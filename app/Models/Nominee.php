<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nominee extends Model
{
    protected $fillable = ['client_id', 'name', 'relationship', 'date_of_birth', 'percentage'];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
