<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDesignationRequest;
use App\Http\Requests\UpdateDesignationRequest;
use App\Models\Department;
use App\Models\Designation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignationController extends Controller
{
    public function index(Request $request)
    {
        $designations = Designation::query()
            ->when($request->search, fn ($q, $search) => $q->whereAny(['name', 'code', 'level'], 'like', "%{$search}%"))
            ->when($request->department_id, fn ($q, $dept) => $q->where('department_id', $dept))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->with('department:id,name')
            ->withCount('employees')
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('designations/index', [
            'designations' => $designations,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'department_id', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('designations/create', [
            'departments' => Department::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreDesignationRequest $request)
    {
        Designation::create($request->validated());

        return redirect()->route('designations.index');
    }

    public function edit(Designation $designation)
    {
        return Inertia::render('designations/edit', [
            'designation' => $designation,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateDesignationRequest $request, Designation $designation)
    {
        $designation->update($request->validated());

        return redirect()->route('designations.index');
    }

    public function destroy(Designation $designation)
    {
        $designation->delete();

        return redirect()->route('designations.index');
    }
}