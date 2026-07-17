<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaterialRequest;
use App\Http\Requests\UpdateMaterialRequest;
use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $materials = Material::query()
            ->when($request->search, fn ($q, $search) => $q->whereAny(['name', 'sku', 'category'], 'like', "%{$search}%"))
            ->when($request->category, fn ($q, $category) => $q->where('category', $category))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('materials/index', [
            'materials' => $materials,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {
        return Inertia::render('materials/create');
    }

    public function store(StoreMaterialRequest $request)
    {
        Material::create($request->validated());

        return redirect()->route('materials.index');
    }

    public function show(Material $material)
    {
        $material->load(['inventory', 'purchases']);

        return Inertia::render('materials/show', compact('material'));
    }

    public function edit(Material $material)
    {
        return Inertia::render('materials/edit', compact('material'));
    }

    public function update(UpdateMaterialRequest $request, Material $material)
    {
        $material->update($request->validated());

        return redirect()->route('materials.index');
    }

    public function destroy(Material $material)
    {
        $material->delete();

        return redirect()->route('materials.index');
    }
}
