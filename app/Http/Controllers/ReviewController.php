<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Tour;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function create(Booking $booking): Response
    {
        // Check if user can review this booking
        $user = Auth::user();
        if (!$user || ($booking->user_id !== $user->id && $booking->customer_email !== $user->email)) {
            abort(403, 'You can only review your own bookings.');
        }

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
        // Check if user can review this booking
        $user = Auth::user();
        if (!$user || ($booking->user_id !== $user->id && $booking->customer_email !== $user->email)) {
            abort(403, 'You can only review your own bookings.');
        }

        if ($booking->review) {
            return back()->with('error', 'You have already reviewed this booking');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:10|max:2000',
            'photos' => 'nullable|array',
            'photos.*' => 'image|max:2048',
        ]);

        // Handle photo uploads
        $photos = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $photos[] = $photo->store('reviews', 'public');
            }
        }

        Review::create([
            'tour_id' => $booking->tour_id,
            'booking_id' => $booking->id,
            'user_id' => $user->id,
            'reviewer_name' => $booking->customer_name,
            'reviewer_email' => $booking->customer_email,
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'comment' => $validated['comment'],
            'photos' => $photos,
            'is_verified' => true,
            'is_approved' => false, // Requires admin approval
        ]);

        return redirect()->route('client.bookings.show', $booking)
            ->with('success', 'Thank you for your review! It will be published after approval.');
    }

    public function index(Request $request): Response
    {
        $query = Review::with(['tour', 'user']);

        if ($request->filled('status')) {
            if ($request->status === 'approved') {
                $query->approved();
            } elseif ($request->status === 'pending') {
                $query->pending();
            }
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->rating);
        }

        $reviews = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/reviews/index', [
            'reviews' => $reviews,
            'filters' => $request->only(['status', 'rating']),
        ]);
    }

    public function show(Review $review): Response
    {
        $review->load(['tour', 'user', 'booking']);

        return Inertia::render('admin/reviews/show', [
            'review' => $review,
        ]);
    }

    public function approve(Review $review)
    {
        $review->approve();

        return back()->with('success', 'Review approved and published.');
    }

    public function reject(Review $review)
    {
        $review->reject();

        return back()->with('success', 'Review rejected.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Review deleted.');
    }

    public function tourReviews(Tour $tour, Request $request): Response
    {
        $reviews = $tour->reviews()
            ->with(['user'])
            ->approved()
            ->latest()
            ->paginate(10);

        return Inertia::render('reviews/tour-reviews', [
            'tour' => $tour,
            'reviews' => $reviews,
        ]);
    }
}
