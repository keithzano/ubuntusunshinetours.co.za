@component('mail::message')
# New Booking Received 📋

A new booking has been made on {{ config('app.name') }}.

## Booking Details

**Reference:** {{ $booking->booking_reference }}

**Tour:** {{ $tour->title }}

**Date:** {{ \Carbon\Carbon::parse($booking->tour_date)->format('l, F j, Y') }}

**Time:** {{ $booking->tour_time ? \Carbon\Carbon::parse($booking->tour_time)->format('g:i A') : 'Not specified' }}

## Customer Details

**Name:** {{ $booking->customer_name }}

**Email:** {{ $booking->customer_email }}

**Phone:** {{ $booking->customer_phone ?? 'Not provided' }}

**Country:** {{ $booking->customer_country ?? 'Not provided' }}

## Participants

**Total:** {{ $booking->total_participants }} person(s)

@if($booking->special_requirements)
**Special Requirements:** {{ $booking->special_requirements }}
@endif

## Payment

| Description | Amount |
|:----------- | ------:|
| Subtotal | R {{ number_format($booking->subtotal, 2) }} |
@if($booking->discount > 0)
| Discount | -R {{ number_format($booking->discount, 2) }} |
@endif
| **Total** | **R {{ number_format($booking->total, 2) }}** |

**Payment Status:** {{ ucfirst($booking->payment_status) }}

@component('mail::button', ['url' => url('/admin/bookings/' . $booking->id)])
View Booking
@endcomponent

---

This is an automated notification from {{ config('app.name') }}.
@endcomponent
