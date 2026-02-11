<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::updateOrCreate(
            ['email' => 'admin@ubuntusunshinetours.co.za'],
            [
                'name' => 'Admin User',
                'role' => 'admin',
                'password' => bcrypt('password'),
            ]
        );

        // Create test client
        User::updateOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Test Client',
                'role' => 'client',
                'password' => bcrypt('password'),
            ]
        );
    }
}
