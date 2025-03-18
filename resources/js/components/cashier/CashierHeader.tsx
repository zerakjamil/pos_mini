import React from 'react';
import { PageHeader, Button } from 'antd';
import { BarcodeOutlined, ShoppingCartOutlined } from '@ant-design/icons';

interface CashierHeaderProps {
  onNewTransaction?: () => void;
}

const CashierHeader: React.FC<CashierHeaderProps> = ({ onNewTransaction }) => {
  return (
    <PageHeader
      className="site-page-header mb-4"
      title="Cashier System"
      subTitle="Process sales and transactions"
      extra={[
        <Button
          key="1"
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={onNewTransaction}
        >
          New Transaction
        </Button>,
      ]}
    />
  );
};

export default CashierHeader;
