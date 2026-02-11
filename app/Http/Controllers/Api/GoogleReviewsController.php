<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleReviewsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GoogleReviewsController extends Controller
{
    private GoogleReviewsService $googleReviewsService;

    public function __construct(GoogleReviewsService $googleReviewsService)
    {
        $this->googleReviewsService = $googleReviewsService;
    }

    /**
     * Get Google Reviews for the business
     */
    public function index(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 5);
        
        $reviewsData = $this->googleReviewsService->getReviews();
        
        // Limit the number of reviews returned
        $reviews = array_slice($reviewsData['reviews'], 0, $limit);
        
        return response()->json([
            'rating' => $reviewsData['rating'],
            'total_reviews' => $reviewsData['total_reviews'],
            'reviews' => $this->googleReviewsService->formatReviewsForFrontend($reviews),
            'review_url' => $this->googleReviewsService->getReviewUrl(),
            'maps_url' => $this->googleReviewsService->getMapsUrl(),
        ]);
    }

    /**
     * Get Google Reviews summary
     */
    public function summary(): JsonResponse
    {
        $reviewsData = $this->googleReviewsService->getReviews();
        
        return response()->json([
            'rating' => $reviewsData['rating'],
            'total_reviews' => $reviewsData['total_reviews'],
            'review_url' => $this->googleReviewsService->getReviewUrl(),
        ]);
    }
}
