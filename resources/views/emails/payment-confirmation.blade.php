@component('mail::message')
# Payment Confirmed! ✅

Hi {{ $booking->customer_name }},

Your payment has been successfully processed. Here's your receipt.

## Booking Details

**Booking Reference:** {{ $booking->booking_reference }}

**Tour:** {{ $tour->title }}

**Date:** {{ \Carbon\Carbon::parse($booking->tour_date)->format('l, F j, Y') }}

**Participants:** {{ $booking->total_participants }} person(s)

---

## Payment Summary

| Description | Amount |
|:----------- | ------:|
| Subtotal | R {{ number_format($booking->subtotal, 2) }} |
@if($booking->discount > 0)
| Discount | -R {{ number_format($booking->discount, 2) }} |
@endif
| **Total Paid** | **R {{ number_format($booking->total, 2) }}** |

---

## 📎 Your Invoice

Your official invoice is attached to this email as a PDF file. Please keep it for your records.

@component('mail::button', ['url' => url('/my/bookings/' . $booking->id)])
View Booking Details
@endcomponent

## What's Next?

1. **Save this email** for your records
2. **Check your tour details** carefully
3. **Arrive on time** at the meeting point
4. **Have an amazing time!**

---

Thank you for choosing {{ config('app.name') }}!

Best regards,<br>
The {{ config('app.name') }} Team

<small>
Questions? Reply to this email or contact us at info@ubuntusunshinetours.co.za
</small>
@endcomponent
