import { type Sale } from '@/types/sales';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import { Button, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';

export function useSalesTable() {
  const { t } = useTranslation();

  const columns: ColumnsType<Sale> = [
    {
      title: t('sales.transactionNumber'),
      dataIndex: 'transaction_number',
      key: 'transaction_number',
    },
    {
      title: t('sales.date'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: t('sales.totalAmount'),
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount: number) => `${t('common.currency')} ${Number(amount).toLocaleString()}`,
    },
    {
      title: t('sales.amountPaid'),
      dataIndex: 'amount_paid',
      key: 'amount_paid',
      render: (amount: number) => `${t('common.currency')} ${Number(amount).toLocaleString()}`,
    },
    {
      title: t('sales.change'),
      dataIndex: 'change_amount',
      key: 'change_amount',
      render: (amount: number) => `${t('common.currency')} ${Number(amount).toLocaleString()}`,
    },
    {
      title: t('sales.paymentMethods.title'),
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => (
        <Tag color={method === 'cash' ? 'green' : 'blue'}>
          {t(`sales.paymentMethods.${method}`)}
        </Tag>
      ),
    },
    {
      title: t('roles.management'),
      dataIndex: 'cashier_name',
      key: 'cashier_name',
    },
    {
      title: t('sales.itemsCount'),
      key: 'items_count',
      render: (_, record: Sale) => (record.items ? record.items.length : 0),
    },
    {
      title: t('common.action'),
      key: 'actions',
      render: (_, record: Sale) => (
        <Link href={route('sales.show', record.id)}>
          <Button type="primary" icon={<EyeOutlined />} size="small">
            {t('common.view')}
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
