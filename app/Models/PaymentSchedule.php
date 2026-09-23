<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentSchedule extends Model
{
    protected $fillable = [
        'booking_id',
        'label',
        'due_date',
        'amount',
        'paid_amount',
        'status',
        'paid_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'due_date'   => 'date',
            'paid_date'  => 'date',
            'amount'     => 'decimal:2',
            'paid_amount'=> 'decimal:2',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /** Auto-sync status when paid_amount is saved */
    protected static function booted(): void
    {
        static::saving(function (PaymentSchedule $ps) {
            $paid = (float) $ps->paid_amount;
            $due  = (float) $ps->amount;
            if ($paid <= 0) {
                $ps->status = 'pending';
            } elseif ($paid >= $due) {
                $ps->status = 'paid';
            } else {
                $ps->status = 'partial';
            }
        });
    }
}
