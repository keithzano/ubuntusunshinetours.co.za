<?php

namespace App\Services;

use App\Models\GoogleReview;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleReviewsService
{
    private string $apiKey;
    private string $placeId;
    private ?string $reviewUrl;
    private ?string $mapsUrl;

    public function __construct()
    {
        $this->apiKey = config('services.google.api_key');
        $this->placeId = config('services.google.place_id');
        $this->reviewUrl = config('services.google.review_url');
        $this->mapsUrl = config('services.google.maps_url');
    }

    /**
     * Get reviews from Google API or fallback to database
     */
    public function getReviews(): array
    {
        // Try to get from Google API first
        if (!empty($this->apiKey) && !empty($this->placeId)) {
            $placeDetails = $this->getPlaceDetails($this->placeId);
            
            if ($placeDetails) {
                return [
                    'rating' => $placeDetails['rating'] ?? 0,
                    'total_reviews' => $placeDetails['user_ratings_total'] ?? 0,
                    'reviews' => $placeDetails['reviews'] ?? [],
                    'source' => 'google_api'
                ];
            }
        }

        // Fallback to database
        return $this->getReviewsFromDatabase();
    }

    /**
     * Get reviews from database (fallback)
     */
    private function getReviewsFromDatabase(): array
    {
        $reviews = GoogleReview::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($review) {
                return [
                    'author_name' => $review->author_name,
                    'profile_photo_url' => $review->profile_photo_url,
                    'rating' => $review->rating,
                    'relative_time_description' => $review->relative_time_description,
                    'text' => $review->text,
                    'photos' => $review->photos ?? [],
                ];
            })
            ->toArray();

        $avgRating = count($reviews) > 0 
            ? collect($reviews)->avg('rating') 
            : 0;

        return [
            'rating' => round($avgRating, 1),
            'total_reviews' => count($reviews),
            'reviews' => $reviews,
            'source' => 'database'
        ];
    }

    /**
     * Get place details from Google Places API
     */
    private function getPlaceDetails(string $placeId): ?array
    {
        $response = Http::get('https://maps.googleapis.com/maps/api/place/details/json', [
            'place_id' => $placeId,
            'fields' => 'rating,user_ratings_total,reviews,name',
            'key' => $this->apiKey,
            'language' => 'en',
        ]);

        $data = $response->json();

        if ($data['status'] !== 'OK') {
            Log::error('Google Places API error: ' . ($data['error_message'] ?? 'Unknown error'));
            return null;
        }

        $result = $data['result'] ?? null;

        // Accept results that contain "sunshine" (case-insensitive)
        if ($result && !str_contains(strtolower($result['name'] ?? ''), 'sunshine')) {
            Log::warning('Google Places API returned wrong business: ' . ($result['name'] ?? 'Unknown') . ' — falling back to DB reviews');
            return null;
        }

        return $result;
    }

    /**
     * Get Google Review URL
     */
    public function getReviewUrl(): string
    {
        if (!empty($this->reviewUrl)) {
            return $this->reviewUrl;
        }
        if (empty($this->placeId)) {
            return '';
        }
        return 'https://search.google.com/local/writereview?placeid=' . $this->placeId;
    }

    public function getMapsUrl(): string
    {
        if (!empty($this->mapsUrl)) {
            return $this->mapsUrl;
        }
        if (empty($this->placeId)) {
            return '';
        }
        return 'https://www.google.com/maps/place/?q=place_id:' . $this->placeId;
    }

    /**
     * Format reviews for frontend display
     */
    public function formatReviewsForFrontend(array $reviews): array
    {
        return array_map(function ($review) {
            return [
                'author_name' => $review['author_name'],
                'rating' => $review['rating'],
                'relative_time_description' => $review['relative_time_description'],
                'text' => $review['text'],
                'profile_photo_url' => $review['profile_photo_url'] ?? null,
            ];
        }, $reviews);
    }
}
