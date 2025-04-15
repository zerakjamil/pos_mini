import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Save, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BreadcrumbItem } from '@/types';

export default function Create() {
    const { t } = useTranslation('management/create');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard.title'), href: route('dashboard') },
        { title: t('cashiers.title'), href: route('cashiers-management.index') },
        { title: t('cashiers.create.title'), href: route('cashiers-management.create') },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cashiers-management.store'), {
            onSuccess: () => {
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <Head title={t('cashiers.create.title')} />

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">{t('cashiers.create.title')}</h2>
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
                                        <Label htmlFor="name">{t('form.name')}</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder={t('form.namePlaceholder')}
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t('form.email')}</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder={t('form.emailPlaceholder')}
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t('form.phone')}</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder={t('form.phonePlaceholder')}
                                            className={errors.phone ? 'border-red-500' : ''}
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-500">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">{t('form.password')}</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={passwordVisible ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder={t('form.passwordPlaceholder')}
                                                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                            >
                                                {passwordVisible ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-500">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">{t('form.confirmPassword')}</Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={confirmPasswordVisible ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder={t('form.confirmPasswordPlaceholder')}
                                                className={errors.password_confirmation ? 'border-red-500 pr-10' : 'pr-10'}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                            >
                                                {confirmPasswordVisible ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-start space-x-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center"
                                    >
                                        {processing ? (
                                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        {t('common.save')}
                                    </Button>
                                    <Link href={route('cashiers-management.index')}>
                                        <Button variant="outline" type="button">
                                            {t('common.cancel')}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </SettingsLayout>
        </AppLayout>
    );
}
