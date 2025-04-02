import React from 'react';
import { Row, Col } from 'antd';
import { DollarOutlined, PercentageOutlined } from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface ReportSummaryProps {
  summary: {
    totalRevenue?: number | string;
    totalCost?: number | string;
    totalProfit?: number | string;
    avgMargin?: number | string;
  };
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ summary = {} }) => {
  const parseNumericValue = (val: any): number => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      // For concatenated values like "0245000.0033500.00", take the first number
      const match = val.match(/\d+(\.\d+)?/);
      const parsedVal = match ? parseFloat(match[0]) : 0;
      return isNaN(parsedVal) ? 0 : parsedVal;
    }
    return 0;
  };

  const {
    totalRevenue = 0,
    totalCost = 0,
    totalProfit = 0,
    avgMargin = 0
  } = summary;

  const numTotalRevenue = parseNumericValue(totalRevenue);
  const numTotalCost = parseNumericValue(totalCost);
  const numTotalProfit = parseNumericValue(totalProfit);
  const numAvgMargin = parseNumericValue(avgMargin);

  return (
    <Row gutter={24} className="mt-4">
      <Col xs={24} sm={12} md={6}>
        <StatisticCard
          title="Total Revenue"
          value={numTotalRevenue}
          formatter={formatCurrency}
          valueStyle={{ color: '#3f8600' }}
          icon={<DollarOutlined />}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatisticCard
          title="Cost of Goods"
          value={numTotalCost}
          formatter={formatCurrency}
          valueStyle={{ color: '#cf1322' }}
          icon={<DollarOutlined />}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatisticCard
          title="Gross Profit"
          value={numTotalProfit}
          formatter={formatCurrency}
          valueStyle={{ color: '#3f8600' }}
          icon={<DollarOutlined />}
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StatisticCard
          title="Profit Margin"
          value={numAvgMargin}
          formatter={formatPercentage}
          valueStyle={{ color: numAvgMargin > 0 ? '#3f8600' : '#cf1322' }}
          icon={<PercentageOutlined />}
        />
      </Col>
    </Row>
  );
};

export default ReportSummary;
