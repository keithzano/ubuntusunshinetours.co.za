<?php

namespace App\Console\Commands;

use App\Jobs\SendCartAbandonmentEmail;
use App\Models\Cart;
use App\Models\Setting;
use Illuminate\Console\Command;

class SendCartAbandonmentEmails extends Command
{
    protected $signature = 'cart:send-abandonment-emails';
    protected $description = 'Send emails to users who have abandoned their cart';

    public function handle(): int
    {
        $enabled = Setting::get('cart_abandonment_enabled', true);

        if (!$enabled) {
            $this->info('Cart abandonment emails are disabled.');
            return self::SUCCESS;
        }

        $delayHours = Setting::get('cart_abandonment_delay_hours', 24);
        $cutoffTime = now()->subHours($delayHours);

        $carts = Cart::whereNull('abandoned_email_sent_at')
            ->where('updated_at', '<', $cutoffTime)
            ->whereHas('items')
            ->where(function ($query) {
                $query->whereNotNull('email')
                    ->orWhereNotNull('user_id');
            })
            ->get();

        $this->info("Found {$carts->count()} abandoned carts to process.");

        foreach ($carts as $cart) {
            SendCartAbandonmentEmail::dispatch($cart->id);
            $this->line("Dispatched email for cart #{$cart->id}");
        }

        $this->info('Done!');

        return self::SUCCESS;
    }
}
