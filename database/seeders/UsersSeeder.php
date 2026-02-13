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

        // Create real clients from Google reviews
        $clients = [
            [
                'email' => 'imran.chowdhury@review.google',
                'name' => 'Imran Chowdhury',
            ],
            [
                'email' => 'sandra.schwemmer@review.google', 
                'name' => 'Sandra Schwemmer',
            ],
            [
                'email' => 'mizan.chowdhury@review.google',
                'name' => 'Mizan Chowdhury',
            ],
        ];

        foreach ($clients as $client) {
            User::updateOrCreate(
                ['email' => $client['email']],
                [
                    'name' => $client['name'],
                    'role' => 'client',
                    'password' => bcrypt('password'),
                ]
            );
        }
    }
}
