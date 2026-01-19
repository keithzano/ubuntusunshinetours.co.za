<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Review::with(['tour', 'user', 'booking']);

        if ($request->filled('status')) {
            if ($request->status === 'pending') {
                $query->pending();
            } else {
                $query->approved();
            }
        }

        if ($request->filled('tour_id')) {
            $query->where('tour_id', $request->tour_id);
        }

        $reviews = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('admin/reviews/index', [
            'reviews' => $reviews,
            'filters' => $request->only(['status', 'tour_id']),
        ]);
    }

    public function approve(Review $review)
    {
        $review->approve();

        return back()->with('success', 'Review approved');
    }

    public function reject(Review $review)
    {
        $review->reject();

        return back()->with('success', 'Review rejected');
    }

    public function destroy(Review $review)
    {
        $tourId = $review->tour_id;
        $review->delete();

        // Update tour rating
        $review->tour->updateRating();

        return back()->with('success', 'Review deleted');
    }
}
