import { Head, Link, useForm, router } from '@inertiajs/react';
import { Save, Shield, Key, Lock, User, Palette, LogIn, UserPlus } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { PageProps, Settings } from '@/types';

interface SettingsPageProps extends PageProps {
    settings: Settings;
}

function GeneralSettings({ settings }: { settings: Settings['general'] }) {
    const { data, setData, post, processing } = useForm({
        site_name: settings.site_name || 'Ubuntu Sunshine Tours',
        site_description: settings.site_description || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        contact_address: settings.contact_address || '',
        whatsapp_number: settings.whatsapp_number || '',
        currency: settings.currency || 'ZAR',
        currency_symbol: settings.currency_symbol || 'R',
        logo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/general');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Basic site configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="site_name">Site Name</Label>
                            <Input
                                id="site_name"
                                value={data.site_name}
                                onChange={(e) => setData('site_name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="contact_email">Contact Email</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="logo">Logo</Label>
                        <div className="mt-2">
                            {settings.logo && (
                                <div className="mb-4">
                                    <img
                                        src={`/storage/${settings.logo}`}
                                        alt="Current logo"
                                        className="h-16 w-auto rounded border border-gray-200"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Current logo</p>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setData('logo', file);
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <div className="text-sm text-muted-foreground">
                                    <p>Recommended: 200x50px</p>
                                    <p>Max size: 2MB</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="site_description">Site Description</Label>
                        <Textarea
                            id="site_description"
                            value={data.site_description}
                            onChange={(e) => setData('site_description', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="contact_phone">Contact Phone</Label>
                            <Input
                                id="contact_phone"
                                value={data.contact_phone}
                                onChange={(e) => setData('contact_phone', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                            <Input
                                id="whatsapp_number"
                                value={data.whatsapp_number}
                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="contact_address">Contact Address</Label>
                        <Textarea
                            id="contact_address"
                            value={data.contact_address}
                            onChange={(e) => setData('contact_address', e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="currency">Currency Code</Label>
                            <Input
                                id="currency"
                                value={data.currency}
                                onChange={(e) => setData('currency', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="currency_symbol">Currency Symbol</Label>
                            <Input
                                id="currency_symbol"
                                value={data.currency_symbol}
                                onChange={(e) => setData('currency_symbol', e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}

function PayFastSettings({ settings }: { settings: Settings['payfast'] }) {
    const { data, setData, post, processing } = useForm({
        payfast_merchant_id: settings.payfast_merchant_id || '',
        payfast_merchant_key: settings.payfast_merchant_key || '',
        payfast_passphrase: settings.payfast_passphrase || '',
        payfast_sandbox: settings.payfast_sandbox ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/payfast');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>PayFast Settings</CardTitle>
                    <CardDescription>Configure your PayFast payment integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                        <strong>Important:</strong> Get your PayFast credentials from your{' '}
                        <a
                            href="https://www.payfast.co.za/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            PayFast Dashboard
                        </a>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="payfast_merchant_id">Merchant ID</Label>
                            <Input
                                id="payfast_merchant_id"
                                value={data.payfast_merchant_id}
                                onChange={(e) => setData('payfast_merchant_id', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="payfast_merchant_key">Merchant Key</Label>
                            <Input
                                id="payfast_merchant_key"
                                type="password"
                                value={data.payfast_merchant_key}
                                onChange={(e) => setData('payfast_merchant_key', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="payfast_passphrase">Passphrase (Optional)</Label>
                        <Input
                            id="payfast_passphrase"
                            type="password"
                            value={data.payfast_passphrase}
                            onChange={(e) => setData('payfast_passphrase', e.target.value)}
                        />
                        <p className="mt-1 text-sm text-muted-foreground">
                            Set this in your PayFast dashboard for extra security
                        </p>
                    </div>

                    <label className="flex cursor-pointer items-center gap-3">
                        <Checkbox
                            checked={data.payfast_sandbox}
                            onCheckedChange={(checked) => setData('payfast_sandbox', checked as boolean)}
                        />
                        <div>
                            <p className="font-medium">Sandbox Mode</p>
                            <p className="text-sm text-muted-foreground">
                                Enable for testing. Disable for live payments.
                            </p>
                        </div>
                    </label>

                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Save PayFast Settings
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}

function EmailSettings({ settings }: { settings: Settings['email'] }) {
    const { data, setData, post, processing } = useForm({
        mail_from_name: settings.mail_from_name || 'Ubuntu Sunshine Tours',
        mail_from_address: settings.mail_from_address || '',
        booking_notification_email: settings.booking_notification_email || '',
        cart_abandonment_enabled: settings.cart_abandonment_enabled ?? true,
        cart_abandonment_delay_hours: settings.cart_abandonment_delay_hours || 24,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/email');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Email Settings</CardTitle>
                    <CardDescription>Configure email notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="mail_from_name">From Name</Label>
                            <Input
                                id="mail_from_name"
                                value={data.mail_from_name}
                                onChange={(e) => setData('mail_from_name', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="mail_from_address">From Email</Label>
                            <Input
                                id="mail_from_address"
                                type="email"
                                value={data.mail_from_address}
                                onChange={(e) => setData('mail_from_address', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="booking_notification_email">Booking Notification Email</Label>
                        <Input
                            id="booking_notification_email"
                            type="email"
                            value={data.booking_notification_email}
                            onChange={(e) => setData('booking_notification_email', e.target.value)}
                        />
                        <p className="mt-1 text-sm text-muted-foreground">
                            Receive notifications when new bookings are made
                        </p>
                    </div>

                    <div className="space-y-4 rounded-lg border p-4">
                        <label className="flex cursor-pointer items-center gap-3">
                            <Checkbox
                                checked={data.cart_abandonment_enabled}
                                onCheckedChange={(checked) =>
                                    setData('cart_abandonment_enabled', checked as boolean)
                                }
                            />
                            <div>
                                <p className="font-medium">Cart Abandonment Emails</p>
                                <p className="text-sm text-muted-foreground">
                                    Send reminder emails to customers who abandon their cart
                                </p>
                            </div>
                        </label>

                        {data.cart_abandonment_enabled && (
                            <div>
                                <Label htmlFor="cart_abandonment_delay_hours">Delay (hours)</Label>
                                <Input
                                    id="cart_abandonment_delay_hours"
                                    type="number"
                                    min={1}
                                    max={72}
                                    value={data.cart_abandonment_delay_hours}
                                    onChange={(e) =>
                                        setData('cart_abandonment_delay_hours', parseInt(e.target.value))
                                    }
                                    className="w-32"
                                />
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Send email after this many hours of inactivity
                                </p>
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Email Settings
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}

function SeoSettings({ settings }: { settings: Settings['seo'] }) {
    const { data, setData, post, processing } = useForm({
        meta_title: settings.meta_title || '',
        meta_description: settings.meta_description || '',
        meta_keywords: settings.meta_keywords || '',
        google_analytics_id: settings.google_analytics_id || '',
        facebook_pixel_id: settings.facebook_pixel_id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/seo');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                    <CardDescription>Search engine optimization and analytics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="meta_title">Default Meta Title</Label>
                        <Input
                            id="meta_title"
                            value={data.meta_title}
                            onChange={(e) => setData('meta_title', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="meta_description">Default Meta Description</Label>
                        <Textarea
                            id="meta_description"
                            value={data.meta_description}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="meta_keywords">Meta Keywords</Label>
                        <Input
                            id="meta_keywords"
                            value={data.meta_keywords}
                            onChange={(e) => setData('meta_keywords', e.target.value)}
                            placeholder="tours, safari, cape town, south africa"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
                            <Input
                                id="google_analytics_id"
                                value={data.google_analytics_id}
                                onChange={(e) => setData('google_analytics_id', e.target.value)}
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>
                        <div>
                            <Label htmlFor="facebook_pixel_id">Facebook Pixel ID</Label>
                            <Input
                                id="facebook_pixel_id"
                                value={data.facebook_pixel_id}
                                onChange={(e) => setData('facebook_pixel_id', e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Save SEO Settings
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}

function ProfileSettings() {
    useEffect(() => {
        router.visit('/settings/profile');
    }, []);

    return (
        <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Redirecting to profile settings...</p>
            </div>
        </div>
    );
}

export default function AdminSettings({ settings }: SettingsPageProps) {
    return (
        <AdminLayout>
            <Head title="Settings - Admin" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your site configuration</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="payfast">PayFast</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <GeneralSettings settings={settings.general} />
                </TabsContent>

                <TabsContent value="payfast">
                    <PayFastSettings settings={settings.payfast} />
                </TabsContent>

                <TabsContent value="email">
                    <EmailSettings settings={settings.email} />
                </TabsContent>

                <TabsContent value="seo">
                    <SeoSettings settings={settings.seo} />
                </TabsContent>

                <TabsContent value="profile">
                    <ProfileSettings />
                </TabsContent>
            </Tabs>
        </AdminLayout>
    );
}
