@component('mail::message')
# How Was Your Tour? 🌍

Hi {{ $booking->customer_name }},

We hope you had an amazing time on your **{{ $tour->title }}** tour on {{ \Carbon\Carbon::parse($booking->tour_date)->format('l, F j, Y') }}!

We'd love to hear about your experience. Your feedback helps us improve and helps other travellers make informed decisions.

@component('mail::button', ['url' => url('/my/bookings/' . $booking->id)])
Leave a Review
@endcomponent

## Why Leave a Review?

- **Help other travellers** find the best experiences
- **Share your highlights** and favourite moments
- **Help us improve** our tours and services

It only takes a minute, and it means the world to us!

---

Thank you for choosing {{ config('app.name') }}!

Best regards,<br>
The {{ config('app.name') }} Team

<small>
Questions? Reply to this email or contact us at info@ubuntusunshinetours.co.za
</small>
@endcomponent
