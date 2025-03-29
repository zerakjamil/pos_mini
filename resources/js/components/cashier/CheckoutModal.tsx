import React from 'react';
import { Modal, Row, Col, Typography, InputNumber } from 'antd';
const { Text } = Typography;

interface CheckoutModalProps {
  visible: boolean;
  total: number;
  amountPaid: number | null;
  change: number;
  onAmountPaidChange: (value: number | null) => void;
  onComplete: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  visible,
  total,
  amountPaid,
  change,
  onAmountPaidChange,
  onComplete,
  onCancel,
  loading = false
}) => {
  return (
      <Modal
          title="Complete Transaction"
          open={visible}
          onOk={onComplete}
          onCancel={onCancel}
          okText="Complete Payment"
          cancelText="Cancel"
          confirmLoading={loading}
          okButtonProps={{ disabled: !amountPaid || amountPaid < total || loading }}
      >
          <div style={{ marginBottom: 16 }}>
              <Row>
                  <Col span={12}>
                      <Text strong>Total Amount:</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong>IQD {total.toFixed(0)}</Text>
                  </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                  <Col span={12}>
                      <Text>Amount Paid:</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                      <InputNumber
                          style={{ width: '100%' }}
                          value={amountPaid}
                          onChange={onAmountPaidChange}
                          min={0}
                          precision={0}
                          formatter={(value) => `IQD ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={(value) => Number(value?.toString().replace(/[^\d]/g, ''))}
                          disabled={loading}
                          autoFocus
                      />
                  </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                  <Col span={12}>
                      <Text strong>Change:</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: 'right' }}>
                      <Text strong style={{ fontSize: 18 }}>
                          IQD {change.toFixed(0)}
                      </Text>
                  </Col>
              </Row>
          </div>
      </Modal>
  );
};

export default CheckoutModal;
