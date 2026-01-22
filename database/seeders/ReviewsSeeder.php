<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Tour;
use Illuminate\Database\Seeder;

class ReviewsSeeder extends Seeder
{
    public function run(): void
    {
        // Get some bookings to create reviews for
        $bookings = Booking::with('tour')->take(10)->get();
        
        if ($bookings->isEmpty()) {
            $this->command->warn('No bookings found. Please run ToursSeeder first.');
            return;
        }

        $sampleReviews = [
            [
                'rating' => 5,
                'title' => 'Absolutely Amazing Experience!',
                'comment' => 'This was one of the best tours I\'ve ever been on. The guide was knowledgeable, the scenery was breathtaking, and everything was well-organized. Would definitely recommend to anyone visiting South Africa!',
            ],
            [
                'rating' => 5,
                'title' => 'Professional and Friendly Service',
                'comment' => 'From booking to the actual tour, everything was seamless. The guide went above and beyond to ensure we had a great time. The wildlife viewing was incredible and we got some amazing photos.',
            ],
            [
                'rating' => 4,
                'title' => 'Great Tour with Minor Issues',
                'comment' => 'Overall a fantastic experience. The tour was well-planned and the guide was excellent. Only minor issue was that the vehicle was a bit cramped, but the views and experience made up for it.',
            ],
            [
                'rating' => 5,
                'title' => 'Unforgettable Safari Adventure',
                'comment' => 'The Addo Elephant Park tour exceeded all our expectations. We saw so many animals and the guide knew exactly where to find them. The lunch provided was also delicious. Highly recommend!',
            ],
            [
                'rating' => 5,
                'title' => 'Perfect Wine Tasting Experience',
                'comment' => 'Stellenbosch wine tour was absolutely perfect. The wineries selected were excellent, and the guide provided great insights into South African wines. The lunch at the second winery was exceptional.',
            ],
            [
                'rating' => 4,
                'title' => 'Good City Tour',
                'comment' => 'Nice overview of Cape Town\'s highlights. Table Mountain was definitely the highlight. The guide was knowledgeable but the tour felt a bit rushed at some locations. Still worth it for the views alone.',
            ],
            [
                'rating' => 5,
                'title' => 'Exceptional Service and Experience',
                'comment' => 'Ubuntu Sunshine Tours provided exceptional service from start to finish. The booking process was easy, communication was excellent, and the tour itself was unforgettable. Will definitely book with them again!',
            ],
            [
                'rating' => 5,
                'title' => 'Breathtaking Views and Great Guide',
                'comment' => 'The Garden Route tour was absolutely stunning. Our guide, James, was fantastic - very knowledgeable and passionate about the region. The stops were well-chosen and the timing was perfect.',
            ],
            [
                'rating' => 4,
                'title' => 'Very Enjoyable Experience',
                'comment' => 'Had a great time on the city tour. The guide was friendly and informative. The only reason for 4 stars instead of 5 is that we felt a bit rushed at the Bo-Kaap stop. Otherwise, everything was excellent.',
            ],
            [
                'rating' => 5,
                'title' => 'Beyond Expectations!',
                'comment' => 'This tour exceeded all my expectations. The attention to detail, the quality of the guide, and the overall experience was just outstanding. I\'ve already recommended it to all my friends planning to visit South Africa.',
            ],
        ];

        foreach ($bookings as $index => $booking) {
            if (!isset($sampleReviews[$index])) {
                break;
            }

            $reviewData = $sampleReviews[$index];
            
            // Create review
            Review::create([
                'tour_id' => $booking->tour_id,
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'reviewer_name' => $booking->customer_name,
                'reviewer_email' => $booking->customer_email,
                'rating' => $reviewData['rating'],
                'title' => $reviewData['title'],
                'comment' => $reviewData['comment'],
                'is_verified' => true,
                'is_approved' => true, // Auto-approve for demo purposes
                'approved_at' => now(),
            ]);

            // Update tour rating
            $booking->tour->updateRating();
        }

        $this->command->info('Created ' . min(count($sampleReviews), $bookings->count()) . ' sample reviews.');
    }
}
