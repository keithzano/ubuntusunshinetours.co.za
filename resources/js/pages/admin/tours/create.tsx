import { Head, router, useForm } from '@inertiajs/react';
import { Minus, Plus, Save, Trash2 } from 'lucide-react';

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
import { Category, Location, PageProps } from '@/types';

interface CreateTourProps extends PageProps {
    categories: Category[];
    locations: Location[];
}

interface PricingTier {
    name: string;
    description: string;
    price: number;
    min_age: number | null;
    max_age: number | null;
    is_active: boolean;
}

interface MediaFile {
    file: File;
    id: string;
    preview: string;
    type: 'image' | 'video';
}

export default function AdminToursCreate({ categories, locations }: CreateTourProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        short_description: '',
        description: '',
        category_id: '',
        location_id: '',
        price: '',
        original_price: '',
        price_type: 'per_person',
        max_group_size: '',
        duration: '',
        duration_minutes: '',
        highlights: [''],
        includes: [''],
        excludes: [''],
        what_to_bring: [''],
        meeting_point: { address: '', instructions: '' },
        cancellation_policy: '',
        languages: ['English'],
        min_participants: '1',
        max_participants: '',
        booking_cutoff_hours: '24',
        is_active: true,
        is_featured: false,
        is_bestseller: false,
        instant_confirmation: true,
        free_cancellation: false,
        free_cancellation_hours: '24',
        media_files: [] as MediaFile[],
        featured_image: null as File | null,
        pricing_tiers: [
            { name: 'Adult', description: '', price: 0, min_age: 18, max_age: null, is_active: true },
            { name: 'Child', description: '', price: 0, min_age: 3, max_age: 17, is_active: true },
        ] as PricingTier[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Submitting tour form...', data);
        
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
                data.pricing_tiers.forEach((tier: PricingTier, index: number) => {
                    Object.keys(tier).forEach(tierKey => {
                        formData.append(`pricing_tiers[${index}][${tierKey}]`, String(tier[tierKey as keyof PricingTier]));
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
        
        router.post('/admin/tours', formData, {
            onSuccess: () => {
                console.log('Tour created successfully');
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
            preserveState: true,
        });
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
            { name: '', description: '', price: 0, min_age: null, max_age: null, is_active: true },
        ]);
    };

    const removePricingTier = (index: number) => {
        const newTiers = [...data.pricing_tiers];
        newTiers.splice(index, 1);
        setData('pricing_tiers', newTiers);
    };

    const updatePricingTier = (index: number, field: keyof PricingTier, value: any) => {
        const newTiers = [...data.pricing_tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setData('pricing_tiers', newTiers);
    };

    return (
        <AdminLayout>
            <Head title="Add Tour - Admin" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold">Add New Tour</h1>
                <p className="text-muted-foreground">Create a new tour listing</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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

                        <div className="grid gap-4 md:grid-cols-2">
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
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
                                        {locations.map((loc) => (
                                            <SelectItem key={loc.id} value={String(loc.id)}>
                                                {loc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="duration">Duration *</Label>
                                <Input
                                    id="duration"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
                                    placeholder="e.g., 4 hours, Full day"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                                <Input
                                    id="duration_minutes"
                                    type="number"
                                    value={data.duration_minutes}
                                    onChange={(e) => setData('duration_minutes', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="max_group_size">Max Group Size</Label>
                                <Input
                                    id="max_group_size"
                                    type="number"
                                    value={data.max_group_size}
                                    onChange={(e) => setData('max_group_size', e.target.value)}
                                />
                            </div>
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
                                <Label htmlFor="price">Base Price (ZAR) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="original_price">Original Price (for discounts)</Label>
                                <Input
                                    id="original_price"
                                    type="number"
                                    step="0.01"
                                    value={data.original_price}
                                    onChange={(e) => setData('original_price', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="price_type">Price Type</Label>
                                <Select
                                    value={data.price_type}
                                    onValueChange={(value) => setData('price_type', value)}
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

                        {/* Pricing Tiers */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <Label>Pricing Tiers</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addPricingTier}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add Tier
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {data.pricing_tiers.map((tier, index) => (
                                    <div key={index} className="flex items-end gap-3 rounded-lg border p-3">
                                        <div className="flex-1">
                                            <Label>Name</Label>
                                            <Input
                                                value={tier.name}
                                                onChange={(e) => updatePricingTier(index, 'name', e.target.value)}
                                                placeholder="e.g., Adult, Child"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <Label>Price</Label>
                                            <Input
                                                type="number"
                                                value={tier.price}
                                                onChange={(e) => updatePricingTier(index, 'price', parseFloat(e.target.value))}
                                            />
                                        </div>
                                        <div className="w-20">
                                            <Label>Min Age</Label>
                                            <Input
                                                type="number"
                                                value={tier.min_age || ''}
                                                onChange={(e) => updatePricingTier(index, 'min_age', e.target.value ? parseInt(e.target.value) : null)}
                                            />
                                        </div>
                                        <div className="w-20">
                                            <Label>Max Age</Label>
                                            <Input
                                                type="number"
                                                value={tier.max_age || ''}
                                                onChange={(e) => updatePricingTier(index, 'max_age', e.target.value ? parseInt(e.target.value) : null)}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePricingTier(index)}
                                            disabled={data.pricing_tiers.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Highlights */}
                <Card>
                    <CardHeader>
                        <CardTitle>Highlights & Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Highlights */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <Label>Tour Highlights</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('highlights')}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {data.highlights.map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                                            placeholder="Enter highlight"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeArrayItem('highlights', index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What's Included */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <Label>What's Included</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('includes')}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {data.includes.map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => updateArrayItem('includes', index, e.target.value)}
                                            placeholder="e.g., Hotel pickup"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeArrayItem('includes', index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What's Not Included */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <Label>What's Not Included</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('excludes')}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {data.excludes.map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => updateArrayItem('excludes', index, e.target.value)}
                                            placeholder="e.g., Meals"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeArrayItem('excludes', index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Meeting Point & Policy */}
                <Card>
                    <CardHeader>
                        <CardTitle>Meeting Point & Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Meeting Point Address</Label>
                            <Input
                                value={data.meeting_point.address}
                                onChange={(e) => setData('meeting_point', { ...data.meeting_point, address: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Meeting Instructions</Label>
                            <Textarea
                                value={data.meeting_point.instructions}
                                onChange={(e) => setData('meeting_point', { ...data.meeting_point, instructions: e.target.value })}
                                rows={2}
                            />
                        </div>
                        <div>
                            <Label>Cancellation Policy</Label>
                            <Textarea
                                value={data.cancellation_policy}
                                onChange={(e) => setData('cancellation_policy', e.target.value)}
                                rows={3}
                            />
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
                                {data.featured_image && (
                                    <div className="mt-2">
                                        <img
                                            src={URL.createObjectURL(data.featured_image)}
                                            alt="Featured image preview"
                                            className="h-32 w-32 object-cover rounded"
                                        />
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
                            <div>
                                <Label>Min Participants</Label>
                                <Input
                                    type="number"
                                    value={data.min_participants}
                                    onChange={(e) => setData('min_participants', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Max Participants</Label>
                                <Input
                                    type="number"
                                    value={data.max_participants}
                                    onChange={(e) => setData('max_participants', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Booking Cutoff (hours)</Label>
                                <Input
                                    type="number"
                                    value={data.booking_cutoff_hours}
                                    onChange={(e) => setData('booking_cutoff_hours', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                            <label className="flex cursor-pointer items-center gap-2">
                                <Checkbox
                                    checked={data.free_cancellation}
                                    onCheckedChange={(checked) => setData('free_cancellation', checked as boolean)}
                                />
                                <span>Free Cancellation</span>
                            </label>
                        </div>

                        {data.free_cancellation && (
                            <div className="w-48">
                                <Label>Free cancellation before (hours)</Label>
                                <Input
                                    type="number"
                                    value={data.free_cancellation_hours}
                                    onChange={(e) => setData('free_cancellation_hours', e.target.value)}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Saving...' : 'Create Tour'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.get('/admin/tours')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
