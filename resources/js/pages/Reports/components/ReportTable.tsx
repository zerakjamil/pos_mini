import React from 'react';
import { Table, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ProfitData } from '../types/types';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface ReportTableProps {
  data: ProfitData[];
  summary: {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    avgMargin: number;
  };
}

const ReportTable: React.FC<ReportTableProps> = ({ data, summary }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Sales Count',
      dataIndex: 'sales_count',
      key: 'sales_count',
      render: (count: number) => count.toLocaleString('en-US'),
    },
    {
      title: (
        <span>
          Total Revenue
          <Tooltip title="Sum of all sales transactions">
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: 'total_revenue',
      key: 'total_revenue',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: (
        <span>
          Cost of Goods
          <Tooltip title="Total cost to purchase all sold items (batch price ÷ units per batch × quantity sold)">
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: 'cost_of_goods',
      key: 'cost_of_goods',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: (
        <span>
          Gross Profit
          <Tooltip title="Revenue minus Cost of Goods">
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: 'gross_profit',
      key: 'gross_profit',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: (
        <span>
          Profit Margin
          <Tooltip title="(Gross Profit ÷ Revenue) × 100%">
            <InfoCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: 'profit_margin',
      key: 'profit_margin',
      render: (value: number) => formatPercentage(value),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="date"
      pagination={false}
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <strong>Total</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <strong>{formatCurrency(summary.totalRevenue)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              <strong>{formatCurrency(summary.totalCost)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4}>
              <strong>{formatCurrency(summary.totalProfit)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5}>
              <strong>{formatPercentage(summary.avgMargin)}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
};

export default ReportTable;
