import { Link, usePage } from '@inertiajs/react';
import {
    Facebook,
    Instagram,
    Mail,
    Menu,
    Phone,
    ShoppingCart,
    Twitter,
    User,
    X,
} from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PageProps } from '@/types';

interface PublicLayoutProps {
    children: ReactNode;
}

interface Settings {
    contact_phone?: string;
    contact_email?: string;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { auth, flash } = usePage<PageProps>().props;
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [settings, setSettings] = useState<Settings>({});

    useEffect(() => {
        // Fetch cart count
        fetch('/cart/count')
            .then((res) => res.json())
            .then((data) => setCartCount(data.count || 0))
            .catch(console.error);
        
        // Fetch settings
        fetch('/api/settings')
            .then((res) => res.json())
            .then((data) => setSettings(data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        // Listen for cart updates
        const handleCartUpdate = (event: CustomEvent) => {
            setCartCount(event.detail.count);
        };

        window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

        // Cleanup
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
        };
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            {/* Flash Messages */}
            {flash?.success && (
                <div className="bg-green-500 px-4 py-2 text-center text-white">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="bg-red-500 px-4 py-2 text-center text-white">
                    {flash.error}
                </div>
            )}

            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <img
                                src="/images/logo.png"
                                alt="Ubuntu Sunshine Tours"
                                className="h-10 w-auto"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden items-center gap-6 md:flex">
                            <Link
                                href="/tours"
                                className="text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                Tours
                            </Link>
                            <Link
                                href="/tours?category=safari"
                                className="text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                Safaris
                            </Link>
                            <Link
                                href="/tours?category=city-tour"
                                className="text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                City Tours
                            </Link>
                            <Link
                                href="/booking/lookup"
                                className="text-sm font-medium text-gray-700 hover:text-primary"
                            >
                                Find Booking
                            </Link>
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            {/* Cart */}
                            <Link href="/cart" className="relative">
                                <Button variant="ghost" size="icon">
                                    <ShoppingCart className="h-5 w-5" />
                                </Button>
                                {cartCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {auth?.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <User className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/my/bookings">My Bookings</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/my/wishlist">Wishlist</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings/profile">Settings</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/logout" method="post" as="button" className="w-full">
                                                Logout
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="hidden gap-2 md:flex">
                                    <Link href="/login">
                                        <Button variant="ghost">Login</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button>Sign Up</Button>
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu */}
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild className="md:hidden">
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-80">
                                    <nav className="flex flex-col gap-4 pt-8">
                                        <Link
                                            href="/tours"
                                            className="text-lg font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            All Tours
                                        </Link>
                                        <Link
                                            href="/tours?category=safari"
                                            className="text-lg font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Safaris
                                        </Link>
                                        <Link
                                            href="/tours?category=city-tour"
                                            className="text-lg font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            City Tours
                                        </Link>
                                        <Link
                                            href="/booking/lookup"
                                            className="text-lg font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Find Booking
                                        </Link>
                                        <hr />
                                        {auth?.user ? (
                                            <>
                                                <Link
                                                    href="/my/bookings"
                                                    className="text-lg font-medium"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    My Bookings
                                                </Link>
                                                <Link
                                                    href="/my/wishlist"
                                                    className="text-lg font-medium"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Wishlist
                                                </Link>
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className="text-left text-lg font-medium text-red-600"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Logout
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/login"
                                                    className="text-lg font-medium"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Login
                                                </Link>
                                                <Link
                                                    href="/register"
                                                    className="text-lg font-medium"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Sign Up
                                                </Link>
                                            </>
                                        )}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid gap-8 md:grid-cols-4">
                        {/* About */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white">
                                Ubuntu Sunshine Tours
                            </h3>
                            <p className="text-sm">
                                Experience the beauty of South Africa with our expert guides.
                                15+ years of creating unforgettable memories.
                            </p>
                            <div className="mt-4 flex gap-4">
                                <a href="#" className="hover:text-white">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="hover:text-white">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" className="hover:text-white">
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/tours" className="hover:text-white">
                                        All Tours
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tours?category=safari" className="hover:text-white">
                                        Safaris
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tours?category=city-tour" className="hover:text-white">
                                        City Tours
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/booking/lookup" className="hover:text-white">
                                        Find Booking
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Destinations */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white">Destinations</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/tours?location=cape-town" className="hover:text-white">
                                        Cape Town
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tours?location=port-elizabeth" className="hover:text-white">
                                        Port Elizabeth
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tours?location=garden-route" className="hover:text-white">
                                        Garden Route
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tours?location=addo" className="hover:text-white">
                                        Addo Elephant Park
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-white">Contact Us</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <a href={`tel:${settings.contact_phone || '+27123456789'}`} className="hover:text-white">
                                        {settings.contact_phone || '+27 12 345 6789'}
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <a href={`mailto:${settings.contact_email || 'info@ubuntusunshinetours.co.za'}`} className="hover:text-white">
                                        {settings.contact_email || 'info@ubuntusunshinetours.co.za'}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
                        <p>&copy; {new Date().getFullYear()} Ubuntu Sunshine Tours. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
