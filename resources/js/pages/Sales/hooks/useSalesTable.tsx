import { type Sale } from '@/types/sales';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import { Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export function useSalesTable() {
  const columns: ColumnsType<Sale> = [
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
      render: (amount: number) => `IQD ${Number(amount).toLocaleString()}`,
    },
    {
      title: 'Amount Paid',
      dataIndex: 'amount_paid',
      key: 'amount_paid',
      render: (amount: number) => `IQD ${Number(amount).toLocaleString()}`,
    },
    {
      title: 'Change',
      dataIndex: 'change_amount',
      key: 'change_amount',
      render: (amount: number) => `IQD ${Number(amount).toLocaleString()}`,
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => (
        <Tag color={method === 'cash' ? 'green' : 'blue'}>
          {method.charAt(0).toUpperCase() + method.slice(1)}
        </Tag>
      ),
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

  const tablePaginationConfig = {
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
  };

  return { columns, tablePaginationConfig };
}
