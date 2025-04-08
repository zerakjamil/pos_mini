import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, Descriptions, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { Edit, Eye, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export default function Index({ debt, payments }) {
    const { t } = useTranslation();

    const breadcrumbs = [
        { title: t('common.dashboard'), href: route('dashboard') },
        { title: t('debts.title'), href: route('debts.index') },
        { title: t('debt.description'), href: route('debts.show', debt.id) },
        { title: t('payments.title'), href: route('debts.payments.index', debt.id) },
    ];

    const columns = [
        {
            title: t('payments.date'),
            dataIndex: 'payment_date',
            key: 'payment_date',
            render: (date) => dayjs(date).format('MMM D, YYYY'),
        },
        {
            title: t('payments.amount'),
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (amount) => `${t('common.currency')} ${Number(amount).toLocaleString()}`,
        },
        {
            title: t('payments.method'),
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method) => method ? t(`payments.methods.${method}`) : t('common.notApplicable'),
        },
        {
            title: t('payments.reference'),
            dataIndex: 'reference_number',
            key: 'reference_number',
            render: (ref) => ref || t('common.notApplicable'),
        },
        {
            title: t('payments.notes'),
            dataIndex: 'notes',
            key: 'notes',
            render: (notes) => notes || '-',
        },
        {
            title: t('common.actions'),
            key: 'actions',
            align: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Link href={route('payments.show', record.id)}>
                        <Button type="default" icon={<Eye size={16} />} size="small" title={t('common.view')} />
                    </Link>
                    <Link href={route('payments.edit', record.id)}>
                        <Button type="default" icon={<Edit size={16} />} size="small" title={t('common.edit')} />
                    </Link>
                </Space>
            ),
        },
    ];

    const amount = parseFloat(debt.amount || 0);
    const balance = parseFloat(debt.balance || 0);
    const totalAmount = payments.reduce((pre, cur) => pre + parseFloat(cur.amount || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('payments.paymentsForDebt', { debt: debt.description })} />

            <div className="container" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Title level={2}>{t('payments.paymentsForDebt', { debt: debt.description })}</Title>
                    <Link href={route('debts.payments.create', debt.id)}>
                        <Button type="primary" icon={<PlusCircle size={16} />}>
                            {t('payments.addPayment')}
                        </Button>
                    </Link>
                </div>

                <Card style={{ marginBottom: '24px' }}>
                    <Descriptions title={t('debts.debtInformation')} bordered column={2}>
                        <Descriptions.Item label={t('debtors.debtor')}>{debt.debtor.name}</Descriptions.Item>
                        <Descriptions.Item label={t('debts.dueDate')}>{dayjs(debt.due_date).format('MMM D, YYYY')}</Descriptions.Item>
                        <Descriptions.Item label={t('debts.amount')}>{t('common.currency')} {Number(amount).toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label={t('debts.balance')}>
                            <Text strong type={balance > 0 ? 'danger' : 'success'}>
                                {t('common.currency')} {Number(balance).toLocaleString()}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card>
                    <Table
                        dataSource={payments}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        summary={() => (
                            <Table.Summary>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0}>{t('common.total')}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="right">
                                        <Text strong>{t('common.currency')} {Number(totalAmount).toLocaleString()}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} colSpan={4}></Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
