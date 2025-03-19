import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Table, Typography, Button, Card, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const { Title } = Typography;

interface Transaction {
  id: number;
  transaction_number: string;
  total_amount: number;
  amount_paid: number;
  change_amount: number;
  payment_method: string;
  cashier_name: string;
  created_at: string;
  updated_at: string;
}

interface SalesIndexProps {
  transactions: Transaction[];
}

const SalesIndex: React.FC<SalesIndexProps> = ({ transactions }) => {
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
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => method.charAt(0).toUpperCase() + method.slice(1),
    },
    {
      title: 'Cashier',
      dataIndex: 'cashier_name',
      key: 'cashier_name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Transaction) => (
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
        <div className="flex items-center justify-between mb-4">
          <Title level={4}>Sales History</Title>
          <Link href={route('cashier')}>
            <Button type="primary">
              New Sale
            </Button>
          </Link>
        </div>

        <Card>
          <Table
            columns={columns}
            dataSource={transactions}
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
