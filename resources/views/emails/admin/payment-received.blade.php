@component('mail::message')
# Payment Received 💰

A payment has been received for a booking on {{ config('app.name') }}.

## Payment Details

**Booking Reference:** {{ $booking->booking_reference }}

**Amount:** R {{ number_format($booking->total, 2) }}

**Payment Status:** {{ ucfirst($booking->payment_status) }}

## Booking Details

**Tour:** {{ $tour->title }}

**Date:** {{ \Carbon\Carbon::parse($booking->tour_date)->format('l, F j, Y') }}

**Customer:** {{ $booking->customer_name }} ({{ $booking->customer_email }})

**Participants:** {{ $booking->total_participants }} person(s)

@component('mail::button', ['url' => url('/admin/bookings/' . $booking->id)])
View Booking
@endcomponent

---

This is an automated notification from {{ config('app.name') }}.
@endcomponent
