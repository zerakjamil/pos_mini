import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DollarOutlined, InfoCircleOutlined, PercentageOutlined, PrinterOutlined } from '@ant-design/icons';
import { Head } from '@inertiajs/react';
import { Alert, Button, Card, Col, DatePicker, Divider, Row, Space, Table, Tabs, Tooltip, Typography } from 'antd';
import React, { ReactNode, useState } from 'react';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Define interfaces for our data structures
interface ProfitData {
    date: string;
    sales_count: number;
    total_revenue: number;
    cost_of_goods: number;
    gross_profit: number;
    profit_margin: number;
}

interface ReportProps {
    dailyProfits: ProfitData[];
    weeklyProfits: ProfitData[];
    monthlyProfits: ProfitData[];
}

interface SummaryData {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    avgMargin: number;
}

interface StatisticProps {
    title: string;
    value: number;
    prefix?: string;
    suffix?: string;
    valueStyle?: React.CSSProperties;
    formatter?: (value: number) => string;
    icon?: ReactNode;
}

const ReportsPage: React.FC<ReportProps> = ({ dailyProfits, weeklyProfits, monthlyProfits }) => {
    const [activeTab, setActiveTab] = useState<string>('daily');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Reports', href: route('reports.index') },
    ];

    // Format currency with thousands separators
    const formatCurrency = (amount: number): string => {
        return `IQD ${Number(amount).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    // Format percentage values
    const formatPercentage = (value: number): string => {
        return `${(value * 100).toFixed(2)}%`;
    };

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

    const handlePrint = (): void => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const reportTitle = activeTab === 'daily' ? 'Daily Sales Report' : activeTab === 'weekly' ? 'Weekly Sales Report' : 'Monthly Sales Report';

        const data: ProfitData[] = activeTab === 'daily' ? dailyProfits : activeTab === 'weekly' ? weeklyProfits : monthlyProfits;

        let tableHtml = `
                                  <html>
                                  <head>
                                    <title>${reportTitle}</title>
                                    <style>
                                      body { font-family: Arial, sans-serif; margin: 20px; }
                                      h1 { text-align: center; color: #1890ff; }
                                      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                      th, td { border: 1px solid #ddd; padding: 8px; }
                                      th { background-color: #f2f2f2; font-weight: bold; text-align: left; }
                                      .summary { margin-top: 20px; font-weight: bold; }
                                      .print-date { text-align: right; margin-bottom: 20px; }
                                      .formula-box { border: 1px solid #ddd; padding: 10px; margin: 10px 0; background-color: #f9f9f9; }
                                      .currency { text-align: right; }
                                      .percent { text-align: right; }
                                      .count { text-align: center; }
                                      tfoot td { font-weight: bold; background-color: #f9f9f9; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="print-date">Generated: ${new Date().toLocaleString()}</div>
                                    <h1>${reportTitle}</h1>

                                    <div class="formula-box">
                                      <h3>How Profits Are Calculated:</h3>
                                      <p>• <strong>Cost of Goods</strong> = (Batch Price ÷ Units per Batch) × Quantity Sold</p>
                                      <p>• <strong>Gross Profit</strong> = Total Revenue − Cost of Goods</p>
                                      <p>• <strong>Profit Margin</strong> = (Gross Profit ÷ Total Revenue) × 100%</p>
                                    </div>

                                    <table>
                                      <thead>
                                        <tr>
                                          <th>Date</th>
                                          <th>Sales Count</th>
                                          <th>Total Revenue</th>
                                          <th>Cost of Goods</th>
                                          <th>Gross Profit</th>
                                          <th>Profit Margin</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                `;

        data.forEach((item) => {
            tableHtml += `
                <tr>
                    <td>${item.date}</td>
                    <td class="count">${item.sales_count.toLocaleString('en-US')}</td>
                    <td class="currency">${formatCurrency(item.total_revenue)}</td>
                    <td class="currency">${formatCurrency(item.cost_of_goods)}</td>
                    <td class="currency">${formatCurrency(item.gross_profit)}</td>
                    <td class="percent">${formatPercentage(item.profit_margin)}</td>
                </tr>
            `;
        });

        // Calculate totals
        const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
        const totalProfit = data.reduce((sum, item) => sum + item.gross_profit, 0);
        const totalCost = data.reduce((sum, item) => sum + item.cost_of_goods, 0);
        const avgMargin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;

        tableHtml += `
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2">Total</td>
                    <td class="currency">${formatCurrency(totalRevenue)}</td>
                    <td class="currency">${formatCurrency(totalCost)}</td>
                    <td class="currency">${formatCurrency(totalProfit)}</td>
                    <td class="percent">${formatPercentage(avgMargin)}</td>
                </tr>
            </tfoot>
            </table>
            <div class="summary">
                <p>Total Revenue: ${formatCurrency(totalRevenue)}</p>
                <p>Total Cost: ${formatCurrency(totalCost)}</p>
                <p>Total Profit: ${formatCurrency(totalProfit)}</p>
                <p>Average Profit Margin: ${formatPercentage(avgMargin)}</p>
            </div>
        `;

        printWindow.document.write(tableHtml);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const calculateSummary = (data: ProfitData[]): SummaryData => {
        const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
        const totalCost = data.reduce((sum, item) => sum + item.cost_of_goods, 0);
        const totalProfit = data.reduce((sum, item) => sum + item.gross_profit, 0);
        const avgMargin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;

        return { totalRevenue, totalCost, totalProfit, avgMargin };
    };

    const renderTabContent = (data: ProfitData[]): React.ReactElement => {
        const summary = calculateSummary(data);

        return (
            <>
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

                <Divider />

                <Row gutter={24} className="mt-4">
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false} className="text-center">
                            <Statistic
                                title="Total Revenue"
                                value={summary.totalRevenue}
                                formatter={formatCurrency}
                                valueStyle={{ color: '#3f8600' }}
                                icon={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false} className="text-center">
                            <Statistic
                                title="Cost of Goods"
                                value={summary.totalCost}
                                formatter={formatCurrency}
                                valueStyle={{ color: '#cf1322' }}
                                icon={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false} className="text-center">
                            <Statistic
                                title="Gross Profit"
                                value={summary.totalProfit}
                                formatter={formatCurrency}
                                valueStyle={{ color: '#3f8600' }}
                                icon={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card bordered={false} className="text-center">
                            <Statistic
                                title="Profit Margin"
                                value={summary.avgMargin}
                                formatter={formatPercentage}
                                valueStyle={{ color: summary.avgMargin > 0 ? '#3f8600' : '#cf1322' }}
                                icon={<PercentageOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            </>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Row justify="space-between" align="middle" className="mb-4">
                    <Col>
                        <Title level={4}>Sales Reports</Title>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                            Print Report
                        </Button>
                    </Col>
                </Row>

                <Card>
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

                    <div className="mb-4">
                        <RangePicker className="w-full md:w-auto" />
                    </div>

                    <Tabs defaultActiveKey="daily" onChange={(key) => setActiveTab(key)}>
                        <TabPane tab="Daily" key="daily">
                            {renderTabContent(dailyProfits)}
                        </TabPane>
                        <TabPane tab="Weekly" key="weekly">
                            {renderTabContent(weeklyProfits)}
                        </TabPane>
                        <TabPane tab="Monthly" key="monthly">
                            {renderTabContent(monthlyProfits)}
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        </AppLayout>
    );
};

// Custom Statistic component for summary cards
const Statistic: React.FC<StatisticProps> = ({ title, value, prefix, suffix, valueStyle, formatter, icon }) => {
    const formattedValue = formatter ? formatter(value) : value.toLocaleString('en-US');

    return (
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
    );
};

export default ReportsPage;
