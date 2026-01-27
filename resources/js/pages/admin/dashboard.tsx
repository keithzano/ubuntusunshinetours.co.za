import { Head, Link } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    Calendar,
    DollarSign,
    Eye,
    TrendingUp,
    Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Booking, PageProps, Tour } from '@/types';

interface DashboardProps extends PageProps {
    stats: {
        totalRevenue: number;
        monthlyRevenue: number;
        totalBookings: number;
        monthlyBookings: number;
        totalCustomers: number;
        newCustomers: number;
        activeTours: number;
        pageViews: number;
    };
    recentBookings: Booking[];
    revenueChart: { month: string; revenue: number; bookings: number }[];
    topTours: Tour[];
    bookingsByStatus: Record<string, number>;
}

function StatCard({
    title,
    value,
    subValue,
    icon: Icon,
    trend,
}: {
    title: string;
    value: string | number;
    subValue?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
}) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                        {subValue && (
                            <p className="mt-1 flex items-center text-sm text-muted-foreground">
                                {trend === 'up' && <ArrowUp className="mr-1 h-4 w-4 text-green-600 dark:text-green-400" />}
                                {trend === 'down' && <ArrowDown className="mr-1 h-4 w-4 text-red-600 dark:text-red-400" />}
                                {subValue}
                            </p>
                        )}
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard({
    stats,
    recentBookings,
    revenueChart,
    topTours,
    bookingsByStatus,
}: DashboardProps) {
    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };

    return (
        <AdminLayout>
            <Head title="Dashboard - Admin" />

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={`R ${stats.totalRevenue.toLocaleString()}`}
                    subValue={`R ${stats.monthlyRevenue.toLocaleString()} this month`}
                    icon={DollarSign}
                    trend="up"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings}
                    subValue={`${stats.monthlyBookings} this month`}
                    icon={Calendar}
                    trend="up"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    subValue={`${stats.newCustomers} new this month`}
                    icon={Users}
                    trend="up"
                />
                <StatCard
                    title="Page Views (30d)"
                    value={stats.pageViews.toLocaleString()}
                    subValue={`${stats.activeTours} active tours`}
                    icon={Eye}
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Bookings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Bookings</CardTitle>
                        <Link href="/admin/bookings">
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentBookings.slice(0, 5).map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                                >
                                    <div>
                                        <p className="font-medium">{booking.customer_name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.tour?.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {booking.booking_reference}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">R {booking.total.toLocaleString()}</p>
                                        <Badge className={statusColors[booking.status] || ''}>
                                            {booking.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {recentBookings.length === 0 && (
                                <p className="text-center text-muted-foreground">No recent bookings</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Tours */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Top Performing Tours</CardTitle>
                        <Link href="/admin/tours">
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topTours.map((tour, index) => (
                                <div
                                    key={tour.id}
                                    className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/80 dark:bg-primary/60 text-sm font-bold text-primary-foreground">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium">{tour.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {tour.bookings_count} bookings
                                        </p>
                                    </div>
                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                            ))}
                            {topTours.length === 0 && (
                                <p className="text-center text-muted-foreground">No tour data yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Bookings by Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bookings by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(bookingsByStatus).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`h-3 w-3 rounded-full ${
                                                status === 'confirmed'
                                                    ? 'bg-green-600 dark:bg-green-400'
                                                    : status === 'pending'
                                                      ? 'bg-yellow-600 dark:bg-yellow-400'
                                                      : status === 'cancelled'
                                                        ? 'bg-red-600 dark:bg-red-400'
                                                        : 'bg-blue-600 dark:bg-blue-400'
                                            }`}
                                        />
                                        <span className="capitalize">{status}</span>
                                    </div>
                                    <span className="font-bold">{count}</span>
                                </div>
                            ))}
                            {Object.keys(bookingsByStatus).length === 0 && (
                                <p className="text-center text-muted-foreground">No booking data</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Chart Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend (12 months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {revenueChart.slice(-6).map((item) => (
                                <div key={item.month} className="flex items-center gap-4">
                                    <span className="w-20 text-sm text-muted-foreground">{item.month}</span>
                                    <div className="flex-1">
                                        <div
                                            className="h-6 rounded bg-primary/80 dark:bg-primary/60"
                                            style={{
                                                width: `${Math.min(100, (item.revenue / (Math.max(...revenueChart.map((r) => r.revenue)) || 1)) * 100)}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="w-24 text-right text-sm font-medium">
                                        R {item.revenue.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            {revenueChart.length === 0 && (
                                <p className="text-center text-muted-foreground">No revenue data yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
