import { Link } from '@inertiajs/react';
import { Globe, LayoutGrid, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';

import AppLogo from './app-logo';

interface NavItem {
    title: string;
    href: string;
    icon: any;
}

interface Settings {
    contact_phone?: string;
    contact_email?: string;
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [settings, setSettings] = useState<Settings>({});

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(console.error);
    }, []);

    const footerNavItems: NavItem[] = [
        {
            title: 'Website',
            href: 'https://ubuntusunshinetours.co.za',
            icon: Globe,
        },
        {
            title: 'Contact Us',
            href: `mailto:${settings.contact_email || 'info@ubuntusunshinetours.co.za'}`,
            icon: Mail,
        },
        {
            title: 'Call Us',
            href: `tel:${settings.contact_phone || '+27123456789'}`,
            icon: Phone,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
