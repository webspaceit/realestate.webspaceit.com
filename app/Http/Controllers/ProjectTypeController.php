<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectTypeRequest;
use App\Http\Requests\UpdateProjectTypeRequest;
use App\Models\ProjectType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectTypeController extends Controller
{
    public function index()
    {
        $projectTypes = ProjectType::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('project-types/index', [
            'projectTypes' => $projectTypes,
            'filters' => request()->only(['search']),
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:project_types,id'],
        ]);

        foreach ($request->ids as $index => $id) {
            ProjectType::where('id', $id)->update(['sort_order' => $index + 1]);
        }

        return response()->json(['success' => true]);
    }

    public function create()
    {
        return Inertia::render('project-types/create');
    }

    public function store(StoreProjectTypeRequest $request)
    {
        ProjectType::create($request->validated());

        return redirect()->route('project-types.index')
            ->with('success', 'Project Type created successfully.');
    }

    public function show(ProjectType $projectType)
    {
        return Inertia::render('project-types/show', [
            'projectType' => $projectType,
        ]);
    }

    public function edit(ProjectType $projectType)
    {
        return Inertia::render('project-types/edit', [
            'projectType' => $projectType,
        ]);
    }

    public function update(UpdateProjectTypeRequest $request, ProjectType $projectType)
    {
        $projectType->update($request->validated());

        return redirect()->route('project-types.index')
            ->with('success', 'Project Type updated successfully.');
    }

    public function destroy(ProjectType $projectType)
    {
        $projectType->delete();

        return redirect()->route('project-types.index')
            ->with('success', 'Project Type deleted successfully.');
    }
}
