<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'building_id' => ['required', 'exists:buildings,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'unit_number' => ['required', 'string', 'max:50'],
            'floor' => ['nullable', 'integer'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'area_sqft' => ['nullable', 'numeric', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:available,sold,reserved,under_construction'],
            'description' => ['nullable', 'string'],
            'parking' => ['required', 'string', 'in:Available,Not Available'],
            'parking_details' => ['nullable', 'string', 'max:255'],
        ];
    }
}
