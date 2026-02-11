<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Location;
use App\Models\Tour;
use App\Models\TourPricingTier;
use App\Models\TourTimeSlot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TourController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Tour::with(['category', 'location']);

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $tours = $query->latest()->paginate(15)->withQueryString();
        $categories = Category::active()->get();

        return Inertia::render('admin/tours/index', [
            'tours' => $tours,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    public function create(): Response
    {
        $categories = Category::active()->ordered()->get();
        $locations = Location::active()->get();

        return Inertia::render('admin/tours/create', [
            'categories' => $categories,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateTour($request);

        // Handle boolean checkboxes - convert to proper booleans after validation
        $validated['is_active'] = $request->boolean('is_active');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_bestseller'] = $request->boolean('is_bestseller');
        $validated['instant_confirmation'] = $request->boolean('instant_confirmation');
        $validated['free_cancellation'] = $request->boolean('free_cancellation');

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')
                ->store('tours', 'public');
        }

        // Handle media files upload (gallery)
        if ($request->hasFile('media_files')) {
            $gallery = [];
            $mediaFiles = $request->file('media_files');
            if (is_array($mediaFiles)) {
                foreach ($mediaFiles as $file) {
                    if ($file && $file->isValid()) {
                        $path = $file->store('tours/gallery', 'public');
                        $gallery[] = $path;
                    }
                }
            }
            $validated['gallery'] = $gallery;
        }

        $validated['slug'] = Str::slug($validated['title']);

        Log::info('Creating tour with data:', $validated);
        $tour = Tour::create($validated);
        Log::info('Tour created with ID:', ['id' => $tour->id]);

        // Create pricing tiers
        if ($request->has('pricing_tiers')) {
            foreach ($request->pricing_tiers as $index => $tier) {
                $tour->pricingTiers()->create([
                    'name' => $tier['name'],
                    'description' => $tier['description'] ?? null,
                    'price' => $tier['price'],
                    'min_age' => ($tier['min_age'] === 'null' || $tier['min_age'] === null) ? null : $tier['min_age'],
                    'max_age' => ($tier['max_age'] === 'null' || $tier['max_age'] === null) ? null : $tier['max_age'],
                    'is_active' => filter_var($tier['is_active'], FILTER_VALIDATE_BOOLEAN),
                    'sort_order' => $index,
                ]);
            }
        }

        Log::info('Tour creation completed successfully');

        return redirect()->route('admin.tours.index')
            ->with('success', 'Tour created successfully');
    }

    public function edit(Tour $tour): Response
    {
        $tour->load(['pricingTiers', 'timeSlots']);
        $categories = Category::active()->ordered()->get();
        $locations = Location::active()->get();

        return Inertia::render('admin/tours/edit', [
            'tour' => $tour,
            'categories' => $categories,
            'locations' => $locations,
        ]);
    }

    public function update(Request $request, Tour $tour)
    {
        $validated = $this->validateTour($request, $tour->id);

        // Handle boolean checkboxes - convert to proper booleans after validation
        $validated['is_active'] = $request->boolean('is_active');
        $validated['is_featured'] = $request->boolean('is_featured');
        $validated['is_bestseller'] = $request->boolean('is_bestseller');
        $validated['instant_confirmation'] = $request->boolean('instant_confirmation');
        $validated['free_cancellation'] = $request->boolean('free_cancellation');

        try {
            DB::beginTransaction();

            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                // Delete old image
                if ($tour->featured_image) {
                    Storage::disk('public')->delete($tour->featured_image);
                }
                $validated['featured_image'] = $request->file('featured_image')
                    ->store('tours', 'public');
            }

            // Handle media files upload (gallery)
            if ($request->hasFile('media_files')) {
                // Delete old gallery
                if ($tour->gallery) {
                    foreach ($tour->gallery as $image) {
                        Storage::disk('public')->delete($image);
                    }
                }
                $gallery = [];
                $mediaFiles = $request->file('media_files');
                if (is_array($mediaFiles)) {
                    foreach ($mediaFiles as $file) {
                        if ($file && $file->isValid()) {
                            $gallery[] = $file->store('tours/gallery', 'public');
                        }
                    }
                }
                $validated['gallery'] = $gallery;
            }

            if (isset($validated['title']) && $validated['title'] !== $tour->title) {
                $validated['slug'] = Str::slug($validated['title']);
            }

            $tour->update($validated);

            // Update pricing tiers
            if ($request->has('pricing_tiers')) {
                $tour->pricingTiers()->delete();
                foreach ($request->pricing_tiers as $index => $tier) {
                    $tour->pricingTiers()->create([
                        'name' => $tier['name'],
                        'description' => $tier['description'] ?? null,
                        'price' => $tier['price'],
                        'min_age' => (($tier['min_age'] ?? null) === 'null' || ($tier['min_age'] ?? null) === 'undefined') ? null : ($tier['min_age'] ?? null),
                        'max_age' => (($tier['max_age'] ?? null) === 'null' || ($tier['max_age'] ?? null) === 'undefined') ? null : ($tier['max_age'] ?? null),
                        'is_active' => isset($tier['is_active']) ? filter_var($tier['is_active'], FILTER_VALIDATE_BOOLEAN) : true,
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.tours.index')
                ->with('success', 'Tour updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update tour', [
                'tour_id' => $tour->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'Failed to update tour: ' . $e->getMessage());
        }
    }

    public function destroy(Tour $tour)
    {
        // Delete images
        if ($tour->featured_image) {
            Storage::disk('public')->delete($tour->featured_image);
        }
        if ($tour->gallery) {
            foreach ($tour->gallery as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $tour->delete();

        return redirect()->route('admin.tours.index')
            ->with('success', 'Tour deleted successfully');
    }

    public function toggleStatus(Tour $tour)
    {
        $tour->update(['is_active' => !$tour->is_active]);

        return back()->with('success', 'Tour status updated');
    }

    public function toggleFeatured(Tour $tour)
    {
        $tour->update(['is_featured' => !$tour->is_featured]);

        return back()->with('success', 'Tour featured status updated');
    }

    public function timeSlots(Tour $tour): Response
    {
        $timeSlots = $tour->timeSlots()
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('start_time')
            ->paginate(30);

        return Inertia::render('admin/tours/time-slots', [
            'tour' => $tour,
            'timeSlots' => $timeSlots,
        ]);
    }

    public function storeTimeSlots(Request $request, Tour $tour)
    {
        $validated = $request->validate([
            'date_from' => 'required|date|after_or_equal:today',
            'date_to' => 'required|date|after_or_equal:date_from',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'available_spots' => 'required|integer|min:1',
            'days' => 'required|array',
            'days.*' => 'in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
        ]);

        $startDate = Carbon::parse($validated['date_from']);
        $endDate = Carbon::parse($validated['date_to']);
        $created = 0;

        while ($startDate <= $endDate) {
            $dayName = strtolower($startDate->format('l'));
            
            if (in_array($dayName, $validated['days'])) {
                TourTimeSlot::updateOrCreate(
                    [
                        'tour_id' => $tour->id,
                        'date' => $startDate->toDateString(),
                        'start_time' => $validated['start_time'],
                    ],
                    [
                        'end_time' => $validated['end_time'],
                        'available_spots' => $validated['available_spots'],
                        'is_active' => true,
                    ]
                );
                $created++;
            }
            
            $startDate->addDay();
        }

        return back()->with('success', "{$created} time slots created/updated");
    }

    public function deleteTimeSlot(TourTimeSlot $timeSlot)
    {
        $timeSlot->delete();

        return back()->with('success', 'Time slot deleted');
    }

    private function validateTour(Request $request, ?int $tourId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string|max:1000',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location_id' => 'required|exists:locations,id',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'price_type' => 'required|in:per_person,per_group',
            'max_group_size' => 'nullable|integer|min:1',
            'duration' => 'required|string|max:100',
            'duration_minutes' => 'nullable|integer|min:1',
            'highlights' => 'nullable|array',
            'includes' => 'nullable|array',
            'excludes' => 'nullable|array',
            'what_to_bring' => 'nullable|array',
            'meeting_point' => 'nullable|array',
            'cancellation_policy' => 'nullable|string',
            'languages' => 'nullable|array',
            'accessibility' => 'nullable|array',
            'available_days' => 'nullable|array',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'min_participants' => 'integer|min:1',
            'max_participants' => 'nullable|integer|min:1',
            'booking_cutoff_hours' => 'integer|min:0',
            'featured_image' => 'nullable|image|max:5120|mimes:jpeg,png,jpg,gif',
            'media_files.*' => 'nullable|image|max:5120|mimes:jpeg,png,jpg,gif',
            'video_url' => 'nullable|url',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'free_cancellation_hours' => 'nullable|integer|min:0',
        ]);
    }
}
