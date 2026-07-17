<?php

namespace App\Http\Controllers;

use App\Models\PaymentTerm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentTermController extends Controller
{
    public function index()
    {
        $paymentTerm = PaymentTerm::first() ?? new PaymentTerm;

        return Inertia::render('payment-terms/index', [
            'paymentTerm' => $paymentTerm,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'date_of_opening' => ['nullable', 'date'],
            'date_of_handover' => ['nullable', 'date', 'after_or_equal:date_of_opening'],
            'total_agreed_price' => ['nullable', 'numeric', 'min:0'],
            'down_payment_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $paymentTerm = PaymentTerm::first();

        if ($paymentTerm) {
            $paymentTerm->update($data);
        } else {
            $paymentTerm = PaymentTerm::create($data);
        }

        return redirect()->route('payment-terms.index')
            ->with('success', 'Payment Terms updated successfully.');
    }
}
