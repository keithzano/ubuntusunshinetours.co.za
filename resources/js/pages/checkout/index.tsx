import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Calendar, Check, Clock, Lock, MapPin, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';
import { Cart, CartItem, PageProps, User } from '@/types';

interface CheckoutPageProps extends PageProps {
    cart: Cart;
    items: CartItem[];
    subtotal: number;
    user: User | null;
}

export default function CheckoutIndex({ cart, items, subtotal, user }: CheckoutPageProps) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: user?.phone || '',
        customer_country: user?.country || 'South Africa',
        special_requirements: '',
        create_account: false,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout/process');
    };

    return (
        <PublicLayout>
            <Head title="Checkout - Ubuntu Sunshine Tours" />

            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Form */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Customer Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="customer_name">Full Name *</Label>
                                            <Input
                                                id="customer_name"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                required
                                            />
                                            {errors.customer_name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="customer_email">Email Address *</Label>
                                            <Input
                                                id="customer_email"
                                                type="email"
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                required
                                            />
                                            {errors.customer_email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.customer_email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor="customer_phone">Phone Number</Label>
                                            <Input
                                                id="customer_phone"
                                                type="tel"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="customer_country">Country</Label>
                                            <Input
                                                id="customer_country"
                                                value={data.customer_country}
                                                onChange={(e) => setData('customer_country', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="special_requirements">Special Requirements</Label>
                                        <Textarea
                                            id="special_requirements"
                                            value={data.special_requirements}
                                            onChange={(e) => setData('special_requirements', e.target.value)}
                                            placeholder="Any dietary requirements, accessibility needs, or other special requests..."
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Create Account */}
                            {!user && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create Account (Optional)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <label className="flex cursor-pointer items-center gap-3">
                                            <Checkbox
                                                checked={data.create_account}
                                                onCheckedChange={(checked) =>
                                                    setData('create_account', checked as boolean)
                                                }
                                            />
                                            <span>Create an account to easily manage your bookings</span>
                                        </label>

                                        {data.create_account && (
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <Label htmlFor="password">Password</Label>
                                                    <Input
                                                        id="password"
                                                        type="password"
                                                        value={data.password}
                                                        onChange={(e) => setData('password', e.target.value)}
                                                        required={data.create_account}
                                                    />
                                                    {errors.password && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                                    <Input
                                                        id="password_confirmation"
                                                        type="password"
                                                        value={data.password_confirmation}
                                                        onChange={(e) =>
                                                            setData('password_confirmation', e.target.value)
                                                        }
                                                        required={data.create_account}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Booking Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Booking Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {items.map((item) => {
                                        const totalParticipants = item.participants.reduce(
                                            (sum, p) => sum + p.quantity,
                                            0
                                        );
                                        return (
                                            <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded">
                                                    <img
                                                        src={
                                                            item.tour?.featured_image
                                                                ? `/storage/${item.tour.featured_image}`
                                                                : '/images/placeholder-tour.jpg'
                                                        }
                                                        alt={item.tour?.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{item.tour?.title}</h3>
                                                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(item.tour_date).toLocaleDateString()}
                                                        </span>
                                                        <span>{totalParticipants} participants</span>
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium">
                                                        R {item.subtotal.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Total */}
                        <div>
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Order Total</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>R {subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Taxes & Fees</span>
                                            <span>Included</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span>R {subtotal.toLocaleString()}</span>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={processing}
                                    >
                                        {processing ? 'Processing...' : 'Pay with PayFast'}
                                    </Button>

                                    {/* Trust Signals */}
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <p className="flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            Secure SSL encrypted payment
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Your data is protected
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Check className="h-4 w-4" />
                                            Instant booking confirmation
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <img
                                            src="/images/payfast-logo.png"
                                            alt="PayFast"
                                            className="mx-auto h-8"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>

                {/* Back to Cart */}
                <div className="mt-8">
                    <Link href="/cart" className="text-primary hover:underline">
                        ← Back to cart
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
