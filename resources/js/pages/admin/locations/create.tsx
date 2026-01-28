import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

export default function AdminLocationCreate() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        console.log('Submitting location form...', formData);
        
        router.post('/admin/locations', formData, {
            onSuccess: () => {
                console.log('Location created successfully');
                // Success message will be shown via flash message
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
            },
            preserveState: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Location - Admin" />

            <div className="mb-6">
                <Link href="/admin/locations" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Locations
                </Link>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="e.g., Cape Town Waterfront"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        type="text"
                                        placeholder="e.g., Cape Town"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="region">Region/Province</Label>
                                    <Input
                                        id="region"
                                        name="region"
                                        type="text"
                                        placeholder="e.g., Western Cape"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    type="text"
                                    required
                                    placeholder="e.g., South Africa"
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="latitude">Latitude</Label>
                                    <Input
                                        id="latitude"
                                        name="latitude"
                                        type="number"
                                        step="any"
                                        min="-90"
                                        max="90"
                                        placeholder="e.g., -33.9249"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="longitude">Longitude</Label>
                                    <Input
                                        id="longitude"
                                        name="longitude"
                                        type="number"
                                        step="any"
                                        min="-180"
                                        max="180"
                                        placeholder="e.g., 18.4241"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Location Image</Label>
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optional: Upload an image for this location (max 2MB)
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        defaultChecked
                                        className="h-4 w-4 rounded border-gray-300 text-[#00AEF1] focus:ring-[#00AEF1]"
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        name="is_featured"
                                        className="h-4 w-4 rounded border-gray-300 text-[#00AEF1] focus:ring-[#00AEF1]"
                                    />
                                    <Label htmlFor="is_featured">Featured</Label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit">Create Location</Button>
                                <Link href="/admin/locations">
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
        </AdminLayout>
    );
}
