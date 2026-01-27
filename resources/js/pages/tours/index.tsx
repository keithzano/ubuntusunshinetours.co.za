import { Head, Link, router } from '@inertiajs/react';
import {
    Check,
    ChevronDown,
    Clock,
    Filter,
    Grid,
    List,
    MapPin,
    Search,
    Star,
    X,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import PublicLayout from '@/layouts/public-layout';
import { Category, Location, PageProps, PaginatedResponse, Tour } from '@/types';

interface ToursPageProps extends PageProps {
    tours: PaginatedResponse<Tour>;
    categories: Category[];
    locations: Location[];
    filters: {
        search?: string;
        category?: string;
        location?: string;
        min_price?: string;
        max_price?: string;
        duration?: string;
        free_cancellation?: boolean;
        instant_confirmation?: boolean;
        sort?: string;
    };
}

function TourCard({ tour, view = 'grid' }: { tour: Tour; view?: 'grid' | 'list' }) {
    if (view === 'list') {
        return (
            <Link href={`/tours/${tour.slug}`}>
                <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="flex flex-col md:flex-row">
                        <div className="relative aspect-video w-full md:aspect-[4/3] md:w-72">
                            <img
                                src={tour.featured_image ? `/storage/${tour.featured_image}` : '/images/safari.jpg'}
                                alt={tour.title}
                                className="h-full w-full object-cover"
                            />
                            {tour.is_bestseller && (
                                <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
                                    Bestseller
                                </span>
                            )}
                        </div>
                        <CardContent className="flex flex-1 flex-col justify-between p-4">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{tour.location?.name}</span>
                                    <span>•</span>
                                    <span>{tour.category?.name}</span>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                                    {tour.title}
                                </h3>
                                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                    {tour.short_description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {tour.duration}
                                    </span>
                                    {tour.reviews_count > 0 && tour.rating && (
                                        <span className="flex items-center gap-1">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            {Number(tour.rating).toFixed(1)} ({tour.reviews_count} reviews)
                                        </span>
                                    )}
                                    {tour.free_cancellation && (
                                        <span className="flex items-center gap-1 text-green-600">
                                            <Check className="h-4 w-4" />
                                            Free cancellation
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t pt-4">
                                <div>
                                    <span className="text-sm text-muted-foreground">From</span>
                                    <p className="text-xl font-bold">R {tour.price.toLocaleString()}</p>
                                </div>
                                <Button>View Details</Button>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </Link>
        );
    }

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
                                {Number(tour.rating).toFixed(1)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm text-muted-foreground">From</span>
                            <p className="text-lg font-bold">R {tour.price.toLocaleString()}</p>
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

function FiltersSidebar({
    categories,
    locations,
    filters,
    onFilterChange,
}: {
    categories: Category[];
    locations: Location[];
    filters: ToursPageProps['filters'];
    onFilterChange: (key: string, value: string | boolean | null) => void;
}) {
    return (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <h3 className="mb-3 font-semibold">Category</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category.id} className="flex cursor-pointer items-center gap-2">
                            <Checkbox
                                checked={filters.category === category.slug}
                                onCheckedChange={(checked) =>
                                    onFilterChange('category', checked ? category.slug : null)
                                }
                            />
                            <span className="text-sm">{category.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Locations */}
            <div>
                <h3 className="mb-3 font-semibold">Location</h3>
                <div className="space-y-2">
                    {locations.map((location) => (
                        <label key={location.id} className="flex cursor-pointer items-center gap-2">
                            <Checkbox
                                checked={filters.location === location.slug}
                                onCheckedChange={(checked) =>
                                    onFilterChange('location', checked ? location.slug : null)
                                }
                            />
                            <span className="text-sm">{location.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Duration */}
            <div>
                <h3 className="mb-3 font-semibold">Duration</h3>
                <div className="space-y-2">
                    {[
                        { value: 'short', label: 'Up to 3 hours' },
                        { value: 'half_day', label: '3-5 hours' },
                        { value: 'full_day', label: '5-10 hours' },
                        { value: 'multi_day', label: 'Multi-day' },
                    ].map((option) => (
                        <label key={option.value} className="flex cursor-pointer items-center gap-2">
                            <Checkbox
                                checked={filters.duration?.includes(option.value)}
                                onCheckedChange={(checked) =>
                                    onFilterChange('duration', checked ? option.value : null)
                                }
                            />
                            <span className="text-sm">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div>
                <h3 className="mb-3 font-semibold">Features</h3>
                <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                            checked={!!filters.free_cancellation}
                            onCheckedChange={(checked) =>
                                onFilterChange('free_cancellation', checked ? true : null)
                            }
                        />
                        <span className="text-sm">Free cancellation</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                            checked={!!filters.instant_confirmation}
                            onCheckedChange={(checked) =>
                                onFilterChange('instant_confirmation', checked ? true : null)
                            }
                        />
                        <span className="text-sm">Instant confirmation</span>
                    </label>
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="mb-3 font-semibold">Price Range</h3>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.min_price || ''}
                        onChange={(e) => onFilterChange('min_price', e.target.value || null)}
                        className="w-24"
                    />
                    <span>-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.max_price || ''}
                        onChange={(e) => onFilterChange('max_price', e.target.value || null)}
                        className="w-24"
                    />
                </div>
            </div>
        </div>
    );
}

export default function ToursIndex({
    tours,
    categories,
    locations,
    filters,
}: ToursPageProps) {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleFilterChange = (key: string, value: string | boolean | null) => {
        const newFilters = { ...filters };
        if (value === null) {
            delete newFilters[key as keyof typeof filters];
        } else {
            (newFilters as any)[key] = value;
        }
        router.get('/tours', newFilters, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', searchQuery || null);
    };

    const handleSortChange = (sort: string) => {
        handleFilterChange('sort', sort);
    };

    const clearFilters = () => {
        router.get('/tours');
    };

    const hasActiveFilters =
        filters.category ||
        filters.location ||
        filters.duration ||
        filters.free_cancellation ||
        filters.instant_confirmation ||
        filters.min_price ||
        filters.max_price;

    return (
        <PublicLayout>
            <Head title="Tours - Ubuntu Sunshine Tours" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold">Explore Our Tours</h1>
                    <p className="text-muted-foreground">
                        Discover amazing experiences across South Africa
                    </p>
                </div>

                {/* Search & Sort Bar */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1 md:max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search tours..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="flex items-center gap-4">
                        {/* Mobile Filter Button */}
                        <Sheet>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="outline">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                    {hasActiveFilters && (
                                        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                                            Active
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6">
                                    <FiltersSidebar
                                        categories={categories}
                                        locations={locations}
                                        filters={filters}
                                        onFilterChange={handleFilterChange}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Sort Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    Sort by
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSortChange('recommended')}>
                                    Recommended
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange('price_low')}>
                                    Price: Low to High
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange('price_high')}>
                                    Price: High to Low
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange('rating')}>
                                    Highest Rated
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange('reviews')}>
                                    Most Reviewed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSortChange('newest')}>
                                    Newest
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* View Toggle */}
                        <div className="hidden items-center gap-1 rounded-md border p-1 md:flex">
                            <Button
                                variant={view === 'grid' ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setView('grid')}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={view === 'list' ? 'secondary' : 'ghost'}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setView('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-muted-foreground">Active filters:</span>
                        {filters.category && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
                                Category: {filters.category}
                                <button onClick={() => handleFilterChange('category', null)}>
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {filters.location && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
                                Location: {filters.location}
                                <button onClick={() => handleFilterChange('location', null)}>
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {filters.free_cancellation && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
                                Free cancellation
                                <button onClick={() => handleFilterChange('free_cancellation', null)}>
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Clear all
                        </Button>
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden w-64 shrink-0 md:block">
                        <FiltersSidebar
                            categories={categories}
                            locations={locations}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </aside>

                    {/* Tours Grid */}
                    <div className="flex-1">
                        <p className="mb-4 text-sm text-muted-foreground">
                            Showing {tours.from}-{tours.to} of {tours.total} tours
                        </p>

                        {tours.data.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-lg text-muted-foreground">No tours found</p>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your filters or search query
                                </p>
                                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div
                                    className={
                                        view === 'grid'
                                            ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                                            : 'space-y-4'
                                    }
                                >
                                    {tours.data.map((tour) => (
                                        <TourCard key={tour.id} tour={tour} view={view} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {tours.last_page > 1 && (
                                    <div className="mt-8 flex justify-center gap-2">
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
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
