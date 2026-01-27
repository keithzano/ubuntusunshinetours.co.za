<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function autocomplete(Request $request)
    {
        $query = $request->get('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }
        
        $tours = Tour::with(['category', 'location'])
            ->active()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('short_description', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhereHas('category', function ($subQ) use ($query) {
                      $subQ->where('name', 'like', "%{$query}%");
                  })
                  ->orWhereHas('location', function ($subQ) use ($query) {
                      $subQ->where('name', 'like', "%{$query}%");
                  });
            })
            ->limit(8)
            ->get()
            ->map(function ($tour) {
                return [
                    'id' => $tour->id,
                    'title' => $tour->title,
                    'slug' => $tour->slug,
                    'price' => $tour->price,
                    'location' => $tour->location?->name,
                    'category' => $tour->category?->name,
                    'image' => $tour->featured_image ? "/storage/{$tour->featured_image}" : '/images/safari.jpg',
                    'duration' => $tour->duration,
                    'rating' => $tour->rating,
                    'reviews_count' => $tour->reviews_count,
                ];
            });
        
        return response()->json($tours);
    }
}
