import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { Location, PageProps } from '@/types';

interface LocationEditProps extends PageProps {
    location: Location;
}

export default function AdminLocationEdit({ location }: LocationEditProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        router.put(`/admin/locations/${location.id}`, formData, {
            onSuccess: () => {
                // Success message will be shown via flash message
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${location.name} - Admin`} />

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
                            <CardTitle>Edit Location: {location.name}</CardTitle>
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
                                    defaultValue={location.name}
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
                                        defaultValue={location.city || ''}
                                        placeholder="e.g., Cape Town"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="region">Region/Province</Label>
                                    <Input
                                        id="region"
                                        name="region"
                                        type="text"
                                        defaultValue={location.region || ''}
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
                                    defaultValue={location.country}
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
                                        defaultValue={location.latitude || ''}
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
                                        defaultValue={location.longitude || ''}
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
                                    Optional: Upload a new image to replace the current one (max 2MB)
                                </p>
                                {location.image && (
                                    <p className="text-xs text-muted-foreground">
                                        Current image: {location.image}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        defaultChecked={location.is_active}
                                        className="h-4 w-4 rounded border-gray-300 text-[#00AEF1] focus:ring-[#00AEF1]"
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        name="is_featured"
                                        defaultChecked={location.is_featured}
                                        className="h-4 w-4 rounded border-gray-300 text-[#00AEF1] focus:ring-[#00AEF1]"
                                    />
                                    <Label htmlFor="is_featured">Featured</Label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit">Update Location</Button>
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
