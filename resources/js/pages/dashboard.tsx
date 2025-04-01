import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { Card, Statistic, Button, Table, Tag, Alert, Row, Col } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, BarChartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Package, AlertTriangle } from 'lucide-react';
import React from 'react';
interface BreadcrumbItem {
    title: string;
    href: string;
}

export default function Dashboard() {
    const { auth, stats, lowStockProducts, expiringProducts, recentSales } = usePage().props as any;
    const user = auth.user;
    const isSupervisor = user?.role === 'supervisor';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
    ];

    // Columns for recent sales table
    const salesColumns = [
        {
            title: 'Transaction #',
            dataIndex: 'transaction_number',
            key: 'transaction_number',
        },
        {
            title: 'Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount: number | string) => {
                const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
            return isNaN(numAmount) ? 'IQD 0' : `IQD ${numAmount.toLocaleString()}`;
            },
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Link href={route('sales.show', record.id)}>
                    <Button type="link" size="small">View</Button>
                </Link>
            ),
        },
    ];

    // Add cashier name column for supervisors
    if (isSupervisor) {
        salesColumns.splice(2, 0, {
            title: 'Cashier',
            dataIndex: 'cashier_name',
            key: 'cashier_name',
        });
    }

    const lowStockColumns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Current Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Reorder Level',
            dataIndex: 'reorder_level',
            key: 'reorder_level',
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: any) => (
                <Tag color={record.stock === 0 ? 'red' : 'orange'}>
                    {record.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                </Tag>
            ),
        },
    ];

    // Columns for expiring products
    const expiringColumns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Expiration Date',
            dataIndex: 'expiration_date',
            key: 'expiration_date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Days Left',
            dataIndex: 'days_until_expiration',
            key: 'days_until_expiration',
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: any) => (
                <Tag color={record.expired ? 'red' : 'orange'}>
                    {record.expired ? 'Expired' : 'Expiring Soon'}
                </Tag>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
                <p className="text-gray-600 mb-4">
                    You are logged in as a {user.role}.
                </p>


                {/* Quick Stats Section */}
                <Row gutter={16} className="mb-4">
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Today's Sales"
                                value={stats?.todaySales || 0}
                                precision={0}
                                prefix={<DollarOutlined />}
                                suffix="IQD"
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Products"
                                value={stats?.productsCount || 0}
                                prefix={<ShoppingCartOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title="Transactions"
                                value={stats?.transactionsCount || 0}
                                prefix={<BarChartOutlined />}
                            />
                        </Card>
                    </Col>

                    {isSupervisor && (
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title="Users"
                                    value={stats?.usersCount || 0}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                    )}
                </Row>

                {/* Quick Actions */}
                <Card title="Quick Actions" className="mb-4">
                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Link href={route('cashier')}>
                                <Button type="primary" icon={<ShoppingCartOutlined />} size="large" block>
                                    New Sale
                                </Button>
                            </Link>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Link href={route('product.index')}>
                                <Button icon={<Package className="w-4 h-4" />} size="large" block>
                                    View Products
                                </Button>
                            </Link>
                        </Col>
                        {isSupervisor && (
                            <Col xs={24} sm={8}>
                                <Link href={route('product.create')}>
                                    <Button icon={<Package className="w-4 h-4" />} size="large" block>
                                        Add Product
                                    </Button>
                                </Link>
                            </Col>
                        )}
                    </Row>
                </Card>

                {/* Alerts Section */}
                {(lowStockProducts?.length > 0 || expiringProducts?.length > 0) && (
                    <Card title="Alerts" className="mb-4">
                        {lowStockProducts?.length > 0 && (
                            <Alert
                                message={`${lowStockProducts.length} products with low stock`}
                                type="warning"
                                showIcon
                                icon={<AlertTriangle className="w-4 h-4" />}
                                className="mb-4"
                                action={
                                    <Link href={route('product.index')}>
                                        <Button size="small">View All</Button>
                                    </Link>
                                }
                            />
                        )}

                        {expiringProducts?.length > 0 && (
                            <Alert
                                message={`${expiringProducts.length} products expiring soon`}
                                type="error"
                                showIcon
                                icon={<ExclamationCircleOutlined />}
                                action={
                                    <Link href={route('product.index')}>
                                        <Button size="small">View All</Button>
                                    </Link>
                                }
                            />
                        )}
                    </Card>
                )}

                {/* Recent Sales Section */}
                <Card title="Recent Sales" className="mb-4">
                    <Table
                        columns={salesColumns}
                        dataSource={recentSales || []}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                    <div className="mt-4 text-right">
                        <Link href={route('sales.index')}>
                            <Button type="link">View All Sales</Button>
                        </Link>
                    </div>
                </Card>

                {/* Low Stock and Expiring Products (for supervisors) */}
                {isSupervisor && (
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Card title="Low Stock Products" className="mb-4">
                                <Table
                                    columns={lowStockColumns}
                                    dataSource={lowStockProducts || []}
                                    rowKey="id"
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title="Expiring Products" className="mb-4">
                                <Table
                                    columns={expiringColumns}
                                    dataSource={expiringProducts || []}
                                    rowKey="id"
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>
        </AppLayout>
    );
}
