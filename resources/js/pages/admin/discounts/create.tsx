import { Head, router, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

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
import { PageProps } from '@/types';

export default function AdminDiscountsCreate({ auth }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        description: '',
        type: 'percentage',
        value: '',
        min_order_amount: '',
        max_discount: '',
        max_uses: '',
        per_user_limit: '',
        valid_from: '',
        expires_at: '',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/discounts');
    };

    return (
        <AdminLayout>
            <Head title="Add Discount - Admin" />

            <div className="mb-6">
                <h1 className="text-3xl font-bold">Add Discount Code</h1>
                <p className="text-muted-foreground">Create a new discount code</p>
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
                                <Label htmlFor="code">Discount Code *</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    placeholder="SUMMER2025"
                                    required
                                />
                                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                            </div>
                            <div>
                                <Label htmlFor="type">Type *</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) => setData('type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={2}
                                placeholder="Summer sale discount for all tours"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="value">
                                    {data.type === 'percentage' ? 'Percentage (%)' : 'Amount (ZAR)'} *
                                </Label>
                                <Input
                                    id="value"
                                    type="number"
                                    step={data.type === 'percentage' ? '1' : '0.01'}
                                    min={data.type === 'percentage' ? '1' : '0'}
                                    max={data.type === 'percentage' ? '100' : ''}
                                    value={data.value}
                                    onChange={(e) => setData('value', e.target.value)}
                                    placeholder={data.type === 'percentage' ? '10' : '100'}
                                    required
                                />
                                {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                            </div>
                            <div>
                                <Label htmlFor="min_order_amount">Minimum Order Amount (ZAR)</Label>
                                <Input
                                    id="min_order_amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.min_order_amount}
                                    onChange={(e) => setData('min_order_amount', e.target.value)}
                                    placeholder="500"
                                />
                            </div>
                            <div>
                                <Label htmlFor="max_discount">Maximum Discount (ZAR)</Label>
                                <Input
                                    id="max_discount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.max_discount}
                                    onChange={(e) => setData('max_discount', e.target.value)}
                                    placeholder="1000"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Usage Limits */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usage Limits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="max_uses">Maximum Uses</Label>
                                <Input
                                    id="max_uses"
                                    type="number"
                                    min="1"
                                    value={data.max_uses}
                                    onChange={(e) => setData('max_uses', e.target.value)}
                                    placeholder="100"
                                />
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Leave empty for unlimited uses
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="per_user_limit">Per User Limit</Label>
                                <Input
                                    id="per_user_limit"
                                    type="number"
                                    min="1"
                                    value={data.per_user_limit}
                                    onChange={(e) => setData('per_user_limit', e.target.value)}
                                    placeholder="1"
                                />
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Maximum times each user can use this code
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Validity Period */}
                <Card>
                    <CardHeader>
                        <CardTitle>Validity Period</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="valid_from">Valid From</Label>
                                <Input
                                    id="valid_from"
                                    type="datetime-local"
                                    value={data.valid_from}
                                    onChange={(e) => setData('valid_from', e.target.value)}
                                />
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Leave empty to start immediately
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="expires_at">Expires At</Label>
                                <Input
                                    id="expires_at"
                                    type="datetime-local"
                                    value={data.expires_at}
                                    onChange={(e) => setData('expires_at', e.target.value)}
                                />
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Leave empty for no expiry
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <label className="flex cursor-pointer items-center gap-2">
                            <Checkbox
                                checked={data.is_active}
                                onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                            />
                            <span>Active</span>
                        </label>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" disabled={processing}>
                        <Save className="mr-2 h-4 w-4" />
                        {processing ? 'Saving...' : 'Create Discount'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.get('/admin/discounts')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
