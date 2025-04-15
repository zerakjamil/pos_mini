import React from 'react';
import { Card, Table } from 'antd';
import { TransactionItem } from '../../../types/cashier';
import { useTranslation } from 'react-i18next';

interface TransactionItemsTableProps {
  items: TransactionItem[];
  totalAmount: number;
}

const TransactionItemsTable: React.FC<TransactionItemsTableProps> = ({ items, totalAmount }) => {
  const { t } = useTranslation('sale/show');

  const columns = [
    {
      title: t('sales.items.product'),
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: t('sales.items.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('sales.items.unitPrice'),
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => `${t('sales.currency')} ${Number(price).toLocaleString()}`,
    },
    {
      title: t('sales.subtotal'),
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => `${t('sales.currency')} ${Number(subtotal).toLocaleString()}`,
    },
  ];

  return (
    <Card title={t('sales.items.title')}>
      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
        locale={{ emptyText: t('sales.noItems') }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3} align="right">
                <strong>{t('sales.totalAmount')}:</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>{t('sales.currency')} {Number(totalAmount).toLocaleString()}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
};

export default TransactionItemsTable;
