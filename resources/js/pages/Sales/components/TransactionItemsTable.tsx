import React from 'react';
import { Card, Table } from 'antd';
import { TransactionItem } from '../../../types/cashier';

interface TransactionItemsTableProps {
  items: TransactionItem[];
  totalAmount: number;
}

const TransactionItemsTable: React.FC<TransactionItemsTableProps> = ({ items, totalAmount }) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => `IQD ${Number(price).toLocaleString()}`,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => `IQD ${Number(subtotal).toLocaleString()}`,
    },
  ];

  return (
    <Card title="Items">
      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3} align="right">
                <strong>Total:</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>IQD {Number(totalAmount).toLocaleString()}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
};

export default TransactionItemsTable;
