import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MessageSquare, MoreHorizontal, Search, Star, Trash2 } from 'lucide-react';
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
import { PageProps, PaginatedResponse, Review } from '@/types';

interface ReviewsIndexProps extends PageProps {
    reviews: PaginatedResponse<Review>;
    filters?: {
        search?: string;
        rating?: string;
        status?: string;
    };
}

export default function AdminReviewsIndex({ reviews, filters }: ReviewsIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/reviews', { ...filters, search }, { preserveState: true });
    };

    const handleFilter = (key: string, value: string | null) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key as keyof typeof filters];
        router.get('/admin/reviews', newFilters, { preserveState: true });
    };

    const handleApprove = (review: Review) => {
        router.post(`/admin/reviews/${review.id}/approve`);
    };

    const handleReject = (review: Review) => {
        router.post(`/admin/reviews/${review.id}/reject`);
    };

    const handleDelete = (review: Review) => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(`/admin/reviews/${review.id}`);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating 
                                ? 'fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500' 
                                : 'text-gray-300 dark:text-gray-600'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
        <AdminLayout>
            <Head title="Reviews - Admin" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Reviews</h1>
                    <p className="text-muted-foreground">Manage customer reviews</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search reviews..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="flex gap-2">
                            <Select
                                value={filters?.rating || 'all'}
                                onValueChange={(value) => handleFilter('rating', value === 'all' ? null : value)}
                            >
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Ratings</SelectItem>
                                    <SelectItem value="5">5 Stars</SelectItem>
                                    <SelectItem value="4">4 Stars</SelectItem>
                                    <SelectItem value="3">3 Stars</SelectItem>
                                    <SelectItem value="2">2 Stars</SelectItem>
                                    <SelectItem value="1">1 Star</SelectItem>
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
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reviews Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Review</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Tour</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Rating</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {reviews.data.map((review) => (
                                    <tr key={review.id} className="hover:bg-muted/50">
                                        <td className="px-4 py-3">
                                            <div className="max-w-xs">
                                                <p className="line-clamp-2">{review.comment}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{review.customer_name}</p>
                                                <p className="text-sm text-muted-foreground">{review.customer_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{review.tour?.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {review.tour?.location?.name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{renderStars(review.rating)}</td>
                                        <td className="px-4 py-3">
                                            {new Date(review.created_at).toLocaleDateString('en-ZA', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className={statusColors[review.status] || ''}>
                                                {review.status}
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
                                                        <Link href={`/tours/${review.tour?.slug}#reviews`} target="_blank">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View on Tour
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {review.status === 'pending' && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => handleApprove(review)}
                                                                className="text-green-600"
                                                            >
                                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleReject(review)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Reject
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {review.status === 'approved' && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleReject(review)}
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDelete(review)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {reviews.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                            No reviews found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {reviews.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3">
                            <p className="text-sm text-muted-foreground">
                                Showing {reviews.from} to {reviews.to} of {reviews.total} reviews
                            </p>
                            <div className="flex gap-2">
                                {reviews.links.map((link, index) => (
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
