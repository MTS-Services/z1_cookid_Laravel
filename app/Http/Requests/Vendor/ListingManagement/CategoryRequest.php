<?php

namespace App\Http\Requests\Vendor\ListingManagement;

use App\Enums\ActiveInactiveStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('vendor')->check();
    }

    public function rules(): array  
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:10240'],
            'remove_image' => ['nullable', 'boolean'],
            'status' => ['required', new Enum(ActiveInactiveStatus::class)],
        ];
    }
}
