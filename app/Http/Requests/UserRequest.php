<?php

namespace App\Http\Requests;

use App\Enums\ActiveInactive;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        dd($this->route('user'));
        // Check korchi eta ki update request naki create
        $userId = $this->route('user'); // Route parameter name jodi 'user' hoy

        return [
            'username' => [
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('users', 'username')->ignore($userId),
            ],
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'your_self' => ['nullable', 'string'],
            'brokerage_name' => ['nullable', 'string'],
            'license_number' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'status' => ['sometimes', new Enum(ActiveInactive::class)],
            'user_type' => ['required', 'string'],

            // Update-er somoy password optional kora hoyeche
            'password' => $userId
                ? ['nullable', 'confirmed', Password::defaults()]
                : ['required', 'confirmed', Password::defaults()],
        ];
    }
}
