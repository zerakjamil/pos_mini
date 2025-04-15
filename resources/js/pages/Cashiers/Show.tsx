import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit } from 'lucide-react';

interface Cashier {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: 'active' | 'inactive';
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export default function Show({ cashier }: { cashier: Cashier }) {
  const { t } = useTranslation('management/show');

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('dashboard.title'), href: route('dashboard') },
    { title: t('cashiers.title'), href: route('cashiers-management.index') },
    { title: cashier.name, href: route('cashiers-management.show', cashier.id) },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${t('cashiers.show.title')} - ${cashier.name}`} />

      <SettingsLayout>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{t('cashiers.show.title')}</h2>
          <div className="flex items-center gap-2">
            <Link href={route('cashiers-management.index')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('cashiers.actions.back')}
              </Button>
            </Link>
            <Link href={route('cashiers-management.edit', cashier.id)}>
              <Button size="sm">
                <Edit className="mr-2 h-4 w-4" />
                {t('cashiers.actions.edit')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('cashiers.show.personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t('cashiers.form.name')}
                  </dt>
                  <dd className="text-base">{cashier.name}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t('cashiers.form.email')}
                  </dt>
                  <dd className="text-base">{cashier.email}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t('cashiers.form.phone')}
                  </dt>
                  <dd className="text-base">{cashier.phone || '-'}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t('cashiers.list.status')}
                  </dt>
                  <dd className="text-base">
                    <Badge variant={cashier.status === 'active' ? 'success' : 'destructive'}>
                      {cashier.status === 'active' ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('cashiers.show.accountInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t('cashiers.show.createdAt')}
                  </dt>
                  <dd className="text-base">
                    {new Date(cashier.created_at).toLocaleString()}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t('cashiers.show.updatedAt')}
                  </dt>
                  <dd className="text-base">
                    {new Date(cashier.updated_at).toLocaleString()}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t('cashiers.show.userRole')}
                  </dt>
                  <dd className="text-base">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {cashier.user.role}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
