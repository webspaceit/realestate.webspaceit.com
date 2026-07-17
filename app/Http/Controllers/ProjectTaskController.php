<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectTaskRequest;
use App\Http\Requests\UpdateProjectTaskRequest;
use App\Models\ProjectPhase;
use App\Models\ProjectTask;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectTaskController extends Controller
{
    public function index(Request $request): Response
    {
        $tasks = ProjectTask::query()
            ->with(['phase', 'assignedTo'])
            ->when($request->filled('phase_id'), fn ($q) => $q->where('phase_id', $request->phase_id))
            ->when($request->filled('assigned_to'), fn ($q) => $q->where('assigned_to', $request->assigned_to))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', '%'.$request->search.'%'))
            ->when($request->filled('role'), fn ($q) => $q->whereHas('assignedTo', fn ($q) => $q->where('role', $request->role)))
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'phases' => ProjectPhase::select('id', 'name')->get(),
            'users' => User::select('id', 'name', 'role')->get(),
            'filters' => $request->only('phase_id', 'assigned_to', 'status', 'search', 'role'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('tasks/create', [
            'phases' => ProjectPhase::select('id', 'name')->get(),
            'users' => User::select('id', 'name', 'role')->get(),
        ]);
    }

    public function store(StoreProjectTaskRequest $request): RedirectResponse
    {
        ProjectTask::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task created.')]);

        return to_route('tasks.index');
    }

    public function show(ProjectTask $task): Response
    {
        $task->load(['phase', 'assignedTo']);

        return Inertia::render('tasks/show', [
            'task' => $task,
        ]);
    }

    public function edit(ProjectTask $task): Response
    {
        return Inertia::render('tasks/edit', [
            'task' => $task,
            'phases' => ProjectPhase::select('id', 'name')->get(),
            'users' => User::select('id', 'name', 'role')->get(),
        ]);
    }

    public function update(UpdateProjectTaskRequest $request, ProjectTask $task): RedirectResponse
    {
        $task->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task updated.')]);

        return to_route('tasks.index');
    }

    public function destroy(ProjectTask $task): RedirectResponse
    {
        $task->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task deleted.')]);

        return to_route('tasks.index');
    }
}
