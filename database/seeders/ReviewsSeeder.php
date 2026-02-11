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
        // Delete any old seeded/fake reviews first
        Review::query()->delete();

        $bookings = Booking::with('tour')->take(3)->get();

        if ($bookings->count() < 3) {
            $this->command->warn('Need at least 3 bookings. Please run BookingsSeeder first.');
            return;
        }

        // Real Google reviews from Ubuntu Sunshine Tours
        $realReviews = [
            [
                'reviewer_name' => 'Imran Chowdhury',
                'reviewer_email' => 'imran.chowdhury@review.google',
                'rating' => 5,
                'title' => 'Highly Recommend',
                'comment' => 'I had a great time with my family. We saw so many animals and the guide had so much knowledge about the park and the city. Highly recommend using this company.',
            ],
            [
                'reviewer_name' => 'Sandra Schwemmer',
                'reviewer_email' => 'sandra.schwemmer@review.google',
                'rating' => 5,
                'title' => 'Absolute Fantastic Day',
                'comment' => 'We booked the double safari tour combined with a city tour. We had an absolute fantastic day. Our guide Mariska was very knowledgeable and passionate about the animals and the city.',
            ],
            [
                'reviewer_name' => 'Mizan Chowdhury',
                'reviewer_email' => 'mizan.chowdhury@review.google',
                'rating' => 5,
                'title' => 'Best Time of My Life',
                'comment' => 'Great service. Had the best time of my life.',
            ],
        ];

        foreach ($bookings as $index => $booking) {
            $reviewData = $realReviews[$index];

            Review::updateOrCreate(
                ['booking_id' => $booking->id],
                [
                    'tour_id' => $booking->tour_id,
                    'user_id' => $booking->user_id,
                    'reviewer_name' => $reviewData['reviewer_name'],
                    'reviewer_email' => $reviewData['reviewer_email'],
                    'rating' => $reviewData['rating'],
                    'title' => $reviewData['title'],
                    'comment' => $reviewData['comment'],
                    'is_verified' => true,
                    'is_approved' => true,
                    'approved_at' => now(),
                ]
            );

            $booking->tour->updateRating();
        }

        $this->command->info('Created 3 real Google reviews.');
    }
}
