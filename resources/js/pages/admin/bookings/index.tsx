import { Head, Link, router } from '@inertiajs/react';
import { Download, Eye, Filter, MoreHorizontal, Search } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { Booking, PageProps, PaginatedResponse } from '@/types';

interface BookingsIndexProps extends PageProps {
    bookings: PaginatedResponse<Booking>;
    filters: {
        search?: string;
        status?: string;
        payment_status?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function AdminBookingsIndex({ bookings, filters }: BookingsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/bookings', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string | null) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key as keyof typeof filters];
        router.get('/admin/bookings', newFilters, { preserveState: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams(filters as Record<string, string>);
        window.location.href = `/admin/bookings/export?${params.toString()}`;
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-blue-100 text-blue-800',
    };

    const paymentStatusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        refunded: 'bg-gray-100 text-gray-800',
    };

    return (
        <AdminLayout>
            <Head title="Bookings - Admin" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Bookings</h1>
                    <p className="text-muted-foreground">Manage tour bookings</p>
                </div>
                <Button onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search bookings..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="flex gap-2">
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => handleFilter('status', value === 'all' ? null : value)}
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.payment_status || 'all'}
                                onValueChange={(value) => handleFilter('payment_status', value === 'all' ? null : value)}
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Payment" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Payment</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Input
                            type="date"
                            value={filters.date_from || ''}
                            onChange={(e) => handleFilter('date_from', e.target.value)}
                            placeholder="From date"
                            className="w-48"
                        />
                        <Input
                            type="date"
                            value={filters.date_to || ''}
                            onChange={(e) => handleFilter('date_to', e.target.value)}
                            placeholder="To date"
                            className="w-48"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Bookings Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Reference</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Tour</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Participants</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {bookings.data.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{booking.booking_reference}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(booking.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{booking.customer_name}</p>
                                                <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{booking.tour?.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.tour?.location?.name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(booking.tour_date).toLocaleDateString('en-ZA', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-4 py-3">{booking.total_participants}</td>
                                        <td className="px-4 py-3 font-medium">R {booking.total.toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                <Badge className={statusColors[booking.status] || ''}>
                                                    {booking.status}
                                                </Badge>
                                                <Badge className={paymentStatusColors[booking.payment_status] || ''}>
                                                    {booking.payment_status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/bookings/${booking.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {booking.payment_status === 'paid' && (
                                                        <DropdownMenuItem
                                                            onClick={() => window.open(`/admin/bookings/${booking.id}/invoice`)}
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Download Invoice
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                            No bookings found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {bookings.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <p className="text-sm text-muted-foreground">
                                Showing {bookings.from} to {bookings.to} of {bookings.total} bookings
                            </p>
                            <div className="flex gap-2">
                                {bookings.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
