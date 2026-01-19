import { Head, Link, router } from '@inertiajs/react';
import { Download, Mail, MoreHorizontal, Search, User } from 'lucide-react';
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
import { PageProps, PaginatedResponse, User as UserType } from '@/types';

interface CustomersIndexProps extends PageProps {
    customers: PaginatedResponse<UserType>;
    filters: {
        search?: string;
        role?: string;
        date_from?: string;
        date_to?: string;
    };
}

export default function AdminCustomersIndex({ customers, filters }: CustomersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/customers', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string | null) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key as keyof typeof filters];
        router.get('/admin/customers', newFilters, { preserveState: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams(filters as Record<string, string>);
        window.location.href = `/admin/customers/export?${params.toString()}`;
    };

    return (
        <AdminLayout>
            <Head title="Customers - Admin" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Customers</h1>
                    <p className="text-muted-foreground">Manage your customer accounts</p>
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
                                    placeholder="Search customers..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <Select
                            value={filters.role || 'all'}
                            onValueChange={(value) => handleFilter('role', value === 'all' ? null : value)}
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
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

            {/* Customers Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Bookings</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Total Spent</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {customers.data.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                                                    {customer.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{customer.name}</p>
                                                    <Badge variant={customer.role === 'admin' ? 'default' : 'secondary'}>
                                                        {customer.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>{customer.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{customer.phone || '-'}</td>
                                        <td className="px-4 py-3">{customer.bookings_count || 0}</td>
                                        <td className="px-4 py-3 font-medium">
                                            R {customer.total_spent ? customer.total_spent.toLocaleString() : '0'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(customer.created_at).toLocaleDateString('en-ZA', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
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
                                                        <Link href={`/admin/customers/${customer.id}`}>
                                                            <User className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/customers/${customer.id}/bookings`}>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            View Bookings
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {customers.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                            No customers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {customers.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <p className="text-sm text-muted-foreground">
                                Showing {customers.from} to {customers.to} of {customers.total} customers
                            </p>
                            <div className="flex gap-2">
                                {customers.links.map((link, index) => (
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
