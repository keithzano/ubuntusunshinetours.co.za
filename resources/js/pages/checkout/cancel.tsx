import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { PageProps } from '@/types';

interface Settings {
    contact_email?: string;
}

export default function CheckoutCancel({}: PageProps) {
    const [settings, setSettings] = useState<Settings>({});

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => setSettings(data))
            .catch(console.error);
    }, []);

    return (
        <PublicLayout>
            <Head title="Payment Cancelled - Ubuntu Sunshine Tours" />

            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-lg text-center">
                    {/* Cancel Icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                        <AlertCircle className="h-10 w-10 text-yellow-600" />
                    </div>

                    <h1 className="mb-2 text-3xl font-bold">Payment Cancelled</h1>
                    <p className="mb-8 text-muted-foreground">
                        Your payment was cancelled. Don't worry - no charges have been made to your account.
                    </p>

                    <Card className="mb-8">
                        <CardContent className="p-6 text-left">
                            <h2 className="mb-4 font-semibold">What would you like to do?</h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <ShoppingCart className="mt-1 h-5 w-5 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-medium">Your cart is still saved</p>
                                        <p className="text-sm text-muted-foreground">
                                            You can return to checkout at any time to complete your booking.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link href="/cart">
                            <Button>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Return to Cart
                            </Button>
                        </Link>
                        <Link href="/tours">
                            <Button variant="outline">Browse Tours</Button>
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-muted-foreground">
                        Having trouble with payment?{' '}
                        <a href={`mailto:${settings.contact_email || 'info@ubuntusunshinetours.co.za'}`} className="text-primary hover:underline">
                            Contact us
                        </a>{' '}
                        for assistance.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
