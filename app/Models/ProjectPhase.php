<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectPhase extends Model
{
    protected $fillable = ['project_id', 'name', 'description', 'start_date', 'end_date', 'status', 'order'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(ProjectTask::class, 'phase_id');
    }

    public function budgets(): HasMany
    {
        return $this->hasMany(Budget::class, 'phase_id');
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'phase_id');
    }
}
