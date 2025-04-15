import React from 'react';
import { Button, Space, Typography } from 'antd';
import { ArrowLeft, Printer } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface SaleHeaderProps {
  transactionNumber: string;
  onPrint: () => void;
}

const SaleHeader: React.FC<SaleHeaderProps> = ({ transactionNumber, onPrint }) => {
  const { t } = useTranslation('sale/show');

  return (
    <div className="flex justify-between items-center py-4">
      <Space>
        <Link href={route('sales.index')}>
          <Button icon={<ArrowLeft className="h-4 w-4 mr-2" />}>
            {t('sales.actions.backToSales')}
          </Button>
        </Link>
        <Title level={4} style={{ margin: 0 }}>
          {t('sales.sale')} #{transactionNumber}
        </Title>
      </Space>
      <Button
        type="primary"
        icon={<Printer className="h-4 w-4 mr-2" />}
        onClick={onPrint}
      >
        {t('sales.actions.printReceipt')}
      </Button>
    </div>
  );
};

export default SaleHeader;
