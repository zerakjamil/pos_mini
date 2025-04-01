import React from 'react';
import { Row, Col, Typography, Button, DatePicker } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface ReportHeaderProps {
  onPrint: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ onPrint }) => {
  return (
    <>
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <Title level={4}>Sales Reports</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PrinterOutlined />} onClick={onPrint}>
            Print Report
          </Button>
        </Col>
      </Row>
      <div className="mb-4">
        <RangePicker className="w-full md:w-auto" />
      </div>
    </>
  );
};

export default ReportHeader;
