<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Services\NotificationService;
use Illuminate\Console\Command;

class SendReviewRequests extends Command
{
    protected $signature = 'bookings:send-review-requests';

    protected $description = 'Send review request emails to customers whose tours were completed yesterday';

    public function handle(): int
    {
        $bookings = Booking::with(['tour', 'review'])
            ->where('status', 'confirmed')
            ->where('payment_status', 'paid')
            ->whereDate('tour_date', now()->subDay()->toDateString())
            ->whereDoesntHave('review')
            ->get();

        $sent = 0;

        foreach ($bookings as $booking) {
            NotificationService::sendReviewRequest($booking);
            $sent++;
        }

        $this->info("Sent {$sent} review request email(s).");

        return Command::SUCCESS;
    }
}
