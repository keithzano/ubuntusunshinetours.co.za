<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleReviewsService
{
    private string $apiKey;
    private string $placeId;
    private string $reviewUrl;
    private string $mapsUrl;

    public function __construct()
    {
        $this->apiKey = config('services.google.api_key');
        $this->placeId = config('services.google.place_id', '');
        $this->reviewUrl = config('services.google.review_url', '');
        $this->mapsUrl = config('services.google.maps_url', '');
    }

    /**
     * Fetch Google Reviews for the business
     */
    public function getReviews(): array
    {
        return Cache::remember('google_reviews:' . $this->placeId, 3600, function () {
            try {
                if (empty($this->apiKey) || empty($this->placeId)) {
                    return $this->getEmptyReviews();
                }

                $placeDetails = $this->getPlaceDetails($this->placeId);
                if (!$placeDetails) {
                    return $this->getEmptyReviews();
                }

                return [
                    'rating' => $placeDetails['rating'] ?? 0,
                    'total_reviews' => $placeDetails['user_ratings_total'] ?? 0,
                    'reviews' => $placeDetails['reviews'] ?? [],
                ];
            } catch (\Exception $e) {
                Log::error('Failed to fetch Google Reviews: ' . $e->getMessage());
                return $this->getEmptyReviews();
            }
        });
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
        
        // Check if we got the right business (Ubuntu Sunshine Tours)
        if ($result && !str_contains(strtolower($result['name'] ?? ''), 'ubuntu sunshine')) {
            Log::warning('Google Places API returned unexpected business name: ' . ($result['name'] ?? 'Unknown') . ' (configured place_id=' . $this->placeId . ')');
        }

        return $result;
    }

    private function getEmptyReviews(): array
    {
        return [
            'rating' => 0,
            'total_reviews' => 0,
            'reviews' => [],
        ];
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
