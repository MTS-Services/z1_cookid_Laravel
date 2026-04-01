<?php

namespace App\Http\Controllers\Admin\FinanceManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FinanceManagement\UpdatePaymentGatewaySettingsRequest;
use App\Models\PaymentGatewaySetting;
use App\Support\PaymentGatewayConfig;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentGatewaySettingsController extends Controller
{
    public function edit(): Response
    {
        $row = PaymentGatewaySetting::query()->first();

        return Inertia::render('admin/finance-management/payment-gateways', [
            'settings' => [
                'stripe_publishable_key' => $row?->stripe_publishable_key ?? '',
                'stripe_currency' => $row?->stripe_currency ?? config('services.stripe.currency', 'usd'),
                'paypal_client_id' => $row?->paypal_client_id ?? '',
                'paypal_environment' => $row?->paypal_environment ?? config('services.paypal.environment', 'sandbox'),
                'paypal_currency' => $row?->paypal_currency ?? config('services.paypal.currency', 'usd'),
                'has_stripe_secret' => $row !== null && filled($row->stripe_secret),
                'has_paypal_client_secret' => $row !== null && filled($row->paypal_client_secret),
                'stripe_active' => $row === null ? true : (bool) $row->stripe_active,
                'paypal_active' => $row === null ? true : (bool) $row->paypal_active,
            ],
        ]);
    }

    public function update(UpdatePaymentGatewaySettingsRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $setting = PaymentGatewaySetting::query()->first() ?? new PaymentGatewaySetting;

        $setting->stripe_publishable_key = filled($validated['stripe_publishable_key'] ?? null)
            ? (string) $validated['stripe_publishable_key']
            : null;
        $setting->stripe_currency = filled($validated['stripe_currency'] ?? null)
            ? (string) $validated['stripe_currency']
            : null;
        $setting->paypal_client_id = filled($validated['paypal_client_id'] ?? null)
            ? (string) $validated['paypal_client_id']
            : null;
        $setting->paypal_environment = filled($validated['paypal_environment'] ?? null)
            ? (string) $validated['paypal_environment']
            : null;
        $setting->paypal_currency = filled($validated['paypal_currency'] ?? null)
            ? (string) $validated['paypal_currency']
            : null;

        if ($request->filled('stripe_secret')) {
            $setting->stripe_secret = (string) $validated['stripe_secret'];
        }

        if ($request->filled('paypal_client_secret')) {
            $setting->paypal_client_secret = (string) $validated['paypal_client_secret'];
        }

        $setting->stripe_active = $request->boolean('stripe_active');
        $setting->paypal_active = $request->boolean('paypal_active');

        $setting->save();

        PaymentGatewayConfig::forgetCachedRow();

        return redirect()
            ->route('admin.fm.payment-gateways.edit')
            ->with('success', __('Payment gateway settings saved.'));
    }
}
