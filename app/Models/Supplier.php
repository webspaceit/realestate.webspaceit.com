<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $fillable = ['company_name', 'contact_person', 'email', 'phone', 'address'];

    public function materialPurchases(): HasMany
    {
        return $this->hasMany(MaterialPurchase::class);
    }
}
