import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EyeOutlined } from '@ant-design/icons';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, Table, Tag, Typography } from 'antd';
import React from 'react';

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
    id: number;
    transaction_number: string;
    total_amount: number;
    amount_paid: number;
    change_amount: number;
    payment_method: string;
    cashier_name: string;
    created_at: string;
    updated_at: string;
    items: SaleItem[];
    user?: User;
}

interface SalesIndexProps {
    sales: Sale[];
    userRole: string;
}

const SalesIndex: React.FC<SalesIndexProps> = ({ sales, userRole }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Sales History', href: route('sales.index') },
    ];

    const columns = [
        {
            title: 'Transaction #',
            dataIndex: 'transaction_number',
            key: 'transaction_number',
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Total Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount: number) => `IQD ${amount.toLocaleString()}`,
        },
        {
            title: 'Amount Paid',
            dataIndex: 'amount_paid',
            key: 'amount_paid',
            render: (amount: number) => `IQD ${amount.toLocaleString()}`,
        },
        {
            title: 'Change',
            dataIndex: 'change_amount',
            key: 'change_amount',
            render: (amount: number) => `IQD ${amount.toLocaleString()}`,
        },
        {
            title: 'Payment Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method: string) => <Tag color={method === 'cash' ? 'green' : 'blue'}>{method.charAt(0).toUpperCase() + method.slice(1)}</Tag>,
        },
        {
            title: 'Cashier',
            dataIndex: 'cashier_name',
            key: 'cashier_name',
        },
        {
            title: 'Items Count',
            key: 'items_count',
            render: (_, record: Sale) => (record.items ? record.items.length : 0),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record: Sale) => (
                <Link href={route('sales.show', record.id)}>
                    <Button type="primary" icon={<EyeOutlined />} size="small">
                        View
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales History" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <Title level={4}>Sales History</Title>
                    <Link href={route('cashier')}>
                        <Button type="primary">New Sale</Button>
                    </Link>
                </div>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={sales}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                        }}
                    />
                </Card>
            </div>
        </AppLayout>
    );
};

export default SalesIndex;
