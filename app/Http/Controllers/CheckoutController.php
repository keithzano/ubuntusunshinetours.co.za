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
use Illuminate\Support\Facades\Session;
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

        if (!$merchantId || !$merchantKey) {
            // Fallback for testing - redirect to success
            return redirect()->route('checkout.success');
        }

        $bookingRefs = collect($bookings)->pluck('booking_reference')->join(', ');

        $data = [
            'merchant_id' => $merchantId,
            'merchant_key' => $merchantKey,
            'return_url' => route('checkout.success'),
            'cancel_url' => route('checkout.cancel'),
            'notify_url' => route('payfast.notify'),
            'name_first' => explode(' ', $bookings[0]->customer_name)[0],
            'name_last' => explode(' ', $bookings[0]->customer_name)[1] ?? '',
            'email_address' => $email,
            'amount' => number_format($amount, 2, '.', ''),
            'item_name' => "Tour Booking: {$bookingRefs}",
            'custom_str1' => json_encode(collect($bookings)->pluck('id')->toArray()),
        ];

        // Generate signature
        $signatureString = '';
        foreach ($data as $key => $val) {
            if ($val !== '') {
                $signatureString .= $key . '=' . urlencode(trim($val)) . '&';
            }
        }
        $signatureString = substr($signatureString, 0, -1);
        if ($passphrase) {
            $signatureString .= '&passphrase=' . urlencode(trim($passphrase));
        }
        $data['signature'] = md5($signatureString);

        $payFastUrl = $sandbox
            ? 'https://sandbox.payfast.co.za/eng/process'
            : 'https://www.payfast.co.za/eng/process';

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
        $userId = auth()->id();

        return Cart::getOrCreate($userId, $sessionId);
    }
}
