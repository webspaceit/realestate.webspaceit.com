<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Expense;
use App\Models\Project;
use App\Models\ProjectPhase;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::query()
            ->when(request('project_id'), function ($query, $projectId) {
                $query->where('project_id', $projectId);
            })
            ->when(request('phase_id'), function ($query, $phaseId) {
                $query->where('phase_id', $phaseId);
            })
            ->when(request('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->with('project', 'phase')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('expenses/index', [
            'expenses' => $expenses,
            'filters' => request()->only(['project_id', 'phase_id', 'category']),
            'projects' => Project::all(['id', 'name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('expenses/create', [
            'projects' => Project::all(['id', 'name']),
            'phases' => ProjectPhase::all(['id', 'name']),
        ]);
    }

    public function store(StoreExpenseRequest $request)
    {
        Expense::create($request->validated());

        return redirect()->route('expenses.index')
            ->with('success', 'Expense created successfully.');
    }

    public function show(Expense $expense)
    {
        $expense->load('project', 'phase');

        return Inertia::render('expenses/show', [
            'expense' => $expense,
        ]);
    }

    public function edit(Expense $expense)
    {
        return Inertia::render('expenses/edit', [
            'expense' => $expense,
            'projects' => Project::all(['id', 'name']),
            'phases' => ProjectPhase::all(['id', 'name']),
        ]);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $expense->update($request->validated());

        return redirect()->route('expenses.index')
            ->with('success', 'Expense updated successfully.');
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();

        return redirect()->route('expenses.index')
            ->with('success', 'Expense deleted successfully.');
    }
}
