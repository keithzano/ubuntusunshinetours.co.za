<?php

namespace App\Jobs;

use App\Mail\CartAbandonmentMail;
use App\Models\Cart;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendCartAbandonmentEmail implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected int $cartId
    ) {}

    public function handle(): void
    {
        $cart = Cart::with(['items.tour'])->find($this->cartId);

        if (!$cart || $cart->items->isEmpty() || $cart->abandoned_email_sent_at) {
            return;
        }

        $email = $cart->email ?? $cart->user?->email;

        if (!$email) {
            return;
        }

        Mail::to($email)->send(new CartAbandonmentMail($cart));

        $cart->update(['abandoned_email_sent_at' => now()]);
    }
}
