<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBuildingRequest;
use App\Http\Requests\UpdateBuildingRequest;
use App\Models\Building;
use App\Models\Project;
use Inertia\Inertia;

class BuildingController extends Controller
{
    public function index()
    {
        $buildings = Building::query()
            ->when(request('search'), function ($query, $search) {
                $query->whereAny(['name', 'code', 'address'], 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('buildings/index', [
            'buildings' => $buildings,
            'filters' => request()->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('buildings/create', [
            'projects' => Project::all(['id', 'name']),
        ]);
    }

    public function store(StoreBuildingRequest $request)
    {
        Building::create($request->validated());

        return redirect()->route('buildings.index')
            ->with('success', 'Building created successfully.');
    }

    public function show(Building $building)
    {
        $building->load('units');

        return Inertia::render('buildings/show', [
            'building' => $building,
        ]);
    }

    public function edit(Building $building)
    {
        return Inertia::render('buildings/edit', [
            'building' => $building,
            'projects' => Project::all(['id', 'name']),
        ]);
    }

    public function update(UpdateBuildingRequest $request, Building $building)
    {
        $building->update($request->validated());

        return redirect()->route('buildings.index')
            ->with('success', 'Building updated successfully.');
    }

    public function destroy(Building $building)
    {
        $building->delete();

        return redirect()->route('buildings.index')
            ->with('success', 'Building deleted successfully.');
    }
}
