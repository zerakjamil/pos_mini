// resources/js/Pages/Debts/Show.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  Button,
  Typography,
  Descriptions,
  Table,
  Space,
  Divider,
  Tag,
  Popconfirm
} from 'antd';
import { Edit, PlusCircle, Trash } from 'lucide-react';

const { Title, Text } = Typography;

export default function Show({ debt }) {
  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Debts', href: route('debts.index') },
    { title: debt.description, href: route('debts.show', debt.id) }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const handleDeletePayment = (paymentId) => {
    // Submit delete request for the payment
    window.location.href = route('payments.destroy', paymentId);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => `$${parseFloat(amount).toFixed(2)}`,
    },
    {
      title: 'Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: 'Reference',
      dataIndex: 'reference_number',
      key: 'reference_number',
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Link href={route('payments.edit', record.id)}>
            <Button type="default" icon={<Edit size={16} />} size="small" />
          </Link>
          <Popconfirm
            title="Delete payment"
            description="Are you sure you want to delete this payment?"
            onConfirm={() => handleDeletePayment(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="default" icon={<Trash size={16} />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalPaid = debt.payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
  const amount = parseFloat(debt.amount || 0);
  const balance = parseFloat(debt.balance || 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Debt - ${debt.description}`} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>Debt Details</Title>
          <Space>
            <Link href={route('debts.edit', debt.id)}>
              <Button icon={<Edit size={16} />}>Edit Debt</Button>
            </Link>
            <Link href={route('debts.payments.create', debt.id)}>
              <Button type="primary" icon={<PlusCircle size={16} />}>Record Payment</Button>
            </Link>
          </Space>
        </div>

        <Card>
          <Descriptions title="Debt Information" bordered column={2} layout="vertical">
            <Descriptions.Item label="Debtor">
              <Link href={route('debtors.show', debt.debtor_id)}>
                {debt.debtor.name}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(debt.status)}>{debt.status.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Description">{debt.description}</Descriptions.Item>
            <Descriptions.Item label="Due Date">{new Date(debt.due_date).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Total Amount">${amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Balance">${balance.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Paid Amount">${totalPaid.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Created At">{new Date(debt.created_at).toLocaleDateString()}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        <Card title="Payment History">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Title level={4}>Payments</Title>
            <Link href={route('debts.payments.create', debt.id)}>
              <Button type="primary" icon={<PlusCircle size={16} />}>
                Add Payment
              </Button>
            </Link>
          </div>

          <Table
            columns={columns}
            dataSource={debt.payments}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: 'No payments recorded yet'
            }}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
