<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    protected $fillable = [
        'contact_person',
        'company_name',
        'email',
        'phone',
        'source',
        'stage',
        'probability',
        'value',
        'assigned_to_id',
        'follow_up_date',
        'notes',
        'converted_client_id',
        'converted_at',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'probability' => 'integer',
        'follow_up_date' => 'date',
        'converted_at' => 'datetime',
    ];

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_id');
    }

    public function interactions(): HasMany
    {
        return $this->hasMany(Interaction::class);
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class);
    }

    public function convertedClient(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'converted_client_id');
    }

    public function isConverted(): bool
    {
        return $this->converted_client_id !== null;
    }
}