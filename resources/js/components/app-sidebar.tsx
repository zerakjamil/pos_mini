import { NavMain } from '@/components/nav-main';
import { Link } from '@inertiajs/react';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import AppLogo from './app-logo';
import { NavFooter } from '@/components/nav-footer';
import { type NavItem } from '@/types';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import CashierSystem from '@/pages/CashierSystem';

// Extend the NavItem type to include the active property
type ExtendedNavItem = NavItem & {
    active?: boolean;
};

// Export the navigation items so they can be imported elsewhere
export const mainNavItems: ExtendedNavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },{
        title: 'Products',
        href: route('products.index'),
        icon: LayoutGrid,
    },
    {
        title: 'Cashier',
        href: route('cashier'),
        icon: LayoutGrid,
        active: route().current('cashier'),
    }
];

export const footerNavItems: ExtendedNavItem[] = [
    // Your footer nav items here
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
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
