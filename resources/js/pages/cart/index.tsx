import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/public-layout';
import { Cart, CartItem, PageProps } from '@/types';

interface CartPageProps extends PageProps {
    cart: Cart;
    items: CartItem[];
    total: number;
}

function CartItemCard({
    item,
    onRemove,
}: {
    item: CartItem;
    onRemove: (id: number) => void;
}) {
    const totalParticipants = item.participants.reduce((sum, p) => sum + p.quantity, 0);

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    {/* Tour Image */}
                    <div className="aspect-video w-full overflow-hidden rounded-lg md:aspect-square md:w-32">
                        <img
                            src={
                                item.tour?.featured_image
                                    ? `/storage/${item.tour.featured_image}`
                                    : '/images/safari.jpg'
                            }
                            alt={item.tour?.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Tour Details */}
                    <div className="flex flex-1 flex-col justify-between">
                        <div>
                            <Link
                                href={`/tours/${item.tour?.slug}`}
                                className="text-lg font-semibold hover:text-primary"
                            >
                                {item.tour?.title}
                            </Link>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {item.tour?.location?.name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {item.tour?.duration}
                                </span>
                            </div>
                        </div>

                        {/* Date & Participants */}
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1 rounded bg-gray-100 px-3 py-1 text-sm">
                                <Calendar className="h-4 w-4" />
                                {new Date(item.tour_date).toLocaleDateString('en-ZA', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Participant Breakdown */}
                        <div className="mt-2 text-sm text-muted-foreground">
                            {item.participants.map((p, idx) => (
                                <span key={idx}>
                                    {p.quantity}x {p.name} (R{p.price.toLocaleString()})
                                    {idx < item.participants.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end">
                        <p className="text-xl font-bold">R {item.subtotal.toLocaleString()}</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => onRemove(item.id)}
                        >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Remove
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CartIndex({ cart, items, total }: CartPageProps) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleRemove = (itemId: number) => {
        setIsRemoving(true);
        router.delete(`/cart/${itemId}`, {
            onFinish: () => setIsRemoving(false),
            onSuccess: () => {
                // Update cart count globally
                fetch('/cart/count')
                    .then((res) => res.json())
                    .then((data) => {
                        // Dispatch custom event to update cart count in layout
                        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: data.count } }));
                    })
                    .catch(() => {});
            }
        });
    };

    const handleClearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            router.delete('/cart', {
                onSuccess: () => {
                    // Update cart count globally
                    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: 0 } }));
                }
            });
        }
    };

    if (items.length === 0) {
        return (
            <PublicLayout>
                <Head title="Cart - Ubuntu Sunshine Tours" />
                <div className="container mx-auto px-4 py-16 text-center">
                    <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                    <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
                    <p className="mb-6 text-muted-foreground">
                        Browse our amazing tours and add some to your cart!
                    </p>
                    <Link href="/tours">
                        <Button size="lg">Browse Tours</Button>
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Cart - Ubuntu Sunshine Tours" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Your Cart</h1>
                    <Button variant="ghost" onClick={handleClearCart}>
                        Clear Cart
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="space-y-4 lg:col-span-2">
                        {items.map((item) => (
                            <CartItemCard key={item.id} item={item} onRemove={handleRemove} />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="line-clamp-1">{item.tour?.title}</span>
                                            <span>R {item.subtotal.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>R {total.toLocaleString()}</span>
                                </div>

                                <Link href="/checkout" className="block">
                                    <Button className="w-full" size="lg">
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <p className="text-center text-sm text-muted-foreground">
                                    Secure checkout powered by PayFast
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-8 text-center">
                    <Link href="/tours" className="text-primary hover:underline">
                        ← Continue browsing tours
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
