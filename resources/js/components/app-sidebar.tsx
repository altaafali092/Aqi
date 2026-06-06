import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Home, LayoutGrid, WashingMachine } from 'lucide-react';

import AppLogo from '@/components/app-logo';
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

import type { NavItem } from '@/types';
import { dashboard } from '@/routes/admin';
import { index as WardIndex } from '@/routes/admin/wards';
import { index as MuncipleIndex } from '@/routes/admin/municipal-wastes';

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Wards',
            href: WardIndex().url,
            icon: Home,
        },
        ...(role === 'admin'
            ? [
                {
                    title: 'Municipal Wastes',
                    href: MuncipleIndex().url,
                    icon: WashingMachine,
                },
            ]
            : []),
    ];

    const footerNavItems: NavItem[] = [
        // {
        //     title: 'Documentation',
        //     href: 'https://laravel.com/docs/starter-kits#react',
        //     icon: BookOpen,
        // },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
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