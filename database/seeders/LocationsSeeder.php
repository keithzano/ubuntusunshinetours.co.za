<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationsSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            ['name' => 'Cape Town', 'slug' => 'cape-town', 'city' => 'Cape Town', 'region' => 'Western Cape', 'is_featured' => true],
            ['name' => 'Port Elizabeth', 'slug' => 'port-elizabeth', 'city' => 'Gqeberha', 'region' => 'Eastern Cape', 'is_featured' => true],
            ['name' => 'Garden Route', 'slug' => 'garden-route', 'region' => 'Western Cape', 'is_featured' => true],
            ['name' => 'Addo Elephant Park', 'slug' => 'addo', 'region' => 'Eastern Cape', 'is_featured' => true],
            ['name' => 'Stellenbosch', 'slug' => 'stellenbosch', 'city' => 'Stellenbosch', 'region' => 'Western Cape', 'is_featured' => false],
            ['name' => 'Franschhoek', 'slug' => 'franschhoek', 'city' => 'Franschhoek', 'region' => 'Western Cape', 'is_featured' => false],
        ];

        foreach ($locations as $location) {
            Location::create(array_merge($location, ['country' => 'South Africa', 'is_active' => true]));
        }
    }
}
