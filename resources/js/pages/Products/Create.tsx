import React from 'react';
import { usePage } from '@inertiajs/react';
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
    const { categories = [] } = usePage().props as unknown as {
        categories: CategoryType[];
    };

    const breadcrumbs: BreadCrumb[] = [
        {title: 'Dashboard', href: route('dashboard')},
        {title: 'Products', href: route('product.index')},
        {title: 'Create Product', href: route('product.create')},
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="create-product-page">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Create New Product</h1>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <ProductForm categories={categories} />
                </div>
            </div>
        </AppLayout>
    );
};

export default Create;
