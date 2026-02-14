@component('mail::message')
# New Client Registration 👤

A new client has registered on {{ config('app.name') }}.

## Client Details

**Name:** {{ $user->name }}

**Email:** {{ $user->email }}

**Phone:** {{ $user->phone ?? 'Not provided' }}

**Country:** {{ $user->country ?? 'Not provided' }}

**Registered:** {{ $user->created_at->format('l, F j, Y \a\t g:i A') }}

@component('mail::button', ['url' => url('/admin/users')])
View All Users
@endcomponent

---

This is an automated notification from {{ config('app.name') }}.
@endcomponent
