<?php

namespace App\Http\Requests\Vendor\ListingManagement;

use App\Enums\ActiveInactiveStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class ListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth('vendor')->check();
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'serviceTitle' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'duration' => ['required', 'string', 'max:100'],
            'carType' => ['required', 'exists:car_types,id'],
            'category' => ['required', 'exists:categories,id'],
            'location' => ['required', 'string', 'max:255'],
            'features' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'file', 'image', 'max:2048'],
            'remove_image' => ['nullable', 'boolean'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['file', 'image', 'max:2048'],
            'remove_gallery_ids' => ['nullable', 'array'],
            'remove_gallery_ids.*' => ['integer'],
            'status' => ['nullable', new Enum(ActiveInactiveStatus::class)],
        ];
    }
}
