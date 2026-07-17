<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialPurchase extends Model
{
    protected $fillable = ['material_id', 'supplier_id', 'quantity', 'unit_price', 'total_price', 'purchase_date', 'status'];

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
        ];
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
