import React from 'react';
import { Row, Col } from 'antd';
import { DollarOutlined, PercentageOutlined } from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface ReportSummaryProps {
  summary: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    avgMargin: number;
  };
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ summary }) => {
  return (
    <Row gutter={24} className="mt-4">
      <Col xs={24} sm={12} md={6}>
        <StatisticCard
          title="Total Revenue"
          value={summary.totalRevenue}
          formatter={formatCurrency}
          valueStyle={{ color: '#3f8600' }}
          icon={<DollarOutlined />}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatisticCard
          title="Cost of Goods"
          value={summary.totalCost}
          formatter={formatCurrency}
          valueStyle={{ color: '#cf1322' }}
          icon={<DollarOutlined />}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatisticCard
          title="Gross Profit"
          value={summary.totalProfit}
          formatter={formatCurrency}
          valueStyle={{ color: '#3f8600' }}
          icon={<DollarOutlined />}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatisticCard
          title="Profit Margin"
          value={summary.avgMargin}
          formatter={formatPercentage}
          valueStyle={{ color: summary.avgMargin > 0 ? '#3f8600' : '#cf1322' }}
          icon={<PercentageOutlined />}
        />
      </Col>
    </Row>
  );
};

export default ReportSummary;
