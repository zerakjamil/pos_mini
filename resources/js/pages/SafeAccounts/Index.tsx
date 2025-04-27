import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Space, Table, Typography, Popconfirm, message } from 'antd';
import { Link, router } from '@inertiajs/react';
import { Edit, Eye, PlusCircle, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { SafeAccount } from '@/types/safe';
import { formatCurrency } from '@/utils/format';

interface SafeAccountsProps {
    accounts: SafeAccount[];
}

const SafeAccounts: React.FC<SafeAccountsProps> = ({ accounts }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleDelete = (id: string) => {
        setLoading(true);
        router.delete(route('safe-accounts.destroy', id), {
            onSuccess: () => {
                message.success(t('safe.accountDeleted'));
                setLoading(false);
            },
            onError: () => {
                message.error(t('safe.accountDeleteError'));
                setLoading(false);
            }
        });
    };

    const columns = [
        {
            title: t('safe.name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('safe.description'),
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => text || '-',
            ellipsis: true,
        },
        {
            title: t('safe.balance'),
            dataIndex: 'balance',
            key: 'balance',
            render: (balance: number) => formatCurrency(balance),
        },
        {
            title: t('common.actions'),
            key: 'actions',
            render: (_: any, record: SafeAccount) => (
                <Space size="small">
                    <Link href={route('safe-accounts.show', record.id)}>
                        <Button type="default" size="small" icon={<Eye size={16} />} title={t('common.view')} />
                    </Link>
                    <Link href={route('safe-accounts.edit', record.id)}>
                        <Button type="default" size="small" icon={<Edit size={16} />} title={t('common.edit')} />
                    </Link>
                    <Popconfirm
                        title={t('safe.confirmDelete')}
                        description={t('safe.confirmDeleteDescription')}
                        onConfirm={() => handleDelete(record.id)}
                        okText={t('common.yes')}
                        cancelText={t('common.no')}
                    >
                        <Button 
                            type="default" 
                            size="small" 
                            danger 
                            icon={<Trash2 size={16} />} 
                            title={t('common.delete')} 
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title={t('safe.accounts')} />
            
            <div className="container p-6">
                <PageHeader
                    title={t('safe.accounts')}
                    breadcrumbItems={[
                        { title: t('sidebar.dashboard'), href: route('dashboard') },
                        { title: t('safe.accounts'), href: route('safe-accounts.index') },
                    ]}
                    actions={
                        <Link href={route('safe-accounts.create')}>
                            <Button type="primary" icon={<PlusCircle size={16} />}>
                                {t('safe.createAccount')}
                            </Button>
                        </Link>
                    }
                />

                <Card className="mt-4">
                    <Table 
                        dataSource={accounts} 
                        columns={columns} 
                        rowKey="id" 
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            </div>
        </AppLayout>
    );
};

export default SafeAccounts;