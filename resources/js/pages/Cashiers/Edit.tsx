import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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

export default function Edit({ cashier }: { cashier: Cashier }) {
  const { t } = useTranslation('management/edit');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('dashboard.title'), href: route('dashboard') },
    { title: t('cashiers.title'), href: route('cashiers-management.index') },
    { title: cashier.name, href: route('cashiers-management.show', cashier.id ) },
    { title: t('cashiers.edit.title'), href: route('cashiers-management.edit', cashier.id) },
  ];

  const { data, setData, put, processing, errors, reset } = useForm({
    name: cashier.name,
    email: cashier.email,
    phone: cashier.phone || '',
    status: cashier.status,
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('cashiers-management.update', cashier.id), {
      onSuccess: () => {
        reset('password', 'password_confirmation');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${t('cashiers.edit.title')} - ${cashier.name}`} />

      <SettingsLayout>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{t('cashiers.edit.title')}</h2>
          <Link href={route('cashiers-management.index')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
          </Link>
        </div>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('common.formErrors')}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {Object.entries(errors).map(([key, value]) => (
                  <li key={key}>{value}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('cashiers.form.name')}</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder={t('cashiers.form.namePlaceholder')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('cashiers.form.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder={t('cashiers.form.emailPlaceholder')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('cashiers.form.phone')}</Label>
                    <Input
                      id="phone"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      placeholder={t('cashiers.form.phonePlaceholder')}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">{t('cashiers.form.status')}</Label>
                    <Select
                      value={data.status}
                      onValueChange={(value) => setData('status', value)}
                    >
                      <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('cashiers.form.selectStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{t('cashiers.form.active')}</SelectItem>
                        <SelectItem value="inactive">{t('cashiers.form.inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-500">{errors.status}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('cashiers.form.password')}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={passwordVisible ? 'text' : 'password'}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder={t('cashiers.form.passwordPlaceholder')}
                        className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('cashiers.form.passwordHelp')}
                    </p>
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">
                      {t('cashiers.form.confirmPassword')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password_confirmation"
                        type={passwordVisible ? 'text' : 'password'}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder={t('cashiers.form.confirmPasswordPlaceholder')}
                        className={errors.password_confirmation ? 'border-red-500 pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" disabled={processing}>
                  {processing ? (
                    <span className="flex items-center gap-1">
                      <span className="animate-spin">⏳</span> {t('common.saving')}
                    </span>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t('common.save')}
                    </>
                  )}
                </Button>
                <Link href={route('cashiers-management.index')}>
                  <Button variant="outline" type="button">
                    {t('common.cancel')}
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </SettingsLayout>
    </AppLayout>
  );
}
