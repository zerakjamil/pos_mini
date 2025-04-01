// resources/js/Pages/Payments/Show.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  Button,
  Typography,
  Descriptions,
  Divider,
  Space,
  Popconfirm
} from 'antd';
import { Edit, ArrowLeft, Trash } from 'lucide-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function Show({ payment }) {
  const debt = payment.debt;

  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Debts', href: route('debts.index') },
    { title: debt.description, href: route('debts.show', debt.id) },
    { title: `Payment #${payment.id}`, href: route('payments.show', payment.id) }
  ];

  function handleDelete() {
    window.location.href = route('payments.destroy', payment.id);
  }

  const getMethodLabel = (method) => {
    if (!method) return 'Not specified';
    return method.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const amount = parseFloat(payment.amount || 0);
  const debtAmount = parseFloat(debt.amount || 0);
  const debtBalance = parseFloat(debt.balance || 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Payment Details" />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>Payment Details</Title>
          <Space>
            <Link href={route('payments.edit', payment.id)}>
              <Button type="primary" icon={<Edit size={16} />}>Edit</Button>
            </Link>
            <Popconfirm
              title="Delete payment"
              description="Are you sure you want to delete this payment?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<Trash size={16} />}>Delete</Button>
            </Popconfirm>
          </Space>
        </div>

        <Card>
          <Descriptions title="Payment Information" bordered column={1}>
            <Descriptions.Item label="Amount">
              <Text strong>${amount.toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {dayjs(payment.payment_date).format('MMMM D, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {getMethodLabel(payment.payment_method)}
            </Descriptions.Item>
            {payment.reference_number && (
              <Descriptions.Item label="Reference Number">
                {payment.reference_number}
              </Descriptions.Item>
            )}
            {payment.notes && (
              <Descriptions.Item label="Notes">
                {payment.notes}
              </Descriptions.Item>
            )}
          </Descriptions>

          <Divider />

          <Descriptions title="Related Debt" bordered column={1}>
            <Descriptions.Item label="Debtor">
              <Link href={route('debtors.show', debt.debtor_id)}>{debt.debtor.name}</Link>
            </Descriptions.Item>
            <Descriptions.Item label="Description">{debt.description}</Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {dayjs(debt.due_date).format('MMMM D, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">${debtAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Balance">
              <Text type={debtBalance > 0 ? "danger" : "success"} strong>
                ${debtBalance.toFixed(2)}
              </Text>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
            <Link href={route('debts.show', debt.id)}>
              <Button icon={<ArrowLeft size={16} />}>Back to Debt</Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
