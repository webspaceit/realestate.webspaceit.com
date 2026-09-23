<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\Client;
use App\Models\Unit;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::query()
            ->when(request('search'), function ($query, $search) {
                $query->whereHas('client', function ($q) use ($search) {
                    $q->where('contact_person', 'like', "%{$search}%")
                      ->orWhere('company_name', 'like', "%{$search}%")
                      ->orWhere('phone_mobile', 'like', "%{$search}%");
                })->orWhereHas('unit', function ($q) use ($search) {
                    $q->where('unit_number', 'like', "%{$search}%");
                });
            })
            ->when(request('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when(request('booking_type'), function ($query, $type) {
                $query->where('booking_type', $type);
            })
            ->with('client', 'unit.building')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'filters' => request()->only(['search', 'status', 'booking_type']),
        ]);
    }

    public function create()
    {
        return Inertia::render('bookings/create', [
            'clients' => Client::all(['id', 'contact_person', 'company_name', 'phone_mobile']),
            'units' => Unit::with('building')->where('status', 'available')->where('is_bulk', false)->get(['id', 'unit_number', 'building_id', 'price', 'status']),
        ]);
    }

    public function store(StoreBookingRequest $request)
    {
        $booking = Booking::create($request->validated());

        $unit = Unit::findOrFail($request->unit_id);
        $unit->update(['status' => $request->booking_type === 'sale' ? 'sold' : 'reserved']);

        return redirect()->route('bookings.index')
            ->with('success', 'Booking created successfully.');
    }

    public function show(Booking $booking)
    {
        $booking->load('client', 'unit.building', 'paymentSchedules');

        return Inertia::render('bookings/show', [
            'booking' => $booking,
        ]);
    }

    public function edit(Booking $booking)
    {
        $booking->load('client', 'unit');

        return Inertia::render('bookings/edit', [
            'booking' => $booking,
            'clients' => Client::all(['id', 'contact_person', 'company_name', 'phone_mobile']),
            'units' => Unit::with('building')
                ->where(function ($q) use ($booking) {
                    $q->where('status', 'available')
                      ->orWhere('id', $booking->unit_id);
                })
                ->where('is_bulk', false)
                ->get(['id', 'unit_number', 'building_id', 'price', 'status']),
        ]);
    }

    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        $oldUnitId = $booking->unit_id;
        $oldBookingType = $booking->booking_type;

        $booking->update($request->validated());

        if ($oldUnitId !== $request->unit_id) {
            Unit::findOrFail($oldUnitId)->update(['status' => 'available']);

            $newUnit = Unit::findOrFail($request->unit_id);
            $newUnit->update(['status' => $request->booking_type === 'sale' ? 'sold' : 'reserved']);
        } elseif ($oldBookingType !== $request->booking_type) {
            $unit = Unit::findOrFail($request->unit_id);
            $unit->update(['status' => $request->booking_type === 'sale' ? 'sold' : 'reserved']);
        }

        return redirect()->route('bookings.index')
            ->with('success', 'Booking updated successfully.');
    }

    public function destroy(Booking $booking)
    {
        $unitId = $booking->unit_id;

        $booking->delete();

        Unit::findOrFail($unitId)->update(['status' => 'available']);

        return redirect()->route('bookings.index')
            ->with('success', 'Booking deleted successfully.');
    }
}
