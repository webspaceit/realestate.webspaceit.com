<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    protected $fillable = ['building_id', 'project_id', 'unit_number', 'unit_name', 'floor', 'bedrooms', 'bathrooms', 'area_sqft', 'price', 'status', 'description', 'parking', 'parking_details', 'is_bulk'];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function clientProperties(): HasMany
    {
        return $this->hasMany(ClientProperty::class);
    }
}
