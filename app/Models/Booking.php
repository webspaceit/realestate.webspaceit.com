<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'client_id', 'unit_id', 'booking_type', 'booking_date',
        'status', 'down_payment', 'total_price', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'booking_date' => 'date',
            'down_payment' => 'decimal:2',
            'total_price' => 'decimal:2',
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

    public function paymentSchedules(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PaymentSchedule::class)->orderBy('due_date');
    }
}
