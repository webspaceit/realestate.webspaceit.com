<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone_mobile' => ['nullable', 'string', 'max:50'],
            'phone_whatsapp' => ['nullable', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date'],
            'nid_no' => ['nullable', 'string', 'max:50'],
            'tin_no' => ['nullable', 'string', 'max:50'],
            'passport_no' => ['nullable', 'string', 'max:50'],
            'driving_licence' => ['nullable', 'string', 'max:50'],
            'profession' => ['nullable', 'string', 'max:255'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'father_name' => ['nullable', 'string', 'max:255'],
            'mother_name' => ['nullable', 'string', 'max:255'],
            'spouse_name' => ['nullable', 'string', 'max:255'],
            'spouse_nid_no' => ['nullable', 'string', 'max:50'],
            'present_address' => ['nullable', 'string'],
            'permanent_address' => ['nullable', 'string'],
            'professional_address' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'nominees' => ['nullable', 'array'],
            'nominees.*.name' => ['required_with:nominees', 'string', 'max:255'],
            'nominees.*.relationship' => ['required_with:nominees', 'string', 'max:255'],
            'nominees.*.date_of_birth' => ['nullable', 'date'],
            'nominees.*.percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'building_id' => ['nullable', 'exists:buildings,id'],
            'unit_id' => ['nullable', 'exists:units,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
        ];
    }
}
