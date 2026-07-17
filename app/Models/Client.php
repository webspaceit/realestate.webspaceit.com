<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'user_id', 'company_name', 'contact_person', 'email', 'phone',
        'designation', 'phone_mobile', 'phone_whatsapp', 'date_of_birth',
        'nid_no', 'tin_no', 'passport_no', 'driving_licence', 'profession',
        'nationality', 'father_name', 'mother_name', 'spouse_name',
        'spouse_nid_no', 'present_address', 'permanent_address',
        'professional_address', 'photo', 'address',
    ];

    protected $appends = ['photo_url', 'owner_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(ClientProperty::class);
    }

    public function nominees(): HasMany
    {
        return $this->hasMany(Nominee::class);
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }

    public function getOwnerIdAttribute(): string
    {
        return 'FLAT-' . str_pad($this->id, 5, '0', STR_PAD_LEFT);
    }
}
