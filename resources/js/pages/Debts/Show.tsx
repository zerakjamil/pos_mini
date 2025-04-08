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
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export default function Show({ debt }) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('dashboard.title'), href: route('dashboard') },
    { title: t('debts.title'), href: route('debts.index') },
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
      title: t('payments.columns.date'),
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('payments.columns.amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => `${t('common.currency')} ${Number(amount).toLocaleString()}`,
    },
    {
      title: t('payments.columns.method'),
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: t('payments.columns.reference'),
      dataIndex: 'reference_number',
      key: 'reference_number',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Link href={route('payments.edit', record.id)}>
            <Button type="default" icon={<Edit size={16} />} size="small" aria-label={t('common.edit')} />
          </Link>
          <Popconfirm
            title={t('payments.deleteConfirmTitle')}
            description={t('payments.deleteConfirmDescription')}
            onConfirm={() => handleDeletePayment(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button danger type="default" icon={<Trash size={16} />} size="small" aria-label={t('common.delete')} />
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
      <Head title={t('debts.showTitle', { description: debt.description })} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('debts.details')}</Title>
          <Space>
            <Link href={route('debts.edit', debt.id)}>
              <Button icon={<Edit size={16} />}>{t('debts.editDebt')}</Button>
            </Link>
            <Link href={route('debts.payments.create', debt.id)}>
              <Button type="primary" icon={<PlusCircle size={16} />}>{t('payments.recordPayment')}</Button>
            </Link>
          </Space>
        </div>

        <Card>
          <Descriptions title={t('debts.information')} bordered column={2} layout="vertical">
            <Descriptions.Item label={t('debts.debtor')}>
              <Link href={route('debtors.show', debt.debtor_id)}>
                {debt.debtor.name}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label={t('debts.status.title')}>
              <Tag color={getStatusColor(debt.status)}>{t(`debts.status.${debt.status}`)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('debts.description')}>{debt.description}</Descriptions.Item>
            <Descriptions.Item label={t('debts.dueDate')}>{new Date(debt.due_date).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label={t('debts.totalAmount')}>{t('common.currency')} {Number(amount).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label={t('debts.balance')}>{t('common.currency')} {Number(balance).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label={t('debts.paidAmount')}>{t('common.currency')} {Number(totalPaid).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label={t('debts.createdAt')}>{new Date(debt.created_at).toLocaleDateString()}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        <Card title={t('payments.history')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Title level={4}>{t('payments.title')}</Title>
            <Link href={route('debts.payments.create', debt.id)}>
              <Button type="primary" icon={<PlusCircle size={16} />}>
                {t('payments.addPayment')}
              </Button>
            </Link>
          </div>

          <Table
            columns={columns}
            dataSource={debt.payments}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: t('payments.noPaymentsRecorded')
            }}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
