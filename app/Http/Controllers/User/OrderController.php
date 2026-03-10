<?php

namespace App\Http\Controllers\User;

use App\Enums\ActiveInactiveStatus;
use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    // ─── Show Billing Address Page ─────────────────────────────────────────────
    public function billingAddress(Request $request, string $serviceId): Response
    {
        $service = $this->resolveService($serviceId);

        $address = $request->user()
            ->orderAddresses()
            ->latest()
            ->first();

        return Inertia::render('frontend/billing-address', [
            'address' => $address ? [
                'first_name' => $address->first_name,
                'last_name'  => $address->last_name,
                'email'      => $address->email,
                'phone'      => $address->phone,
                'address'    => $address->address,
                'state'      => $address->state,
                'city'       => $address->city,
                'zip_code'   => $address->zip_code,
            ] : null,
            'summary' => [
                // Pass encrypted service id — never raw id
                'id'      => $serviceId,
                'service' => $service->title,
                'price'   => (float) $service->price,
            ],
            'supportPhone' => config('app.support_phone', '(219) 555-0114'),
        ]);
    }

    // ─── Store Billing Address & Redirect to Payment ───────────────────────────
    public function billingAddressStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id'     => ['required', 'string'],
            'first_name'     => ['required', 'string', 'max:255'],
            'last_name'      => ['required', 'string', 'max:255'],
            'email'          => ['required', 'email', 'max:255'],
            'phone'          => ['required', 'string', 'max:50'],
            'address'        => ['required', 'string', 'max:500'],
            'state'          => ['required', 'string', 'max:255'],
            'city'           => ['required', 'string', 'max:255'],
            'zip_code'       => ['required', 'string', 'max:20'],
            'comments'       => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['required', 'in:paypal,stripe'],
        ]);

        // Resolve & verify service is still active
        $service = $this->resolveService($validated['service_id'], true);

        // Save address
        $address = $request->user()->orderAddresses()->create(
            collect($validated)
                ->only(['first_name', 'last_name', 'email', 'phone', 'address', 'state', 'city', 'zip_code'])
                ->toArray()
        );

        // Store payment intent data in session — never in URL
        // This prevents tampering of service_id, address_id, payment_method
        session([
            'payment_pending' => [
                'encrypted_service_id' => $validated['service_id'],
                'address_id'           => $address->id,
                'payment_method'       => $validated['payment_method'],
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
