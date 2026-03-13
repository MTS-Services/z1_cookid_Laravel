<?php

namespace App\Http\Controllers\User;

use App\Enums\ActiveInactiveStatus;
use App\Enums\CommissionType;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\Service;
use App\Models\VendorEarning;
use App\Notifications\VendorGenericNotification;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    // ─── User Order List (Order History) ────────────────────────────────────────
    public function orderDetails(Request $request): Response
    {
        $user = $request->user();
        $orders = $user->orders()
            ->with(['service.vendor', 'address', 'payments', 'review'])
            ->orderByDesc('created_at')
            ->paginate(12)
            ->through(fn (Order $order) => app(ProfileController::class)->formatOrderForUser($order));

        return Inertia::render('user/profile/order-details', [
            'orders' => $orders,
        ]);
    }

    // ─── Single Order Detail ───────────────────────────────────────────────────
    public function orderDetail(Request $request, Order $order): Response|RedirectResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }
        $order->loadMissing(['service.vendor', 'user', 'address', 'payments', 'review']);
        $orderData = app(ProfileController::class)->formatOrderForUser($order);

        return Inertia::render('user/profile/order-detail', [
            'order' => $orderData,
        ]);
    }

    // ─── Show Billing Address Page ─────────────────────────────────────────────
    public function billingAddress(Request $request, string $serviceId): Response
    {
        $service = $this->resolveService($serviceId);
        $user = $request->user();

        // Reuse existing pending order for this user + service if it exists,
        // so simple page reloads do not create duplicate orders.
        $order = Order::query()
            ->where('user_id', $user->id)
            ->where('service_id', $service->id)
            ->where('status', OrderStatus::Pending->value)
            ->latest('id')
            ->first();

        if (! $order) {
            $order = Order::create([
                'user_id' => $user->id,
                'service_id' => $service->id,
                'order_number' => Order::generateOrderNumber(),
                'subtotal' => $service->price,
                'discount' => 0,
                'total' => $service->price,
                'status' => OrderStatus::Pending->value,
            ]);

            VendorEarning::create([
                'vendor_id' => $service->vendor_id,
                'order_id' => $order->id,
                'gross_amount' => $service->price,
                'commission' => 0,
                'commission_type' => CommissionType::Percentage->value,
                'net_amount' => $service->price,
                'released_at' => null,
            ]);

            $service->loadMissing('vendor');
            $vendor = $service->vendor;

            if ($vendor) {
                $vendor->notify(new VendorGenericNotification(
                    sender: $user->full_name ?? 'New booking',
                    message: sprintf(
                        'started a new booking %s for %s. Awaiting payment confirmation.',
                        $order->order_number,
                        $service->title
                    ),
                    avatarUrl: $user->avatar_url ?? null,
                ));
            }
        }

        return Inertia::render('frontend/billing-address', [
            'address' => [
                'order_id' => $order->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => null,
                'state' => null,
                'city' => null,
                'zip_code' => null,
            ],
            'summary' => [
                // Pass encrypted service id — never raw id
                'id' => $serviceId,
                'service' => $service->title,
                'price' => (float) $service->price,
            ],
            'supportPhone' => config('app.support_phone', '(219) 555-0114'),
        ]);
    }

    // ─── Store Billing Address & Redirect to Payment ───────────────────────────
    public function billingAddressStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
            'service_id' => ['required', 'string'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:500'],
            'state' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'zip_code' => ['required', 'string', 'max:20'],
            'comments' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['required', 'in:paypal,stripe'],
        ]);

        // Resolve & verify service is still active
        $service = $this->resolveService($validated['service_id'], true);

        // Save address
        $address = OrderAddress::updateOrCreate(
            ['order_id' => $validated['order_id']],
            collect($validated)
                ->only(['order_id', 'first_name', 'last_name', 'email', 'phone', 'address', 'state', 'city', 'zip_code'])
                ->merge(['user_id' => $request->user()->id])
                ->toArray()
        );

        // Store payment intent data in session — never in URL
        // This prevents tampering of service_id, address_id, payment_method
        session([
            'payment_pending' => [
                'encrypted_service_id' => $validated['service_id'],
                'address_id' => $address->id,
                'payment_method' => $validated['payment_method'],
                'order_id' => $validated['order_id'],
            ],
        ]);

        // Single internal redirect — no external URL exposed here
        return redirect()->route('user.payment.start');
    }

    // ─── Resolve & Validate Encrypted Service ID ──────────────────────────────
    private function resolveService(string $encryptedId, bool $asValidationError = false): Service
    {
        try {
            $serviceId = (int) Crypt::decryptString($encryptedId);
        } catch (DecryptException) {
            if ($asValidationError) {
                throw ValidationException::withMessages([
                    'service_id' => __('Invalid service selected.'),
                ]);
            }
            abort(404);
        }

        $service = Service::query()
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->find($serviceId);

        if (! $service) {
            if ($asValidationError) {
                throw ValidationException::withMessages([
                    'service_id' => __('Selected service is unavailable.'),
                ]);
            }
            abort(404);
        }

        return $service;
    }
}
