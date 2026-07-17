<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientPropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'],
            'unit_id' => ['required', 'exists:units,id', Rule::unique('client_properties', 'unit_id')->where(function ($query) {
                return $query->where('client_id', $this->client_id);
            })],
            'ownership_start' => ['nullable', 'date'],
            'ownership_end' => ['nullable', 'date', 'after_or_equal:ownership_start'],
        ];
    }
}
