<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
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
    }
}
