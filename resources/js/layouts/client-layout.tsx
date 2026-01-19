import { Link, usePage } from '@inertiajs/react';
import { Calendar, Heart, LogOut, Settings, User } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { PageProps } from '@/types';

interface ClientLayoutProps {
    children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const { auth } = usePage<PageProps>().props;

    const navigation = [
        { name: 'My Bookings', href: '/my/bookings', icon: Calendar },
        { name: 'Wishlist', href: '/my/wishlist', icon: Heart },
        { name: 'Settings', href: '/settings/profile', icon: Settings },
    ];

    return (
        <PublicLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* User Info */}
                            <div className="rounded-lg border bg-white p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                                        {auth.user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{auth.user?.name}</p>
                                        <p className="text-sm text-muted-foreground">{auth.user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </Link>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">{children}</main>
                </div>
            </div>
        </PublicLayout>
    );
}
