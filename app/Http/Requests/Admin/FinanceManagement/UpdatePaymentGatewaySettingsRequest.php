<?php

namespace App\Http\Requests\Admin\FinanceManagement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePaymentGatewaySettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('admin')->check();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'stripe_publishable_key' => ['nullable', 'string', 'max:255'],
            'stripe_secret' => ['nullable', 'string', 'max:5000'],
            'stripe_currency' => ['nullable', 'string', 'max:10'],
            'paypal_client_id' => ['nullable', 'string', 'max:255'],
            'paypal_client_secret' => ['nullable', 'string', 'max:5000'],
            'paypal_environment' => ['nullable', Rule::in(['sandbox', 'live'])],
            'paypal_currency' => ['nullable', 'string', 'max:10'],
        ];
    }
}
