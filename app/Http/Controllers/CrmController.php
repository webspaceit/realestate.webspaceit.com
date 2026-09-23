<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Client;
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

        // ── Chart data ────────────────────────────────────────────────────
        $monthlyLeads = Lead::query()
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->where('created_at', '>=', Carbon::now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => ['month' => $r->month, 'count' => (int) $r->count]);

        $interactionsByType = Interaction::query()
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->get()
            ->map(fn ($r) => ['type' => $r->type, 'count' => (int) $r->count]);

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
            'monthlyLeads' => $monthlyLeads,
            'interactionsByType' => $interactionsByType,
        ]);
    }

    public function reports()
    {
        $stages = config('crm.stages');
        $sources = config('crm.sources');

        // ── Leads by stage ──────────────────────────────────────────────
        $allLeads = Lead::all();

        $byStage = collect($stages)->map(fn ($meta, $stage) => [
            'stage'    => $stage,
            'count'    => $allLeads->where('stage', $stage)->count(),
            'value'    => (float) $allLeads->where('stage', $stage)->sum('value'),
            'badge'    => $meta['badge'],
        ])->values();

        // ── Leads by source ─────────────────────────────────────────────
        $bySource = collect($sources)->map(fn ($src) => [
            'source' => $src,
            'count'  => $allLeads->where('source', $src)->count(),
        ])->filter(fn ($s) => $s['count'] > 0)->values();

        // ── Monthly leads created (last 12 months) ───────────────────────
        $monthlyLeads = Lead::query()
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->where('created_at', '>=', Carbon::now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // ── Conversion stats ─────────────────────────────────────────────
        $totalLeads    = $allLeads->count();
        $convertedLeads = $allLeads->whereNotNull('converted_client_id')->count();
        $awardedLeads  = $allLeads->where('stage', 'Awarded')->count();
        $lostLeads     = $allLeads->where('stage', 'Lost')->count();
        $conversionRate = $totalLeads > 0 ? round($convertedLeads / $totalLeads * 100, 1) : 0;

        // ── Bookings summary ─────────────────────────────────────────────
        $bookings = Booking::all();
        $bookingsByStatus = [
            'pending'   => $bookings->where('status', 'pending')->count(),
            'confirmed' => $bookings->where('status', 'confirmed')->count(),
            'cancelled' => $bookings->where('status', 'cancelled')->count(),
        ];
        $totalBookingValue = (float) $bookings->whereIn('status', ['pending', 'confirmed'])->sum('total_price');

        // ── Monthly bookings (last 12 months) ────────────────────────────
        $monthlyBookings = Booking::query()
            ->selectRaw("DATE_FORMAT(booking_date, '%Y-%m') as month, COUNT(*) as count, SUM(total_price) as value")
            ->where('booking_date', '>=', Carbon::now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // ── Interactions by type ─────────────────────────────────────────
        $interactionsByType = Interaction::query()
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->get();

        // ── Top clients by booking value ─────────────────────────────────
        $topClients = Client::query()
            ->withAggregate(
                ['bookings' => fn ($q) => $q->whereIn('status', ['pending', 'confirmed'])],
                'total_price',
                'sum'
            )
            ->having('bookings_sum_total_price', '>', 0)
            ->orderByDesc('bookings_sum_total_price')
            ->limit(10)
            ->get(['id', 'contact_person', 'company_name'])
            ->map(fn ($c) => [
                'id'          => $c->id,
                'name'        => $c->company_name ?: $c->contact_person,
                'total_value' => (float) $c->bookings_sum_total_price,
            ]);

        return Inertia::render('crm/reports', [
            'byStage'          => $byStage,
            'bySource'         => $bySource,
            'monthlyLeads'     => $monthlyLeads,
            'monthlyBookings'  => $monthlyBookings,
            'conversionStats'  => [
                'total'          => $totalLeads,
                'converted'      => $convertedLeads,
                'awarded'        => $awardedLeads,
                'lost'           => $lostLeads,
                'conversion_rate'=> $conversionRate,
            ],
            'bookingsByStatus' => $bookingsByStatus,
            'totalBookingValue'=> $totalBookingValue,
            'interactionsByType'=> $interactionsByType,
            'topClients'       => $topClients,
        ]);
    }
}