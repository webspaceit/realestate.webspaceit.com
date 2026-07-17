<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contractor extends Model
{
    protected $fillable = ['company_name', 'contact_person', 'email', 'phone', 'address', 'specialization', 'license_number', 'status', 'nid', 'bio_data', 'deed_of_agreement', 'passport_photo'];

    public function assignments(): HasMany
    {
        return $this->hasMany(ContractorAssignment::class);
    }
}
