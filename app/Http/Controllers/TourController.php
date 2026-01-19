<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Location;
use App\Models\PageView;
use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TourController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Tour::with(['category', 'location', 'pricingTiers'])
            ->active();

        // Search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Category filter
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Location filter
        if ($request->filled('location')) {
            $query->whereHas('location', function ($q) use ($request) {
                $q->where('slug', $request->location);
            });
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Duration filter
        if ($request->filled('duration')) {
            $durations = explode(',', $request->duration);
            $query->where(function ($q) use ($durations) {
                foreach ($durations as $duration) {
                    match ($duration) {
                        'short' => $q->orWhere('duration_minutes', '<=', 180),
                        'half_day' => $q->orWhereBetween('duration_minutes', [181, 300]),
                        'full_day' => $q->orWhereBetween('duration_minutes', [301, 600]),
                        'multi_day' => $q->orWhere('duration_minutes', '>', 600),
                        default => null,
                    };
                }
            });
        }

        // Features filter
        if ($request->boolean('free_cancellation')) {
            $query->where('free_cancellation', true);
        }
        if ($request->boolean('instant_confirmation')) {
            $query->where('instant_confirmation', true);
        }

        // Sorting
        $sortBy = $request->get('sort', 'recommended');
        match ($sortBy) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            'rating' => $query->orderBy('rating', 'desc'),
            'reviews' => $query->orderBy('reviews_count', 'desc'),
            'newest' => $query->latest(),
            default => $query->orderBy('bookings_count', 'desc')->orderBy('rating', 'desc'),
        };

        $tours = $query->paginate(12)->withQueryString();

        $categories = Category::active()->ordered()->get();
        $locations = Location::active()->get();

        return Inertia::render('tours/index', [
            'tours' => $tours,
            'categories' => $categories,
            'locations' => $locations,
            'filters' => $request->only([
                'search', 'category', 'location', 'min_price', 'max_price',
                'duration', 'free_cancellation', 'instant_confirmation', 'sort'
            ]),
        ]);
    }

    public function show(string $slug): Response
    {
        $tour = Tour::with([
            'category',
            'location',
            'pricingTiers' => fn($q) => $q->active()->orderBy('sort_order'),
            'approvedReviews' => fn($q) => $q->latest()->take(10),
            'availableTimeSlots' => fn($q) => $q->orderBy('date')->orderBy('start_time')->take(30),
        ])
            ->where('slug', $slug)
            ->active()
            ->firstOrFail();

        // Record page view
        PageView::record($tour->id, 'tour_detail');
        $tour->incrementViews();

        // Get related tours
        $relatedTours = Tour::with(['category', 'location'])
            ->active()
            ->where('id', '!=', $tour->id)
            ->where(function ($q) use ($tour) {
                $q->where('category_id', $tour->category_id)
                    ->orWhere('location_id', $tour->location_id);
            })
            ->take(4)
            ->get();

        return Inertia::render('tours/show', [
            'tour' => $tour,
            'relatedTours' => $relatedTours,
        ]);
    }

    public function getAvailability(Request $request, Tour $tour)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'participants' => 'integer|min:1',
        ]);

        $slots = $tour->timeSlots()
            ->where('date', $request->date)
            ->active()
            ->get()
            ->filter(fn($slot) => $slot->hasAvailability($request->get('participants', 1)));

        return response()->json([
            'available' => $slots->isNotEmpty(),
            'slots' => $slots,
        ]);
    }
}
