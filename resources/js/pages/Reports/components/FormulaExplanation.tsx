import React from 'react';
import { Alert, Space, Typography } from 'antd';

const { Paragraph } = Typography;

const FormulaExplanation: React.FC = () => {
  return (
    <Alert
      message="How Profits Are Calculated"
      description={
        <Space direction="vertical">
          <Paragraph>
            <strong>Cost of Goods</strong> = (Batch Price ÷ Units per Batch) × Quantity Sold
          </Paragraph>
          <Paragraph>
            <strong>Gross Profit</strong> = Total Revenue − Cost of Goods
          </Paragraph>
          <Paragraph>
            <strong>Profit Margin</strong> = (Gross Profit ÷ Total Revenue) × 100%
          </Paragraph>
        </Space>
      }
      type="info"
      showIcon
      className="mb-4"
    />
  );
};

export default FormulaExplanation;
