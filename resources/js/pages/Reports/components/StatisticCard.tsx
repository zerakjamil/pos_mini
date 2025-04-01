import React, { ReactNode } from 'react';
import { Card } from 'antd';

interface StatisticProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  valueStyle?: React.CSSProperties;
  formatter?: (value: number) => string;
  icon?: ReactNode;
}

const StatisticCard: React.FC<StatisticProps> = ({
  title,
  value,
  prefix,
  suffix,
  valueStyle,
  formatter,
  icon
}) => {
  const formattedValue = formatter ? formatter(value) : value.toLocaleString('en-US');

  return (
    <Card bordered={false} className="text-center">
      <div>
        <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.45)' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px' }}>
          {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
          <span style={{ fontSize: '24px', ...valueStyle }}>
            {prefix}
            {formattedValue}
            {suffix}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StatisticCard;
