<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Send review request emails daily at 10:00 AM for tours completed yesterday
Schedule::command('bookings:send-review-requests')->dailyAt('10:00');
