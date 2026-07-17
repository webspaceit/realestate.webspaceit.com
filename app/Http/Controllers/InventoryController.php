<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryRequest;
use App\Http\Requests\UpdateInventoryRequest;
use App\Models\Inventory;
use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $inventory = Inventory::query()
            ->with('material')
            ->when($request->search, fn ($q, $search) => $q->whereHas('material', fn ($q) => $q->where('name', 'like', "%{$search}%")))
            ->when($request->low_stock, fn ($q) => $q->whereColumn('quantity', '<=', 'minimum_quantity'))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('inventory/index', [
            'inventory' => $inventory,
            'filters' => $request->only(['search', 'low_stock']),
        ]);
    }

    public function create()
    {
        $materials = Material::select('id', 'name', 'sku')->get();

        return Inertia::render('inventory/create', compact('materials'));
    }

    public function store(StoreInventoryRequest $request)
    {
        Inventory::create($request->validated());

        return redirect()->route('inventory.index');
    }

    public function show(Inventory $inventory)
    {
        $inventory->load(['material', 'movements']);

        return Inertia::render('inventory/show', compact('inventory'));
    }

    public function edit(Inventory $inventory)
    {
        $materials = Material::select('id', 'name', 'sku')->get();

        return Inertia::render('inventory/edit', compact('inventory', 'materials'));
    }

    public function update(UpdateInventoryRequest $request, Inventory $inventory)
    {
        $inventory->update($request->validated());

        return redirect()->route('inventory.index');
    }

    public function destroy(Inventory $inventory)
    {
        $inventory->delete();

        return redirect()->route('inventory.index');
    }
}
