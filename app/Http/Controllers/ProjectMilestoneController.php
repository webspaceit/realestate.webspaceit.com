<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectMilestoneRequest;
use App\Http\Requests\UpdateProjectMilestoneRequest;
use App\Models\Project;
use App\Models\ProjectMilestone;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectMilestoneController extends Controller
{
    public function index(Request $request): Response
    {
        $milestones = ProjectMilestone::query()
            ->with('project')
            ->when($request->filled('project_id'), fn ($q) => $q->where('project_id', $request->project_id))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('milestones/index', [
            'milestones' => $milestones,
            'filters' => $request->only(['project_id', 'status']),
            'projects' => Project::select('id', 'name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('milestones/create', [
            'projects' => Project::select('id', 'name')->get(),
        ]);
    }

    public function store(StoreProjectMilestoneRequest $request): RedirectResponse
    {
        ProjectMilestone::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Milestone created.')]);

        return to_route('milestones.index');
    }

    public function show(ProjectMilestone $milestone): Response
    {
        $milestone->load('project');

        return Inertia::render('milestones/show', [
            'milestone' => $milestone,
        ]);
    }

    public function edit(ProjectMilestone $milestone): Response
    {
        return Inertia::render('milestones/edit', [
            'milestone' => $milestone,
            'projects' => Project::select('id', 'name')->get(),
        ]);
    }

    public function update(UpdateProjectMilestoneRequest $request, ProjectMilestone $milestone): RedirectResponse
    {
        $milestone->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Milestone updated.')]);

        return to_route('milestones.index');
    }

    public function destroy(ProjectMilestone $milestone): RedirectResponse
    {
        $milestone->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Milestone deleted.')]);

        return to_route('milestones.index');
    }
}
