import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, Star, Loader2 } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Tour {
    id: number;
    title: string;
    slug: string;
    price: number;
    location: string;
    category: string;
    image: string;
    duration: string;
    rating: number;
    reviews_count: number;
}

interface SearchAutocompleteProps {
    placeholder?: string;
    className?: string;
}

export default function SearchAutocomplete({ 
    placeholder = "Search tours, destinations, activities...", 
    className = "" 
}: SearchAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            searchTours(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const searchTours = async (searchQuery: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/search/autocomplete?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setResults(data);
            setIsOpen(true);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            window.location.href = `/tours?search=${encodeURIComponent(query)}`;
        }
    };

    const handleResultClick = () => {
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div ref={searchRef} className={`relative w-full ${className}`}>
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder}
                        className="w-full border-0 pl-10 pr-10 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-0 bg-transparent"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setIsOpen(true)}
                    />
                    {loading && (
                        <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 animate-spin" />
                    )}
                </div>
            </form>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto rounded-lg bg-white shadow-lg border">
                    {results.length > 0 ? (
                        <div className="py-2">
                            {results.map((tour) => (
                                <Link
                                    key={tour.id}
                                    href={`/tours/${tour.slug}`}
                                    onClick={handleResultClick}
                                    className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={tour.image}
                                            alt={tour.title}
                                            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">
                                                {tour.title}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {tour.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {tour.duration}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">
                                                        R {tour.price.toLocaleString()}
                                                    </span>
                                                    {tour.category && (
                                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                            {tour.category}
                                                        </span>
                                                    )}
                                                </div>
                                                {tour.rating && (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                        <span>{Number(tour.rating).toFixed(1)}</span>
                                                        <span className="text-gray-500">({tour.reviews_count})</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                            <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No tours found</p>
                            <p className="text-xs mt-1">Try different keywords</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
