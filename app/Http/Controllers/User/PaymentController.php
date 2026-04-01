<?php

namespace App\Http\Controllers\User;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\Payment;
use App\Models\Service;
use App\Notifications\VendorGenericNotification;
use App\Support\PaymentGatewayConfig;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class PaymentController extends Controller
{
    // ─── Entry Point: Called after billingAddressStore redirect ───────────────
    public function start(Request $request): RedirectResponse|\Symfony\Component\HttpFoundation\Response
    {
        // Read from session — never from URL params (prevents tampering)
        $pending = session('payment_pending');

        if (! $pending || ! isset($pending['encrypted_service_id'], $pending['address_id'], $pending['payment_method'])) {
            return redirect()
                ->route('frontend.home')
                ->withErrors(['payment' => 'Payment session expired. Please try again.']);
        }

        $encryptedServiceId = (string) $pending['encrypted_service_id'];
        $addressId = (int) $pending['address_id'];
        $paymentMethod = (string) $pending['payment_method'];

        // Validate payment method whitelist
        if (! in_array($paymentMethod, ['stripe', 'paypal'], true)) {
            abort(422, 'Invalid payment method.');
        }

        if ($paymentMethod === 'stripe' && ! PaymentGatewayConfig::stripeActive()) {
            abort(422, 'Stripe checkout is not available.');
        }

        if ($paymentMethod === 'paypal' && ! PaymentGatewayConfig::paypalActive()) {
            abort(422, 'PayPal checkout is not available.');
        }

        $service = $this->resolveService($encryptedServiceId);
        $user = $request->user();

        // Ensure address belongs to user
        $address = OrderAddress::where('id', $addressId)->where('user_id', $user->id)->firstOrFail();

        $amount = (float) $service->price;
        $amountInCents = (int) round($amount * 100);

        if ($amountInCents < 50) {
            abort(422, 'Amount too low for payment processing (minimum $0.50).');
        }

        $methodEnum = $paymentMethod === PaymentMethod::Stripe->value ? PaymentMethod::Stripe : PaymentMethod::Paypal;

        $orderId = $pending['order_id'];
        $order = Order::findOrFail($orderId);

        [$order, $payment] = DB::transaction(function () use ($user, $order, $amount, $methodEnum) {

            $payment = Payment::create([
                'order_id' => $order->id,
                'user_id' => $user->id,
                'amount' => $amount,
                'method' => $methodEnum,
                'status' => PaymentStatus::Unpaid->value,
            ]);

            return [$order, $payment];
        });

        // Consume session immediately — prevents replay attacks
        session()->forget('payment_pending');

        $currency = PaymentGatewayConfig::stripeCurrency();

        if ($paymentMethod === PaymentMethod::Stripe->value) {
            $checkoutUrl = $this->createStripeCheckoutSession(
                $service,
                $amountInCents,
                $currency,
                $encryptedServiceId,
                $addressId,
                $order,
                $payment
            );

            return $this->externalRedirect($checkoutUrl, $request);
        }

        if ($paymentMethod === PaymentMethod::Paypal->value) {
            $paypalCurrency = PaymentGatewayConfig::paypalCurrency();
            $approvalUrl = $this->createPaypalOrder(
                $service,
                $amountInCents,
                $paypalCurrency,
                $encryptedServiceId,
                $addressId,
                $order,
                $payment
            );

            return $this->externalRedirect($approvalUrl, $request);
        }

        abort(422, 'Unhandled payment method.');
    }

    /**
     * Payment success callback (after Stripe Checkout or PayPal approval).
     * Verifies payment with gateway and updates Order + Payment.
     */
    public function success(Request $request, string $gateway): RedirectResponse
    {
        $gateway = strtolower($gateway);

        if ($gateway === 'stripe') {
            return $this->handleStripeSuccess($request);
        }

        if ($gateway === 'paypal') {
            return $this->handlePayPalSuccess($request);
        }

        return redirect()->route('frontend.home')->withErrors(['payment' => 'Invalid gateway.']);
    }

    private function handleStripeSuccess(Request $request): RedirectResponse
    {
        $sessionId = $request->query('session_id');

        if (! $sessionId || ! is_string($sessionId)) {
            return redirect()->route('frontend.home')->withErrors(['payment' => 'Missing Stripe session.']);
        }

        $secretKey = PaymentGatewayConfig::stripeSecret();
        if ($secretKey === '') {
            return redirect()->route('frontend.home')->withErrors(['payment' => 'Stripe is not configured.']);
        }

        $response = Http::withBasicAuth($secretKey, '')
            ->timeout(10)
            ->get('https://api.stripe.com/v1/checkout/sessions/'.$sessionId.'?expand[]=payment_intent');

        if (! $response->successful()) {
            report(new \RuntimeException('Stripe session retrieval failed: '.$response->body()));

            return redirect()->route('frontend.home')->withErrors(['payment' => 'Could not verify payment.']);
        }

        $session = $response->json();
        $paymentStatus = $session['payment_status'] ?? PaymentStatus::Unpaid->value;

        if ($paymentStatus !== PaymentStatus::Paid->value) {
            return redirect()->route('frontend.home')->withErrors(['payment' => 'Payment was not completed.']);
        }

        $paymentId = (int) ($session['metadata']['payment_id'] ?? 0);
        $payment = Payment::where('id', $paymentId)->where('user_id', $request->user()->id)->first();

        if (! $payment || $payment->isPaid()) {
            return redirect()->route('frontend.home')->with('status', __('Payment already recorded.'));
        }

        $paymentIntent = $session['payment_intent'] ?? null;
        $paymentIntentId = is_array($paymentIntent) ? ($paymentIntent['id'] ?? null) : $paymentIntent;
        $chargeId = null;
        if (is_array($paymentIntent) && isset($paymentIntent['charges']['data'][0]['id'])) {
            $chargeId = $paymentIntent['charges']['data'][0]['id'];
        } elseif (is_string($paymentIntentId)) {
            $chargeResponse = Http::withBasicAuth($secretKey, '')
                ->get('https://api.stripe.com/v1/payment_intents/'.$paymentIntentId);
            if ($chargeResponse->successful()) {
                $pi = $chargeResponse->json();
                $chargeId = $pi['charges']['data'][0]['id'] ?? null;
            }
        }

        DB::transaction(function () use ($payment, $sessionId, $paymentIntentId, $chargeId) {
            $payment->update([
                'status' => PaymentStatus::Paid->value,
                'paid_at' => now(),
                'transaction_id' => $chargeId ?? $sessionId,
                'stripe_payment_intent_id' => $paymentIntentId,
                'stripe_charge_id' => $chargeId,
            ]);

            $order = $payment->order;
            $order->update([
                'status' => OrderStatus::Confirmed->value,
            ]);

            $order->loadMissing('service.vendor', 'user');
            $vendor = $order->service?->vendor;

            if ($vendor) {
                $vendor->notify(new VendorGenericNotification(
                    sender: $order->user?->full_name ?? 'New booking',
                    message: sprintf(
                        'placed a new order %s for %s.',
                        $order->order_number,
                        $order->service?->title ?? 'a service'
                    ),
                    avatarUrl: $order->user?->avatar_url ?? null,
                ));
            }
        });

        return redirect()->route('frontend.booking-confirm', ['order' => $payment->order->id])
            ->with('status', __('Payment successful. Order :order confirmed.', ['order' => $payment->order->order_number]));
    }

    private function handlePayPalSuccess(Request $request): RedirectResponse
    {
        $token = $request->query('token'); // PayPal order ID (PayerID is separate in older flow)
        if (! $token || ! is_string($token)) {
            return redirect()->route('frontend.home')->withErrors(['payment' => 'Missing PayPal token.']);
        }

        $payment = Payment::where('paypal_order_id', $token)->where('user_id', $request->user()->id)->first();

        if (! $payment || $payment->isPaid()) {
            return redirect()->route('frontend.home')->withErrors(['payment' => 'Payment not found.']);
        }

        $clientId = PaymentGatewayConfig::paypalClientId();
        $clientSecret = PaymentGatewayConfig::paypalSecret();
        $environment = PaymentGatewayConfig::paypalEnvironment();
        $baseUrl = $environment === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

        $tokenResponse = Http::asForm()
            ->withBasicAuth($clientId, $clientSecret)
            ->post($baseUrl.'/v1/oauth2/token', ['grant_type' => 'client_credentials']);

        if (! $tokenResponse->successful() || ! $tokenResponse->json('access_token')) {
            return redirect()->route('frontend.home')->withErrors(['payment' => 'Could not verify with PayPal.']);
        }

        $accessToken = $tokenResponse->json('access_token');

        $captureResponse = Http::withToken($accessToken)
            ->asJson()
            ->withHeaders([
                'Prefer' => 'return=representation',
            ])
            ->post($baseUrl.'/v2/checkout/orders/'.$token.'/capture', new \stdClass);

        if (! $captureResponse->successful()) {
            report(new \RuntimeException('PayPal capture failed: '.$captureResponse->body()));

            return redirect()->route('frontend.home')->withErrors(['payment' => 'PayPal capture failed.']);
        }

        $captureData = $captureResponse->json();
        $status = $captureData['status'] ?? null;
        $purchaseUnits = $captureData['purchase_units'] ?? [];
        $captureId = $purchaseUnits[0]['payments']['captures'][0]['id'] ?? null;
        $payerId = $captureData['payer']['payer_id'] ?? null;

        if ($status !== 'COMPLETED') {
            return redirect()->route('frontend.home')->withErrors(['payment' => 'PayPal payment not completed.']);
        }

        DB::transaction(function () use ($payment, $captureId, $payerId) {
            $payment->update([
                'status' => PaymentStatus::Paid->value,
                'paid_at' => now(),
                'transaction_id' => $captureId,
                'paypal_capture_id' => $captureId,
                'paypal_payer_id' => $payerId,
            ]);

            $order = $payment->order;
            $order->update([
                'status' => OrderStatus::Confirmed->value,
            ]);

            $order->loadMissing('service.vendor', 'user');
            $vendor = $order->service?->vendor;

            if ($vendor) {
                $vendor->notify(new VendorGenericNotification(
                    sender: $order->user?->full_name ?? 'New booking',
                    message: sprintf(
                        'placed a new order %s for %s.',
                        $order->order_number,
                        $order->service?->title ?? 'a service'
                    ),
                    avatarUrl: $order->user?->avatar_url ?? null,
                ));
            }
        });

        return redirect()->route('frontend.booking-confirm', ['order' => $payment->order->id])
            ->with('status', __('Payment successful. Order :order confirmed.', ['order' => $payment->order->order_number]));
    }

    /**
     * Redirect to external URL (Stripe/PayPal). For Inertia/XHR requests, use
     * Inertia::location() so the browser does a full-page redirect and avoids
     * CORS / Network Error when Axios tries to follow the redirect.
     */
    private function externalRedirect(string $url, Request $request): RedirectResponse|\Symfony\Component\HttpFoundation\Response
    {
        if ($request->header('X-Inertia')) {
            return Inertia::location($url);
        }

        return redirect()->away($url);
    }

    // ─── Stripe Checkout Session ───────────────────────────────────────────────
    private function createStripeCheckoutSession(
        Service $service,
        int $amountInCents,
        string $currency,
        string $encryptedServiceId,
        int $addressId,
        Order $order,
        Payment $payment
    ): string {
        $secretKey = PaymentGatewayConfig::stripeSecret();

        if ($secretKey === '') {
            abort(500, 'Stripe is not configured.');
        }

        $successUrl = route('user.payment.success', ['gateway' => 'stripe'])
            .'?session_id={CHECKOUT_SESSION_ID}';

        $cancelUrl = route('user.order.billing-address', ['service_id' => $encryptedServiceId])
            .'?payment=stripe_cancel';

        $response = Http::asForm()
            ->withBasicAuth($secretKey, '')
            ->timeout(15)
            ->post('https://api.stripe.com/v1/checkout/sessions', [
                'mode' => 'payment',
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
                'line_items' => [[
                    'quantity' => 1,
                    'price_data' => [
                        'currency' => strtolower($currency),
                        'unit_amount' => $amountInCents,
                        'product_data' => [
                            'name' => $service->title,
                        ],
                    ],
                ]],
                'metadata' => [
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                ],
            ]);

        if (! $response->successful()) {
            report(new \RuntimeException(
                'Stripe checkout session creation failed: '.$response->body()
            ));
            abort(500, 'Unable to start Stripe payment. Please try again.');
        }

        $session = $response->json();

        if (empty($session['url'])) {
            abort(500, 'Stripe did not return a checkout URL.');
        }

        $payment->update([
            'gateway_response' => json_encode([
                'stripe_session_id' => $session['id'] ?? null,
            ]),
        ]);

        return $session['url'];
    }

    // ─── PayPal Order Creation ─────────────────────────────────────────────────
    private function createPaypalOrder(
        Service $service,
        int $amountInCents,
        string $currency,
        string $encryptedServiceId,
        int $addressId,
        Order $order,
        Payment $payment
    ): string {
        $clientId = PaymentGatewayConfig::paypalClientId();
        $clientSecret = PaymentGatewayConfig::paypalSecret();
        $environment = PaymentGatewayConfig::paypalEnvironment();
        if ($clientId === '' || $clientSecret === '') {
            abort(500, 'PayPal is not configured.');
        }
        $baseUrl = $environment === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        // Step 1: Get access token
        $tokenResponse = Http::asForm()
            ->withBasicAuth($clientId, $clientSecret)
            ->timeout(15)
            ->post($baseUrl.'/v1/oauth2/token', ['grant_type' => 'client_credentials']);

        if (! $tokenResponse->successful()) {
            report(new \RuntimeException(
                'PayPal token request failed: '.$tokenResponse->body()
            ));
            abort(500, 'Unable to authenticate with PayPal.');
        }

        $accessToken = $tokenResponse->json('access_token');

        if (! $accessToken) {
            abort(500, 'PayPal access token missing.');
        }

        // PayPal will append its own query params (e.g. ?token=...).
        // Do not use placeholders like {TOKEN} in return_url.
        $successUrl = route('user.payment.success', ['gateway' => 'paypal']);

        $cancelUrl = route('user.order.billing-address', ['service_id' => $encryptedServiceId])
            .'?payment=paypal_cancel';

        // Step 2: Create PayPal order (custom_id = our payment id for success handler)
        $orderResponse = Http::withToken($accessToken)
            ->acceptJson()
            ->timeout(15)
            ->post($baseUrl.'/v2/checkout/orders', [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'amount' => [
                        'currency_code' => strtoupper($currency),
                        'value' => number_format($amountInCents / 100, 2, '.', ''),
                    ],
                    'description' => $service->title,
                    'custom_id' => (string) $payment->id,
                    'reference_id' => (string) $order->id,
                ]],
                'application_context' => [
                    'brand_name' => config('app.name'),
                    'landing_page' => 'NO_PREFERENCE',
                    'user_action' => 'PAY_NOW',
                    'return_url' => $successUrl,
                    'cancel_url' => $cancelUrl,
                ],
            ]);

        if (! $orderResponse->successful()) {
            report(new \RuntimeException(
                'PayPal order creation failed: '.$orderResponse->status().' '.$orderResponse->body()
            ));
            abort(500, 'Unable to start PayPal payment. Please try again.');
        }

        $paypalOrder = $orderResponse->json();
        $paypalOrderId = $paypalOrder['id'] ?? null;

        if ($paypalOrderId) {
            $payment->update(['paypal_order_id' => $paypalOrderId]);
        }

        $approvalLink = collect($paypalOrder['links'] ?? [])
            ->firstWhere('rel', 'approve')['href'] ?? null;

        if (! $approvalLink) {
            abort(500, 'PayPal did not return an approval URL.');
        }

        return $approvalLink;
    }

    // ─── Resolve Encrypted Service ID ─────────────────────────────────────────
    private function resolveService(string $encryptedId): Service
    {
        try {
            $serviceId = (int) Crypt::decryptString($encryptedId);
        } catch (DecryptException) {
            abort(404, 'Invalid service.');
        }

        $service = Service::query()
            ->where('status', ActiveInactiveStatus::ACTIVE->value)
            ->find($serviceId);

        if (! $service) {
            abort(404, 'Service not found or unavailable.');
        }

        return $service;
    }
}
