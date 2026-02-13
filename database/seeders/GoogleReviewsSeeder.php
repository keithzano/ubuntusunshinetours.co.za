<?php

namespace Database\Seeders;

use App\Models\GoogleReview;
use Illuminate\Database\Seeder;

class GoogleReviewsSeeder extends Seeder
{
    public function run(): void
    {
        // Delete any old seeded/fake Google reviews first
        GoogleReview::query()->delete();

        // Real Google reviews from Ubuntu Sunshine Tours (placeholders until Place ID is fixed)
        $googleReviews = [
            [
                'author_name' => 'Imran Chowdhury',
                'profile_photo_url' => null,
                'rating' => 5,
                'text' => 'I had a great time with my family. We saw so many animals and the guide had so much knowledge about the park and the city. Highly recommend using this company.',
                'relative_time_description' => '8 minutes ago',
                'is_active' => true,
                'created_at' => now()->subDays(1),
                'updated_at' => now(),
            ],
            [
                'author_name' => 'Sandra Schwemmer',
                'profile_photo_url' => null,
                'rating' => 5,
                'text' => 'We booked the double safari tour combined with a city tour. We had an absolute fantastic day. Our guide Mariska was very knowledgeable and passionate about the animals and the city.',
                'relative_time_description' => '8 minutes ago',
                'is_active' => true,
                'created_at' => now()->subDays(2),
                'updated_at' => now(),
            ],
            [
                'author_name' => 'Mizan Chowdhury',
                'profile_photo_url' => null,
                'rating' => 5,
                'text' => 'Great service. Had the best time of my life.',
                'relative_time_description' => '8 minutes ago',
                'is_active' => true,
                'created_at' => now()->subDays(3),
                'updated_at' => now(),
            ],
        ];

        foreach ($googleReviews as $review) {
            GoogleReview::create($review);
        }

        $this->command->info('Created 3 placeholder Google reviews.');
    }
}
