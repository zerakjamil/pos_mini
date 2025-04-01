import React from 'react';
import { Row, Col, Typography, Divider, Button } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import { CartItem } from '../../types/cashier';

const { Text } = Typography;

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
  onClearCart
}) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Row>
          <Col span={12}><Text>Items:</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text>{totalItems}</Text>
          </Col>
        </Row>
        <Row>
          <Col span={12}><Text>Subtotal:</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text>IQD {total.toFixed(0)}</Text>
          </Col>
        </Row>
        {/*  TODO if tax is applied */}
        {/*<Row>*/}
        {/*  <Col span={12}><Text>Tax (0%):</Text></Col>*/}
        {/*  <Col span={12} style={{ textAlign: 'right' }}>*/}
        {/*    <Text>$0.00</Text>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        <Divider />
        <Row>
          <Col span={12}><Text strong>Total:</Text></Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Text strong>IQD {total.toFixed(0)}</Text>
          </Col>
        </Row>
      </div>

      <div style={{ marginTop: 24 }}>
        <Button
          type="primary"
          size="large"
          block
          icon={<DollarOutlined />}
          onClick={onCheckout}
          disabled={cartItems.length === 0}
        >
          Checkout
        </Button>

        <Button
          danger
          size="large"
          block
          style={{ marginTop: 8 }}
          onClick={onClearCart}
          disabled={cartItems.length === 0}
        >
          Clear Cart
        </Button>
      </div>
    </>
  );
};

export default TransactionSummary;
