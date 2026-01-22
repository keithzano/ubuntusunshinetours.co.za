<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Database\Seeder;

class BookingsSeeder extends Seeder
{
    public function run(): void
    {
        $tours = Tour::all();
        $users = User::where('role', 'client')->get();

        if ($tours->isEmpty() || $users->isEmpty()) {
            $this->command->warn('No tours or users found. Please run ToursSeeder and UsersSeeder first.');
            return;
        }

        // Create sample bookings
        foreach ($tours->take(15) as $index => $tour) {
            $user = $users->random();
            
            Booking::create([
                'tour_id' => $tour->id,
                'user_id' => $user->id,
                'booking_reference' => 'UB-' . str_pad($index + 1, 6, '0', STR_PAD_LEFT),
                'customer_name' => $user->name,
                'customer_email' => $user->email,
                'customer_phone' => '+27 83 123 456' . $index,
                'tour_date' => now()->addDays(rand(1, 30))->format('Y-m-d'),
                'tour_time' => '09:00',
                'participants' => [
                    [
                        'tier' => 'Adult',
                        'quantity' => rand(1, 4),
                        'price' => $tour->price,
                    ]
                ],
                'total_participants' => rand(1, 4),
                'subtotal' => $tour->price * rand(1, 4),
                'discount' => 0,
                'tax' => 0,
                'total' => $tour->price * rand(1, 4),
                'currency' => 'ZAR',
                'status' => 'completed',
                'payment_status' => 'paid',
                'confirmed_at' => now()->subDays(rand(1, 10)),
            ]);
        }

        $this->command->info('Created 15 sample bookings.');
    }
}
