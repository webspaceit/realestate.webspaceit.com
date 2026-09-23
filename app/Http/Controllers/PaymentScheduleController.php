<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\PaymentSchedule;
use Illuminate\Http\Request;

class PaymentScheduleController extends Controller
{
    public function store(Request $request, Booking $booking)
    {
        $data = $request->validate([
            'label'      => 'nullable|string|max:100',
            'due_date'   => 'required|date',
            'amount'     => 'required|numeric|min:0',
            'paid_amount'=> 'nullable|numeric|min:0',
            'paid_date'  => 'nullable|date',
            'notes'      => 'nullable|string',
        ]);

        $data['booking_id'] = $booking->id;
        $data['paid_amount'] = $data['paid_amount'] ?? 0;

        PaymentSchedule::create($data);

        return redirect()->route('bookings.show', $booking->id)
            ->with('success', 'Payment entry added.');
    }

    public function update(Request $request, Booking $booking, PaymentSchedule $paymentSchedule)
    {
        abort_if($paymentSchedule->booking_id !== $booking->id, 403);

        $data = $request->validate([
            'label'      => 'nullable|string|max:100',
            'due_date'   => 'required|date',
            'amount'     => 'required|numeric|min:0',
            'paid_amount'=> 'nullable|numeric|min:0',
            'paid_date'  => 'nullable|date',
            'notes'      => 'nullable|string',
        ]);

        $data['paid_amount'] = $data['paid_amount'] ?? 0;

        $paymentSchedule->update($data);

        return redirect()->route('bookings.show', $booking->id)
            ->with('success', 'Payment entry updated.');
    }

    public function destroy(Booking $booking, PaymentSchedule $paymentSchedule)
    {
        abort_if($paymentSchedule->booking_id !== $booking->id, 403);

        $paymentSchedule->delete();

        return redirect()->route('bookings.show', $booking->id)
            ->with('success', 'Payment entry removed.');
    }
}
