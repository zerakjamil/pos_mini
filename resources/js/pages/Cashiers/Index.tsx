import { Head, Link, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import SettingsLayout from '@/layouts/settings/layout';
import { useState } from 'react';
import {
    Table,
    Card,
    Space,
    Tag,
    Modal,
    Pagination,
    message,
    Typography
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function CashiersIndex() {
    const { t } = useTranslation('management/cashier');
    const { cashiers } = usePage().props as any;
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.home'), href: route('dashboard') },
        { title: t('breadcrumb.cashiers'), href: route('cashiers-management.index') },
    ];

    const showDeleteConfirm = (id: string) => {
        confirm({
            title: t('delete.confirm'),
            icon: <ExclamationCircleOutlined />,
            content: t('delete.description'),
            okText: t('delete.yes'),
            okType: 'danger',
            cancelText: t('delete.no'),
            onOk() {
                router.delete(route('cashiers-management.destroy', id), {
                    onSuccess: () => {
                        message.success(t('delete.success'));
                    },
                    onError: () => {
                        message.error(t('delete.error'));
                    },
                });
            },
        });
    };

    // Calculate pagination
    const totalItems = cashiers.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const currentItems = cashiers.slice(startIndex, endIndex);

    const columns = [
        {
            title: t('table.name'),
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: t('table.email'),
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: t('table.phone'),
            dataIndex: 'phone',
            key: 'phone',
            render: (phone: string) => phone || '-',
        },
        {
            title: t('table.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'error'} className="capitalize">
                    {status === 'active' ? t('status.active') : t('status.inactive')}
                </Tag>
            ),
        },
        {
            title: t('table.actions'),
            key: 'actions',
            render: (_: any, record: any) => (
                <Space size="small">
                    <Link href={route('cashiers-management.show', record.id)}>
                        <Button type="text" size="small" icon={<Eye className="h-4 w-4" />} />
                    </Link>
                    <Link href={route('cashiers-management.edit', record.id)}>
                        <Button type="text" size="small" icon={<Edit className="h-4 w-4" />} />
                    </Link>
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<Trash2 className="h-4 w-4" />}
                        onClick={() => showDeleteConfirm(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <Head title={t('page.title')} />

                <div className="flex justify-between items-center mb-6">
                    <Title level={2} className="!m-0">{t('page.title')}</Title>
                    <Link href={route('cashiers-management.create')}>
                        <Button
                            className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors"
                            type="default"
                        >
                            <PlusCircle className="h-4 w-4" />
                            {t('actions.create')}
                        </Button>
                    </Link>
                </div>

                <Card bordered={false} className="shadow-sm">
                    <Table
                        columns={columns}
                        dataSource={currentItems}
                        rowKey="id"
                        pagination={false}
                        locale={{ emptyText: t('table.noData') }}
                        className="border rounded-md"
                    />

                    {totalItems > 0 && (
                        <div className="flex items-center justify-between px-4 py-4 border-t">
                            <Text type="secondary" className="text-sm">
                                {t('pagination.showing', {
                                    from: startIndex + 1,
                                    to: endIndex,
                                    total: totalItems
                                })}
                            </Text>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalItems}
                                onChange={handlePageChange}
                                showSizeChanger
                                pageSizeOptions={['10', '20', '50']}
                                size="small"
                                showTotal={(total, range) =>
                                    t('pagination.showing', {
                                        from: range[0],
                                        to: range[1],
                                        total
                                    })
                                }
                            />
                        </div>
                    )}
                </Card>
            </SettingsLayout>
        </AppLayout>
    );
}
