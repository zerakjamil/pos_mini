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
    ShoppingCart,
    Users,
    Wallet,
    ArrowLeftRight
} from 'lucide-react';
import AppLogo from './app-logo';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwither';
import { useRtl } from '@/contexts/RtlContext';

export function AppSidebar() {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const isSupervisor = user?.role === 'supervisor';
    const {isRtl} = useRtl();

    const mainNavItems: ExtendedNavItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: t('sidebar.products'),
            href: '/products',
            icon: Package,
        },
        {
            title: t('sidebar.salesHistory'),
            href: '/sales',
            icon: BarChart2,
        },
        {
            title: t('sidebar.cashier'),
            href: '/cashier',
            icon: ShoppingCart,
        },
        {
            title: t('sidebar.debtors'),
            href: '/debtors',
            icon: Users,
        },
        {
            title: t('sidebar.debts'),
            href: '/debts',
            icon: ClipboardIcon,
        },

    ];

    const supervisorNavItems: ExtendedNavItem[] = [
        {
            title: t('sidebar.reports'),
            href: '/reports',
            icon: PieChart,
        },
        {
            title: t('sidebar.categories'),
            href: '/categories',
            icon: Folder,
        },
        {
            title: t('sidebar.safeAccounts'),
            href: '/safe-accounts',
            icon: Wallet,
        },
        {
            title: t('sidebar.safeTransactions'),
            href: '/safe-transactions',
            icon: ArrowLeftRight,
        },
    ];

    const navItems = isSupervisor ? [...mainNavItems, ...supervisorNavItems] : mainNavItems;

    const footerNavItems: ExtendedNavItem[] = [
        // Your footer nav items here
    ];

    return (
        <Sidebar collapsible="icon" variant="inset" side={isRtl ? 'right' : 'left'} className="h-screen">
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
                <LanguageSwitcher />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
