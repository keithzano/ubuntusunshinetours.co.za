import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientLayout from '@/layouts/client-layout';
import { Booking, PageProps } from '@/types';

interface BookingsPageProps extends PageProps {
    upcomingBookings: Booking[];
    pastBookings: Booking[];
}

function BookingCard({ booking }: { booking: Booking }) {
    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800',
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="aspect-video w-full overflow-hidden rounded-lg md:aspect-square md:w-32">
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

                    <div className="flex flex-1 flex-col justify-between">
                        <div>
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {booking.booking_reference}
                                    </p>
                                    <h3 className="font-semibold">{booking.tour?.title}</h3>
                                </div>
                                <Badge className={statusColors[booking.status] || ''}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {booking.tour?.location?.name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(booking.tour_date).toLocaleDateString('en-ZA', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {booking.tour?.duration}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="font-bold">R {booking.total.toLocaleString()}</p>
                            <Link href={`/my/bookings/${booking.id}`}>
                                <Button variant="outline" size="sm">
                                    View Details
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function BookingsIndex({ upcomingBookings, pastBookings }: BookingsPageProps) {
    return (
        <ClientLayout>
            <Head title="My Bookings - Ubuntu Sunshine Tours" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>

                <Tabs defaultValue="upcoming">
                    <TabsList className="mb-6">
                        <TabsTrigger value="upcoming">
                            Upcoming ({upcomingBookings.length})
                        </TabsTrigger>
                        <TabsTrigger value="past">
                            Past ({pastBookings.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming">
                        {upcomingBookings.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="mb-4 text-muted-foreground">
                                        You don't have any upcoming bookings.
                                    </p>
                                    <Link href="/tours">
                                        <Button>Browse Tours</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="past">
                        {pastBookings.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">
                                        You don't have any past bookings.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {pastBookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </ClientLayout>
    );
}
