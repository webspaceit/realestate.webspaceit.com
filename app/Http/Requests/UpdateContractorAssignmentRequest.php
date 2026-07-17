<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContractorAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contractor_id' => ['required', 'exists:contractors,id'],
            'project_id' => ['required', 'exists:projects,id'],
            'task_id' => ['nullable', 'exists:project_tasks,id'],
            'contract_amount' => ['required', 'numeric', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['required', 'string', 'in:pending,active,completed,terminated'],
        ];
    }
}
