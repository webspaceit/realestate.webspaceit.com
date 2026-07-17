<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\District;
use App\Models\Division;
use App\Models\Project;
use App\Models\ProjectType;
use App\Models\Thana;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::query()
            ->when(request('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when(request('building_id'), function ($query, $buildingId) {
                $query->where('building_id', $buildingId);
            })
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->with('building')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'filters' => request()->only(['search', 'status', 'building_id']),
            'buildings' => Building::all(['id', 'name', 'code']),
        ]);
    }

    public function create()
    {
        return Inertia::render('projects/create', [
            'buildings' => Building::all(['id', 'name', 'code']),
            'projectTypes' => ProjectType::where('is_active', true)->orderBy('sort_order')->orderBy('name')->get(['id', 'name']),
            'divisions' => Division::all(['id', 'name']),
            'districts' => District::all(['id', 'division_id', 'name']),
            'thanas' => Thana::all(['id', 'district_id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'building_id' => ['nullable', 'exists:buildings,id'],
            'project_type_id' => ['nullable', 'exists:project_types,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50', 'unique:projects,code'],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'land_size_katha' => ['nullable', 'numeric', 'min:0'],
            'land_details' => ['nullable', 'string'],
            'rajuk_file_submit_date' => ['nullable', 'date'],
            'rajuk_permission_status' => ['nullable', 'string', 'in:not_submitted,file_submitted,processing,on_hold,pending,rejected,approved'],
            'total_unit' => ['nullable', 'integer', 'min:0'],
            'total_flat' => ['nullable', 'integer', 'min:0'],
            'total_floor' => ['nullable', 'integer', 'min:0'],
            'total_parking' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:planning,in_progress,on_hold,completed,cancelled'],
            'division_id' => ['nullable', 'exists:divisions,id'],
            'district_id' => ['nullable', 'exists:districts,id'],
            'thana_id' => ['nullable', 'exists:thanas,id'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        Project::create($validated);

        return redirect()->route('projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function show(Project $project)
    {
        $project->load(['projectType', 'phases', 'milestones', 'budgets', 'contractorAssignments.contractor', 'division', 'district', 'thana']);

        return Inertia::render('projects/show', [
            'project' => $project,
        ]);
    }

    public function edit(Project $project)
    {
        return Inertia::render('projects/edit', [
            'project' => $project,
            'buildings' => Building::all(['id', 'name', 'code']),
            'projectTypes' => ProjectType::where('is_active', true)->orderBy('sort_order')->orderBy('name')->get(['id', 'name']),
            'divisions' => Division::all(['id', 'name']),
            'districts' => District::all(['id', 'division_id', 'name']),
            'thanas' => Thana::all(['id', 'district_id', 'name']),
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'building_id' => ['nullable', 'exists:buildings,id'],
            'project_type_id' => ['nullable', 'exists:project_types,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('projects', 'code')->ignore($project->id)],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'land_size_katha' => ['nullable', 'numeric', 'min:0'],
            'land_details' => ['nullable', 'string'],
            'rajuk_file_submit_date' => ['nullable', 'date'],
            'rajuk_permission_status' => ['nullable', 'string', 'in:not_submitted,file_submitted,processing,on_hold,pending,rejected,approved'],
            'total_unit' => ['nullable', 'integer', 'min:0'],
            'total_flat' => ['nullable', 'integer', 'min:0'],
            'total_floor' => ['nullable', 'integer', 'min:0'],
            'total_parking' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', 'in:planning,in_progress,on_hold,completed,cancelled'],
            'division_id' => ['nullable', 'exists:divisions,id'],
            'district_id' => ['nullable', 'exists:districts,id'],
            'thana_id' => ['nullable', 'exists:thanas,id'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $project->update($validated);

        return redirect()->route('projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }
}
