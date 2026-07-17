<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectPhaseRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['required', 'string', 'in:planning,pending,in_progress,on_hold,completed'],
            'order' => ['nullable', 'integer', 'min:0'],
            'tasks' => ['nullable', 'array'],
            'tasks.*.id' => ['nullable', 'exists:project_tasks,id'],
            'tasks.*.name' => ['required_with:tasks', 'string', 'max:255'],
            'tasks.*.assigned_to' => ['nullable', 'exists:users,id'],
            'tasks.*.priority' => ['nullable', 'string', 'in:low,medium,high,urgent'],
            'tasks.*.status' => ['nullable', 'string', 'in:todo,in_progress,done'],
            'tasks.*.start_date' => ['nullable', 'date'],
            'tasks.*.end_date' => ['nullable', 'date'],
            'tasks.*.description' => ['nullable', 'string'],
        ];
    }
}
