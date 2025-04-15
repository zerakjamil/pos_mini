// resources/js/pages/Sales/components/TransactionDetails.tsx
import React from 'react';
import { Card, Descriptions } from 'antd';
import { Transaction } from '../../../types/cashier';
import { useTranslation } from 'react-i18next';

interface TransactionDetailsProps {
  sale: Transaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ sale }) => {
  const { t } = useTranslation('sale/show');

  return (
    <Card title={t('sales.details')}>
      <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
        <Descriptions.Item label={t('sales.transactionNumber')}>
          {sale.transaction_number}
        </Descriptions.Item>
        <Descriptions.Item label={t('sales.date')}>
          {new Date(sale.created_at).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={t('sales.cashier')}>
          {sale.cashier_name}
        </Descriptions.Item>
        <Descriptions.Item label={t('sales.paymentMethod')}>
          {t(`sales.paymentMethods.${sale.payment_method}`)}
        </Descriptions.Item>
        <Descriptions.Item label={t('sales.totalAmount')}>
          {t('sales.currency')} {Number(sale.total_amount).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={t('sales.amountPaid')}>
          {t('sales.currency')} {Number(sale.amount_paid).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label={t('sales.change')}>
          {t('sales.currency')} {Number(sale.change_amount).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default TransactionDetails;
