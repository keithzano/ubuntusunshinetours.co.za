<?php

namespace App\Mail;

use App\Models\Cart;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CartAbandonmentMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Cart $cart
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You left something behind! Complete your booking',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.cart-abandonment',
            with: [
                'cart' => $this->cart,
                'items' => $this->cart->items,
                'total' => $this->cart->getTotal(),
            ],
        );
    }
}
