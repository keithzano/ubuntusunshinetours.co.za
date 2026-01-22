import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Star, Filter } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GoogleReviews from '@/components/GoogleReviews';
import PublicLayout from '@/layouts/public-layout';
import { PageProps, Review, Tour } from '@/types';

interface TourReviewsProps extends PageProps {
    tour: Tour;
    reviews: {
        data: Review[];
        links: any[];
    };
}

export default function TourReviews({ tour, reviews }: TourReviewsProps) {
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const averageRating = reviews.data.length > 0 
        ? (reviews.data.reduce((sum, review) => sum + review.rating, 0) / reviews.data.length).toFixed(1)
        : '0.0';

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.data.filter(review => review.rating === rating).length,
        percentage: reviews.data.length > 0 
            ? (reviews.data.filter(review => review.rating === rating).length / reviews.data.length) * 100
            : 0
    }));

    return (
        <PublicLayout>
            <Head title={`Reviews for ${tour.title} - Ubuntu Sunshine Tours`} />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link href={`/tours/${tour.slug}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {tour.title}
                    </Link>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tour Info */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="aspect-video w-32 overflow-hidden rounded-lg">
                                        <img
                                            src={
                                                tour.featured_image
                                                    ? `/storage/${tour.featured_image}`
                                                    : '/images/safari.jpg'
                                            }
                                            alt={tour.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">{tour.title}</h1>
                                        <p className="text-muted-foreground">{tour.short_description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {renderStars(Math.round(parseFloat(averageRating)))}
                                            <span className="text-lg font-semibold">{averageRating}</span>
                                            <span className="text-muted-foreground">
                                                ({reviews.data.length} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rating Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Rating Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {ratingDistribution.map(({ rating, count, percentage }) => (
                                        <div key={rating} className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 w-16">
                                                <span className="text-sm font-medium">{rating}</span>
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-yellow-400 h-2 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-muted-foreground w-12 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews List */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>
                                        Customer Reviews ({reviews.data.length})
                                    </CardTitle>
                                    <Select defaultValue="newest">
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">Newest First</SelectItem>
                                            <SelectItem value="oldest">Oldest First</SelectItem>
                                            <SelectItem value="highest">Highest Rating</SelectItem>
                                            <SelectItem value="lowest">Lowest Rating</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {reviews.data.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <p className="text-muted-foreground">No reviews yet</p>
                                        <p className="text-sm text-muted-foreground">
                                            Be the first to share your experience!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {reviews.data.map((review) => (
                                            <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-semibold">{review.reviewer_name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {renderStars(review.rating)}
                                                        {review.is_verified && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {review.title && (
                                                    <h4 className="font-medium mb-2">{review.title}</h4>
                                                )}

                                                <p className="text-gray-700 mb-3">{review.comment}</p>

                                                {/* Photos */}
                                                {review.photos && review.photos.length > 0 && (
                                                    <div className="flex gap-2 mb-3">
                                                        {review.photos.map((photo, index) => (
                                                            <img
                                                                key={index}
                                                                src={`/storage/${photo}`}
                                                                alt={`Review photo ${index + 1}`}
                                                                className="h-20 w-20 object-cover rounded cursor-pointer hover:opacity-80"
                                                                onClick={() => window.open(`/storage/${photo}`, '_blank')}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>Booking: {review.booking?.booking_reference}</span>
                                                    <span>Tour Date: {new Date(review.booking?.tour_date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {reviews.links && reviews.links.length > 3 && (
                                    <div className="flex justify-center mt-6">
                                        <div className="flex gap-2">
                                            {reviews.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-2 rounded ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Google Reviews */}
                        <GoogleReviews showLeaveReviewButton={true} maxReviews={2} />

                        {/* Leave Review CTA */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Share Your Experience</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Have you been on this tour? Your feedback helps other travelers make informed decisions.
                                </p>
                                <div className="space-y-2">
                                    <Button className="w-full" asChild>
                                        <Link href={`/tours/${tour.slug}`}>
                                            Book This Tour
                                        </Link>
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center">
                                        After your tour, you'll receive an invitation to leave a review
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Total Reviews</span>
                                        <span className="font-medium">{reviews.data.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Average Rating</span>
                                        <span className="font-medium">{averageRating} / 5</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">5 Star Reviews</span>
                                        <span className="font-medium">
                                            {reviews.data.filter(r => r.rating === 5).length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Verified Reviews</span>
                                        <span className="font-medium">
                                            {reviews.data.filter(r => r.is_verified).length}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
