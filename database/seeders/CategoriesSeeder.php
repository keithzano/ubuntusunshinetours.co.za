<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
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
    }
}
