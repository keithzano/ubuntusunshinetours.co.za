<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
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
