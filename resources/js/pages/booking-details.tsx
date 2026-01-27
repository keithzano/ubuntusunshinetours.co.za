import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Users, FileText, Mail, Phone, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import { Booking, PageProps } from '@/types';

interface BookingDetailsProps extends PageProps {
    booking: Booking;
}

export default function BookingDetails({ booking }: BookingDetailsProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <PublicLayout>
            <Head title={`Booking ${booking.booking_reference} - Ubuntu Sunshine Tours`} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link href="/booking/lookup" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Booking Lookup
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Booking Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold">Booking Details</h1>
                                    <p className="text-muted-foreground">
                                        Reference: {booking.booking_reference}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <Badge className={getStatusColor(booking.status)}>
                                        {booking.status}
                                    </Badge>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {new Date(booking.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Tour Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tour Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="aspect-video w-full overflow-hidden rounded-lg">
                                        <img
                                            src={
                                                booking.tour?.featured_image
                                                    ? `/storage/${booking.tour.featured_image}`
                                                    : '/images/safari.jpg'
                                            }
                                            alt={booking.tour?.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{booking.tour?.title}</h3>
                                        <p className="text-muted-foreground mt-2">
                                            {booking.tour?.description}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {new Date(booking.tour_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {booking.tour?.duration}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {booking.tour?.location?.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {booking.participants?.length || 0} participants
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Participants */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Participants</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {booking.participants?.map((participant, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                <div>
                                                    <p className="font-medium">{participant.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {participant.age} years old
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">R {participant.price}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {participant.quantity}x
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pickup Information */}
                            {booking.pickup_location && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Pickup Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="font-medium">{booking.pickup_location}</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Pickup time: {booking.pickup_time || 'To be confirmed'}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="font-medium">{booking.customer_name}</p>
                                        <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                                    </div>
                                    {booking.customer_phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{booking.customer_phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{booking.customer_email}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pricing */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pricing Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>R {booking.subtotal || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span className="text-green-600">
                                            -R {booking.discount || 0}
                                        </span>
                                    </div>
                                    {booking.tax && booking.tax > 0 && (
                                        <div className="flex justify-between">
                                            <span>Tax</span>
                                            <span>R {booking.tax}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total Paid</span>
                                        <span>R {booking.total || 0}</span>
                                    </div>
                                    <div className="pt-2">
                                        <Badge className={getPaymentStatusColor(booking.payment_status)}>
                                            {booking.payment_status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full" variant="outline" asChild>
                                        <Link href={`/booking/invoice/${booking.id}`}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Download Invoice
                                        </Link>
                                    </Button>
                                    
                                    {booking.status === 'completed' && !booking.review && (
                                        <Button className="w-full" asChild>
                                            <Link href={`/bookings/${booking.id}/review`}>
                                                <Star className="mr-2 h-4 w-4" />
                                                Leave a Review
                                            </Link>
                                        </Button>
                                    )}
                                    
                                    {booking.review && (
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <p className="text-sm text-green-700">
                                                ✓ You have reviewed this booking
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact Support */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Need Help?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        If you have any questions about your booking, please don't hesitate to contact us.
                                    </p>
                                    <Button className="w-full" variant="outline" asChild>
                                        <Link href="/contact">
                                            <Mail className="mr-2 h-4 w-4" />
                                            Contact Support
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
