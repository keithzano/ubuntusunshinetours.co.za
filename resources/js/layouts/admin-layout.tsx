import { Link, router, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    Cog,
    FileText,
    Home,
    LayoutDashboard,
    LogOut,
    MapPin,
    MessageSquare,
    Percent,
    Tag,
    Users,
} from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { PageProps } from '@/types';

interface AdminLayoutProps {
    children: ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Tours', href: '/admin/tours', icon: FileText },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Locations', href: '/admin/locations', icon: MapPin },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Discounts', href: '/admin/discounts', icon: Percent },
    { name: 'Settings', href: '/admin/settings', icon: Cog },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { auth } = usePage<PageProps>().props;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white">
                <div className="flex h-16 items-center justify-center border-b border-gray-800">
                    <Link href="/admin" className="text-xl font-bold">
                        Admin Panel
                    </Link>
                </div>

                <nav className="mt-6 space-y-1 px-3">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-4">
                    <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm font-bold">
                            {auth.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium">{auth.user?.name}</p>
                            <p className="text-xs text-gray-400">Administrator</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/" className="flex-1">
                            <Button variant="outline" size="sm" className="w-full text-gray-900">
                                <Home className="mr-1 h-4 w-4" />
                                Site
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => router.post('/logout')}
                        >
                            <LogOut className="mr-1 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">{children}</main>
        </div>
    );
}
