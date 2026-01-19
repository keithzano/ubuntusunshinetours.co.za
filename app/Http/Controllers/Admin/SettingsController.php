<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $settings = [
            'general' => Setting::getGroup('general'),
            'payfast' => Setting::getGroup('payfast'),
            'email' => Setting::getGroup('email'),
            'seo' => Setting::getGroup('seo'),
        ];

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function updateGeneral(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'site_description' => 'nullable|string|max:500',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string|max:50',
            'contact_address' => 'nullable|string|max:500',
            'whatsapp_number' => 'nullable|string|max:50',
            'currency' => 'required|string|max:10',
            'currency_symbol' => 'required|string|max:10',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value, 'general');
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $oldLogo = Setting::get('logo');
            if ($oldLogo) {
                Storage::disk('public')->delete($oldLogo);
            }
            $path = $request->file('logo')->store('settings', 'public');
            Setting::set('logo', $path, 'general');
        }

        Setting::clearCache();

        return back()->with('success', 'General settings updated');
    }

    public function updatePayfast(Request $request)
    {
        $validated = $request->validate([
            'payfast_merchant_id' => 'required|string',
            'payfast_merchant_key' => 'required|string',
            'payfast_passphrase' => 'nullable|string',
            'payfast_sandbox' => 'boolean',
        ]);

        Setting::set('payfast_merchant_id', $validated['payfast_merchant_id'], 'payfast');
        Setting::set('payfast_merchant_key', $validated['payfast_merchant_key'], 'payfast');
        Setting::set('payfast_passphrase', $validated['payfast_passphrase'] ?? '', 'payfast');
        Setting::set('payfast_sandbox', $validated['payfast_sandbox'] ?? false, 'payfast', 'boolean');

        Setting::clearCache();

        return back()->with('success', 'PayFast settings updated');
    }

    public function updateEmail(Request $request)
    {
        $validated = $request->validate([
            'mail_from_name' => 'required|string|max:255',
            'mail_from_address' => 'required|email',
            'booking_notification_email' => 'required|email',
            'cart_abandonment_enabled' => 'boolean',
            'cart_abandonment_delay_hours' => 'integer|min:1|max:72',
        ]);

        foreach ($validated as $key => $value) {
            $type = is_bool($value) ? 'boolean' : (is_int($value) ? 'integer' : 'string');
            Setting::set($key, $value, 'email', $type);
        }

        Setting::clearCache();

        return back()->with('success', 'Email settings updated');
    }

    public function updateSeo(Request $request)
    {
        $validated = $request->validate([
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:500',
            'google_analytics_id' => 'nullable|string|max:50',
            'facebook_pixel_id' => 'nullable|string|max:50',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value ?? '', 'seo');
        }

        Setting::clearCache();

        return back()->with('success', 'SEO settings updated');
    }
}
