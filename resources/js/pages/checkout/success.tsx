import { Head, Link } from '@inertiajs/react';
import { Calendar, Check, Clock, Download, Mail, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import { Booking, PageProps } from '@/types';

interface SuccessPageProps extends PageProps {
    bookings: Booking[];
}

interface Settings {
    contact_email?: string;
}

export default function CheckoutSuccess({ bookings }: SuccessPageProps) {
    const [settings, setSettings] = useState<Settings>({});

    useEffect(() => {
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => setSettings(data))
            .catch(console.error);
    }, []);

    return (
        <PublicLayout>
            <Head title="Booking Confirmed - Ubuntu Sunshine Tours" />

            <div className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-2xl text-center">
                    {/* Success Icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-10 w-10 text-green-600" />
                    </div>

                    <h1 className="mb-2 text-3xl font-bold">Booking Confirmed!</h1>
                    <p className="mb-8 text-muted-foreground">
                        Thank you for booking with Ubuntu Sunshine Tours. A confirmation email has been sent to
                        your email address.
                    </p>

                    {/* Booking Details */}
                    <div className="space-y-4 text-left">
                        {bookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Booking Reference</p>
                                            <p className="text-xl font-bold">{booking.booking_reference}</p>
                                        </div>
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                            Confirmed
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                                            <img
                                                src={
                                                    booking.tour?.featured_image
                                                        ? `/storage/${booking.tour.featured_image}`
                                                        : '/images/placeholder-tour.jpg'
                                                }
                                                alt={booking.tour?.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{booking.tour?.title}</h3>
                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {booking.tour?.location?.name}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(booking.tour_date).toLocaleDateString('en-ZA', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {booking.tour?.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Participants</p>
                                            <p className="font-medium">{booking.total_participants} people</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Total Paid</p>
                                            <p className="font-medium">R {booking.total.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                        {bookings.length > 0 && (
                            <Link href={`/my/bookings/${bookings[0].id}/invoice`}>
                                <Button variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Invoice
                                </Button>
                            </Link>
                        )}
                        <Link href="/tours">
                            <Button>Browse More Tours</Button>
                        </Link>
                    </div>

                    {/* What's Next */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>What happens next?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-left">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium">Check your email</p>
                                    <p className="text-sm text-muted-foreground">
                                        We've sent a confirmation email with all your booking details.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium">Prepare for your tour</p>
                                    <p className="text-sm text-muted-foreground">
                                        Review the tour details and what to bring. We'll send you a reminder
                                        before your tour date.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium">Enjoy your experience!</p>
                                    <p className="text-sm text-muted-foreground">
                                        Arrive at the meeting point on time and get ready for an amazing tour.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Need Help */}
                    <p className="mt-8 text-sm text-muted-foreground">
                        Need help with your booking?{' '}
                        <a href={`mailto:${settings.contact_email || 'info@ubuntusunshinetours.co.za'}`} className="text-primary hover:underline">
                            Contact us
                        </a>
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
