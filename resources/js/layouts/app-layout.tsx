import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <ToastProvider>
            {children}
            <Toaster />
        </ToastProvider>
    </AppLayoutTemplate>
);
