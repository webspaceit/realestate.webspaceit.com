<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryMovement extends Model
{
    protected $fillable = ['inventory_id', 'quantity_change', 'type', 'reference_type', 'reference_id', 'notes'];

    public function inventory(): BelongsTo
    {
        return $this->belongsTo(Inventory::class);
    }
}
