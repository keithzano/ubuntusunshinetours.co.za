import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';

export default function AdminCategoryCreate() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        console.log('Submitting category form...', formData);
        
        router.post('/admin/categories', formData, {
            onSuccess: () => {
                console.log('Category created successfully');
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
            <Head title="Create Category - Admin" />

            <div className="mb-6">
                <Link href="/admin/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Categories
                </Link>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="e.g., Safari Tours"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon</Label>
                                    <Input
                                        id="icon"
                                        name="icon"
                                        type="text"
                                        placeholder="e.g., 🦁 or binoculars"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    placeholder="Describe this category..."
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        name="sort_order"
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Category Image</Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        type="file"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

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

                            <div className="flex gap-4">
                                <Button type="submit">Create Category</Button>
                                <Link href="/admin/categories">
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
