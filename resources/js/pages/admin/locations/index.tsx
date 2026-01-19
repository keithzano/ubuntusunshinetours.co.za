import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MapPin, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
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
import { Location, PageProps } from '@/types';

interface LocationsIndexProps extends PageProps {
    locations: Location[];
    filters?: {
        search?: string;
        status?: string;
        featured?: string;
    };
}

export default function AdminLocationsIndex({ locations, filters }: LocationsIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/locations', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string | null) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key as keyof typeof filters];
        router.get('/admin/locations', newFilters, { preserveState: true });
    };

    const handleToggleStatus = (location: Location) => {
        router.post(`/admin/locations/${location.id}/toggle-status`);
    };

    const handleToggleFeatured = (location: Location) => {
        router.post(`/admin/locations/${location.id}/toggle-featured`);
    };

    const handleDelete = (location: Location) => {
        if (confirm(`Are you sure you want to delete "${location.name}"?`)) {
            router.delete(`/admin/locations/${location.id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Locations - Admin" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Locations</h1>
                    <p className="text-muted-foreground">Manage tour locations</p>
                </div>
                <Link href="/admin/locations/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Location
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
                                    placeholder="Search locations..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="flex gap-2">
                            <Select
                                value={filters?.status || 'all'}
                                onValueChange={(value) => handleFilter('status', value === 'all' ? null : value)}
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters?.featured || 'all'}
                                onValueChange={(value) => handleFilter('featured', value === 'all' ? null : value)}
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Featured" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="not-featured">Not Featured</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Locations Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Region</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Country</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Tours</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {locations.map((location) => (
                                    <tr key={location.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                                    <MapPin className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{location.name}</p>
                                                    <p className="text-sm text-muted-foreground">/{location.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{location.region}</p>
                                                {location.city && (
                                                    <p className="text-sm text-muted-foreground">{location.city}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{location.country}</td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                <p className="font-medium">{location.tours_count || 0}</p>
                                                {location.active_tours_count !== undefined && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {location.active_tours_count} active
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Badge
                                                    variant={location.is_active ? 'default' : 'secondary'}
                                                    className="cursor-pointer"
                                                    onClick={() => handleToggleStatus(location)}
                                                >
                                                    {location.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                                {location.is_featured && (
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
                                                        <Link href={`/tours?location=${location.id}`} target="_blank">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Tours
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/locations/${location.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleFeatured(location)}
                                                    >
                                                        {location.is_featured ? 'Remove Featured' : 'Make Featured'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDelete(location)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {locations.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                            No locations found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
