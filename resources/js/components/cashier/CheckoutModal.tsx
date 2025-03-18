import React from 'react';
import { Modal, InputNumber, Statistic, Row, Col, Button } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

interface CheckoutModalProps {
  visible: boolean;
  total: number;
  amountPaid: number | null;
  change: number;
  onAmountPaidChange: (value: number | null) => void;
  onComplete: () => void;
  onCancel: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  visible,
  total,
  amountPaid,
  change,
  onAmountPaidChange,
  onComplete,
  onCancel,
}) => {
  return (
    <Modal
      title="Complete Transaction"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onComplete}
          disabled={!amountPaid || amountPaid < total}
        >
          Complete Payment
        </Button>,
      ]}
    >
      <Row gutter={16} className="mb-4">
        <Col span={12}>
          <Statistic
            title="Total Amount"
            value={total}
            precision={2}
            prefix="$"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Change"
            value={change}
            precision={2}
            prefix="$"
            valueStyle={{ color: change > 0 ? '#3f8600' : '#cf1322' }}
          />
        </Col>
      </Row>

      <div className="mb-4">
        <label className="block mb-2">Amount Paid:</label>
        <InputNumber
          style={{ width: '100%' }}
          size="large"
          min={0}
          step={0.01}
          precision={2}
          value={amountPaid}
          onChange={onAmountPaidChange}
          prefix={<DollarOutlined />}
          autoFocus
        />
      </div>

      {amountPaid && amountPaid < total && (
        <div className="text-red-500">
          Amount paid must be at least equal to the total.
        </div>
      )}
    </Modal>
  );
};

export default CheckoutModal;
