<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = ['code', 'building_id', 'project_type_id', 'name', 'description', 'start_date', 'end_date', 'budget', 'land_size_katha', 'land_details', 'rajuk_file_submit_date', 'rajuk_permission_status', 'total_unit', 'total_flat', 'total_floor', 'total_parking', 'status', 'division_id', 'district_id', 'thana_id', 'address'];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function projectType(): BelongsTo
    {
        return $this->belongsTo(ProjectType::class);
    }

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function thana(): BelongsTo
    {
        return $this->belongsTo(Thana::class);
    }

    public function phases(): HasMany
    {
        return $this->hasMany(ProjectPhase::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMilestone::class);
    }

    public function contractorAssignments(): HasMany
    {
        return $this->hasMany(ContractorAssignment::class);
    }

    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
