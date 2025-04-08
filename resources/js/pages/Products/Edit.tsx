import React from 'react';
    import { usePage } from '@inertiajs/react';
    import { useTranslation } from 'react-i18next';
    import AppLayout from '@/layouts/app-layout';
    import ProductForm from '@/components/ProductForm/ProductForm';
    import dayjs from 'dayjs';

    interface BreadCrumb {
        title: string;
        href: string;
    }

    interface CategoryType {
        id: number;
        name: string;
    }

    interface ProductType {
        id: number;
        name: string;
        barcode?: string;
        brand?: string;
        category_id: number;
        batch_price: number;
        units_per_batch: number;
        price: number;
        stock: number;
        reorder_level?: number;
        expiration_date?: string;
        image_url?: string;
    }

    interface ProductData {
        id?: number;
        name: string;
        barcode: string;
        brand: string;
        category_id: number | undefined;
        batch_price: number;
        units_per_batch: number;
        price: number;
        stock: number;
        reorder_level: number;
        // Use proper type for DatePicker in Ant Design
        expiration_date: any; // Will be changed to dayjs object
        image: any; // Keep any for now since it can be File or null
        image_url?: string;
    }

    const Edit: React.FC = () => {
        const { t } = useTranslation();
        const { categories = [], product } = usePage().props as unknown as {
            categories: CategoryType[];
            product: ProductType;
        };

        const breadcrumbs: BreadCrumb[] = [
            {title: t('dashboard.title'), href: route('dashboard')},
            {title: t('products.title'), href: route('product.index')},
            {title: t('products.edit.title'), href: route('product.edit', { id: product?.id })}
        ];

        // Ensure we have valid product data before rendering ProductForm
        if (!product || !product.id) {
            return (
                <AppLayout breadcrumbs={breadcrumbs}>
                    <div className="edit-product-page">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">{t('products.edit.pageTitle')}</h1>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div>Loading product data...</div>
                        </div>
                    </div>
                </AppLayout>
            );
        }

        // Transform the product data to match what ProductForm expects
        const formattedProduct: ProductData = {
            id: product.id,
            name: product.name || '',
            barcode: product.barcode || '',
            brand: product.brand || '',
            category_id: product.category_id,
            batch_price: product.batch_price,
            units_per_batch: product.units_per_batch,
            price: product.price,
            stock: product.stock,
            reorder_level: product.reorder_level || 0,
            expiration_date: product.expiration_date ? dayjs(product.expiration_date) : null,
            image: null,
            image_url: product.image_url
        };

        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="edit-product-page">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">{t('products.edit.pageTitle')}</h1>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <ProductForm
                            editMode={true}
                            categories={categories}
                            initialData={formattedProduct}
                            method="put" // Add method prop for HTTP PUT
                        />
                    </div>
                </div>
            </AppLayout>
        );
    };

    export default Edit;
