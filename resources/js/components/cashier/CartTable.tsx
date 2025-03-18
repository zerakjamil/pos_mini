import React from 'react';
import { Table, Button, InputNumber } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { CartItem } from '../../types/cashier';

interface CartTableProps {
  cartItems: CartItem[];
  total: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartTable: React.FC<CartTableProps> = ({
  cartItems,
  total,
  onUpdateQuantity,
  onRemoveItem
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
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, record: CartItem) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => onUpdateQuantity(record.id, value as number)}
          style={{ width: '70px' }}
        />
      ),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => `$${subtotal.toFixed(2)}`,
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

  const footer = () => (
    <div className="text-right font-bold">
      <span>Total: ${total.toFixed(2)}</span>
    </div>
  );

  return (
    <Table
      columns={columns}
      dataSource={cartItems}
      rowKey="id"
      pagination={false}
      footer={footer}
      locale={{ emptyText: 'No items in cart' }}
    />
  );
};

export default CartTable;
