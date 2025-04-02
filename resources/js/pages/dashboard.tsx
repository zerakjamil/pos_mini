import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link } from '@inertiajs/react';
import { Card, Statistic, Button, Table, Tag, Alert, Row, Col } from 'antd';
import { ShoppingCartOutlined, DollarOutlined, UserOutlined, BarChartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Package, AlertTriangle } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
    title: string;
    href: string;
}

export default function Dashboard() {
    const { t } = useTranslation();
    const { auth, stats, lowStockProducts, expiringProducts, recentSales } = usePage().props as any;
    const user = auth.user;
    const isSupervisor = user?.role === 'supervisor';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('dashboard.title'), href: route('dashboard') },
    ];

    // Columns for recent sales table
    const salesColumns = [
        {
            title: t('dashboard.sales.transactionNumber'),
            dataIndex: 'transaction_number',
            key: 'transaction_number',
        },
        {
            title: t('dashboard.sales.amount'),
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount: number | string) => {
                const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
                return isNaN(numAmount) ? `${t('common.currency')} 0` : `${t('common.currency')} ${numAmount.toLocaleString()}`;
            },
        },
        {
            title: t('dashboard.sales.date'),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: t('common.action'),
            key: 'action',
            render: (_: any, record: any) => (
                <Link href={route('sales.show', record.id)}>
                    <Button type="link" size="small">{t('common.view')}</Button>
                </Link>
            ),
        },
    ];

    // Add cashier name column for supervisors
    if (isSupervisor) {
        salesColumns.splice(2, 0, {
            title: t('dashboard.sales.cashier'),
            dataIndex: 'cashier_name',
            key: 'cashier_name',
        });
    }

    const lowStockColumns = [
        {
            title: t('dashboard.products.product'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('dashboard.products.currentStock'),
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: t('dashboard.products.reorderLevel'),
            dataIndex: 'reorder_level',
            key: 'reorder_level',
        },
        {
            title: t('dashboard.products.status'),
            key: 'status',
            render: (_: any, record: any) => (
                <Tag color={record.stock === 0 ? 'red' : 'orange'}>
                    {record.stock === 0 ? t('dashboard.products.outOfStock') : t('dashboard.products.lowStock')}
                </Tag>
            ),
        },
    ];

    // Columns for expiring products
    const expiringColumns = [
        {
            title: t('dashboard.products.product'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('dashboard.products.expirationDate'),
            dataIndex: 'expiration_date',
            key: 'expiration_date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: t('dashboard.products.daysLeft'),
            dataIndex: 'days_until_expiration',
            key: 'days_until_expiration',
        },
        {
            title: t('dashboard.products.status'),
            key: 'status',
            render: (_: any, record: any) => (
                <Tag color={record.expired ? 'red' : 'orange'}>
                    {record.expired ? t('dashboard.products.expired') : t('dashboard.products.expiringSoon')}
                </Tag>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4" dir={'rtl'}>
                <h1 className="text-2xl font-bold">{t('dashboard.welcome', { name: user.name })}</h1>
                <p className="text-gray-600 mb-4">
                    {t('dashboard.loggedInAs', { role: t(`roles.${user.role}`) })}
                </p>

                {/* Quick Stats Section */}
                <Row gutter={16} className="mb-4">
                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title={t('dashboard.stats.todaySales')}
                                value={stats?.todaySales || 0}
                                precision={0}
                                prefix={<DollarOutlined />}
                                suffix={t('common.currency')}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title={t('dashboard.stats.products')}
                                value={stats?.productsCount || 0}
                                prefix={<ShoppingCartOutlined />}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card>
                            <Statistic
                                title={t('dashboard.stats.transactions')}
                                value={stats?.transactionsCount || 0}
                                prefix={<BarChartOutlined />}
                            />
                        </Card>
                    </Col>

                    {isSupervisor && (
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <Statistic
                                    title={t('dashboard.stats.users')}
                                    value={stats?.usersCount || 0}
                                    prefix={<UserOutlined />}
                                />
                            </Card>
                        </Col>
                    )}
                </Row>

                {/* Quick Actions */}
                <Card title={t('dashboard.quickActions.title')} className="mb-4">
                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Link href={route('cashier')}>
                                <Button type="primary" icon={<ShoppingCartOutlined />} size="large" block>
                                    {t('dashboard.quickActions.newSale')}
                                </Button>
                            </Link>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Link href={route('product.index')}>
                                <Button icon={<Package className="w-4 h-4" />} size="large" block>
                                    {t('dashboard.quickActions.viewProducts')}
                                </Button>
                            </Link>
                        </Col>
                        {isSupervisor && (
                            <Col xs={24} sm={8}>
                                <Link href={route('product.create')}>
                                    <Button icon={<Package className="w-4 h-4" />} size="large" block>
                                        {t('dashboard.quickActions.addProduct')}
                                    </Button>
                                </Link>
                            </Col>
                        )}
                    </Row>
                </Card>

                {/* Alerts Section */}
                {(lowStockProducts?.length > 0 || expiringProducts?.length > 0) && (
                    <Card title={t('dashboard.alerts.title')} className="mb-4">
                        {lowStockProducts?.length > 0 && (
                            <Alert
                                message={t('dashboard.alerts.lowStockMessage', { count: lowStockProducts.length })}
                                type="warning"
                                showIcon
                                icon={<AlertTriangle className="w-4 h-4" />}
                                className="mb-4"
                                action={
                                    <Link href={route('product.index')}>
                                        <Button size="small">{t('dashboard.alerts.viewAll')}</Button>
                                    </Link>
                                }
                            />
                        )}

                        {expiringProducts?.length > 0 && (
                            <Alert
                                message={t('dashboard.alerts.expiringMessage', { count: expiringProducts.length })}
                                type="error"
                                showIcon
                                icon={<ExclamationCircleOutlined />}
                                action={
                                    <Link href={route('product.index')}>
                                        <Button size="small">{t('dashboard.alerts.viewAll')}</Button>
                                    </Link>
                                }
                            />
                        )}
                    </Card>
                )}

                {/* Recent Sales Section */}
                <Card title={t('dashboard.recentSales.title')} className="mb-4">
                    <Table
                        columns={salesColumns}
                        dataSource={recentSales || []}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                    <div className="mt-4 text-right">
                        <Link href={route('sales.index')}>
                            <Button type="link">{t('dashboard.recentSales.viewAll')}</Button>
                        </Link>
                    </div>
                </Card>

                {/* Low Stock and Expiring Products (for supervisors) */}
                {isSupervisor && (
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Card title={t('dashboard.lowStockProducts.title')} className="mb-4">
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
                            <Card title={t('dashboard.expiringProducts.title')} className="mb-4">
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
