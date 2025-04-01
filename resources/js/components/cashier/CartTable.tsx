import React from 'react';
import { Table, Button, InputNumber, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { CartItem } from '../../types/cashier';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const columns = [
    {
      title: t('cashier.cart.product'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('cashier.cart.price'),
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${t('common.currency')} ${price.toFixed(0)}`,
    },
    {
      title: t('cashier.cart.quantity'),
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
      title: t('cashier.cart.subtotal'),
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => `${t('common.currency')} ${subtotal.toFixed(0)}`,
    },
    {
      title: t('cashier.cart.action'),
      key: 'action',
      render: (_: any, record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoveItem(record.id)}
          aria-label={t('cashier.cart.remove')}
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
              <Text strong>{t('cashier.cart.total')}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <Text strong>{t('common.currency')} {total.toFixed(0)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} />
          </Table.Summary.Row>
        </Table.Summary>
      )}
      locale={{
        emptyText: t('cashier.cart.empty')
      }}
    />
  );
};

export default CartTable;
