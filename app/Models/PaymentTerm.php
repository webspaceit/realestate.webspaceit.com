<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTerm extends Model
{
    protected $fillable = [
        'date_of_opening',
        'date_of_handover',
        'total_agreed_price',
        'down_payment_percentage',
    ];

    protected function casts(): array
    {
        return [
            'date_of_opening' => 'date',
            'date_of_handover' => 'date',
            'total_agreed_price' => 'decimal:2',
            'down_payment_percentage' => 'decimal:2',
        ];
    }
}
