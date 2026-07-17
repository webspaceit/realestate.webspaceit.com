<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectPhaseRequest;
use App\Http\Requests\UpdateProjectPhaseRequest;
use App\Models\Project;
use App\Models\ProjectPhase;
use App\Models\ProjectTask;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectPhaseController extends Controller
{
    public function index(Request $request): Response
    {
        $phases = ProjectPhase::query()
            ->when($request->filled('project_id'), fn ($q) => $q->where('project_id', $request->project_id))
            ->with('project')
            ->orderBy('order')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('phases/index', [
            'phases' => $phases,
            'projects' => Project::select('id', 'name')->get(),
            'filters' => $request->only('project_id'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('phases/create', [
            'projects' => Project::select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function store(StoreProjectPhaseRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $phase = ProjectPhase::create($request->validated());

            if ($request->filled('tasks')) {
                foreach ($request->tasks as $taskData) {
                    $phase->tasks()->create($taskData);
                }
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Phase created.')]);

        return to_route('phases.index');
    }

    public function show(ProjectPhase $phase): Response
    {
        $phase->load(['tasks', 'budgets', 'expenses']);

        return Inertia::render('phases/show', [
            'phase' => $phase,
        ]);
    }

    public function edit(ProjectPhase $phase): Response
    {
        $phase->load('tasks');

        return Inertia::render('phases/edit', [
            'phase' => $phase,
            'projects' => Project::select('id', 'name')->get(),
            'users' => User::select('id', 'name')->get(),
        ]);
    }

    public function update(UpdateProjectPhaseRequest $request, ProjectPhase $phase): RedirectResponse
    {
        DB::transaction(function () use ($request, $phase) {
            $phase->update($request->validated());

            if ($request->has('tasks')) {
                $existingIds = $phase->tasks()->pluck('id')->toArray();
                $submittedIds = collect($request->tasks)->pluck('id')->filter()->toArray();

                $toDelete = array_diff($existingIds, $submittedIds);
                ProjectTask::whereIn('id', $toDelete)->delete();

                foreach ($request->tasks as $taskData) {
                    if (!empty($taskData['id'])) {
                        ProjectTask::where('id', $taskData['id'])->where('phase_id', $phase->id)->update(collect($taskData)->except('id')->toArray());
                    } else {
                        $phase->tasks()->create($taskData);
                    }
                }
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Phase updated.')]);

        return to_route('phases.index');
    }

    public function destroy(ProjectPhase $phase): RedirectResponse
    {
        $phase->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Phase deleted.')]);

        return to_route('phases.index');
    }
}
