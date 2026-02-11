import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleReviewsEmbedProps {
    showLeaveReviewButton?: boolean;
}

export default function GoogleReviewsEmbed({ 
    showLeaveReviewButton = true 
}: GoogleReviewsEmbedProps) {
    const placeId = 'CTMi-h2OUqLSEAE';
    const mapsUrl = `https://g.page/r/${placeId}`;
    const reviewUrl = `https://g.page/r/${placeId}/review`;

    const handleViewReviews = () => {
        window.open(mapsUrl, '_blank');
    };

    const handleLeaveReview = () => {
        window.open(reviewUrl, '_blank');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Ubuntu Sunshine Tours Reviews
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center py-8">
                    <Star className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Read Our Google Reviews</h3>
                    <p className="text-muted-foreground mb-6">
                        See what our guests are saying about Ubuntu Sunshine Tours on Google
                    </p>
                    
                    <div className="space-y-3">
                        <Button onClick={handleViewReviews} variant="outline" className="w-full">
                            <Star className="h-4 w-4 mr-2" />
                            Read All Google Reviews
                        </Button>
                        
                        {showLeaveReviewButton && (
                            <Button onClick={handleLeaveReview} className="w-full">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Leave a Google Review
                            </Button>
                        )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center mt-4">
                        Opens in a new window on Google Maps
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
