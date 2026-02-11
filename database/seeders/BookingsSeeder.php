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
        // Delete old fake bookings
        Booking::where('booking_reference', 'like', 'UB-0000%')->delete();

        $tours = Tour::all();
        $user = User::where('role', 'client')->first();

        if ($tours->isEmpty() || !$user) {
            $this->command->warn('No tours or users found. Please run ToursSeeder and UsersSeeder first.');
            return;
        }

        // Create minimal bookings to support the 3 real Google reviews
        $reviewers = [
            ['name' => 'Imran Chowdhury', 'email' => 'imran.chowdhury@review.google'],
            ['name' => 'Sandra Schwemmer', 'email' => 'sandra.schwemmer@review.google'],
            ['name' => 'Mizan Chowdhury', 'email' => 'mizan.chowdhury@review.google'],
        ];

        foreach ($reviewers as $index => $reviewer) {
            $tour = $tours[$index] ?? $tours->first();

            Booking::updateOrCreate([
                'booking_reference' => 'UB-R' . str_pad($index + 1, 5, '0', STR_PAD_LEFT),
            ], [
                'tour_id' => $tour->id,
                'user_id' => $user->id,
                'customer_name' => $reviewer['name'],
                'customer_email' => $reviewer['email'],
                'customer_phone' => '+27 81 596 4461',
                'tour_date' => now()->subDays(7 * ($index + 1))->format('Y-m-d'),
                'tour_time' => '09:00',
                'participants' => [
                    ['tier' => 'Adult', 'quantity' => 2, 'price' => $tour->price]
                ],
                'total_participants' => 2,
                'subtotal' => $tour->price * 2,
                'discount' => 0,
                'tax' => 0,
                'total' => $tour->price * 2,
                'currency' => 'ZAR',
                'status' => 'completed',
                'payment_status' => 'paid',
                'confirmed_at' => now()->subDays(7 * ($index + 1)),
            ]);
        }

        $this->command->info('Created 3 bookings for real reviewers.');
    }
}
