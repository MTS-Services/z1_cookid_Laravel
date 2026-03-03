<?php

namespace App\Http\Requests\Admin;

use App\Models\Admin;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('admin')->check();
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $adminId = auth('admin')->user()->id;

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(Admin::class, 'email')->ignore($adminId),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'current_password' => [
                'nullable',
                'required_with:password',
                'current_password:admin',
            ],
            'password' => [
                'nullable',
                'confirmed',
                Password::default(),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'current_password.required_with' => 'Please confirm your current password to set a new one.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}
