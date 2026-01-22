import { useState, useEffect } from 'react';
import { Star, ExternalLink, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GoogleReview {
    author_name: string;
    rating: number;
    relative_time_description: string;
    text: string;
    profile_photo_url?: string;
}

interface GoogleReviewsResponse {
    rating: number;
    total_reviews: number;
    reviews: GoogleReview[];
    review_url: string;
}

interface GoogleReviewsProps {
    showLeaveReviewButton?: boolean;
    maxReviews?: number;
}

export default function GoogleReviews({ 
    showLeaveReviewButton = true, 
    maxReviews = 3 
}: GoogleReviewsProps) {
    const [reviewsData, setReviewsData] = useState<GoogleReviewsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/google-reviews');
                if (!response.ok) {
                    throw new Error('Failed to fetch reviews');
                }
                const data = await response.json();
                setReviewsData(data);
            } catch (err) {
                console.error('Error fetching Google Reviews:', err);
                setError('Unable to load reviews at this time');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

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

    const handleLeaveReview = () => {
        if (reviewsData?.review_url) {
            window.open(reviewsData.review_url, '_blank');
        }
    };

    const handleViewAllReviews = () => {
        if (reviewsData?.review_url) {
            window.open(reviewsData.review_url, '_blank');
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" />
                        Google Reviews
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(maxReviews)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                                    </div>
                                </div>
                                <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
                                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !reviewsData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" />
                        Google Reviews
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-muted-foreground mb-4">
                            {error || 'Reviews temporarily unavailable'}
                        </p>
                        {showLeaveReviewButton && (
                            <Button onClick={handleLeaveReview}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Leave a Google Review
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const displayReviews = reviewsData.reviews.slice(0, maxReviews);
    const averageRating = reviewsData.rating;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" />
                        Google Reviews
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">{averageRating}</span>
                        <div className="flex flex-col">
                            {renderStars(Math.round(averageRating))}
                            <span className="text-xs text-muted-foreground">
                                {reviewsData.total_reviews} reviews
                            </span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {displayReviews.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-muted-foreground">No reviews yet</p>
                        {showLeaveReviewButton && (
                            <Button onClick={handleLeaveReview} className="mt-4">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Be the first to review!
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {displayReviews.map((review, index) => (
                            <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                                <div className="flex items-start gap-3">
                                    {review.profile_photo_url && (
                                        <img
                                            src={review.profile_photo_url}
                                            alt={review.author_name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-medium">{review.author_name}</h4>
                                            <span className="text-xs text-muted-foreground">
                                                {review.relative_time_description}
                                            </span>
                                        </div>
                                        {renderStars(review.rating)}
                                        <p className="text-sm text-gray-700 mt-2">{review.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {reviewsData.total_reviews > maxReviews && (
                            <Button variant="outline" onClick={handleViewAllReviews} className="w-full">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View all {reviewsData.total_reviews} reviews on Google
                            </Button>
                        )}

                        {showLeaveReviewButton && (
                            <div className="pt-4 border-t">
                                <Button onClick={handleLeaveReview} className="w-full">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Leave a Google Review
                                </Button>
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                    Share your experience on Google to help others
                                </p>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
