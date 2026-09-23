<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Interaction;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InteractionController extends Controller
{
    public function index()
    {
        $interactions = Interaction::query()
            ->with('lead:id,contact_person,company_name', 'client:id,contact_person,company_name', 'recordedBy:id,name')
            ->when(request('search'), function ($query, $search) {
                $query->where('subject', 'like', "%{$search}%");
            })
            ->when(request('type'), fn ($query, $type) => $query->where('type', $type))
            ->when(request('from'), fn ($query, $from) => $query->where('interaction_date', '>=', $from))
            ->when(request('to'), fn ($query, $to) => $query->where('interaction_date', '<=', $to))
            ->orderBy('interaction_date', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('interactions/index', [
            'interactions' => $interactions,
            'filters' => request()->only(['search', 'type', 'from', 'to']),
            'types' => config('crm.interaction_types'),
        ]);
    }

    public function create()
    {
        return Inertia::render('interactions/create', [
            'leads' => Lead::all(['id', 'contact_person', 'company_name']),
            'clients' => Client::all(['id', 'contact_person', 'company_name']),
            'users' => User::all(['id', 'name']),
            'types' => config('crm.interaction_types'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'client_id' => 'nullable|exists:clients,id',
            'type' => 'required|string|max:50',
            'subject' => 'required|string|max:191',
            'notes' => 'nullable|string',
            'interaction_date' => 'required|date',
            'recorded_by_id' => 'nullable|exists:users,id',
        ]);

        Interaction::create($data);

        return redirect()->route('interactions.index')
            ->with('success', 'Interaction logged successfully.');
    }

    public function edit(Interaction $interaction)
    {
        return Inertia::render('interactions/edit', [
            'interaction' => $interaction,
            'leads' => Lead::all(['id', 'contact_person', 'company_name']),
            'clients' => Client::all(['id', 'contact_person', 'company_name']),
            'users' => User::all(['id', 'name']),
            'types' => config('crm.interaction_types'),
        ]);
    }

    public function update(Request $request, Interaction $interaction)
    {
        $data = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'client_id' => 'nullable|exists:clients,id',
            'type' => 'required|string|max:50',
            'subject' => 'required|string|max:191',
            'notes' => 'nullable|string',
            'interaction_date' => 'required|date',
            'recorded_by_id' => 'nullable|exists:users,id',
        ]);

        $interaction->update($data);

        return redirect()->route('interactions.index')
            ->with('success', 'Interaction updated successfully.');
    }

    public function destroy(Interaction $interaction)
    {
        $interaction->delete();

        return redirect()->route('interactions.index')
            ->with('success', 'Interaction deleted successfully.');
    }
}