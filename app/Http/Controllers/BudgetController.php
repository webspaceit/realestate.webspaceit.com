<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBudgetRequest;
use App\Http\Requests\UpdateBudgetRequest;
use App\Models\Budget;
use App\Models\Project;
use App\Models\ProjectPhase;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::query()
            ->when(request('project_id'), function ($query, $projectId) {
                $query->where('project_id', $projectId);
            })
            ->with('project', 'phase')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('budgets/index', [
            'budgets' => $budgets,
            'filters' => request()->only(['project_id']),
            'projects' => Project::all(['id', 'name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('budgets/create', [
            'projects' => Project::all(['id', 'name']),
            'phases' => ProjectPhase::all(['id', 'name']),
        ]);
    }

    public function store(StoreBudgetRequest $request)
    {
        Budget::create($request->validated());

        return redirect()->route('budgets.index')
            ->with('success', 'Budget created successfully.');
    }

    public function show(Budget $budget)
    {
        $budget->load('project', 'phase');

        return Inertia::render('budgets/show', [
            'budget' => $budget,
        ]);
    }

    public function edit(Budget $budget)
    {
        return Inertia::render('budgets/edit', [
            'budget' => $budget,
            'projects' => Project::all(['id', 'name']),
            'phases' => ProjectPhase::all(['id', 'name']),
        ]);
    }

    public function update(UpdateBudgetRequest $request, Budget $budget)
    {
        $budget->update($request->validated());

        return redirect()->route('budgets.index')
            ->with('success', 'Budget updated successfully.');
    }

    public function destroy(Budget $budget)
    {
        $budget->delete();

        return redirect()->route('budgets.index')
            ->with('success', 'Budget deleted successfully.');
    }
}
