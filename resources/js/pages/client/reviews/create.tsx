import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Star, Upload } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { Booking, PageProps } from '@/types';

interface ReviewCreateProps extends PageProps {
    booking: Booking;
}

export default function ReviewCreate({ booking }: ReviewCreateProps) {
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [photos, setPhotos] = useState<File[]>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        
        // Add photos to form data
        photos.forEach((photo, index) => {
            formData.append(`photos[${index}]`, photo);
        });
        
        router.post(`/my/bookings/${booking.id}/review`, formData, {
            onSuccess: () => {
                // Success message will be shown via flash message
            },
            onError: (errors) => {
                console.error('Review submission errors:', errors);
            }
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setPhotos(prev => [...prev, ...files].slice(0, 5)); // Limit to 5 photos
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <PublicLayout>
            <Head title={`Review ${booking.tour?.title} - Ubuntu Sunshine Tours`} />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link href="/my/bookings" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to My Bookings
                    </Link>
                </div>

                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Review Your Experience</CardTitle>
                            <p className="text-muted-foreground">
                                Share your feedback about {booking.tour?.title}
                            </p>
                        </CardHeader>
                        <CardContent>
                            {/* Tour Summary */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="aspect-video w-24 overflow-hidden rounded-lg">
                                        <img
                                            src={
                                                booking.tour?.featured_image
                                                    ? `/storage/${booking.tour.featured_image}`
                                                    : '/images/safari.jpg'
                                            }
                                            alt={booking.tour?.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{booking.tour?.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(booking.tour_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm font-medium">
                                            Booking Reference: {booking.booking_reference}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Rating */}
                                <div>
                                    <Label className="text-base font-medium">Overall Rating *</Label>
                                    <div className="flex gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className="p-1"
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                                onClick={() => setRating(star)}
                                            >
                                                <Star
                                                    className={`h-8 w-8 ${
                                                        star <= (hoveredStar || rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <input type="hidden" name="rating" value={rating} required />
                                    {rating === 0 && (
                                        <p className="text-sm text-red-500 mt-1">Please select a rating</p>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <Label htmlFor="title">Review Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        type="text"
                                        placeholder="Summarize your experience"
                                        maxLength={255}
                                    />
                                </div>

                                {/* Comment */}
                                <div>
                                    <Label htmlFor="comment">Your Review *</Label>
                                    <Textarea
                                        id="comment"
                                        name="comment"
                                        rows={5}
                                        placeholder="Tell us about your experience with this tour..."
                                        required
                                        minLength={10}
                                        maxLength={2000}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Minimum 10 characters, maximum 2000 characters
                                    </p>
                                </div>

                                {/* Photos */}
                                <div>
                                    <Label htmlFor="photos">Photos (Optional)</Label>
                                    <div className="mt-2">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                            <div className="text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="mt-2">
                                                    <label htmlFor="photos" className="cursor-pointer">
                                                        <span className="mt-2 block text-sm font-medium text-gray-900">
                                                            Click to upload photos
                                                        </span>
                                                        <input
                                                            id="photos"
                                                            name="photos"
                                                            type="file"
                                                            className="sr-only"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={handlePhotoChange}
                                                        />
                                                    </label>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        PNG, JPG up to 2MB each (max 5 photos)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Photo Preview */}
                                        {photos.length > 0 && (
                                            <div className="mt-4 grid grid-cols-3 gap-2">
                                                {photos.map((photo, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={URL.createObjectURL(photo)}
                                                            alt={`Preview ${index + 1}`}
                                                            className="h-20 w-full object-cover rounded"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhoto(index)}
                                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={rating === 0}>
                                        Submit Review
                                    </Button>
                                    <Link href={`/my/bookings/${booking.id}`}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}
