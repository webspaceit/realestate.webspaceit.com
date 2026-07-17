<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentCategoryRequest;
use App\Http\Requests\UpdateDocumentCategoryRequest;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = DocumentCategory::query()
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('order')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('document-categories/index', [
            'categories' => $categories,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('document-categories/create');
    }

    public function store(StoreDocumentCategoryRequest $request)
    {
        $maxOrder = DocumentCategory::max('order') ?? 0;

        DocumentCategory::create($request->validated() + ['order' => $maxOrder + 1]);

        return redirect()->route('document-categories.index');
    }

    public function show(DocumentCategory $documentCategory)
    {
        return Inertia::render('document-categories/show', compact('documentCategory'));
    }

    public function edit(DocumentCategory $documentCategory)
    {
        return Inertia::render('document-categories/edit', compact('documentCategory'));
    }

    public function update(UpdateDocumentCategoryRequest $request, DocumentCategory $documentCategory)
    {
        $documentCategory->update($request->validated());

        return redirect()->route('document-categories.index');
    }

    public function destroy(DocumentCategory $documentCategory)
    {
        $documentCategory->delete();

        return redirect()->route('document-categories.index');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:document_categories,id'],
        ]);

        foreach (array_values($request->ids) as $index => $id) {
            DocumentCategory::where('id', $id)->update(['order' => $index + 1]);
        }

        return redirect()->route('document-categories.index');
    }
}
