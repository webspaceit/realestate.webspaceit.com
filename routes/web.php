<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientPropertyController;
use App\Http\Controllers\ContractorAssignmentController;
use App\Http\Controllers\ContractorController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentCategoryController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\MaterialPurchaseController;
use App\Http\Controllers\PaymentTermController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectMilestoneController;
use App\Http\Controllers\ProjectPhaseController;
use App\Http\Controllers\ProjectTaskController;
use App\Http\Controllers\ProjectTypeController;
use App\Http\Controllers\SidebarOrderController;
use App\Http\Controllers\SpecializationController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // debug: verify Inertia response has client data
    Route::get('/debug-clients', function () {
        $clients = App\Models\Client::paginate(10);
        \Illuminate\Support\Facades\Log::info('debug-clients: count=' . $clients->total());
        return \Inertia\Inertia::render('clients/index', [
            'clients' => $clients,
            'filters' => [],
        ]);
    });

    Route::resource('buildings', BuildingController::class);
    Route::get('flats/bulk-create', [UnitController::class, 'bulkCreate'])->name('flats.bulk-create');
    Route::post('flats/bulk', [UnitController::class, 'bulkStore'])->name('flats.bulk');
    Route::get('flats/bulk-units', [UnitController::class, 'bulkIndex'])->name('flats.bulk-index');
    Route::resource('flats', UnitController::class)->parameters(['flats' => 'unit']);
    Route::resource('projects', ProjectController::class);
    Route::resource('project-types', ProjectTypeController::class);
    Route::post('project-types/reorder', [ProjectTypeController::class, 'reorder'])->name('project-types.reorder');
    Route::resource('phases', ProjectPhaseController::class);
    Route::resource('tasks', ProjectTaskController::class);
    Route::resource('milestones', ProjectMilestoneController::class);
    Route::resource('contractors', ContractorController::class);
    Route::resource('contractor-assignments', ContractorAssignmentController::class);
    Route::resource('users', UserController::class);
    Route::resource('specializations', SpecializationController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('materials', MaterialController::class);
    Route::resource('inventory', InventoryController::class);
    Route::resource('material-purchases', MaterialPurchaseController::class);
    Route::resource('budgets', BudgetController::class);
    Route::resource('expenses', ExpenseController::class);
    Route::resource('documents', DocumentController::class);
    Route::resource('document-categories', DocumentCategoryController::class);
    Route::post('document-categories/reorder', [DocumentCategoryController::class, 'reorder'])->name('document-categories.reorder');
    Route::resource('subcategories', SubcategoryController::class);
    Route::get('sidebar-order', [SidebarOrderController::class, 'show'])->name('sidebar-order.show');
    Route::post('sidebar-order', [SidebarOrderController::class, 'update'])->name('sidebar-order.update');
    Route::resource('flat-owners', ClientController::class)->parameters(['flat-owners' => 'client']);
    Route::get('flat-owners/{client}/pdf', [ClientController::class, 'pdf'])->name('flat-owners.pdf');
    Route::resource('client-properties', ClientPropertyController::class);
    Route::resource('bookings', BookingController::class);
    Route::get('payment-terms', [PaymentTermController::class, 'index'])->name('payment-terms.index');
    Route::put('payment-terms', [PaymentTermController::class, 'update'])->name('payment-terms.update');

    Route::get('files/{path}', function (string $path) {
        $fullPath = storage_path('app/public/' . $path);
        if (!file_exists($fullPath)) {
            abort(404);
        }
        if (str_starts_with(realpath($fullPath), realpath(storage_path('app/public'))) === false) {
            abort(403);
        }
        return response()->file($fullPath);
    })->where('path', '.*')->name('files.show');
});

require __DIR__.'/settings.php';
