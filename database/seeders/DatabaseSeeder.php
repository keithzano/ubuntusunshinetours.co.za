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
        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@ubuntusunshinetours.co.za',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);

        // Create test client
        User::factory()->create([
            'name' => 'Test Client',
            'email' => 'client@example.com',
            'role' => 'client',
            'password' => bcrypt('password'),
        ]);

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
            Category::create(array_merge($category, ['sort_order' => $index, 'is_active' => true]));
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
            Location::create(array_merge($location, ['country' => 'South Africa', 'is_active' => true]));
        }

        // Create default settings
        $settings = [
            ['group' => 'general', 'key' => 'site_name', 'value' => 'Ubuntu Sunshine Tours', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'site_description', 'value' => 'Experience unforgettable tours in Cape Town and Port Elizabeth', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'contact_email', 'value' => 'info@ubuntusunshinetours.co.za', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'contact_phone', 'value' => '+27 12 345 6789', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'currency', 'value' => 'ZAR', 'type' => 'string', 'is_public' => true],
            ['group' => 'general', 'key' => 'currency_symbol', 'value' => 'R', 'type' => 'string', 'is_public' => true],
            ['group' => 'payfast', 'key' => 'payfast_merchant_id', 'value' => '', 'type' => 'string'],
            ['group' => 'payfast', 'key' => 'payfast_merchant_key', 'value' => '', 'type' => 'string'],
            ['group' => 'payfast', 'key' => 'payfast_passphrase', 'value' => '', 'type' => 'string'],
            ['group' => 'payfast', 'key' => 'payfast_sandbox', 'value' => 'true', 'type' => 'boolean'],
            ['group' => 'email', 'key' => 'cart_abandonment_enabled', 'value' => 'true', 'type' => 'boolean'],
            ['group' => 'email', 'key' => 'cart_abandonment_delay_hours', 'value' => '24', 'type' => 'integer'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
