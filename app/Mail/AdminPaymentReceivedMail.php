<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminPaymentReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment Received - ' . $this->booking->booking_reference . ' (R' . number_format($this->booking->total, 2) . ')',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.admin.payment-received',
            with: [
                'booking' => $this->booking,
                'tour' => $this->booking->tour,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
