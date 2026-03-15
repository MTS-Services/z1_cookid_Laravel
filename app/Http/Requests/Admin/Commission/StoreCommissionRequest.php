<?php

namespace App\Http\Requests\Admin\Commission;

use App\Enums\ActiveInactiveStatus;
use App\Enums\CommissionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreCommissionRequest extends FormRequest
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
        return [
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'commission_type' => ['required', new Enum(CommissionType::class)],
            'commission_value' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'status' => ['required', new Enum(ActiveInactiveStatus::class)],
        ];
    }
}
