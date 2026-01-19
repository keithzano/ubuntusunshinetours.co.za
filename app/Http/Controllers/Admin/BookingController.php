<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Booking::with(['tour', 'user']);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('booking_reference', 'like', "%{$request->search}%")
                    ->orWhere('customer_name', 'like', "%{$request->search}%")
                    ->orWhere('customer_email', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->filled('date_from')) {
            $query->where('tour_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('tour_date', '<=', $request->date_to);
        }

        $bookings = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/bookings/index', [
            'bookings' => $bookings,
            'filters' => $request->only(['search', 'status', 'payment_status', 'date_from', 'date_to']),
        ]);
    }

    public function show(Booking $booking): Response
    {
        $booking->load(['tour', 'user', 'payments', 'review', 'timeSlot']);

        return Inertia::render('admin/bookings/show', [
            'booking' => $booking,
        ]);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $booking->update(['status' => $request->status]);

        if ($request->status === 'confirmed') {
            $booking->update(['confirmed_at' => now()]);
        }

        if ($request->status === 'cancelled') {
            $booking->update(['cancelled_at' => now()]);
        }

        return back()->with('success', 'Booking status updated');
    }

    public function updatePaymentStatus(Request $request, Booking $booking)
    {
        $request->validate([
            'payment_status' => 'required|in:pending,paid,failed,refunded',
        ]);

        $booking->update(['payment_status' => $request->payment_status]);

        return back()->with('success', 'Payment status updated');
    }
}
