<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReviewRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'How was your experience? Leave a review!',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.review-request',
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
