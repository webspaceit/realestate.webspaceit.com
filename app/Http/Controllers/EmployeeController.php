<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $employees = Employee::query()
            ->when($request->search, fn ($q, $search) => $q->whereAny(['employee_id', 'full_name', 'email', 'mobile'], 'like', "%{$search}%"))
            ->when($request->department_id, fn ($q, $dept) => $q->where('department_id', $dept))
            ->when($request->designation_id, fn ($q, $desig) => $q->where('designation_id', $desig))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->with(['department:id,name', 'designation:id,name'])
            ->orderBy('full_name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'designations' => Designation::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'department_id', 'designation_id', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('employees/create', $this->formOptions());
    }

    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->safe()->except(['photo', ...Employee::CERTIFICATE_FIELDS]);

        foreach (['photo', ...Employee::CERTIFICATE_FIELDS] as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('employees', 'public');
            }
        }

        Employee::create($data);

        return redirect()->route('employees.index');
    }

    public function show(Employee $employee)
    {
        $employee->load(['department:id,name', 'designation:id,name']);

        return Inertia::render('employees/show', compact('employee'));
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('employees/edit', [
            'employee' => $employee,
            ...$this->formOptions(),
        ]);
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $data = $request->safe()->except(['photo', ...Employee::CERTIFICATE_FIELDS]);

        foreach (['photo', ...Employee::CERTIFICATE_FIELDS] as $field) {
            if ($request->hasFile($field)) {
                if ($employee->$field) {
                    Storage::disk('public')->delete($employee->$field);
                }
                $data[$field] = $request->file($field)->store('employees', 'public');
            }
        }

        $employee->update($data);

        return redirect()->route('employees.index');
    }

    public function destroy(Employee $employee)
    {
        foreach (['photo', ...Employee::CERTIFICATE_FIELDS] as $field) {
            if ($employee->$field) {
                Storage::disk('public')->delete($employee->$field);
            }
        }

        $employee->delete();

        return redirect()->route('employees.index');
    }

    private function formOptions(): array
    {
        return [
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'designations' => Designation::orderBy('name')->get(['id', 'name']),
            'countries' => config('hr.countries'),
        ];
    }
}