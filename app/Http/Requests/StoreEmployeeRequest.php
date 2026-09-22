<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // ---- Personal Information ----
            'employee_id' => ['required', 'string', 'max:50', Rule::unique('employees', 'employee_id')],
            'full_name' => ['required', 'string', 'max:255'],
            'father_name' => ['nullable', 'string', 'max:255'],
            'mother_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'mobile' => ['nullable', 'string', 'max:30'],
            'emergency_mobile' => ['nullable', 'string', 'max:30'],
            'dob' => ['nullable', 'date'],
            'present_address' => ['nullable', 'string'],
            'permanent_address' => ['nullable', 'string'],
            'marital_status' => ['nullable', Rule::in(['unmarried', 'married', 'divorced'])],
            'passport_no' => ['nullable', 'string', 'max:50'],
            'blood_group' => ['nullable', Rule::in(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])],
            'gender' => ['nullable', Rule::in(['male', 'female', 'transgender'])],
            'age' => ['nullable', 'integer', 'min:0', 'max:150'],
            'religion' => ['nullable', Rule::in(['islam', 'hinduism', 'christianity', 'buddhism'])],
            'national_id' => ['nullable', 'string', 'max:50'],
            'nationality' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active', 'inactive'])],

            // ---- Position Details ----
            'date_of_joining' => ['nullable', 'date'],
            'position_applied_for' => ['nullable', 'string', 'max:255'],
            'department_id' => ['nullable', 'integer', Rule::exists('departments', 'id')],
            'designation_id' => ['nullable', 'integer', Rule::exists('designations', 'id')],
            'designation_level' => ['nullable', 'string', 'max:255'],
            'employment_type' => ['nullable', Rule::in(['full_time', 'part_time', 'contractual', 'internship'])],
            'monthly_salary' => ['nullable', 'numeric', 'min:0'],
            'functional_superior_name' => ['nullable', 'string', 'max:255'],

            // ---- Educational Qualifications ----
            'highest_degree' => ['nullable', 'string', 'max:255'],
            'institution' => ['nullable', 'string', 'max:255'],
            'passing_year' => ['nullable', 'string', 'max:10'],
            'cgpa' => ['nullable', 'string', 'max:50'],

            // ---- Certificates / Photo ----
            'photo' => ['nullable', 'image', 'max:2048'],
            'certificate_1' => ['nullable', 'file', 'max:10240'],
            'certificate_2' => ['nullable', 'file', 'max:10240'],
            'certificate_3' => ['nullable', 'file', 'max:10240'],
            'certificate_4' => ['nullable', 'file', 'max:10240'],
            'certificate_5' => ['nullable', 'file', 'max:10240'],
            'certificate_6' => ['nullable', 'file', 'max:10240'],
        ];
    }
}