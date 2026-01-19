<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Setting;
use App\Notifications\BookingConfirmed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PayFastController extends Controller
{
    public function notify(Request $request)
    {
        Log::info('PayFast ITN received', $request->all());

        // Verify the request is from PayFast
        if (!$this->verifySignature($request)) {
            Log::error('PayFast signature verification failed');
            return response('Signature verification failed', 400);
        }

        // Verify the payment was successful
        if ($request->payment_status !== 'COMPLETE') {
            Log::info('PayFast payment not complete', ['status' => $request->payment_status]);
            return response('OK');
        }

        // Get booking IDs from custom_str1
        $bookingIds = json_decode($request->custom_str1, true);

        if (!$bookingIds) {
            Log::error('No booking IDs found in PayFast notification');
            return response('No bookings found', 400);
        }

        $bookings = Booking::whereIn('id', $bookingIds)->get();

        foreach ($bookings as $booking) {
            // Create payment record
            Payment::create([
                'booking_id' => $booking->id,
                'payment_method' => 'payfast',
                'transaction_id' => $request->pf_payment_id,
                'payment_id' => $request->pf_payment_id,
                'amount' => $booking->total,
                'currency' => 'ZAR',
                'status' => 'completed',
                'gateway_response' => $request->all(),
                'payer_email' => $request->email_address,
                'paid_at' => now(),
            ]);

            // Update booking status
            $booking->update([
                'status' => 'confirmed',
                'payment_status' => 'paid',
                'confirmed_at' => now(),
            ]);

            // Increment tour bookings count
            $booking->tour->increment('bookings_count');

            // Send confirmation email
            // $booking->notify(new BookingConfirmed($booking));
        }

        Log::info('PayFast payment processed successfully', ['booking_ids' => $bookingIds]);

        return response('OK');
    }

    private function verifySignature(Request $request): bool
    {
        $passphrase = Setting::get('payfast_passphrase');
        
        $pfData = $request->except(['signature']);
        $pfParamString = '';

        foreach ($pfData as $key => $val) {
            if ($val !== '') {
                $pfParamString .= $key . '=' . urlencode(trim($val)) . '&';
            }
        }

        $pfParamString = substr($pfParamString, 0, -1);

        if ($passphrase) {
            $pfParamString .= '&passphrase=' . urlencode(trim($passphrase));
        }

        $signature = md5($pfParamString);

        return $signature === $request->signature;
    }
}
