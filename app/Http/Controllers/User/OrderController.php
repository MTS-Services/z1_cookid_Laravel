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
    public function billingAddress(Request $request, string $serviceId): Response
    {
        $service = $this->resolveService($serviceId);
        $address = $request->user()->orderAddresses()->latest()->first();

        return Inertia::render('frontend/billing-address', [
            'address' => $address,
            'service' => [
                'id' => $service->id,
                'encryptedId' => $serviceId,
                'title' => $service->title,
                'price' => (float) $service->price,
            ],
            'summary' => [
                'id' => Crypt::encryptString($service->id),
                'service' => $service->title,
                'price' => (float) $service->price,
            ],
            'supportPhone' => '(219) 555-0114',
        ]);
    }

    public function billingAddressStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'string'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:500'],
            'state' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'zip_code' => ['required', 'string', 'max:20'],
            'comments' => ['nullable', 'string'],
            'payment_method' => ['required', 'in:paypal,stripe'],
        ]);

        $service = $this->resolveService($validated['service_id'], true);

        $addressData = collect($validated)->only([
            'first_name',
            'last_name',
            'email',
            'phone',
            'address',
            'state',
            'city',
            'zip_code',
        ])->toArray();

        $request->user()->orderAddresses()->create($addressData);

        return redirect()->route('frontend.booking-confirm', [
            'service' => $validated['service_id'],
        ])->with('status', __('Order details saved for :service', ['service' => $service->title]));
    }

    private function resolveService(string $encryptedId, bool $asValidationError = false): Service
    {
        try {
            $serviceId = (int) Crypt::decryptString($encryptedId);
        } catch (DecryptException $exception) {
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
