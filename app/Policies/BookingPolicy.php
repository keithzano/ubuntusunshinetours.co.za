<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        return $user->isAdmin() || $user->id === $booking->user_id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $booking->user_id 
            && $booking->isPending() 
            && $booking->tour_date > now();
    }

    public function review(User $user, Booking $booking): bool
    {
        return $user->id === $booking->user_id 
            && $booking->isCompleted() 
            && !$booking->review;
    }
}
