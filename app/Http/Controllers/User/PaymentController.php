<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    // ─── Entry Point: Called after billingAddressStore redirect ───────────────
    public function start(Request $request): RedirectResponse
    {
        // Read from session — never from URL params (prevents tampering)
        $pending = session('payment_pending');

        if (! $pending || ! isset($pending['encrypted_service_id'], $pending['address_id'], $pending['payment_method'])) {
            return redirect()
                ->route('frontend.home')
                ->withErrors(['payment' => 'Payment session expired. Please try again.']);
        }

        // Consume session immediately — prevents replay attacks
        session()->forget('payment_pending');

        $encryptedServiceId = (string) $pending['encrypted_service_id'];
        $addressId          = (int)    $pending['address_id'];
        $paymentMethod      = (string) $pending['payment_method'];

        // Validate payment method whitelist
        if (! in_array($paymentMethod, ['stripe', 'paypal'], true)) {
            abort(422, 'Invalid payment method.');
        }

        $service = $this->resolveService($encryptedServiceId);

        // ✅ Fix: price (dollars float) → cents integer
        // e.g. 49.99 → 4999  |  50.00 → 5000
        $amountInCents = (int) round((float) $service->price * 100);

        if ($amountInCents < 50) {
            abort(422, 'Amount too low for payment processing (minimum $0.50).');
        }

        if ($paymentMethod === 'stripe') {
            $checkoutUrl = $this->createStripeCheckoutSession(
                $service,
                $amountInCents,
                (string) config('services.stripe.currency', 'usd'),
                $encryptedServiceId,
                $addressId
            );

            return redirect()->away($checkoutUrl);
        }

        if ($paymentMethod === 'paypal') {
            $approvalUrl = $this->createPaypalOrder(
                $service,
                $amountInCents,
                (string) config('services.paypal.currency', 'usd'),
                $encryptedServiceId,
                $addressId
            );

            return redirect()->away($approvalUrl);
        }

        abort(422, 'Unhandled payment method.');
    }

    // ─── Stripe Checkout Session ───────────────────────────────────────────────
    private function createStripeCheckoutSession(
        Service $service,
        int $amountInCents,
        string $currency,
        string $encryptedServiceId,
        int $addressId
    ): string {
        $secretKey = (string) config('services.stripe.secret');

        if ($secretKey === '') {
            abort(500, 'Stripe is not configured.');
        }

        $successUrl = route('frontend.booking-confirm', ['service' => $encryptedServiceId])
            . '?payment=stripe_success';

        $cancelUrl = route('user.order.billing-address', ['service_id' => $encryptedServiceId])
            . '?payment=stripe_cancel';

        $response = Http::asForm()
            ->withBasicAuth($secretKey, '')
            ->timeout(15)
            ->post('https://api.stripe.com/v1/checkout/sessions', [
                'mode'        => 'payment',
                'success_url' => $successUrl,
                'cancel_url'  => $cancelUrl,
                'line_items'  => [[
                    'quantity'   => 1,
                    'price_data' => [
                        'currency'     => strtolower($currency),
                        'unit_amount'  => $amountInCents,
                        'product_data' => [
                            'name' => $service->title,
                        ],
                    ],
                ]],
                'metadata' => [
                    'service_id' => $service->id,
                    'address_id' => $addressId,
                    'user_id'    => auth()->user()->id,
                ],
            ]);

        if (! $response->successful()) {
            report(new \RuntimeException(
                'Stripe checkout session creation failed: ' . $response->body()
            ));
            abort(500, 'Unable to start Stripe payment. Please try again.');
        }

        $session = $response->json();

        if (empty($session['url'])) {
            abort(500, 'Stripe did not return a checkout URL.');
        }

        return $session['url'];
    }

    // ─── PayPal Order Creation ─────────────────────────────────────────────────
    private function createPaypalOrder(
        Service $service,
        int $amountInCents,
        string $currency,
        string $encryptedServiceId,
        int $addressId
    ): string {
        $clientId     = (string) config('services.paypal.client_id');
        $clientSecret = (string) config('services.paypal.secret');
        $environment  = (string) config('services.paypal.environment', 'sandbox');

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
            ->post($baseUrl . '/v1/oauth2/token', ['grant_type' => 'client_credentials']);

        if (! $tokenResponse->successful()) {
            report(new \RuntimeException(
                'PayPal token request failed: ' . $tokenResponse->body()
            ));
            abort(500, 'Unable to authenticate with PayPal.');
        }

        $accessToken = $tokenResponse->json('access_token');

        if (! $accessToken) {
            abort(500, 'PayPal access token missing.');
        }

        $successUrl = route('frontend.booking-confirm', ['service' => $encryptedServiceId])
            . '?payment=paypal_success';

        $cancelUrl = route('user.order.billing-address', ['service_id' => $encryptedServiceId])
            . '?payment=paypal_cancel';

        // Step 2: Create PayPal order
        $orderResponse = Http::withToken($accessToken)
            ->timeout(15)
            ->post($baseUrl . '/v2/checkout/orders', [
                'intent'         => 'CAPTURE',
                'purchase_units' => [[
                    'amount' => [
                        'currency_code' => strtoupper($currency),
                        // PayPal needs decimal string e.g. "49.99"
                        'value'         => number_format($amountInCents / 100, 2, '.', ''),
                    ],
                    'description'  => $service->title,
                    'custom_id'    => (string) $service->id,
                    'reference_id' => (string) $addressId,
                ]],
                'application_context' => [
                    'brand_name'   => config('app.name'),
                    'landing_page' => 'NO_PREFERENCE',
                    'user_action'  => 'PAY_NOW',
                    'return_url'   => $successUrl,
                    'cancel_url'   => $cancelUrl,
                ],
            ]);

        if (! $orderResponse->successful()) {
            report(new \RuntimeException(
                'PayPal order creation failed: ' . $orderResponse->body()
            ));
            abort(500, 'Unable to start PayPal payment. Please try again.');
        }

        $order = $orderResponse->json();

        $approvalLink = collect($order['links'] ?? [])
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
            ->where('status', \App\Enums\ActiveInactiveStatus::ACTIVE)
            ->find($serviceId);

        if (! $service) {
            abort(404, 'Service not found or unavailable.');
        }

        return $service;
    }
}
