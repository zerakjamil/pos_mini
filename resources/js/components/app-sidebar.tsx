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
import { useTranslation } from 'react-i18next';

export function AppSidebar() {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isSupervisor = user?.role === 'supervisor';

    const mainNavItems: ExtendedNavItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: route('dashboard'),
            icon: LayoutGrid,
            active: route().current('dashboard'),
        },
        {
            title: t('sidebar.products'),
            href: route('product.index'),
            icon: Package,
            active: route().current('product.index'),
        },
        {
            title: t('sidebar.salesHistory'),
            href: route('sales.index'),
            icon: BarChart2,
            active: route().current('sales.index'),
        },
        {
            title: t('sidebar.cashier'),
            href: route('cashier'),
            icon: ShoppingCart,
            active: route().current('cashier'),
        },
        {
            title: t('sidebar.debtors'),
            href: route('debtors.index'),
            icon: Users,
            active: route().current('debtors.*'),
        },
        {
            title: t('sidebar.debts'),
            href: route('debts.index'),
            icon: ClipboardIcon,
            active: route().current('debts.*'),
        },
    ];

    const supervisorNavItems: ExtendedNavItem[] = [
        {
            title: t('sidebar.reports'),
            href: route('reports.index'),
            icon: PieChart,
            active: route().current('reports.*'),
        },
        {
            title: t('sidebar.categories'),
            href: route('categories.index'),
            icon: Folder,
            active: route().current('categories.index'),
        },
    ];

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
