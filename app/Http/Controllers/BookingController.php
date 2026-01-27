<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $user = auth()->user();

        $upcomingBookings = $user->bookings()
            ->with(['tour.category', 'tour.location'])
            ->upcoming()
            ->orderBy('tour_date')
            ->get();

        $pastBookings = $user->bookings()
            ->with(['tour.category', 'tour.location'])
            ->past()
            ->orderBy('tour_date', 'desc')
            ->get();

        return Inertia::render('client/bookings/index', [
            'upcomingBookings' => $upcomingBookings,
            'pastBookings' => $pastBookings,
        ]);
    }

    public function show(Booking $booking): Response
    {
        $this->authorize('view', $booking);

        $booking->load(['tour.category', 'tour.location', 'payments', 'review']);

        return Inertia::render('client/bookings/show', [
            'booking' => $booking,
        ]);
    }

    public function cancel(Request $request, Booking $booking)
    {
        $this->authorize('cancel', $booking);

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        // Check cancellation policy
        $hoursUntilTour = now()->diffInHours($booking->tour_date, false);
        $canCancel = $booking->tour->free_cancellation
            && $hoursUntilTour >= ($booking->tour->free_cancellation_hours ?? 24);

        if (!$canCancel && $booking->isPaid()) {
            return back()->with('error', 'This booking cannot be cancelled for a full refund. Please contact us for assistance.');
        }

        $booking->cancel($request->reason);

        // Restore time slot availability
        if ($booking->time_slot_id) {
            $booking->timeSlot?->decrement('booked_spots', $booking->total_participants);
        }

        // TODO: Process refund if applicable

        return back()->with('success', 'Booking cancelled successfully');
    }

    public function invoice(Booking $booking)
    {
        $this->authorize('view', $booking);

        if (!$booking->isPaid()) {
            return back()->with('error', 'Invoice is only available for paid bookings');
        }

        $booking->generateInvoiceNumber();
        $booking->load(['tour', 'payments']);

        $pdf = Pdf::loadView('pdf.invoice', [
            'booking' => $booking,
        ]);

        return $pdf->download("invoice-{$booking->invoice_number}.pdf");
    }

    public function publicInvoice(Booking $booking)
    {
        // Public access - no authorization required
        // But verify booking exists and is paid
        if (!$booking) {
            abort(404, 'Booking not found');
        }

        if (!$booking->isPaid()) {
            abort(403, 'Invoice is only available for paid bookings');
        }

        $booking->generateInvoiceNumber();
        $booking->load(['tour', 'payments']);

        $pdf = Pdf::loadView('pdf.invoice', [
            'booking' => $booking,
        ]);

        return $pdf->download("invoice-{$booking->invoice_number}.pdf");
    }

    public function lookup(Request $request): Response
    {
        return Inertia::render('booking-lookup');
    }

    public function find(Request $request)
    {
        $request->validate([
            'booking_reference' => 'required|string',
            'email' => 'required|email',
        ]);

        $booking = Booking::with(['tour.category', 'tour.location'])
            ->where('booking_reference', strtoupper($request->booking_reference))
            ->where('customer_email', $request->email)
            ->first();

        if (!$booking) {
            return back()->with('error', 'Booking not found. Please check your details and try again.');
        }

        return Inertia::render('booking-details', [
            'booking' => $booking,
        ]);
    }
}
