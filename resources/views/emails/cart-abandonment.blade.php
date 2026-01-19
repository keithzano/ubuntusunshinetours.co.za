@component('mail::message')
# Don't Miss Out on Your Adventure!

Hi there,

We noticed you left some amazing tours in your cart. Your adventure awaits!

## Your Cart Items:

@foreach($items as $item)
**{{ $item->tour->title }}**
- Date: {{ \Carbon\Carbon::parse($item->tour_date)->format('l, F j, Y') }}
- Subtotal: R {{ number_format($item->subtotal, 2) }}

@endforeach

---

**Total: R {{ number_format($total, 2) }}**

@component('mail::button', ['url' => url('/cart')])
Complete Your Booking
@endcomponent

## Why Book With Us?

- ✅ **Free Cancellation** on selected tours
- ✅ **Instant Confirmation**
- ✅ **Secure Payment** via PayFast
- ✅ **Expert Local Guides**

Don't let this experience slip away! Complete your booking today.

If you have any questions, simply reply to this email.

Best regards,<br>
The {{ config('app.name') }} Team

---

<small>If you no longer wish to receive these emails, please let us know.</small>
@endcomponent
