import { Head, Link, router, useForm } from '@inertiajs/react';
import { Minus, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import MediaUpload from '@/components/media-upload';
import { Category, Location, PageProps, Tour, TourPricingTier } from '@/types';

interface EditTourProps extends PageProps {
    tour: Tour;
    categories: Category[];
    locations: Location[];
}

interface MediaFile {
    file: File;
    id: string;
    preview: string;
    type: 'image' | 'video';
}

export default function AdminToursEdit({ tour, categories, locations }: EditTourProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: tour.title || '',
        short_description: tour.short_description || '',
        description: tour.description || '',
        category_id: tour.category_id?.toString() || '',
        location_id: tour.location_id?.toString() || '',
        price: tour.price?.toString() || '',
        original_price: tour.original_price?.toString() || '',
        price_type: tour.price_type || 'per_person',
        max_group_size: tour.max_group_size?.toString() || '',
        duration: tour.duration?.toString() || '',
        duration_minutes: tour.duration_minutes?.toString() || '',
        highlights: tour.highlights || [''],
        includes: tour.includes || [''],
        excludes: tour.excludes || [''],
        what_to_bring: tour.what_to_bring || [''],
        meeting_point: tour.meeting_point || { address: '', instructions: '' },
        cancellation_policy: tour.cancellation_policy || '',
        languages: tour.languages || ['English'],
        min_participants: tour.min_participants?.toString() || '1',
        max_participants: tour.max_participants?.toString() || '',
        booking_cutoff_hours: tour.booking_cutoff_hours?.toString() || '24',
        is_active: tour.is_active ?? true,
        is_featured: tour.is_featured ?? false,
        is_bestseller: tour.is_bestseller ?? false,
        instant_confirmation: tour.instant_confirmation ?? true,
        free_cancellation: tour.free_cancellation ?? false,
        free_cancellation_hours: tour.free_cancellation_hours?.toString() || '24',
        media_files: [] as MediaFile[],
        featured_image: null as File | null,
        pricing_tiers: tour.pricing_tiers || [
            { id: 0, tour_id: tour.id, name: 'Adult', description: '', price: 0, min_age: 18, max_age: undefined, is_active: true, sort_order: 1 },
            { id: 0, tour_id: tour.id, name: 'Child', description: '', price: 0, min_age: 3, max_age: 17, is_active: true, sort_order: 2 },
        ] as TourPricingTier[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Add all form fields
        Object.keys(data).forEach(key => {
            if (key === 'featured_image') {
                // Handle featured image
                if (data.featured_image) {
                    formData.append('featured_image', data.featured_image);
                }
            } else if (key === 'media_files') {
                // Handle files separately
                data.media_files.forEach((file: MediaFile, index: number) => {
                    formData.append(`media_files[${index}]`, file.file);
                });
            } else if (key === 'pricing_tiers') {
                // Handle pricing tiers
                data.pricing_tiers.forEach((tier: TourPricingTier, index: number) => {
                    Object.keys(tier).forEach(tierKey => {
                        formData.append(`pricing_tiers[${index}][${tierKey}]`, String(tier[tierKey as keyof TourPricingTier]));
                    });
                });
            } else if (Array.isArray(data[key as keyof typeof data])) {
                // Handle arrays
                (data[key as keyof typeof data] as string[]).forEach((item: string, index: number) => {
                    formData.append(`${key}[${index}]`, item);
                });
            } else if (typeof data[key as keyof typeof data] === 'object' && data[key as keyof typeof data] !== null) {
                // Handle objects
                Object.keys(data[key as keyof typeof data] as any).forEach(objKey => {
                    formData.append(`${key}[${objKey}]`, String((data[key as keyof typeof data] as any)[objKey]));
                });
            } else {
                // Handle simple values
                formData.append(key, String(data[key as keyof typeof data]));
            }
        });
        
        // Add method override for PUT
        formData.append('_method', 'PUT');
        
        router.post(`/admin/tours/${tour.id}`, formData);
    };

    const addArrayItem = (field: 'highlights' | 'includes' | 'excludes' | 'what_to_bring') => {
        setData(field, [...data[field], '']);
    };

    const removeArrayItem = (field: 'highlights' | 'includes' | 'excludes' | 'what_to_bring', index: number) => {
        const newArray = [...data[field]];
        newArray.splice(index, 1);
        setData(field, newArray);
    };

    const updateArrayItem = (field: 'highlights' | 'includes' | 'excludes' | 'what_to_bring', index: number, value: string) => {
        const newArray = [...data[field]];
        newArray[index] = value;
        setData(field, newArray);
    };

    const addPricingTier = () => {
        setData('pricing_tiers', [
            ...data.pricing_tiers,
            { id: 0, tour_id: tour.id, name: '', description: '', price: 0, min_age: undefined, max_age: undefined, is_active: true, sort_order: data.pricing_tiers.length + 1 },
        ]);
    };

    const removePricingTier = (index: number) => {
        const newTiers = [...data.pricing_tiers];
        newTiers.splice(index, 1);
        setData('pricing_tiers', newTiers);
    };

    const updatePricingTier = (index: number, field: keyof TourPricingTier, value: any) => {
        const newTiers = [...data.pricing_tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setData('pricing_tiers', newTiers);
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${tour.title} - Admin`} />

            <div className="mb-6">
                <h1 className="text-3xl font-bold">Edit Tour</h1>
                <p className="text-muted-foreground">Update tour information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="title">Tour Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                            </div>
                            <div>
                                <Label htmlFor="category_id">Category *</Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="location_id">Location *</Label>
                                <Select
                                    value={data.location_id}
                                    onValueChange={(value) => setData('location_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem key={location.id} value={location.id.toString()}>
                                                {location.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="duration">Duration *</Label>
                                <Input
                                    id="duration"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
                                    placeholder="e.g., 2 hours, Half day, Full day"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="short_description">Short Description *</Label>
                            <Textarea
                                id="short_description"
                                value={data.short_description}
                                onChange={(e) => setData('short_description', e.target.value)}
                                rows={2}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Full Description *</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={6}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="price">Price (ZAR) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="original_price">Original Price (ZAR)</Label>
                                <Input
                                    id="original_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.original_price}
                                    onChange={(e) => setData('original_price', e.target.value)}
                                    placeholder="For showing discount"
                                />
                            </div>
                            <div>
                                <Label htmlFor="price_type">Price Type</Label>
                                <Select
                                    value={data.price_type}
                                    onValueChange={(value) => setData('price_type', value as 'per_person' | 'per_group')}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="per_person">Per Person</SelectItem>
                                        <SelectItem value="per_group">Per Group</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="min_participants">Min Participants</Label>
                                <Input
                                    id="min_participants"
                                    type="number"
                                    min="1"
                                    value={data.min_participants}
                                    onChange={(e) => setData('min_participants', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="max_participants">Max Participants</Label>
                                <Input
                                    id="max_participants"
                                    type="number"
                                    min="1"
                                    value={data.max_participants}
                                    onChange={(e) => setData('max_participants', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Pricing Tiers</Label>
                            <div className="mt-2 space-y-2">
                                {data.pricing_tiers.map((tier, index) => (
                                    <div key={index} className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Tier name"
                                                value={tier.name}
                                                onChange={(e) => updatePricingTier(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Price"
                                                value={tier.price}
                                                onChange={(e) => updatePricingTier(index, 'price', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removePricingTier(index)}
                                            disabled={data.pricing_tiers.length <= 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addPricingTier}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Tier
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Media */}
                <Card>
                    <CardHeader>
                        <CardTitle>Media</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Featured Image */}
                        <div>
                            <Label>Featured Image</Label>
                            <div className="mt-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('featured_image', e.target.files?.[0] || null)}
                                />
                                <p className="mt-1 text-sm text-muted-foreground">
                                    This image will be displayed as the main tour image
                                </p>
                                {tour.featured_image && !data.featured_image && (
                                    <div className="mt-2">
                                        <img
                                            src={`/storage/${tour.featured_image}`}
                                            alt="Current featured image"
                                            className="h-32 w-32 object-cover rounded"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">Current featured image</p>
                                    </div>
                                )}
                                {data.featured_image && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(data.featured_image)}
                                            alt="New featured image preview"
                                            className="h-32 w-32 object-cover rounded"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">New featured image</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gallery */}
                        <div>
                            <Label>Gallery Images</Label>
                            <p className="text-sm text-muted-foreground mb-2">
                                Additional images for the tour gallery (up to 10 images)
                            </p>
                            <MediaUpload
                                value={data.media_files}
                                onChange={(files) => setData('media_files', files)}
                                maxFiles={10}
                                accept="image/*"
                            />
                            {tour.gallery && tour.gallery.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium mb-2">Current Gallery Images:</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {tour.gallery.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={`/storage/${image}`}
                                                    alt={`Gallery image ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this image?')) {
                                                            router.delete(`/admin/tours/${tour.id}/gallery/${encodeURIComponent(image)}`, {
                                                                onSuccess: () => {
                                                                    // Refresh the page to show updated gallery
                                                                    window.location.reload();
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Delete image"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <label className="flex cursor-pointer items-center gap-2">
                                <Checkbox
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                />
                                <span>Active</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2">
                                <Checkbox
                                    checked={data.is_featured}
                                    onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                                />
                                <span>Featured</span>
                            </label>
                            <label className="flex cursor-pointer items-center gap-2">
                                <Checkbox
                                    checked={data.instant_confirmation}
                                    onCheckedChange={(checked) => setData('instant_confirmation', checked as boolean)}
                                />
                                <span>Instant Confirmation</span>
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Saving...' : 'Update Tour'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.get('/admin/tours')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
