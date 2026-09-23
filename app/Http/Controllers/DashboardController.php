<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Client;
use App\Models\Contractor;
use App\Models\Expense;
use App\Models\Inventory;
use App\Models\Project;
use App\Models\ProjectTask;
use App\Models\Unit;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $projectsByStatus = Project::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        $recentExpenses = Expense::with('project')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($e) => [
                'id' => $e->id,
                'description' => $e->description ?? $e->category,
                'category' => $e->category,
                'amount' => $e->amount,
                'date' => $e->expense_date?->toDateString(),
            ]);

        $lowStock = Inventory::with('material')
            ->whereColumn('quantity', '<=', 'minimum_quantity')
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => $i->material->name,
                'quantity' => $i->quantity,
                'reorder_level' => $i->minimum_quantity,
                'unit' => $i->material->unit,
            ]);

        $myTasks = ProjectTask::with('phase.project')
            ->where('assigned_to', auth()->id())
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'title' => $t->name,
                'status' => $t->status,
                'priority' => $t->priority,
                'due_date' => $t->end_date,
            ]);

        // ── Chart data ────────────────────────────────────────────────────
        $unitsByStatus = Unit::selectRaw('status, count(*) as count')
            ->where('is_bulk', false)
            ->groupBy('status')
            ->get()
            ->map(fn ($r) => ['status' => ucfirst($r->status), 'count' => (int) $r->count]);

        $monthlyExpenses = Expense::selectRaw("DATE_FORMAT(expense_date, '%Y-%m') as month, SUM(amount) as total")
            ->whereNotNull('expense_date')
            ->where('expense_date', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($r) => ['month' => $r->month, 'total' => (float) $r->total]);

        return Inertia::render('dashboard', [
            'stats' => [
                'total_buildings' => Building::count(),
                'total_units' => Unit::count(),
                'total_projects' => Project::count(),
                'total_clients' => Client::count(),
                'total_contractors' => Contractor::count(),
                'projects_by_status' => [
                    'planning'    => (int) $projectsByStatus->get('planning', 0),
                    'in_progress' => (int) $projectsByStatus->get('in_progress', 0),
                    'completed'   => (int) $projectsByStatus->get('completed', 0),
                    'on_hold'     => (int) $projectsByStatus->get('on_hold', 0),
                ],
                'recent_expenses' => $recentExpenses,
                'low_stock'       => $lowStock,
                'my_tasks'        => $myTasks,
                'units_by_status' => $unitsByStatus,
                'monthly_expenses'=> $monthlyExpenses,
            ],
        ]);
    }
}
