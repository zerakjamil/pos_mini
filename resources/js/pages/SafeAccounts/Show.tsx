import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Descriptions, Table, Typography, Tag } from 'antd';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { SafeAccount, SafeTransaction } from '@/types/safe';
import { formatCurrency } from '@/utils/format';

interface ShowProps {
    account: SafeAccount;
    transactions: SafeTransaction[];
}

const { Title, Text } = Typography;

const Show: React.FC<ShowProps> = ({ account, transactions }) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t('safe.transactionNumber'),
            dataIndex: 'transaction_number',
            key: 'transaction_number',
        },
        {
            title: t('safe.date'),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: t('safe.type'),
            key: 'type',
            render: (_: any, record: SafeTransaction) => {
                if (record.sender_id === account.id) {
                    return <Tag color="red">{t('safe.outgoing')}</Tag>;
                }
                return <Tag color="green">{t('safe.incoming')}</Tag>;
            },
        },
        {
            title: t('safe.amount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => formatCurrency(amount),
        },
        {
            title: t('safe.otherAccount'),
            key: 'otherAccount',
            render: (_: any, record: SafeTransaction) => {
                if (record.sender_id === account.id) {
                    return record.receiver_name;
                }
                return record.sender_name;
            },
        },
        {
            title: t('safe.description'),
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => text || '-',
            ellipsis: true,
        },
    ];

    return (
        <AppLayout>
            <Head title={account.name} />
            
            <div className="container p-6">
                <PageHeader
                    title={account.name}
                    breadcrumbItems={[
                        { title: t('sidebar.dashboard'), href: route('dashboard') },
                        { title: t('safe.accounts'), href: route('safe-accounts.index') },
                        { title: account.name, href: route('safe-accounts.show', account.id) },
                    ]}
                    actions={
                        <Link href={route('safe-accounts.index')}>
                            <Button icon={<ArrowLeft size={16} />}>
                                {t('common.back')}
                            </Button>
                        </Link>
                    }
                />

                <Card className="mt-4 mb-6">
                    <Descriptions title={t('safe.accountDetails')} bordered column={{ xs: 1, sm: 2 }}>
                        <Descriptions.Item label={t('safe.accountName')}>
                            {account.name}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('safe.balance')}>
                            <Text strong>{formatCurrency(account.balance)}</Text>
                        </Descriptions.Item>
                        {account.description && (
                            <Descriptions.Item label={t('safe.description')} span={2}>
                                {account.description}
                            </Descriptions.Item>
                        )}
                        <Descriptions.Item label={t('safe.createdAt')}>
                            {new Date(account.created_at).toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('safe.updatedAt')}>
                            {new Date(account.updated_at).toLocaleString()}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card>
                    <Title level={4} className="mb-4">{t('safe.accountTransactions')}</Title>
                    <Table 
                        dataSource={transactions}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            </div>
        </AppLayout>
    );
};

export default Show;
