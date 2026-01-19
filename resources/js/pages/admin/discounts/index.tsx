import { Head, Link, router } from '@inertiajs/react';
import { Copy, Edit, Eye, MoreHorizontal, Percent, Plus, Search, Trash2 } from 'lucide-react';
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
import { DiscountCode, PageProps, PaginatedResponse } from '@/types';

interface DiscountsIndexProps extends PageProps {
    discounts: PaginatedResponse<DiscountCode>;
    filters?: {
        search?: string;
        type?: string;
        status?: string;
    };
}

export default function AdminDiscountsIndex({ discounts, filters }: DiscountsIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/discounts', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string | null) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key as keyof typeof filters];
        router.get('/admin/discounts', newFilters, { preserveState: true });
    };

    const handleToggleStatus = (discount: DiscountCode) => {
        router.post(`/admin/discounts/${discount.id}/toggle-status`);
    };

    const handleDelete = (discount: DiscountCode) => {
        if (confirm(`Are you sure you want to delete "${discount.code}"?`)) {
            router.delete(`/admin/discounts/${discount.id}`);
        }
    };

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        // You could add a toast notification here
    };

    const typeColors: Record<string, string> = {
        percentage: 'bg-blue-100 text-blue-800',
        fixed: 'bg-green-100 text-green-800',
    };

    const statusColors: Record<string, string> = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        expired: 'bg-red-100 text-red-800',
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AdminLayout>
            <Head title="Discounts - Admin" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Discount Codes</h1>
                    <p className="text-muted-foreground">Manage discount codes and promotions</p>
                </div>
                <Link href="/admin/discounts/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Discount
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
                                    placeholder="Search discounts..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="flex gap-2">
                            <Select
                                value={filters?.type || 'all'}
                                onValueChange={(value) => handleFilter('type', value === 'all' ? null : value)}
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="percentage">Percentage</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                </SelectContent>
                            </Select>

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
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Discounts Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Code</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Usage</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Valid Until</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {discounts.data.map((discount) => (
                                    <tr key={discount.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono">
                                                    {discount.code}
                                                </code>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleCopyCode(discount.code)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-muted-foreground max-w-xs truncate">
                                                {discount.description || '-'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className={typeColors[discount.type] || ''}>
                                                {discount.type}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {discount.type === 'percentage'
                                                ? `${discount.value}%`
                                                : `R ${discount.value.toLocaleString()}`}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">
                                                <p>
                                                    {discount.used_count} /{' '}
                                                    {discount.max_uses === null ? '∞' : discount.max_uses}
                                                </p>
                                                {discount.max_uses && (
                                                    <p className="text-muted-foreground">
                                                        {Math.round((discount.used_count / discount.max_uses) * 100)}% used
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {discount.expires_at
                                                ? formatDate(discount.expires_at)
                                                : 'No expiry'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className={statusColors[discount.status] || ''}>
                                                {discount.status}
                                            </Badge>
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
                                                        <Link href={`/admin/discounts/${discount.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/discounts/${discount.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleStatus(discount)}
                                                    >
                                                        {discount.is_active ? 'Deactivate' : 'Activate'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDelete(discount)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {discounts.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                                            No discount codes found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {discounts.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <p className="text-sm text-muted-foreground">
                                Showing {discounts.from} to {discounts.to} of {discounts.total} discounts
                            </p>
                            <div className="flex gap-2">
                                {discounts.links.map((link, index) => (
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
