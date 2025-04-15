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
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export default function Show({ payment }) {
  const { t } = useTranslation('payments/show');
  const debt = payment.debt;

  const breadcrumbs = [
    { title: t('payments.breadcrumbs.dashboard'), href: route('dashboard') },
    { title: t('payments.breadcrumbs.debts'), href: route('debts.index') },
    { title: debt.description, href: route('debts.show', debt.id) },
    {
      title: t('payments.breadcrumbs.payment', { id: payment.id }),
      href: route('payments.show', payment.id)
    }
  ];

  function handleDelete() {
    window.location.href = route('payments.destroy', payment.id);
  }

  const getMethodLabel = (method) => {
    if (!method) return t('payments.notSpecified');
    return method.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const amount = parseFloat(payment.amount || 0);
  const debtAmount = parseFloat(debt.amount || 0);
  const debtBalance = parseFloat(debt.balance || 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('payments.title')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('payments.title')}</Title>
          <Space>
            <Link href={route('payments.edit', payment.id)}>
              <Button type="primary" icon={<Edit size={16} />}>
                {t('payments.actions.edit')}
              </Button>
            </Link>
            <Popconfirm
              title={t('payments.deleteConfirmation.title')}
              description={t('payments.deleteConfirmation.description')}
              onConfirm={handleDelete}
              okText={t('payments.deleteConfirmation.confirm')}
              cancelText={t('payments.deleteConfirmation.cancel')}
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<Trash size={16} />}>
                {t('payments.actions.delete')}
              </Button>
            </Popconfirm>
          </Space>
        </div>

        <Card>
          <Descriptions title={t('payments.information')} bordered column={1}>
            <Descriptions.Item label={t('payments.amount')}>
              <Text strong>
                {t('payments.currency')} {Number(amount).toLocaleString()}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label={t('payments.date')}>
              {dayjs(payment.payment_date).format('MMMM D, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label={t('payments.paymentMethod')}>
              {getMethodLabel(payment.payment_method)}
            </Descriptions.Item>
            {payment.reference_number && (
              <Descriptions.Item label={t('payments.referenceNumber')}>
                {payment.reference_number}
              </Descriptions.Item>
            )}
            {payment.notes && (
              <Descriptions.Item label={t('payments.notes')}>
                {payment.notes}
              </Descriptions.Item>
            )}
          </Descriptions>

          <Divider />

          <Descriptions title={t('payments.relatedDebt')} bordered column={1}>
            <Descriptions.Item label={t('payments.debtor')}>
              <Link href={route('debtors.show', debt.debtor_id)}>{debt.debtor.name}</Link>
            </Descriptions.Item>
            <Descriptions.Item label={t('payments.description')}>
              {debt.description}
            </Descriptions.Item>
            <Descriptions.Item label={t('payments.dueDate')}>
              {dayjs(debt.due_date).format('MMMM D, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label={t('payments.amount')}>
              {t('payments.currency')} {Number(debtAmount).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label={t('payments.balance')}>
              <Text type={debtBalance > 0 ? "danger" : "success"} strong>
                {t('payments.currency')} {Number(debtBalance).toLocaleString()}
              </Text>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
            <Link href={route('debts.show', debt.id)}>
              <Button icon={<ArrowLeft size={16} />}>
                {t('payments.actions.backToDebt')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
