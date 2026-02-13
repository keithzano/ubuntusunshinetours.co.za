<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Location;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UsersSeeder::class,
            CategoriesSeeder::class,
            LocationsSeeder::class,
            SettingsSeeder::class,
            ToursSeeder::class,
            GoogleReviewsSeeder::class,
        ]);
    }
}
