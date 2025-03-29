import React from 'react';
import { Table, Button, InputNumber, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { CartItem } from '../../types/cashier';

const { Text } = Typography;

interface CartTableProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  total: number;
}

const CartTable: React.FC<CartTableProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  total
}) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `IQD ${price.toFixed(0)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, record: CartItem) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => onUpdateQuantity(record.id, value || 1)}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => `IQD ${subtotal.toFixed(0)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoveItem(record.id)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={cartItems}
      pagination={false}
      rowKey="id"
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}>
              <Text strong>Total</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <Text strong>IQD {total.toFixed(0)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} />
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
};

export default CartTable;
