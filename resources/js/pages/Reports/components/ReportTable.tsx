import React from 'react';
import { Table, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ProfitData } from '../types/types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const columns = [
    {
      title: t('reports.table.date'),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: t('reports.table.salesCount'),
      dataIndex: 'sales_count',
      key: 'sales_count',
      render: (count: number) => count.toLocaleString('en-US'),
    },
    {
      title: (
        <span>
          {t('reports.table.totalRevenue')}
          <Tooltip title={t('reports.table.totalRevenueTooltip')}>
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
          {t('reports.table.costOfGoods')}
          <Tooltip title={t('reports.table.costOfGoodsTooltip')}>
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
          {t('reports.table.grossProfit')}
          <Tooltip title={t('reports.table.grossProfitTooltip')}>
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
          {t('reports.table.profitMargin')}
          <Tooltip title={t('reports.table.profitMarginTooltip')}>
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
              <strong>{t('reports.table.total')}</strong>
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
