import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EyeOutlined } from '@ant-design/icons';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, Table, Tag, Typography, Space } from 'antd';
import React from 'react';
import { useSalesTable } from '@/pages/Sales/hooks/useSalesTable';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '@/utils/format';
import { usePage } from '@inertiajs/react';

const { Title } = Typography;

interface SaleItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Sale {
    id: string;
    transaction_number: string;
    total_amount: number;
    amount_paid: number;
    change_amount: number;
    payment_method: string;
    payment_status: string;
    cashier_name: string;
    customer_name?: string;
    created_at: string;
    items_count: number;
    user?: {
        id: string;
        name: string;
    };
    debtor?: {
        id: string;
        name: string;
    };
}

interface SalesIndexProps {
    sales: Sale[];
    userRole: string;
}

const SalesIndex: React.FC<SalesIndexProps> = () => {
    const { t } = useTranslation();
    const { sales, userRole } = usePage<SalesIndexProps>().props;

    const columns = [
        {
            title: t('sales.transactionNumber'),
            dataIndex: 'transaction_number',
            key: 'transaction_number',
            render: (text: string, record: Sale) => (
                <Link href={route('sales.show', record.id)}>{text}</Link>
            ),
        },
        {
            title: t('sales.date'),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => formatDate(date),
        },
        {
            title: t('sales.totalAmount'),
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount: number) => formatCurrency(amount),
        },
        {
            title: t('sales.itemsCount'),
            dataIndex: 'items_count',
            key: 'items_count',
        },
        {
            title: t('paymentMethod'),
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method: string, record: Sale) => {
                const color = method === 'debt' ? 'orange' : 'green';
                const text = method === 'debt'
                    ? t('sales.paymentMethods.debt')
                    : t('sales.paymentMethods.cash');

                return (
                    <Tag color={color}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: t('common.actions'),
            key: 'action',
            render: (_, record: Sale) => (
                <Space size="middle">
                    <Link href={route('sales.show', record.id)}>
                        <Button type="primary" size="small">
                            {t('common.view')}
                        </Button>
                    </Link>
                </Space>
            ),
        },
    ];

    // Add management column for supervisors
    if (userRole === 'supervisor' || userRole === 'admin') {
        columns.splice(4, 0, {
            title: t('sales.cashier'),
            dataIndex: 'cashier_name',
            key: 'cashier_name',
        });
    }

    return (
        <AppLayout>
            <Head title={t('sales.history')} />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">{t('sales.history')}</h1>
                    <Link href={route('cashier')}>
                        <Button type="primary">{t('sales.newSale')}</Button>
                    </Link>
                </div>

                <Table
                    columns={columns}
                    dataSource={sales}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </AppLayout>
    );
};

export default SalesIndex;
