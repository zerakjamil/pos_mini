import React from 'react';
import { Row, Col, Typography, Button, DatePicker } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface ReportHeaderProps {
  onPrint: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ onPrint }) => {
  const { t } = useTranslation();

  return (
    <>
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Title level={4}>{t('reports.salesReports')}</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={onPrint}
            aria-label={t('reports.printReport')}
          >
            {t('reports.printReport')}
          </Button>
        </Col>
      </Row>
      <div className="mb-4">
        <RangePicker
          className="w-full md:w-auto"
          placeholder={[t('reports.startDate'), t('reports.endDate')]}
        />
      </div>
    </>
  );
};

export default ReportHeader;
