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

export default function Show({ cardDebt }) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('dashboard.title'), href: route('dashboard') },
    { title: t('cardDebts.title'), href: route('card-debts.index') },
    { title: cardDebt.card_type, href: route('card-debts.show', cardDebt.id) }
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
    window.location.href = route('card-debts.payments.destroy', paymentId);
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
      title: t('common.actions'),
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Link href={route('card-debts.payments.edit', record.id)}>
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

  const totalPaid = cardDebt.payments.reduce((sum, payment) => sum + parseFloat(payment.amount || 0), 0);
  const amount = parseFloat(cardDebt.amount || 0);
  const balance = parseFloat(cardDebt.balance || 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('cardDebts.showTitle', { cardType: cardDebt.card_type })} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('cardDebts.details')}</Title>
          <Space>
            <Link href={route('card-debts.edit', cardDebt.id)}>
              <Button icon={<Edit size={16} />}>{t('cardDebts.editCardDebt')}</Button>
            </Link>
            <Link href={route('card-debts.payments.create', cardDebt.id)}>
              <Button type="primary" icon={<PlusCircle size={16} />}>{t('payments.recordPayment')}</Button>
            </Link>
          </Space>
        </div>

        <Card>
          <Descriptions title={t('cardDebts.information')} bordered column={2} layout="vertical">
            <Descriptions.Item label={t('cardDebts.debtor')}>
              <Link href={route('debtors.show', cardDebt.debtor_id)}>
                {cardDebt.debtor.name}
              </Link>
            </Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.status.title')}>
              <Tag color={getStatusColor(cardDebt.status)}>{t(`cardDebts.status.${cardDebt.status}`)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.cardType')}>{cardDebt.card_type}</Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.cardValue')}>{t('common.currency')} {Number(cardDebt.card_value).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.quantity')}>{cardDebt.quantity}</Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.dueDate')}>{new Date(cardDebt.due_date).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.totalAmount')}>{t('common.currency')} {Number(amount).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.balance')}>{t('common.currency')} {Number(balance).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.paidAmount')}>{t('common.currency')} {Number(totalPaid).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.createdAt')}>{new Date(cardDebt.created_at).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label={t('cardDebts.description')} span={2}>
              {cardDebt.description || t('cardDebts.noDescription')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        <Card title={t('payments.history')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Title level={4}>{t('payments.title')}</Title>
            <Link href={route('card-debts.payments.create', cardDebt.id)}>
              <Button type="primary" icon={<PlusCircle size={16} />}>
                {t('payments.addPayment')}
              </Button>
            </Link>
          </div>

          <Table
            columns={columns}
            dataSource={cardDebt.payments}
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
