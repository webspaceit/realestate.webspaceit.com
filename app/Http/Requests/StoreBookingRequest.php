<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'],
            'unit_id' => ['required', 'exists:units,id'],
            'booking_type' => ['required', 'string', 'in:booking,sale'],
            'booking_date' => ['required', 'date'],
            'status' => ['required', 'string', 'in:pending,confirmed,cancelled'],
            'down_payment' => ['nullable', 'numeric', 'min:0'],
            'total_price' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
