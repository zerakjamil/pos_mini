import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { EyeOutlined } from '@ant-design/icons';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, Table, Tag, Typography } from 'antd';
import React from 'react';
import { useSalesTable } from '@/pages/Sales/hooks/useSalesTable';

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

const SalesIndex: React.FC<SalesIndexProps> = ({ sales }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Sales History', href: route('sales.index') },
    ];

    const { columns } = useSalesTable();

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
