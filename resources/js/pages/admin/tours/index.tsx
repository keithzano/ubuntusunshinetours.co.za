import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
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
import { Category, PageProps, PaginatedResponse, Tour } from '@/types';

interface ToursIndexProps extends PageProps {
    tours: PaginatedResponse<Tour>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}

export default function AdminToursIndex({ tours, categories, filters }: ToursIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/tours', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string | null) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key as keyof typeof filters];
        router.get('/admin/tours', newFilters, { preserveState: true });
    };

    const handleDelete = (tour: Tour) => {
        if (confirm(`Are you sure you want to delete "${tour.title}"?`)) {
            router.delete(`/admin/tours/${tour.id}`);
        }
    };

    const handleToggleStatus = (tour: Tour) => {
        router.post(`/admin/tours/${tour.id}/toggle-status`);
    };

    const handleToggleFeatured = (tour: Tour) => {
        router.post(`/admin/tours/${tour.id}/toggle-featured`);
    };

    return (
        <AdminLayout>
            <Head title="Tours - Admin" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Tours</h1>
                    <p className="text-muted-foreground">Manage your tour listings</p>
                </div>
                <Link href="/admin/tours/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tour
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search tours..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <Select
                            value={filters.category || 'all'}
                            onValueChange={(value) => handleFilter('category', value === 'all' ? null : value)}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.status || 'all'}
                            onValueChange={(value) => handleFilter('status', value === 'all' ? null : value)}
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tours Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Tour</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Bookings</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {tours.data.map((tour) => (
                                    <tr key={tour.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded">
                                                    <img
                                                        src={
                                                            tour.featured_image
                                                                ? `/storage/${tour.featured_image}`
                                                                : '/images/placeholder-tour.jpg'
                                                        }
                                                        alt={tour.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{tour.title}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {tour.location?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{tour.category?.name}</td>
                                        <td className="px-4 py-3 text-sm font-medium">
                                            R {tour.price.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm">{tour.bookings_count}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Badge
                                                    variant={tour.is_active ? 'default' : 'secondary'}
                                                    className="cursor-pointer"
                                                    onClick={() => handleToggleStatus(tour)}
                                                >
                                                    {tour.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                                {tour.is_featured && (
                                                    <Badge variant="outline">Featured</Badge>
                                                )}
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
                                                        <Link href={`/tours/${tour.slug}`} target="_blank">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/tours/${tour.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleFeatured(tour)}
                                                    >
                                                        {tour.is_featured ? 'Remove Featured' : 'Make Featured'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDelete(tour)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {tours.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                            No tours found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {tours.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <p className="text-sm text-muted-foreground">
                                Showing {tours.from} to {tours.to} of {tours.total} tours
                            </p>
                            <div className="flex gap-2">
                                {tours.links.map((link, index) => (
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
