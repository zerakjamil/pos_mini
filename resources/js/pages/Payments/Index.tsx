// resources/js/Pages/Payments/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, Descriptions, Space, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import { Edit, Eye, PlusCircle } from 'lucide-react';

const { Title, Text } = Typography;

export default function Index({ debt, payments }) {
    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Debts', href: route('debts.index') },
        { title: debt.description, href: route('debts.show', debt.id) },
        { title: 'Payments', href: route('debts.payments.index', debt.id) },
    ];

    const columns = [
        {
            title: 'Date',
            dataIndex: 'payment_date',
            key: 'payment_date',
            render: (date) => dayjs(date).format('MMM D, YYYY'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (amount) => `IQD ${Number(amount).toLocaleString()}`,
        },
        {
            title: 'Method',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method) => method?.replace('_', ' ').toUpperCase() || 'N/A',
        },
        {
            title: 'Reference',
            dataIndex: 'reference_number',
            key: 'reference_number',
            render: (ref) => ref || 'N/A',
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes) => notes || '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Link href={route('payments.show', record.id)}>
                        <Button type="default" icon={<Eye size={16} />} size="small" />
                    </Link>
                    <Link href={route('payments.edit', record.id)}>
                        <Button type="default" icon={<Edit size={16} />} size="small" />
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
            <Head title={`Payments - ${debt.description}`} />

            <div className="container" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Title level={2}>Payments for {debt.description}</Title>
                    <Link href={route('debts.payments.create', debt.id)}>
                        <Button type="primary" icon={<PlusCircle size={16} />}>
                            Add Payment
                        </Button>
                    </Link>
                </div>

                <Card style={{ marginBottom: '24px' }}>
                    <Descriptions title="Debt Information" bordered column={2}>
                        <Descriptions.Item label="Debtor">{debt.debtor.name}</Descriptions.Item>
                        <Descriptions.Item label="Due Date">{dayjs(debt.due_date).format('MMM D, YYYY')}</Descriptions.Item>
                        <Descriptions.Item label="Amount">IQD {Number(amount).toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="Balance">
                            <Text strong type={balance > 0 ? 'danger' : 'success'}>
                                IQD {Number(balance).toLocaleString()}
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
                                    <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="right">
                                        <Text strong>IQD {Number(totalAmount).toLocaleString()}</Text>
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
