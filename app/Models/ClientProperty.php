<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientProperty extends Model
{
    protected $fillable = ['client_id', 'unit_id', 'project_id', 'ownership_start', 'ownership_end'];

    protected function casts(): array
    {
        return [
            'ownership_start' => 'date',
            'ownership_end' => 'date',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
