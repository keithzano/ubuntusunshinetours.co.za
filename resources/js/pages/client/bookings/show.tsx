import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, DollarSign, FileText, MapPin, Mail, Star, Users, Phone, User, Download, MessageSquare } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ClientLayout from '@/layouts/client-layout';
import { Booking, PageProps } from '@/types';

interface BookingShowProps extends PageProps {
    booking: Booking;
}

export default function ClientBookingShow({ booking }: BookingShowProps) {
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
        <ClientLayout>
            <Head title={`Booking ${booking.booking_reference}`} />

            <div className="mb-6">
                <Link href="/my/bookings" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to My Bookings
                </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Booking Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Booking Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Booking Details</CardTitle>
                                <div className="flex gap-2">
                                    <Badge className={getStatusColor(booking.status)}>
                                        {booking.status}
                                    </Badge>
                                    <Badge className={getPaymentStatusColor(booking.payment_status)}>
                                        {booking.payment_status}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">Reference: {booking.booking_reference}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Booked on {new Date(booking.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <h4 className="font-medium mb-2">Tour Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{booking.tour?.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(booking.tour_date).toLocaleDateString()}</span>
                                        </div>
                                        {booking.tour_time && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>{booking.tour_time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Contact Information</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <span>{booking.customer_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            <span>{booking.customer_email}</span>
                                        </div>
                                        {booking.customer_phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                <span>{booking.customer_phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-medium mb-2">Participants</h4>
                                <div className="space-y-1">
                                    {booking.participants?.map((participant, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>{participant.quantity} x {participant.tier}</span>
                                            <span>R {(participant.price * participant.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {booking.special_requirements && (
                                <>
                                    <Separator />
                                    <div>
                                        <h4 className="font-medium mb-2">Special Requirements</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.special_requirements}
                                        </p>
                                    </div>
                                </>
                            )}

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>R {booking.subtotal?.toLocaleString()}</span>
                                </div>
                                {booking.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-R {booking.discount?.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>R {booking.tax?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <span className="font-semibold">Total Amount</span>
                                    <span className="font-bold text-lg">R {booking.total?.toLocaleString()}</span>
                                </div>
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
                                <Link href={`/my/bookings/${booking.id}/invoice`}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Download Invoice
                                </Link>
                            </Button>
                            
                            {booking.status === 'completed' && booking.payment_status === 'paid' && !booking.review && (
                                <Button className="w-full" asChild>
                                    <Link href={`/my/bookings/${booking.id}/review`}>
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
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-medium">Booking Created</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(booking.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {booking.confirmed_at && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">Booking Confirmed</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(booking.confirmed_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {booking.cancelled_at && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">Booking Cancelled</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(booking.cancelled_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Important Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Important Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <h5 className="font-medium mb-1">Meeting Point</h5>
                                    <p className="text-muted-foreground">
                                        {booking.tour?.meeting_point?.address || 'Details will be sent via email'}
                                    </p>
                                </div>
                                <div>
                                    <h5 className="font-medium mb-1">What to Bring</h5>
                                    <ul className="text-muted-foreground space-y-1">
                                        {booking.tour?.what_to_bring?.slice(0, 3).map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-primary">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-medium mb-1">Cancellation Policy</h5>
                                    <p className="text-muted-foreground">
                                        {booking.tour?.cancellation_policy || 'Free cancellation up to 24 hours before the tour'}
                                    </p>
                                </div>
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
                                <Link href={`/my/bookings/${booking.id}/invoice`}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Download Invoice
                                </Link>
                            </Button>
                            
                            {/* Leave Review Button */}
                            {booking.status === 'completed' && !booking.review && (
                                <Button className="w-full" asChild>
                                    <Link href={`/my/bookings/${booking.id}/review`}>
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
                            <Button className="w-full" variant="outline">
                                <Mail className="mr-2 h-4 w-4" />
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ClientLayout>
    );
}
