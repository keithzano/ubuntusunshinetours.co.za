@component('mail::message')
# Booking Confirmed! 🎉

Hi {{ $booking->customer_name }},

Great news! Your booking has been confirmed. Get ready for an amazing experience!

## Booking Details

**Booking Reference:** {{ $booking->booking_reference }}

**Tour:** {{ $tour->title }}

**Date:** {{ \Carbon\Carbon::parse($booking->tour_date)->format('l, F j, Y') }}

**Location:** {{ $tour->location?->name }}

**Duration:** {{ $tour->duration }}

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

## What's Next?

1. **Save this email** for your records
2. **Check your tour details** carefully
3. **Arrive on time** at the meeting point
4. **Have an amazing time!**

@if($tour->meeting_point)
## Meeting Point

{{ $tour->meeting_point['address'] ?? 'To be confirmed' }}

@if(isset($tour->meeting_point['instructions']))
{{ $tour->meeting_point['instructions'] }}
@endif
@endif

@component('mail::button', ['url' => url('/my/bookings/' . $booking->id)])
View Booking Details
@endcomponent

@if($booking->isPaid())
## 📎 Your Invoice

Your official invoice is attached to this email as a PDF file. Please keep it for your records.

You can also download your invoice anytime from your booking page.
@endif

## Need to Make Changes?

If you need to modify or cancel your booking, please visit your booking page or contact us.

@if($tour->free_cancellation)
**Free cancellation** available up to {{ $tour->free_cancellation_hours ?? 24 }} hours before the tour.
@endif

---

Thank you for choosing {{ config('app.name') }}!

Best regards,<br>
The {{ config('app.name') }} Team

<small>
Questions? Reply to this email or contact us at info@ubuntusunshinetours.co.za
</small>
@endcomponent
