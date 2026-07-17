<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaterialPurchaseRequest;
use App\Http\Requests\UpdateMaterialPurchaseRequest;
use App\Models\Material;
use App\Models\MaterialPurchase;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialPurchaseController extends Controller
{
    public function index(Request $request)
    {
        $purchases = MaterialPurchase::query()
            ->with(['material', 'supplier'])
            ->when($request->material_id, fn ($q, $id) => $q->where('material_id', $id))
            ->when($request->supplier_id, fn ($q, $id) => $q->where('supplier_id', $id))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('material-purchases/index', [
            'purchases' => $purchases,
            'filters' => $request->only(['material_id', 'supplier_id', 'status']),
            'materials' => Material::select('id', 'name')->get(),
            'suppliers' => Supplier::select('id', 'company_name as name')->get(),
        ]);
    }

    public function create()
    {
        $materials = Material::select('id', 'name', 'sku')->get();
        $suppliers = Supplier::select('id', 'company_name')->get();

        return Inertia::render('material-purchases/create', compact('materials', 'suppliers'));
    }

    public function store(StoreMaterialPurchaseRequest $request)
    {
        MaterialPurchase::create([
            ...$request->validated(),
            'total_price' => $request->quantity * $request->unit_price,
        ]);

        return redirect()->route('material-purchases.index');
    }

    public function show(MaterialPurchase $materialPurchase)
    {
        $materialPurchase->load(['material', 'supplier']);

        return Inertia::render('material-purchases/show', compact('materialPurchase'));
    }

    public function edit(MaterialPurchase $materialPurchase)
    {
        $materials = Material::select('id', 'name', 'sku')->get();
        $suppliers = Supplier::select('id', 'company_name')->get();

        return Inertia::render('material-purchases/edit', compact('materialPurchase', 'materials', 'suppliers'));
    }

    public function update(UpdateMaterialPurchaseRequest $request, MaterialPurchase $materialPurchase)
    {
        $materialPurchase->update([
            ...$request->validated(),
            'total_price' => $request->quantity * $request->unit_price,
        ]);

        return redirect()->route('material-purchases.index');
    }

    public function destroy(MaterialPurchase $materialPurchase)
    {
        $materialPurchase->delete();

        return redirect()->route('material-purchases.index');
    }
}
