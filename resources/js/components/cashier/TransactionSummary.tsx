import React from 'react';
import { Button, Statistic, Card, Space, Divider } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, DeleteOutlined } from '@ant-design/icons';
import { CartItem } from '../../types/cashier';

interface TransactionSummaryProps {
  cartItems: CartItem[];
  total: number;
  onCheckout: () => void;
  onClearCart: () => void;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  cartItems,
  total,
  onCheckout,
  onClearCart,
}) => {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="transaction-summary">
      <Card className="mb-4">
        <Statistic
          title="Total Amount"
          value={total}
          precision={2}
          prefix="$"
          valueStyle={{ color: '#3f8600', fontSize: '2rem' }}
        />
        <Divider />
        <div className="flex justify-between mb-2">
          <span>Items:</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Products:</span>
          <span>{cartItems.length}</span>
        </div>
      </Card>

      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          type="primary"
          size="large"
          icon={<DollarOutlined />}
          onClick={onCheckout}
          disabled={cartItems.length === 0}
          block
        >
          Checkout
        </Button>
        <Button
          danger
          size="large"
          icon={<DeleteOutlined />}
          onClick={onClearCart}
          disabled={cartItems.length === 0}
          block
        >
          Clear Cart
        </Button>
      </Space>
    </div>
  );
};

export default TransactionSummary;
