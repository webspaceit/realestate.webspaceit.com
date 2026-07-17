<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUnitRequest;
use App\Models\Building;
use App\Models\Project;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        $units = Unit::query()
            ->where('is_bulk', false)
            ->when(request('building_id'), function ($query, $buildingId) {
                $query->where('building_id', $buildingId);
            })
            ->when(request('search'), function ($query, $search) {
                $query->where('unit_number', 'like', "%{$search}%");
            })
            ->with('building')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('units/index', [
            'units' => $units,
            'filters' => request()->only(['search', 'building_id']),
            'buildings' => Building::all(['id', 'name', 'code']),
        ]);
    }

    public function bulkIndex()
    {
        $units = Unit::query()
            ->where('is_bulk', true)
            ->when(request('search'), function ($query, $search) {
                $query->where('unit_number', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('units/bulk-index', [
            'units' => $units,
            'filters' => request()->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('units/create', [
            'buildings' => Building::all(['id', 'name', 'code', 'project_id']),
            'projects' => Project::all(['id', 'name']),
            'bulkUnits' => Unit::where('is_bulk', true)->get(['id', 'unit_number', 'unit_name']),
        ]);
    }

    public function store(StoreUnitRequest $request)
    {
        Unit::create($request->validated());

        return redirect()->route('flats.index')
            ->with('success', 'Flat created successfully.');
    }

    public function show(Unit $unit)
    {
        $unit->load('building', 'project');

        return Inertia::render('units/show', [
            'unit' => $unit,
            'bulkUnits' => Unit::where('is_bulk', true)->get(['id', 'unit_number', 'unit_name']),
        ]);
    }

    public function edit(Unit $unit)
    {
        return Inertia::render('units/edit', [
            'unit' => $unit,
            'buildings' => Building::all(['id', 'name', 'code', 'project_id']),
            'projects' => Project::all(['id', 'name']),
            'bulkUnits' => Unit::where('is_bulk', true)->get(['id', 'unit_number', 'unit_name']),
        ]);
    }

    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'building_id' => ['required', 'exists:buildings,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'unit_number' => ['required', 'string', 'max:50'],
            'floor' => ['nullable', 'integer'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'area_sqft' => ['nullable', 'numeric', 'min:0'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:available,sold,reserved,under_construction'],
            'description' => ['nullable', 'string'],
            'parking' => ['required', 'string', 'in:Available,Not Available'],
            'parking_details' => ['nullable', 'string', 'max:255'],
        ]);

        $unit->update($validated);

        return redirect()->route('flats.index')
            ->with('success', 'Flat updated successfully.');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return redirect()->route('flats.index')
            ->with('success', 'Flat deleted successfully.');
    }

    public function bulkCreate()
    {
        return Inertia::render('units/bulk-create');
    }

    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'units' => ['required', 'array', 'min:1'],
            'units.*.unit_number' => ['required', 'string', 'max:255'],
            'units.*.unit_name' => ['nullable', 'string', 'max:255'],
        ]);

        foreach ($validated['units'] as $data) {
            $data['is_bulk'] = true;
            Unit::create($data);
        }

        return redirect()->route('flats.bulk-index')
            ->with('success', count($validated['units']) . ' units created successfully.');
    }
}
