<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Location;
use App\Models\Tour;
use App\Models\TourPricingTier;
use Illuminate\Database\Seeder;

class ToursSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');
        $locations = Location::all()->keyBy('slug');

        $tours = [
            [
                'title' => 'Cape Town City Highlights Tour',
                'slug' => 'cape-town-city-highlights',
                'description' => 'Explore the best of Cape Town including Table Mountain, V&A Waterfront, and Bo-Kaap.',
                'short_description' => 'Full day city tour of Cape Town\'s iconic landmarks.',
                'category_slug' => 'city-tour',
                'location_slug' => 'cape-town',
                'price' => 850.00,
                'duration' => '8 hours',
                'is_featured' => true,
                'is_bestseller' => true,
                'free_cancellation' => true,
            ],
            [
                'title' => 'Addo Elephant National Park Safari',
                'slug' => 'addo-elephant-safari',
                'description' => 'Get up close with elephants and other wildlife in their natural habitat at Addo Elephant Park.',
                'short_description' => 'Full day safari experience at Addo Elephant National Park.',
                'category_slug' => 'safari',
                'location_slug' => 'addo',
                'price' => 1200.00,
                'duration' => '10 hours',
                'is_featured' => true,
                'is_bestseller' => true,
                'free_cancellation' => true,
            ],
            [
                'title' => 'Stellenbosch Wine Tasting Tour',
                'slug' => 'stellenbosch-wine-tour',
                'description' => 'Visit some of the finest wine estates in Stellenbosch with guided tastings and lunch.',
                'short_description' => 'Wine tasting experience in the heart of Stellenbosch.',
                'category_slug' => 'wine-tour',
                'location_slug' => 'stellenbosch',
                'price' => 950.00,
                'duration' => '6 hours',
                'is_featured' => false,
                'is_bestseller' => false,
                'free_cancellation' => true,
            ],
            [
                'title' => 'Garden Route Day Trip',
                'slug' => 'garden-route-day-trip',
                'description' => 'Experience the stunning Garden Route with stops at Knysna, Plettenberg Bay, and more.',
                'short_description' => 'Scenic drive along the famous Garden Route.',
                'category_slug' => 'day-trip',
                'location_slug' => 'garden-route',
                'price' => 1500.00,
                'duration' => '12 hours',
                'is_featured' => true,
                'is_bestseller' => false,
                'free_cancellation' => false,
            ],
            [
                'title' => 'Cape Peninsula Coastal Tour',
                'slug' => 'cape-peninsula-coastal-tour',
                'description' => 'Discover the spectacular Cape Peninsula including Cape Point, Boulders Beach penguins, and Chapman\'s Peak.',
                'short_description' => 'Coastal adventure around the Cape Peninsula.',
                'category_slug' => 'beach-coast',
                'location_slug' => 'cape-town',
                'price' => 1100.00,
                'duration' => '9 hours',
                'is_featured' => false,
                'is_bestseller' => true,
                'free_cancellation' => true,
            ],
            [
                'title' => 'Robben Island Cultural Tour',
                'slug' => 'robben-island-cultural-tour',
                'description' => 'Visit the historic Robben Island where Nelson Mandela was imprisoned, including ferry transfers and guided tour.',
                'short_description' => 'Historical and cultural experience at Robben Island.',
                'category_slug' => 'cultural',
                'location_slug' => 'cape-town',
                'price' => 750.00,
                'duration' => '4 hours',
                'is_featured' => false,
                'is_bestseller' => false,
                'free_cancellation' => true,
            ],
            [
                'title' => 'Port Elizabeth City Tour',
                'slug' => 'port-elizabeth-city-tour',
                'description' => 'Explore the vibrant city of Port Elizabeth (Gqeberha) including the Boardwalk, beaches, and city landmarks.',
                'short_description' => 'Half day tour of Port Elizabeth highlights.',
                'category_slug' => 'city-tour',
                'location_slug' => 'port-elizabeth',
                'price' => 650.00,
                'duration' => '4 hours',
                'is_featured' => false,
                'is_bestseller' => false,
                'free_cancellation' => true,
            ],
            [
                'title' => 'Franschhoek Wine Tram',
                'slug' => 'franschhoek-wine-tram',
                'description' => 'Hop-on hop-off wine tram experience visiting multiple wine estates in the beautiful Franschhoek valley.',
                'short_description' => 'Wine tram tour through Franschhoek wine estates.',
                'category_slug' => 'wine-tour',
                'location_slug' => 'franschhoek',
                'price' => 1050.00,
                'duration' => '8 hours',
                'is_featured' => true,
                'is_bestseller' => false,
                'free_cancellation' => true,
            ],
        ];

        foreach ($tours as $tourData) {
            $category = $categories->get($tourData['category_slug']);
            $location = $locations->get($tourData['location_slug']);

            Tour::updateOrCreate(
                ['slug' => $tourData['slug']],
                [
                    'title' => $tourData['title'],
                    'description' => $tourData['description'],
                    'short_description' => $tourData['short_description'],
                    'category_id' => $category->id,
                    'location_id' => $location->id,
                    'price' => $tourData['price'],
                    'duration' => $tourData['duration'],
                    'is_featured' => $tourData['is_featured'],
                    'is_bestseller' => $tourData['is_bestseller'],
                    'free_cancellation' => $tourData['free_cancellation'],
                    'instant_confirmation' => true,
                    'max_participants' => 20,
                    'min_participants' => 2,
                    'is_active' => true,
                ]
            );
        }

        // Create pricing tiers for all tours
        $allTours = Tour::all();
        
        foreach ($allTours as $tour) {
            // Create standard pricing tiers
            TourPricingTier::create([
                'tour_id' => $tour->id,
                'name' => 'Adult',
                'description' => 'Adult ticket (12+ years)',
                'price' => $tour->price,
                'min_age' => 12,
                'max_age' => null,
                'is_active' => true,
                'sort_order' => 1,
            ]);

            TourPricingTier::create([
                'tour_id' => $tour->id,
                'name' => 'Child',
                'description' => 'Child ticket (3-11 years)',
                'price' => $tour->price * 0.5, // 50% of adult price
                'min_age' => 3,
                'max_age' => 11,
                'is_active' => true,
                'sort_order' => 2,
            ]);

            TourPricingTier::create([
                'tour_id' => $tour->id,
                'name' => 'Senior',
                'description' => 'Senior ticket (60+ years)',
                'price' => $tour->price * 0.8, // 80% of adult price
                'min_age' => 60,
                'max_age' => null,
                'is_active' => true,
                'sort_order' => 3,
            ]);
        }
    }
}
