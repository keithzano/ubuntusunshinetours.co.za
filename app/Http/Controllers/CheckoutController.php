<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Cart;
use App\Models\DiscountCode;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\TourTimeSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use App\Services\NotificationService;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response
    {
        $cart = $this->getCart();
        $cart->load(['items.tour.category', 'items.tour.location', 'items.timeSlot']);

        if ($cart->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty');
        }

        return Inertia::render('checkout/index', [
            'cart' => $cart,
            'items' => $cart->items,
            'subtotal' => $cart->total,
            'user' => auth()->user(),
        ]);
    }

    public function applyDiscount(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $discount = DiscountCode::where('code', strtoupper($request->code))
            ->valid()
            ->first();

        if (!$discount) {
            return back()->with('error', 'Invalid or expired discount code');
        }

        $cart = $this->getCart();
        $discountAmount = $discount->calculateDiscount($cart->total);

        Session::put('discount_code', $discount->code);
        Session::put('discount_amount', $discountAmount);

        return back()->with('success', "Discount of R{$discountAmount} applied!");
    }

    public function removeDiscount()
    {
        Session::forget(['discount_code', 'discount_amount']);

        return back()->with('success', 'Discount removed');
    }

    public function process(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'customer_country' => 'nullable|string|max:100',
            'special_requirements' => 'nullable|string|max:1000',
            'create_account' => 'boolean',
            'password' => 'required_if:create_account,true|nullable|min:8|confirmed',
        ]);

        $cart = $this->getCart();
        $cart->load(['items.tour', 'items.timeSlot']);

        if ($cart->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty');
        }

        $discountCode = Session::get('discount_code');
        $discountAmount = Session::get('discount_amount', 0);

        try {
            DB::beginTransaction();

            // Create account if requested
            $userId = auth()->id();
            if ($request->boolean('create_account') && !$userId) {
                $user = \App\Models\User::create([
                    'name' => $validated['customer_name'],
                    'email' => $validated['customer_email'],
                    'password' => bcrypt($validated['password']),
                    'phone' => $validated['customer_phone'],
                    'country' => $validated['customer_country'],
                ]);
                $userId = $user->id;
                auth()->login($user);

                // Send welcome email and notify admin
                NotificationService::sendWelcomeEmail($user);
                NotificationService::notifyAdminNewRegistration($user);
            }

            $bookings = [];

            foreach ($cart->items as $item) {
                $totalParticipants = collect($item->participants)
                    ->sum('quantity');

                $booking = Booking::create([
                    'user_id' => $userId,
                    'tour_id' => $item->tour_id,
                    'time_slot_id' => $item->time_slot_id,
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                    'customer_country' => $validated['customer_country'],
                    'tour_date' => $item->tour_date,
                    'tour_time' => $item->tour_time,
                    'participants' => $item->participants,
                    'total_participants' => $totalParticipants,
                    'special_requirements' => $validated['special_requirements'],
                    'subtotal' => $item->subtotal,
                    'discount' => $discountAmount / $cart->items->count(), // Split discount
                    'discount_code' => $discountCode,
                    'total' => $item->subtotal - ($discountAmount / $cart->items->count()),
                    'status' => 'pending',
                    'payment_status' => 'pending',
                ]);

                // Update time slot availability
                if ($item->time_slot_id) {
                    TourTimeSlot::where('id', $item->time_slot_id)
                        ->increment('booked_spots', $totalParticipants);
                }

                $bookings[] = $booking;
            }

            // Notify admin about each new booking
            foreach ($bookings as $booking) {
                NotificationService::notifyAdminNewBooking($booking);
            }

            // Calculate total for payment
            $totalAmount = collect($bookings)->sum('total');

            // Store booking IDs in session for payment processing
            Session::put('pending_bookings', collect($bookings)->pluck('id')->toArray());
            Session::put('payment_amount', $totalAmount);
            Session::put('customer_email', $validated['customer_email']);

            // Increment discount usage
            if ($discountCode) {
                DiscountCode::where('code', $discountCode)->first()?->incrementUsage();
            }

            DB::commit();

            // Clear cart and discount
            $cart->clear();
            Session::forget(['discount_code', 'discount_amount']);

            // Redirect to PayFast
            return $this->initiatePayFastPayment($bookings, $totalAmount, $validated['customer_email']);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'An error occurred while processing your order. Please try again.');
        }
    }

    private function initiatePayFastPayment(array $bookings, float $amount, string $email)
    {
        $merchantId = Setting::get('payfast_merchant_id');
        $merchantKey = Setting::get('payfast_merchant_key');
        $passphrase = Setting::get('payfast_passphrase');
        $sandbox = Setting::get('payfast_sandbox', true);

        // Detect localhost — PayFast live endpoint blocks requests with localhost URLs.
        $appUrl = config('app.url', 'http://localhost');
        $isLocalhost = str_contains($appUrl, 'localhost') || str_contains($appUrl, '127.0.0.1');

        if ($isLocalhost && !$sandbox) {
            Log::warning('PayFast: APP_URL is localhost — forcing sandbox mode. Set APP_URL to your real domain for live payments.');
            $sandbox = true;
        }

        if (!$merchantId || !$merchantKey) {
            return redirect()->route('checkout.success');
        }

        $bookingIds = collect($bookings)->pluck('id')->toArray();
        $bookingRefs = collect($bookings)->pluck('booking_reference')->join(', ');

        // Sanitize text fields — strip characters that may trigger PayFast/CloudFront WAF
        $itemName = substr(preg_replace('/[^a-zA-Z0-9 \-_.]/', '', 'Tour Booking ' . $bookingRefs), 0, 100);
        $itemDescription = substr(preg_replace('/[^a-zA-Z0-9 \-_.]/', '', 'Payment for ' . $bookingRefs), 0, 255);

        // Split customer name
        $nameParts = explode(' ', $bookings[0]->customer_name, 2);

        // PayFast parameters — MUST be in PayFast's documented order for correct signature
        // See: https://developers.payfast.co.za/docs#step_1_form_fields
        $data = [
            'merchant_id' => $merchantId,
            'merchant_key' => $merchantKey,
            'return_url' => route('checkout.success'),
            'cancel_url' => route('checkout.cancel'),
            'notify_url' => route('payfast.notify'),
            'name_first' => $nameParts[0] ?? '',
            'name_last' => $nameParts[1] ?? '',
            'email_address' => $email,
            'm_payment_id' => implode('-', $bookingIds),
            'amount' => number_format($amount, 2, '.', ''),
            'item_name' => $itemName,
            'item_description' => $itemDescription,
            'custom_str1' => implode(',', $bookingIds),
        ];

        // Remove empty values — PayFast requires that only non-empty fields
        // are submitted AND included in the signature. Submitting an empty
        // field in the form but excluding it from the signature causes mismatch.
        $data = array_filter($data, function ($val) {
            return $val !== null && $val !== '';
        });

        // Generate signature — iterate in the SAME order as above (do NOT sort)
        $pfOutput = '';
        foreach ($data as $key => $val) {
            $pfOutput .= $key . '=' . urlencode(trim((string) $val)) . '&';
        }
        $getString = substr($pfOutput, 0, -1); // Remove trailing &
        if (!empty($passphrase)) {
            $getString .= '&passphrase=' . urlencode(trim($passphrase));
        }
        $data['signature'] = md5($getString);

        $payFastUrl = $sandbox
            ? 'https://sandbox.payfast.co.za/eng/process'
            : 'https://www.payfast.co.za/eng/process';

        Log::info('PayFast payment initiated', [
            'sandbox' => $sandbox,
            'is_localhost' => $isLocalhost,
            'payfast_url' => $payFastUrl,
            'merchant_id' => $merchantId,
            'amount' => $data['amount'],
            'item_name' => $data['item_name'],
            'return_url' => $data['return_url'],
            'notify_url' => $data['notify_url'],
            'signature_string' => $getString,
            'signature' => $data['signature'],
        ]);

        return Inertia::render('checkout/redirect-to-payfast', [
            'payFastUrl' => $payFastUrl,
            'paymentData' => $data,
        ]);
    }

    public function success(): Response
    {
        $bookingIds = Session::get('pending_bookings', []);
        $bookings = Booking::with('tour')->whereIn('id', $bookingIds)->get();

        Session::forget(['pending_bookings', 'payment_amount', 'customer_email']);

        return Inertia::render('checkout/success', [
            'bookings' => $bookings,
        ]);
    }

    public function cancel(): Response
    {
        return Inertia::render('checkout/cancel');
    }

    private function getCart(): Cart
    {
        $sessionId = Session::getId();
        $userId = auth()->check() ? auth()->id() : null;

        return Cart::getOrCreate($userId, $sessionId);
    }
}
