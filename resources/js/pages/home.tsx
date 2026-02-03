import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    ChevronRight,
    Clock,
    MapPin,
    Shield,
    Star,
    Users,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import GoogleReviewsEmbed from '@/components/GoogleReviewsEmbed';
import PartnerSlider from '@/components/PartnerSlider';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import PublicLayout from '@/layouts/public-layout';
import { Category, Location, PageProps, Tour } from '@/types';

interface HomePageProps extends PageProps {
    featuredTours: Tour[];
    bestsellerTours: Tour[];
    categories: Category[];
    locations: Location[];
    recentTours: Tour[];
}

function TourCard({ tour }: { tour: Tour }) {
    return (
        <Link href={`/tours/${tour.slug}`}>
            <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={tour.featured_image ? `/storage/${tour.featured_image}` : '/images/safari.jpg'}
                        alt={tour.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {tour.is_bestseller && (
                        <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
                            Bestseller
                        </span>
                    )}
                    {tour.discount_percentage && (
                        <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">
                            -{tour.discount_percentage}%
                        </span>
                    )}
                </div>
                <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{tour.location?.name}</span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 font-semibold leading-tight group-hover:text-primary">
                        {tour.title}
                    </h3>
                    <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {tour.duration}
                        </span>
                        {tour.reviews_count > 0 && tour.rating && (
                            <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                {Number(tour.rating).toFixed(1)} ({tour.reviews_count})
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm text-muted-foreground">From</span>
                            <p className="text-lg font-bold">
                                R {tour.price.toLocaleString()}
                            </p>
                        </div>
                        {tour.free_cancellation && (
                            <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                                Free cancellation
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function CategoryCard({ category }: { category: Category }) {
    return (
        <Link href={`/tours?category=${category.slug}`}>
            <div className="group relative aspect-[3/2] overflow-hidden rounded-xl">
                <img
                    src={category.image ? `/storage/${category.image}` : '/images/tour-1.jpg'}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.active_tours_count || 0} tours</p>
                </div>
            </div>
        </Link>
    );
}

function LocationCard({ location }: { location: Location }) {
    return (
        <Link href={`/tours?location=${location.slug}`}>
            <div className="group relative aspect-square overflow-hidden rounded-xl">
                <img
                    src={location.image ? `/storage/${location.image}` : '/images/cape-town.jpg'}
                    alt={location.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">{location.name}</h3>
                    <p className="text-sm opacity-90">{location.active_tours_count || 0} tours</p>
                </div>
            </div>
        </Link>
    );
}

export default function Home({
    featuredTours,
    bestsellerTours,
    categories,
    locations,
    recentTours,
}: HomePageProps) {
    return (
        <PublicLayout>
            <Head title="Home - Ubuntu Sunshine Tours" />

            {/* Hero Section */}
            <section className="relative flex min-h-[600px] items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/hero.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
                <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
                    <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                        Discover South Africa's Magic
                    </h1>
                    <p className="mb-8 text-lg opacity-90 md:text-xl">
                        Experience unforgettable guided tours in Cape Town, Port Elizabeth, and beyond.
                        Let us show you the beauty of South Africa!
                    </p>

                    {/* Search Bar */}
                    <div className="mx-auto max-w-2xl">
                        <div className="flex gap-2 rounded-lg bg-white p-2 shadow-lg">
                            <SearchAutocomplete 
                                placeholder="Search tours, destinations, activities..."
                                className="flex-1"
                            />
                            <Button 
                                size="lg" 
                                className="bg-[#00AEF1] hover:bg-[#0095D1]"
                                onClick={() => {
                                    const input = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                                    if (input?.value.trim()) {
                                        window.location.href = `/tours?search=${encodeURIComponent(input.value)}`;
                                    }
                                }}
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="border-b bg-white py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-[#00AEF1]/10 p-3">
                                <Shield className="h-6 w-6 text-[#00AEF1]" />
                            </div>
                            <div>
                                <p className="font-semibold">Secure Booking</p>
                                <p className="text-sm text-muted-foreground">Safe & secure payments</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-[#00AEF1]/10 p-3">
                                <Users className="h-6 w-6 text-[#00AEF1]" />
                            </div>
                            <div>
                                <p className="font-semibold">15+ Years Experience</p>
                                <p className="text-sm text-muted-foreground">Expert local guides</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-[#00AEF1]/10 p-3">
                                <Calendar className="h-6 w-6 text-[#00AEF1]" />
                            </div>
                            <div>
                                <p className="font-semibold">Free Cancellation</p>
                                <p className="text-sm text-muted-foreground">On selected tours</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-[#00AEF1]/10 p-3">
                                <Star className="h-6 w-6 text-[#00AEF1]" />
                            </div>
                            <div>
                                <p className="font-semibold">Top Rated</p>
                                <p className="text-sm text-muted-foreground">5-star reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Tours */}
            {featuredTours.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold">Featured Tours</h2>
                                <p className="text-muted-foreground">Handpicked experiences for you</p>
                            </div>
                            <Link href="/tours?featured=true">
                                <Button variant="outline">
                                    View All <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredTours.map((tour) => (
                                <TourCard key={tour.id} tour={tour} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold">Explore by Category</h2>
                            <p className="text-muted-foreground">Find the perfect adventure for you</p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {categories.slice(0, 4).map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bestsellers */}
            {bestsellerTours.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold">Bestselling Tours</h2>
                                <p className="text-muted-foreground">Most popular with travelers</p>
                            </div>
                            <Link href="/tours?bestseller=true">
                                <Button variant="outline">
                                    View All <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {bestsellerTours.map((tour) => (
                                <TourCard key={tour.id} tour={tour} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Destinations */}
            {locations.length > 0 && (
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold">Popular Destinations</h2>
                            <p className="text-muted-foreground">Explore South Africa's most beautiful places</p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {locations.slice(0, 4).map((location) => (
                                <LocationCard key={location.id} location={location} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Google Reviews Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold">What Our Guests Say</h2>
                        <p className="text-muted-foreground">Real reviews from happy travelers</p>
                    </div>
                    <div className="mx-auto max-w-4xl">
                        <GoogleReviewsEmbed showLeaveReviewButton={true} />
                    </div>
                </div>
            </section>

            {/* Partner Slider */}
            <PartnerSlider />

            {/* CTA Section */}
            <section className="bg-[#00AEF1] py-16 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-4 text-3xl font-bold">Ready for an Adventure?</h2>
                    <p className="mx-auto mb-8 max-w-2xl opacity-90">
                        Book your tour today and experience the beauty of South Africa with our expert guides.
                        Free cancellation available on selected tours.
                    </p>
                    <Link href="/tours">
                        <Button size="lg" variant="secondary">
                            Browse All Tours
                        </Button>
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
