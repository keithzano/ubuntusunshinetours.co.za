<?php

namespace App\Mail;

use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class BookingConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Booking Confirmed - ' . $this->booking->booking_reference,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking-confirmation',
            with: [
                'booking' => $this->booking,
                'tour' => $this->booking->tour,
            ],
        );
    }

    public function attachments(): array
    {
        $attachments = [];

        // Only attach invoice if booking is paid
        if ($this->booking->isPaid()) {
            $this->booking->generateInvoiceNumber();
            $this->booking->load(['tour', 'payments']);

            $pdf = Pdf::loadView('pdf.invoice', [
                'booking' => $this->booking,
            ]);

            $attachments[] = Attachment::fromData(fn() => $pdf->output(), "invoice-{$this->booking->invoice_number}.pdf")
                ->withMime('application/pdf');
        }

        return $attachments;
    }
}
