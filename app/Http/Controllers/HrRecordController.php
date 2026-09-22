<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\HrRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class HrRecordController extends Controller
{
    public function index(Request $request, string $module)
    {
        ['config' => $config] = $this->resolveModule($module);

        $records = HrRecord::query()
            ->where('module', $module)
            ->when($request->search, fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            }))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->employee_id, fn ($q, $emp) => $q->where('employee_id', $emp))
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('hr/index', [
            'module' => $config,
            'records' => $records,
            'employeesMap' => $this->employeesMap(),
            'departmentsMap' => Department::orderBy('name')->pluck('name', 'id')->all(),
            'designationsMap' => Designation::orderBy('name')->pluck('name', 'id')->all(),
            'filters' => $request->only(['search', 'status', 'employee_id']),
        ]);
    }

    public function create(Request $request, string $module)
    {
        ['config' => $config] = $this->resolveModule($module);

        return Inertia::render('hr/create', [
            'module' => $config,
            ...$this->formOptions(),
        ]);
    }

    public function store(Request $request, string $module)
    {
        ['config' => $config] = $this->resolveModule($module);

        $this->normalize($request);

        $validated = $request->validate($this->rules($config['fields']));

        $payload = $this->buildPayload($validated);

        if ($module === 'leave_applications' && ($payload['data']['from_date'] ?? null) && ($payload['data']['to_date'] ?? null)) {
            $payload['data']['total_days'] = (strtotime($payload['data']['to_date']) - strtotime($payload['data']['from_date'])) / 86400 + 1;
        }

        if ($request->hasFile('file')) {
            $payload['file'] = $request->file('file')->store('hr', 'public');
        }

        HrRecord::create(['module' => $module, ...$payload]);

        return redirect()->route('hr.index', ['module' => $module]);
    }

    public function edit(Request $request, string $module, HrRecord $record)
    {
        ['config' => $config] = $this->resolveModule($module);

        if ($record->module !== $module) {
            abort(404);
        }

        return Inertia::render('hr/edit', [
            'module' => $config,
            'record' => $record,
            ...$this->formOptions(),
        ]);
    }

    public function update(Request $request, string $module, HrRecord $record)
    {
        ['config' => $config] = $this->resolveModule($module);

        if ($record->module !== $module) {
            abort(404);
        }

        $this->normalize($request);

        $validated = $request->validate($this->rules($config['fields']));

        $payload = $this->buildPayload($validated, $record->data ?? []);

        if ($module === 'leave_applications' && ($payload['data']['from_date'] ?? null) && ($payload['data']['to_date'] ?? null)) {
            $payload['data']['total_days'] = (strtotime($payload['data']['to_date']) - strtotime($payload['data']['from_date'])) / 86400 + 1;
        }

        if ($request->hasFile('file')) {
            if ($record->file) {
                Storage::disk('public')->delete($record->file);
            }
            $payload['file'] = $request->file('file')->store('hr', 'public');
        }

        $record->update($payload);

        return redirect()->route('hr.index', ['module' => $module]);
    }

    public function destroy(Request $request, string $module, HrRecord $record)
    {
        if ($record->module !== $module) {
            abort(404);
        }

        if ($record->file) {
            Storage::disk('public')->delete($record->file);
        }

        $record->delete();

        return redirect()->route('hr.index', ['module' => $module]);
    }

    /**
     * Trim string values and turn empty strings into null so optional
     * date/number/select/exists rules don't reject blank inputs.
     */
    private function normalize(Request $request): void
    {
        $input = collect($request->all())
            ->map(fn ($value) => is_string($value) ? (trim($value) === '' ? null : trim($value)) : $value)
            ->all();

        $request->merge($input);
    }

    /**
     * Map submitted field values onto base columns and the data JSON bag.
     */
    private function buildPayload(array $validated, array $existingData = []): array
    {
        $payload = ['data' => $existingData];

        foreach ($validated as $key => $value) {
            $column = $this->baseColumn($key);

            $value = is_string($value) ? trim($value) : $value;
            if ($value === '') {
                $value = null;
            }

            if ($column) {
                $payload[$column] = $value;
            } else {
                $payload['data'][$key] = $value;
            }
        }

        return $payload;
    }

    private function baseColumn(string $key): ?string
    {
        return match ($key) {
            'employee' => 'employee_id',
            'title', 'description', 'date', 'amount', 'status', 'file' => $key,
            default => null,
        };
    }

    private function rules(array $fields): array
    {
        $rules = [];

        foreach ($fields as $field) {
            $key = $field['key'];
            $required = $field['required'] ?? false;

            $rule = $required ? ['required'] : ['nullable'];

            $rule[] = match ($field['type']) {
                'number', 'amount' => 'numeric',
                'date' => 'date',
                'time' => 'date_format:H:i',
                'month' => 'string',
                'employee' => $required ? Rule::exists('employees', 'id') : Rule::exists('employees', 'id'),
                'department' => Rule::exists('departments', 'id'),
                'designation' => Rule::exists('designations', 'id'),
                'select' => Rule::in($field['options'] ?? []),
                'file' => 'file|max:10240',
                default => 'string',
            };

            $rules[$key] = $rule;
        }

        return $rules;
    }

    private function resolveModule(string $module): array
    {
        $modules = config('hr.modules');

        if (! isset($modules[$module])) {
            abort(404);
        }

        return [
            'config' => [
                'key' => $module,
                'title' => $modules[$module]['title'],
                'fields' => $modules[$module]['fields'],
                'columns' => $modules[$module]['columns'],
            ],
        ];
    }

    private function employeesMap(): array
    {
        return Employee::query()
            ->orderBy('full_name')
            ->pluck('full_name', 'id')
            ->map(fn ($name) => (string) $name)
            ->all();
    }

    private function formOptions(): array
    {
        return [
            'employeesMap' => $this->employeesMap(),
            'departmentsMap' => Department::orderBy('name')->pluck('name', 'id')->all(),
            'designationsMap' => Designation::orderBy('name')->pluck('name', 'id')->all(),
        ];
    }
}