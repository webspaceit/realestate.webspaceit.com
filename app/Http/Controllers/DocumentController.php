<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Models\Building;
use App\Models\Document;
use App\Models\DocumentCategory;
use App\Models\Project;
use App\Models\Subcategory;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $perPage = in_array((int) request('per_page'), [10, 50, 100, 150]) ? (int) request('per_page') : 10;

        $documents = Document::query()
            ->when(request('project_id'), function ($query, $projectId) {
                $query->where('project_id', $projectId);
            })
            ->when(request('building_id'), function ($query, $buildingId) {
                $query->where('building_id', $buildingId);
            })
            ->when(request('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->when(request('subcategory_id'), function ($query, $subcategoryId) {
                $query->where('subcategory_id', $subcategoryId);
            })
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->with('project', 'building', 'uploadedBy', 'subcategory')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('documents/index', [
            'documents' => $documents,
            'filters' => request()->only(['project_id', 'building_id', 'category', 'subcategory_id', 'search', 'per_page']),
            'projects' => Project::all(['id', 'name']),
            'buildings' => Building::all(['id', 'name', 'project_id']),
            'categories' => DocumentCategory::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'name', 'document_category_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('documents/create', [
            'projects' => Project::all(['id', 'name']),
            'buildings' => Building::all(['id', 'name', 'project_id']),
            'categories' => DocumentCategory::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'name', 'document_category_id']),
            'existingDocs' => Document::select('project_id', 'building_id', 'subcategory_id')
                ->whereNotNull('project_id')
                ->whereNotNull('building_id')
                ->whereNotNull('subcategory_id')
                ->get(),
        ]);
    }

    public function store(StoreDocumentRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('documents', 'public');
        }

        $data['uploaded_by'] = auth()->id();

        Document::create($data);

        return redirect()->route('documents.index')
            ->with('success', 'Document created successfully.');
    }

    public function show(Document $document)
    {
        $document->load('project', 'building', 'uploadedBy', 'subcategory');

        return Inertia::render('documents/show', [
            'document' => $document,
        ]);
    }

    public function edit(Document $document)
    {
        return Inertia::render('documents/edit', [
            'document' => $document,
            'projects' => Project::all(['id', 'name']),
            'buildings' => Building::all(['id', 'name', 'project_id']),
            'categories' => DocumentCategory::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'name', 'document_category_id']),
            'existingDocs' => Document::select('project_id', 'building_id', 'subcategory_id')
                ->where('id', '!=', $document->id)
                ->whereNotNull('project_id')
                ->whereNotNull('building_id')
                ->whereNotNull('subcategory_id')
                ->get(),
        ]);
    }

    public function update(UpdateDocumentRequest $request, Document $document)
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('documents', 'public');
        }

        $document->update($data);

        return redirect()->route('documents.index')
            ->with('success', 'Document updated successfully.');
    }

    public function destroy(Document $document)
    {
        $document->delete();

        return redirect()->route('documents.index')
            ->with('success', 'Document deleted successfully.');
    }
}
