<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBuildingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'address' => ['nullable', 'string'],
            'total_floors' => ['nullable', 'integer', 'min:0'],
            'total_units' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:planned,under_construction,completed,on_hold'],
            'description' => ['nullable', 'string'],
            'project_id' => ['nullable', 'exists:projects,id'],
        ];
    }
}
