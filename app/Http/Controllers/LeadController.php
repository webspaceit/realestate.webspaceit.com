<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::query()
            ->with('assignedTo:id,name')
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('contact_person', 'like', "%{$search}%")
                        ->orWhere('company_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when(request('stage'), fn ($query, $stage) => $query->where('stage', $stage))
            ->when(request('source'), fn ($query, $source) => $query->where('source', $source))
            ->when(request('assigned_to_id'), fn ($query, $id) => $query->where('assigned_to_id', $id))
            ->orderByRaw("CASE WHEN stage = 'Lost' OR stage = 'On Hold' THEN 1 ELSE 0 END")
            ->orderBy('follow_up_date')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('leads/index', [
            'leads' => $leads,
            'filters' => request()->only(['search', 'stage', 'source', 'assigned_to_id']),
            'users' => User::all(['id', 'name']),
            'stages' => collect(config('crm.stages'))->map(fn ($meta, $key) => [
                'key' => $key,
                'badge' => $meta['badge'],
                'probability' => $meta['probability'],
            ])->values(),
            'sources' => config('crm.sources'),
        ]);
    }

    public function create()
    {
        return Inertia::render('leads/create', [
            'users' => User::all(['id', 'name']),
            'stages' => collect(config('crm.stages'))->map(fn ($meta, $key) => [
                'key' => $key,
                'badge' => $meta['badge'],
                'probability' => $meta['probability'],
            ])->values(),
            'sources' => config('crm.sources'),
            'defaultStage' => array_key_first(config('crm.stages')),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'contact_person' => 'required|string|max:191',
            'company_name' => 'nullable|string|max:191',
            'email' => 'nullable|email|max:191',
            'phone' => 'nullable|string|max:50',
            'source' => 'nullable|string|max:50',
            'stage' => 'required|string|max:50',
            'probability' => 'required|integer|min:0|max:100',
            'value' => 'nullable|numeric|min:0',
            'assigned_to_id' => 'nullable|exists:users,id',
            'follow_up_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        Lead::create($data);

        return redirect()->route('leads.index')
            ->with('success', 'Lead created successfully.');
    }

    public function show(Lead $lead)
    {
        $lead->load([
            'assignedTo:id,name',
            'interactions' => fn ($q) => $q->with('recordedBy:id,name')->orderBy('interaction_date', 'desc'),
            'meetings' => fn ($q) => $q->with('organizer:id,name')->orderBy('scheduled_at', 'desc'),
        ]);

        return Inertia::render('leads/show', [
            'lead' => $lead,
            'stages' => collect(config('crm.stages'))->map(fn ($meta, $key) => [
                'key' => $key,
                'badge' => $meta['badge'],
                'probability' => $meta['probability'],
            ])->values(),
        ]);
    }

    public function edit(Lead $lead)
    {
        return Inertia::render('leads/edit', [
            'lead' => $lead,
            'users' => User::all(['id', 'name']),
            'stages' => collect(config('crm.stages'))->map(fn ($meta, $key) => [
                'key' => $key,
                'badge' => $meta['badge'],
                'probability' => $meta['probability'],
            ])->values(),
            'sources' => config('crm.sources'),
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        $data = $request->validate([
            'contact_person' => 'required|string|max:191',
            'company_name' => 'nullable|string|max:191',
            'email' => 'nullable|email|max:191',
            'phone' => 'nullable|string|max:50',
            'source' => 'nullable|string|max:50',
            'stage' => 'required|string|max:50',
            'probability' => 'required|integer|min:0|max:100',
            'value' => 'nullable|numeric|min:0',
            'assigned_to_id' => 'nullable|exists:users,id',
            'follow_up_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $lead->update($data);

        return redirect()->route('leads.index')
            ->with('success', 'Lead updated successfully.');
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();

        return redirect()->route('leads.index')
            ->with('success', 'Lead deleted successfully.');
    }
}