import { Head, Link, router } from '@inertiajs/react';
import { Search, ArrowLeft, Calendar, MapPin, DollarSign, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/public-layout';
import { PageProps } from '@/types';

interface BookingLookupProps extends PageProps {
    errors?: {
        booking_reference?: string;
        email?: string;
    };
}

export default function BookingLookup({ errors }: BookingLookupProps) {
    const [bookingReference, setBookingReference] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!bookingReference.trim() || !email.trim()) {
            return;
        }

        setLoading(true);

        router.post('/booking/find', {
            booking_reference: bookingReference.trim(),
            email: email.trim(),
        }, {
            onSuccess: (page) => {
                // Will redirect to booking details if found
            },
            onError: (errors) => {
                // Validation errors will be handled by the errors prop
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    return (
        <PublicLayout>
            <Head title="Find Your Booking - Ubuntu Sunshine Tours" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </div>

                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Find Your Booking</CardTitle>
                            <p className="text-muted-foreground">
                                Enter your booking reference and email to access your booking details
                            </p>
                        </CardHeader>
                        <CardContent>
                            {/* Display validation errors */}
                            {(errors?.booking_reference || errors?.email) && (
                                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800">
                                                Booking Not Found
                                            </p>
                                            <p className="text-sm text-red-600 mt-1">
                                                We couldn't find a booking matching those details. Please check:
                                            </p>
                                            <ul className="text-xs text-red-600 mt-2 space-y-1">
                                                <li>• Booking reference from your confirmation email</li>
                                                <li>• Email address used when booking</li>
                                                <li>• No extra spaces or typos</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="booking_reference">Booking Reference</Label>
                                        <Input
                                            id="booking_reference"
                                            type="text"
                                            placeholder="e.g., UST-2024-12345"
                                            value={bookingReference}
                                            onChange={(e) => setBookingReference(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            You can find this in your confirmation email
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            The email used when making the booking
                                        </p>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    disabled={loading}
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    {loading ? 'Searching...' : 'Find Booking'}
                                </Button>
                            </form>

                            <div className="mt-8 pt-6 border-t">
                                <h3 className="font-medium mb-4">What you can access:</h3>
                                <div className="grid gap-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>View tour details and dates</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>Check pickup locations</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span>Download invoice</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>Manage participant details</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
                                <p className="text-sm text-blue-700 mb-3">
                                    If you can't find your booking or have any questions, our support team is here to help.
                                </p>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/contact">
                                        Contact Support
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
