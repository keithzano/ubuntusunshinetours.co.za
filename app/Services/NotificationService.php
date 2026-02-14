<?php

namespace App\Services;

use App\Mail\AdminNewBookingMail;
use App\Mail\AdminNewRegistrationMail;
use App\Mail\AdminPaymentReceivedMail;
use App\Mail\PaymentConfirmationMail;
use App\Mail\ReviewRequestMail;
use App\Mail\WelcomeMail;
use App\Models\Booking;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Send welcome email to a newly registered client.
     */
    public static function sendWelcomeEmail(User $user): void
    {
        try {
            if (Setting::get('notify_client_welcome', true)) {
                Mail::to($user->email)->send(new WelcomeMail($user));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send welcome email', ['user_id' => $user->id, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Notify admin about a new client registration.
     */
    public static function notifyAdminNewRegistration(User $user): void
    {
        try {
            $adminEmail = self::getAdminNotificationEmail();
            if ($adminEmail && Setting::get('notify_admin_registration', true)) {
                Mail::to($adminEmail)->send(new AdminNewRegistrationMail($user));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send admin registration notification', ['user_id' => $user->id, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Notify admin about a new booking.
     */
    public static function notifyAdminNewBooking(Booking $booking): void
    {
        try {
            $adminEmail = self::getAdminNotificationEmail();
            if ($adminEmail && Setting::get('notify_admin_booking', true)) {
                $booking->load('tour');
                Mail::to($adminEmail)->send(new AdminNewBookingMail($booking));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send admin booking notification', ['booking_id' => $booking->id, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Notify admin about a payment received.
     */
    public static function notifyAdminPaymentReceived(Booking $booking): void
    {
        try {
            $adminEmail = self::getAdminNotificationEmail();
            if ($adminEmail && Setting::get('notify_admin_payment', true)) {
                $booking->load('tour');
                Mail::to($adminEmail)->send(new AdminPaymentReceivedMail($booking));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send admin payment notification', ['booking_id' => $booking->id, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Send payment confirmation email to client.
     */
    public static function sendPaymentConfirmation(Booking $booking): void
    {
        try {
            if (Setting::get('notify_client_payment', true)) {
                Mail::to($booking->customer_email)->send(new PaymentConfirmationMail($booking));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send payment confirmation email', ['booking_id' => $booking->id, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Send review request email to client after tour completion.
     */
    public static function sendReviewRequest(Booking $booking): void
    {
        try {
            if (Setting::get('notify_client_review_request', true)) {
                $booking->load('tour');
                Mail::to($booking->customer_email)->send(new ReviewRequestMail($booking));
            }
        } catch (\Exception $e) {
            Log::error('Failed to send review request email', ['booking_id' => $booking->id, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Get the configured admin notification email address.
     */
    private static function getAdminNotificationEmail(): ?string
    {
        $email = Setting::get('admin_notification_email');
        if ($email) {
            return $email;
        }

        // Fall back to booking notification email, then contact email
        return Setting::get('booking_notification_email')
            ?: Setting::get('contact_email');
    }
}
