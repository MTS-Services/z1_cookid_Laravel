<?php

namespace App\Http\Requests\Vendor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class VendorAccountUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('vendor')->check();
    }

    public function rules(): array
    {
        $vendorId = $this->user('vendor')?->id;

        return [
            'profile_photo' => [
                'nullable',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:10240',
            ],

            'shop_name' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('vendors', 'email')->ignore($vendorId),
            ],

            'phone' => ['required', 'string', 'max:20'],

            'region_state' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'zip_code' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],

            /*
            |--------------------------------------------------------------------------
            | Password Update Rules
            |--------------------------------------------------------------------------
            */

            'current_password' => [
                'nullable',
                'required_with:password',
                'current_password:vendor',
            ],

            'password' => [
                'nullable',
                'confirmed', // ✅ requires password_confirmation
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],

            'password_confirmation' => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required_with' =>
            'Please confirm your current password to set a new one.',
            'password.confirmed' =>
            'Password confirmation does not match.',
        ];
    }
}
