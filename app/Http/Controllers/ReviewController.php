<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function create(Booking $booking): Response
    {
        $this->authorize('review', $booking);

        if ($booking->review) {
            return redirect()->route('client.bookings.show', $booking)
                ->with('error', 'You have already reviewed this booking');
        }

        $booking->load('tour');

        return Inertia::render('client/reviews/create', [
            'booking' => $booking,
        ]);
    }

    public function store(Request $request, Booking $booking)
    {
        $this->authorize('review', $booking);

        if ($booking->review) {
            return back()->with('error', 'You have already reviewed this booking');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:10|max:2000',
        ]);

        Review::create([
            'tour_id' => $booking->tour_id,
            'booking_id' => $booking->id,
            'user_id' => auth()->id(),
            'reviewer_name' => $booking->customer_name,
            'reviewer_email' => $booking->customer_email,
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'comment' => $validated['comment'],
            'is_verified' => true,
            'is_approved' => false, // Requires admin approval
        ]);

        return redirect()->route('client.bookings.show', $booking)
            ->with('success', 'Thank you for your review! It will be published after approval.');
    }
}
