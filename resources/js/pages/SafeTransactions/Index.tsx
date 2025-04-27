import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { App, Button, Card, Table, Typography } from 'antd';
import { PageHeader } from '@/components/page-header';
import { Link } from '@inertiajs/react';
import NewTransactionModal from './components/NewTransactionModal';
import { SafeTransaction } from '@/types/safe';
import { formatCurrency } from '@/utils/format';
import { PlusCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const { Title } = Typography;
const { message } = App;

interface SafeTransactionsProps {
    transactions: SafeTransaction[];
    safeAccounts: {
        id: string;
        name: string;
        balance: number;
    }[];
}

const SafeTransactions: React.FC<SafeTransactionsProps> = ({ transactions, safeAccounts }) => {
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState<SafeTransaction[]>(transactions);

    useEffect(() => {
        setTableData(transactions);
    }, [transactions]);

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
            title: t('safe.senderAccount'),
            dataIndex: 'sender_name',
            key: 'sender_name',
        },
        {
            title: t('safe.receiverAccount'),
            dataIndex: 'receiver_name',
            key: 'receiver_name',
        },
        {
            title: t('safe.amount'),
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => formatCurrency(amount),
        },
        {
            title: t('safe.description'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        }
    ];

    const handleCreateTransaction = () => {
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleTransactionSuccess = (transaction: SafeTransaction) => {
        setTableData([transaction, ...tableData]);
        setIsModalVisible(false);
        message.success(t('safe.transactionSuccess'));
    };

    return (
        <AppLayout>
            <Head title={t('safe.transactions')} />
            
            <div className="container p-6">
                <PageHeader
                    title={t('safe.transactions')}
                    breadcrumbItems={[
                        { title: t('sidebar.dashboard'), href: route('dashboard') },
                        { title: t('sidebar.safeTransactions'), href: route('safe-transactions') },
                    ]}
                    actions={
                        <Button 
                            type="primary" 
                            icon={<PlusCircle className="h-4 w-4" />} 
                            onClick={handleCreateTransaction}
                        >
                            {t('safe.create')}
                        </Button>
                    }
                />

                <Card className="mt-4">
                    <Table 
                        dataSource={tableData}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>

                <NewTransactionModal
                    visible={isModalVisible}
                    onCancel={handleModalCancel}
                    onSuccess={handleTransactionSuccess}
                    safeAccounts={safeAccounts}
                />
            </div>
        </AppLayout>
    );
};

export default SafeTransactions;