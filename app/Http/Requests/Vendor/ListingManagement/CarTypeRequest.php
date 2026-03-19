<?php

namespace App\Http\Requests\Vendor\ListingManagement;

use App\Enums\ActiveInactiveStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CarTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('vendor')->check();
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'status' => ['required', new Enum(ActiveInactiveStatus::class)],
            'price' => ['nullable', 'numeric', 'min:0', 'max:99999999.99'],
        ];
    }
}
