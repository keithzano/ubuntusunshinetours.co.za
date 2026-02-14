@component('mail::message')
# Welcome to {{ config('app.name') }}! 🌟

Hi {{ $user->name }},

Thank you for creating an account with us! We're thrilled to have you join the {{ config('app.name') }} family.

## What You Can Do Now

- **Browse our tours** — Explore Cape Town, Port Elizabeth, and beyond
- **Book your adventure** — Secure your spot on amazing tours
- **Manage your bookings** — View, modify, and track all your trips
- **Leave reviews** — Share your experiences with others

@component('mail::button', ['url' => url('/tours')])
Explore Tours
@endcomponent

## Need Help?

Our friendly team is here to assist you with anything you need. Don't hesitate to reach out!

---

Thank you for choosing {{ config('app.name') }}!

Best regards,<br>
The {{ config('app.name') }} Team

<small>
Questions? Reply to this email or contact us at info@ubuntusunshinetours.co.za
</small>
@endcomponent
