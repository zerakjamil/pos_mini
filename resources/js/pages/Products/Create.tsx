import React from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import ProductForm from '@/components/ProductForm/ProductForm';

interface BreadCrumb {
    title: string;
    href: string;
}

interface CategoryType {
    id: number;
    name: string;
}

const Create: React.FC = () => {
    const { t } = useTranslation();
    const { categories = [] } = usePage().props as unknown as {
        categories: CategoryType[];
    };

    const breadcrumbs: BreadCrumb[] = [
        {title: t('dashboard.title'), href: route('dashboard')},
        {title: t('products.title'), href: route('product.index')},
        {title: t('products.create.title'), href: route('product.create')},
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="create-product-page" >
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">{t('products.create.pageTitle')}</h1>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <ProductForm categories={categories} />
                </div>
            </div>
        </AppLayout>
    );
};

export default Create;
