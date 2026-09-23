<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Lead;
use App\Models\Meeting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index()
    {
        $meetings = Meeting::query()
            ->with('lead:id,contact_person,company_name', 'client:id,contact_person,company_name', 'organizer:id,name')
            ->when(request('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when(request('status'), fn ($query, $status) => $query->where('status', $status))
            ->when(request('from'), fn ($query, $from) => $query->where('scheduled_at', '>=', $from . ' 00:00:00'))
            ->when(request('to'), fn ($query, $to) => $query->where('scheduled_at', '<=', $to . ' 23:59:59'))
            ->orderBy('scheduled_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('meetings/index', [
            'meetings' => $meetings,
            'filters' => request()->only(['search', 'status', 'from', 'to']),
            'statuses' => config('crm.meeting_statuses'),
        ]);
    }

    public function create()
    {
        return Inertia::render('meetings/create', [
            'leads' => Lead::all(['id', 'contact_person', 'company_name']),
            'clients' => Client::all(['id', 'contact_person', 'company_name']),
            'users' => User::all(['id', 'name']),
            'statuses' => config('crm.meeting_statuses'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'client_id' => 'nullable|exists:clients,id',
            'title' => 'required|string|max:191',
            'location' => 'nullable|string|max:191',
            'scheduled_at' => 'required|date',
            'status' => 'required|string|max:50',
            'notes' => 'nullable|string',
            'outcome' => 'nullable|string',
            'organizer_id' => 'nullable|exists:users,id',
        ]);

        Meeting::create($data);

        return redirect()->route('meetings.index')
            ->with('success', 'Meeting scheduled successfully.');
    }

    public function edit(Meeting $meeting)
    {
        return Inertia::render('meetings/edit', [
            'meeting' => $meeting,
            'leads' => Lead::all(['id', 'contact_person', 'company_name']),
            'clients' => Client::all(['id', 'contact_person', 'company_name']),
            'users' => User::all(['id', 'name']),
            'statuses' => config('crm.meeting_statuses'),
        ]);
    }

    public function update(Request $request, Meeting $meeting)
    {
        $data = $request->validate([
            'lead_id' => 'nullable|exists:leads,id',
            'client_id' => 'nullable|exists:clients,id',
            'title' => 'required|string|max:191',
            'location' => 'nullable|string|max:191',
            'scheduled_at' => 'required|date',
            'status' => 'required|string|max:50',
            'notes' => 'nullable|string',
            'outcome' => 'nullable|string',
            'organizer_id' => 'nullable|exists:users,id',
        ]);

        $meeting->update($data);

        return redirect()->route('meetings.index')
            ->with('success', 'Meeting updated successfully.');
    }

    public function destroy(Meeting $meeting)
    {
        $meeting->delete();

        return redirect()->route('meetings.index')
            ->with('success', 'Meeting deleted successfully.');
    }
}