<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use App\Models\Lead;
use App\Models\Meeting;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class CrmController extends Controller
{
    public function dashboard()
    {
        $stages = config('crm.stages');

        $leads = Lead::query()
            ->with('assignedTo:id,name')
            ->get();

        $byStage = collect($stages)->map(function ($meta, $stage) use ($leads) {
            $bucket = $leads->where('stage', $stage);

            return [
                'stage' => $stage,
                'badge' => $meta['badge'],
                'probability' => $meta['probability'],
                'count' => $bucket->count(),
                'value' => (float) $bucket->sum('value'),
                'weighted' => (float) $bucket->sum(fn ($l) => $l->value * ($l->probability / 100)),
            ];
        })->values();

        $openLeads = $leads->whereNotIn('stage', ['Lost']);

        $upcomingFollowUps = Lead::query()
            ->whereNotNull('follow_up_date')
            ->where('follow_up_date', '>=', Carbon::today())
            ->orderBy('follow_up_date')
            ->limit(8)
            ->get()
            ->map(fn ($l) => [
                'id' => $l->id,
                'contact_person' => $l->contact_person,
                'company_name' => $l->company_name,
                'stage' => $l->stage,
                'follow_up_date' => $l->follow_up_date?->format('Y-m-d'),
            ]);

        $upcomingMeetings = Meeting::query()
            ->where('status', '!=', 'Cancelled')
            ->where('scheduled_at', '>=', Carbon::now())
            ->orderBy('scheduled_at')
            ->limit(8)
            ->get()
            ->map(fn ($m) => [
                'id' => $m->id,
                'title' => $m->title,
                'location' => $m->location,
                'status' => $m->status,
                'scheduled_at' => $m->scheduled_at?->format('Y-m-d H:i'),
                'lead' => $m->lead?->company_name ?: $m->lead?->contact_person,
                'client' => $m->client?->company_name ?: $m->client?->contact_person,
            ]);

        $recentInteractions = Interaction::query()
            ->with('lead:id,contact_person,company_name', 'client:id,contact_person,company_name', 'recordedBy:id,name')
            ->orderBy('interaction_date', 'desc')
            ->limit(8)
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'type' => $i->type,
                'subject' => $i->subject,
                'interaction_date' => $i->interaction_date?->format('Y-m-d'),
                'party' => $i->lead?->company_name ?: ($i->client?->company_name ?: $i->lead?->contact_person ?: $i->client?->contact_person),
            ]);

        return Inertia::render('crm/dashboard', [
            'stats' => [
                'total_leads' => $leads->count(),
                'open_leads' => $openLeads->where('stage', '!=', 'On Hold')->count(),
                'pipeline_value' => (float) $openLeads->sum('value'),
                'weighted_value' => (float) $openLeads->sum(fn ($l) => $l->value * ($l->probability / 100)),
                'awarded_value' => (float) $leads->where('stage', 'Awarded')->sum('value'),
                'meetings_upcoming' => $upcomingMeetings->count(),
            ],
            'byStage' => $byStage,
            'upcomingFollowUps' => $upcomingFollowUps,
            'upcomingMeetings' => $upcomingMeetings,
            'recentInteractions' => $recentInteractions,
        ]);
    }
}