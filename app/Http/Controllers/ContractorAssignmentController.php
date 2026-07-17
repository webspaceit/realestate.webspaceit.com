<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContractorAssignmentRequest;
use App\Http\Requests\UpdateContractorAssignmentRequest;
use App\Models\Contractor;
use App\Models\ContractorAssignment;
use App\Models\Project;
use App\Models\ProjectTask;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractorAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $assignments = ContractorAssignment::query()
            ->with(['contractor', 'project', 'task'])
            ->when($request->contractor_id, fn ($q, $id) => $q->where('contractor_id', $id))
            ->when($request->project_id, fn ($q, $id) => $q->where('project_id', $id))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('contractor-assignments/index', [
            'contractorAssignments' => $assignments,
            'filters' => $request->only(['contractor_id', 'project_id']),
            'contractors' => Contractor::select('id', 'company_name')->get(),
            'projects' => Project::select('id', 'name')->get(),
        ]);
    }

    public function create()
    {
        $contractors = Contractor::select('id', 'company_name')->get();
        $projects = Project::select('id', 'name')->get();

        return Inertia::render('contractor-assignments/create', compact('contractors', 'projects'));
    }

    public function store(StoreContractorAssignmentRequest $request)
    {
        ContractorAssignment::create($request->validated());

        return redirect()->route('contractor-assignments.index');
    }

    public function show(ContractorAssignment $contractorAssignment)
    {
        $contractorAssignment->load(['contractor', 'project', 'task']);

        return Inertia::render('contractor-assignments/show', compact('contractorAssignment'));
    }

    public function edit(ContractorAssignment $contractorAssignment)
    {
        $contractorAssignment->load(['contractor', 'project', 'task']);
        $contractors = Contractor::select('id', 'company_name')->get();
        $projects = Project::select('id', 'name')->get();
        $tasks = ProjectTask::select('id', 'name')->get();

        return Inertia::render('contractor-assignments/edit', compact('contractorAssignment', 'contractors', 'projects', 'tasks'));
    }

    public function update(UpdateContractorAssignmentRequest $request, ContractorAssignment $contractorAssignment)
    {
        $contractorAssignment->update($request->validated());

        return redirect()->route('contractor-assignments.index');
    }

    public function destroy(ContractorAssignment $contractorAssignment)
    {
        $contractorAssignment->delete();

        return redirect()->route('contractor-assignments.index');
    }
}
