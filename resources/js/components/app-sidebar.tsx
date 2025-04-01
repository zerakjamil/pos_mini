import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart2,
    ClipboardIcon,
    Folder,
    LayoutGrid,
    Package,
    PieChart,
    Settings,
    ShoppingCart,
    Users
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    // Get user role from the page props inside the component
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isSupervisor = user?.role === 'supervisor';

    // Define the navigation items
    const mainNavItems: ExtendedNavItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
            icon: LayoutGrid,
            active: route().current('dashboard'),
        },
        {
            title: 'Products',
            href: route('product.index'),
            icon: Package,
            active: route().current('product.index'),
        },
        {
            title: 'Sales History',
            href: route('sales.index'),
            icon: BarChart2,
            active: route().current('sales.index'),
        },
        {
            title: 'Cashier',
            href: route('cashier'),
            icon: ShoppingCart,
            active: route().current('cashier'),
        },
        {
            title: 'Debtors',
            href: route('debtors.index'),
            icon: Users,
            active: route().current('debtors.*'),
        },
        {
            title: 'Debts',
            href: route('debts.index'),
            icon: ClipboardIcon,
            active: route().current('debts.*'),
        },
    ];

    const supervisorNavItems: ExtendedNavItem[] = [
        {
            title: 'Reports',
            href: route('reports.index'),
            icon: PieChart,
            active: route().current('reports.*'),
        },
        {
            title: 'Categories',
            href: route('categories.index'),
            icon: Folder,
            active: route().current('categories.index'),
        },
    ];

    // Combine the navigation items based on user role
    const navItems = isSupervisor ? [...mainNavItems, ...supervisorNavItems] : mainNavItems;

    const footerNavItems: ExtendedNavItem[] = [
        // Your footer nav items here
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
