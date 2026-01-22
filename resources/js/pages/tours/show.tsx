import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Facebook,
    Globe,
    Heart,
    Info,
    Mail,
    MapPin,
    Minus,
    Plus,
    Share2,
    ShoppingCart,
    Star,
    Twitter,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import GoogleReviews from '@/components/GoogleReviews';
import PublicLayout from '@/layouts/public-layout';
import { PageProps, Tour, TourPricingTier } from '@/types';

interface TourShowProps extends PageProps {
    tour: Tour;
    relatedTours: Tour[];
}

interface ParticipantSelection {
    tier_id: number;
    name: string;
    quantity: number;
    price: number;
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    if (images.length === 0) {
        return (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-200">
                <img
                    src="/images/safari.jpg"
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-2">
                <div
                    className="aspect-video cursor-pointer overflow-hidden rounded-xl"
                    onClick={() => setIsOpen(true)}
                >
                    <img
                        src={`/storage/${images[currentIndex]}`}
                        alt={title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                </div>
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                className={`shrink-0 overflow-hidden rounded-lg ${
                                    index === currentIndex ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <img
                                    src={`/storage/${image}`}
                                    alt={`${title} ${index + 1}`}
                                    className="h-20 w-20 object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl">
                    <div className="relative">
                        <img
                            src={`/storage/${images[currentIndex]}`}
                            alt={title}
                            className="w-full rounded-lg"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                    onClick={() =>
                                        setCurrentIndex((prev) =>
                                            prev === 0 ? images.length - 1 : prev - 1
                                        )
                                    }
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                    onClick={() =>
                                        setCurrentIndex((prev) =>
                                            prev === images.length - 1 ? 0 : prev + 1
                                        )
                                    }
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

function ShareDialog({ tour }: { tour: Tour }) {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Check out this tour: ${tour.title}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share this tour</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex gap-4">
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
                        >
                            <Facebook className="h-5 w-5" />
                            Facebook
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-500 p-3 text-white hover:bg-sky-600"
                        >
                            <Twitter className="h-5 w-5" />
                            Twitter
                        </a>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 p-3 text-white hover:bg-green-600"
                        >
                            <Globe className="h-5 w-5" />
                            WhatsApp
                        </a>
                    </div>
                    <div className="flex gap-2">
                        <Input value={url} readOnly />
                        <Button onClick={copyToClipboard}>Copy</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function BookingCard({
    tour,
    pricingTiers,
}: {
    tour: Tour;
    pricingTiers: TourPricingTier[];
}) {
    const [selectedDate, setSelectedDate] = useState('');
    const [participants, setParticipants] = useState<ParticipantSelection[]>(
        pricingTiers.map((tier) => ({
            tier_id: tier.id,
            name: tier.name,
            quantity: tier.name === 'Adult' ? 1 : 0,
            price: tier.price,
        }))
    );

    const updateParticipant = (tierId: number, delta: number) => {
        setParticipants((prev) =>
            prev.map((p) =>
                p.tier_id === tierId
                    ? { ...p, quantity: Math.max(0, p.quantity + delta) }
                    : p
            )
        );
    };

    const totalParticipants = participants.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = participants.reduce((sum, p) => sum + p.quantity * p.price, 0);

    const handleAddToCart = () => {
        if (!selectedDate) {
            alert('Please select a date');
            return;
        }
        if (totalParticipants === 0) {
            alert('Please select at least one participant');
            return;
        }

        router.post('/cart/add', {
            tour_id: tour.id,
            tour_date: selectedDate,
            participants: participants.filter((p) => p.quantity > 0) as any,
        }, {
            onSuccess: () => {
                // Update cart count globally
                fetch('/cart/count')
                    .then((res) => res.json())
                    .then((data) => {
                        // Dispatch custom event to update cart count in layout
                        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: data.count } }));
                    })
                    .catch(() => {});
            },
            onError: (errors) => {
                console.error('Failed to add to cart:', errors);
                alert('Failed to add to cart. Please try again.');
            }
        });
    };

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <div className="flex items-baseline justify-between">
                    <div>
                        <span className="text-sm text-muted-foreground">From</span>
                        <p className="text-3xl font-bold">R {tour.price.toLocaleString()}</p>
                        {tour.original_price && (
                            <p className="text-sm text-muted-foreground line-through">
                                R {tour.original_price.toLocaleString()}
                            </p>
                        )}
                    </div>
                    <span className="text-sm text-muted-foreground">per person</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Date Selection */}
                <div>
                    <Label htmlFor="date">Select Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={minDate.toISOString().split('T')[0]}
                    />
                </div>

                {/* Participant Selection */}
                <div>
                    <Label>Participants</Label>
                    <div className="mt-2 space-y-3">
                        {pricingTiers.map((tier) => {
                            const participant = participants.find((p) => p.tier_id === tier.id);
                            return (
                                <div key={tier.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{tier.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            R {tier.price.toLocaleString()}
                                            {tier.min_age && tier.max_age && (
                                                <span> (Age {tier.min_age}-{tier.max_age})</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateParticipant(tier.id, -1)}
                                            disabled={!participant || participant.quantity === 0}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center">
                                            {participant?.quantity || 0}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateParticipant(tier.id, 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>R {totalPrice.toLocaleString()}</span>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full" size="lg" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </Button>

                {/* Features */}
                <div className="space-y-2 text-sm">
                    {tour.instant_confirmation && (
                        <p className="flex items-center gap-2 text-green-600">
                            <Check className="h-4 w-4" />
                            Instant confirmation
                        </p>
                    )}
                    {tour.free_cancellation && (
                        <p className="flex items-center gap-2 text-green-600">
                            <Check className="h-4 w-4" />
                            Free cancellation up to {tour.free_cancellation_hours || 24}h before
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function ReviewCard({ review }: { review: any }) {
    return (
        <div className="border-b pb-4">
            <div className="mb-2 flex items-center justify-between">
                <div>
                    <p className="font-medium">{review.reviewer_name}</p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-4 w-4 ${
                                star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
            {review.title && <p className="mb-1 font-medium">{review.title}</p>}
            <p className="text-sm text-muted-foreground">{review.comment}</p>
        </div>
    );
}

export default function TourShow({ tour, relatedTours }: TourShowProps) {
    const allImages = tour.featured_image
        ? [tour.featured_image, ...(tour.gallery || [])]
        : tour.gallery || [];

    const defaultPricingTiers: TourPricingTier[] =
        tour.pricing_tiers && tour.pricing_tiers.length > 0
            ? tour.pricing_tiers
            : [
                  {
                      id: 0,
                      tour_id: tour.id,
                      name: 'Adult',
                      price: tour.price,
                      is_active: true,
                      sort_order: 0,
                  },
              ];

    return (
        <PublicLayout>
            <Head title={`${tour.title} - Ubuntu Sunshine Tours`} />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary">
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/tours" className="hover:text-primary">
                        Tours
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground">{tour.title}</span>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <ImageGallery images={allImages} title={tour.title} />

                        {/* Title & Quick Info */}
                        <div className="mt-6">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold">{tour.title}</h1>
                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {tour.location?.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {tour.duration}
                                        </span>
                                        {tour.reviews_count > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                {tour.rating.toFixed(1)} ({tour.reviews_count} reviews)
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <ShareDialog tour={tour} />
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="mb-6 flex flex-wrap gap-2">
                                {tour.is_bestseller && (
                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                                        Bestseller
                                    </span>
                                )}
                                {tour.free_cancellation && (
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                        Free cancellation
                                    </span>
                                )}
                                {tour.instant_confirmation && (
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                        Instant confirmation
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>About this tour</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: tour.description }}
                                />
                            </CardContent>
                        </Card>

                        {/* Highlights */}
                        {tour.highlights && tour.highlights.length > 0 && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Highlights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-2 md:grid-cols-2">
                                        {tour.highlights.map((highlight, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Check className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* What's Included / Excluded */}
                        <div className="mb-6 grid gap-6 md:grid-cols-2">
                            {tour.includes && tour.includes.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-green-600">What's included</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {tour.includes.map((item, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <Check className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                            {tour.excludes && tour.excludes.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-red-600">What's not included</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {tour.excludes.map((item, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <X className="mt-1 h-4 w-4 shrink-0 text-red-600" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* What to Bring */}
                        {tour.what_to_bring && tour.what_to_bring.length > 0 && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>What to bring</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-2 md:grid-cols-2">
                                        {tour.what_to_bring.map((item, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <Info className="mt-1 h-4 w-4 shrink-0 text-blue-600" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Meeting Point */}
                        {tour.meeting_point && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Meeting Point</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                                        <div>
                                            <p className="font-medium">{tour.meeting_point.address}</p>
                                            {tour.meeting_point.instructions && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {tour.meeting_point.instructions}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Cancellation Policy */}
                        {tour.cancellation_policy && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Cancellation Policy</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{tour.cancellation_policy}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Reviews */}
                        {tour.approved_reviews && tour.approved_reviews.length > 0 && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Reviews</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                            <span className="text-lg font-bold">
                                                {tour.rating.toFixed(1)}
                                            </span>
                                            <span className="text-muted-foreground">
                                                ({tour.reviews_count} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {tour.approved_reviews.map((review) => (
                                            <ReviewCard key={review.id} review={review} />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <BookingCard tour={tour} pricingTiers={defaultPricingTiers} />
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Guest Reviews</h2>
                        <Button variant="outline" asChild>
                            <Link href={`/tours/${tour.id}/reviews`}>
                                View All Reviews
                            </Link>
                        </Button>
                    </div>
                    
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Tour Reviews Summary */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>What Our Guests Say</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <Star className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">Excellent Experience</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Join hundreds of satisfied travelers who have experienced the best of South Africa with us.
                                        </p>
                                        <div className="flex justify-center gap-4 mb-6">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">4.8</div>
                                                <div className="text-sm text-muted-foreground">Average Rating</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">500+</div>
                                                <div className="text-sm text-muted-foreground">Total Reviews</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold">98%</div>
                                                <div className="text-sm text-muted-foreground">Would Recommend</div>
                                            </div>
                                        </div>
                                        <Button asChild>
                                            <Link href={`/tours/${tour.id}/reviews`}>
                                                Read All Reviews
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Google Reviews Widget */}
                        <div>
                            <GoogleReviews showLeaveReviewButton={true} maxReviews={2} />
                        </div>
                    </div>
                </section>

                {/* Related Tours */}
                {relatedTours.length > 0 && (
                    <section className="mt-12">
                        <h2 className="mb-6 text-2xl font-bold">You might also like</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedTours.map((relatedTour) => (
                                <Link key={relatedTour.id} href={`/tours/${relatedTour.slug}`}>
                                    <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                                        <div className="relative aspect-[4/3] overflow-hidden">
                                            <img
                                                src={
                                                    relatedTour.featured_image
                                                        ? `/storage/${relatedTour.featured_image}`
                                                        : '/images/safari.jpg'
                                                }
                                                alt={relatedTour.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="mb-2 line-clamp-2 font-semibold group-hover:text-primary">
                                                {relatedTour.title}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold">
                                                    R {relatedTour.price.toLocaleString()}
                                                </span>
                                                {relatedTour.rating > 0 && (
                                                    <span className="flex items-center gap-1 text-sm">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        {relatedTour.rating.toFixed(1)}
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </PublicLayout>
    );
}
