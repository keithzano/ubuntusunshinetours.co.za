<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Location;
use Illuminate\Database\Seeder;

class CategoriesAndLocationsSeeder extends Seeder
{
    public function run(): void
    {
        // Create categories
        $categories = [
            ['name' => 'Safari', 'slug' => 'safari', 'icon' => 'binoculars', 'description' => 'Wildlife and game reserve experiences'],
            ['name' => 'City Tours', 'slug' => 'city-tour', 'icon' => 'building', 'description' => 'Explore the urban highlights'],
            ['name' => 'Day Trips', 'slug' => 'day-trip', 'icon' => 'sun', 'description' => 'Full day adventure experiences'],
            ['name' => 'Wine Tours', 'slug' => 'wine-tour', 'icon' => 'wine', 'description' => 'Wine tasting and vineyard tours'],
            ['name' => 'Beach & Coast', 'slug' => 'beach-coast', 'icon' => 'waves', 'description' => 'Coastal and beach experiences'],
            ['name' => 'Cultural', 'slug' => 'cultural', 'icon' => 'landmark', 'description' => 'Cultural and historical tours'],
        ];

        foreach ($categories as $index => $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                array_merge($category, ['sort_order' => $index, 'is_active' => true])
            );
        }

        // Create locations
        $locations = [
            ['name' => 'Cape Town', 'slug' => 'cape-town', 'city' => 'Cape Town', 'region' => 'Western Cape', 'is_featured' => true],
            ['name' => 'Port Elizabeth', 'slug' => 'port-elizabeth', 'city' => 'Gqeberha', 'region' => 'Eastern Cape', 'is_featured' => true],
            ['name' => 'Garden Route', 'slug' => 'garden-route', 'region' => 'Western Cape', 'is_featured' => true],
            ['name' => 'Addo Elephant Park', 'slug' => 'addo', 'region' => 'Eastern Cape', 'is_featured' => true],
            ['name' => 'Stellenbosch', 'slug' => 'stellenbosch', 'city' => 'Stellenbosch', 'region' => 'Western Cape', 'is_featured' => false],
            ['name' => 'Franschhoek', 'slug' => 'franschhoek', 'city' => 'Franschhoek', 'region' => 'Western Cape', 'is_featured' => false],
        ];

        foreach ($locations as $location) {
            Location::updateOrCreate(
                ['slug' => $location['slug']],
                array_merge($location, ['country' => 'South Africa', 'is_active' => true])
            );
        }
    }
}
