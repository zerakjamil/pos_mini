import React from 'react';
import { Link } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LayoutGrid, ShoppingCart, Package } from 'lucide-react';
import { AppContent } from '@/components/app-content';
import { mainNavItems, footerNavItems } from '@/components/app-sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">POS System</h2>
          </div>

          <nav className="p-2">
            <ul className="space-y-1">
              {mainNavItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${item.active ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    {item.icon && <item.icon size={20} />}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-0 w-64 p-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <div>
                <p className="font-medium">User Name</p>
                <p className="text-xs text-gray-500">user@example.com</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">
          <AppContent>
            {children}
          </AppContent>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
