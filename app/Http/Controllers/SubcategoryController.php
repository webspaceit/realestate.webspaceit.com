<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubcategoryRequest;
use App\Http\Requests\UpdateSubcategoryRequest;
use App\Models\DocumentCategory;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubcategoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = in_array((int) $request->per_page, [10, 50, 100, 150]) ? (int) $request->per_page : 10;

        $subcategories = Subcategory::query()
            ->with('category')
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->when($request->document_category_id, fn ($q, $id) => $q->where('document_category_id', $id))
            ->orderBy('order')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('subcategories/index', [
            'subcategories' => $subcategories,
            'filters' => $request->only(['search', 'document_category_id', 'per_page']),
            'categories' => DocumentCategory::all(['id', 'name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('subcategories/create', [
            'categories' => DocumentCategory::all(['id', 'name']),
        ]);
    }

    public function store(StoreSubcategoryRequest $request)
    {
        $maxOrder = Subcategory::where('document_category_id', $request->document_category_id)->max('order') ?? 0;

        Subcategory::create($request->validated() + ['order' => $maxOrder + 1]);

        return redirect()->route('subcategories.index');
    }

    public function show(Subcategory $subcategory)
    {
        $subcategory->load('category');

        return Inertia::render('subcategories/show', compact('subcategory'));
    }

    public function edit(Subcategory $subcategory)
    {
        return Inertia::render('subcategories/edit', [
            'subcategory' => $subcategory,
            'categories' => DocumentCategory::all(['id', 'name']),
        ]);
    }

    public function update(UpdateSubcategoryRequest $request, Subcategory $subcategory)
    {
        $subcategory->update($request->validated());

        return redirect()->route('subcategories.index');
    }

    public function destroy(Subcategory $subcategory)
    {
        $subcategory->delete();

        return redirect()->route('subcategories.index');
    }
}
