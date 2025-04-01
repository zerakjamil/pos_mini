import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { Link } from '@inertiajs/react';

const { Title } = Typography;

interface SaleHeaderProps {
  transactionNumber: string;
  onPrint: () => void;
}

const SaleHeader: React.FC<SaleHeaderProps> = ({ transactionNumber, onPrint }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/sales">
          <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
            Back to Sales
          </Button>
        </Link>
        <Title level={4} style={{ margin: 0 }}>Transaction: {transactionNumber}</Title>
      </div>
      <Button
        type="primary"
        icon={<PrinterOutlined />}
        onClick={onPrint}
      >
        Print Receipt
      </Button>
    </div>
  );
};

export default SaleHeader;
