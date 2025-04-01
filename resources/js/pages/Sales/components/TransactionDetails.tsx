// resources/js/pages/Sales/components/TransactionDetails.tsx
import React from 'react';
import { Card, Descriptions } from 'antd';
import { Transaction } from '../../../types/cashier';

interface TransactionDetailsProps {
  sale: Transaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ sale }) => {
  return (
    <Card title="Transaction Details">
      <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
        <Descriptions.Item label="Transaction Number">{sale.transaction_number}</Descriptions.Item>
        <Descriptions.Item label="Date">{new Date(sale.created_at).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Cashier">{sale.cashier_name}</Descriptions.Item>
        <Descriptions.Item label="Payment Method">
          {sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)}
        </Descriptions.Item>
        <Descriptions.Item label="Total Amount">IQD {Number(sale.total_amount).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Amount Paid">IQD {Number(sale.amount_paid).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Change">IQD {Number(sale.change_amount).toLocaleString()}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default TransactionDetails;
