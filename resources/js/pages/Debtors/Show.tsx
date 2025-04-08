import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, Button, Typography, Tag, Table, Space, Descriptions } from 'antd';
import { EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { PageProps } from '@inertiajs/core';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

// Define proper interfaces for the data
interface Debt {
  id: number;
  description: string;
  due_date: string;
  amount: number | string;
  balance: number | string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

interface Debtor {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  debts: Debt[];
}

interface DebtorShowProps extends PageProps {
  debtor: Debtor;
}

export default function Show({ debtor }: DebtorShowProps) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('debtors.title'), href: route('debtors.index') },
    { title: debtor.name, href: route('debtors.show', debtor.id) }
  ];

  const columns = [
    {
      title: t('debts.columns.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('debts.columns.dueDate'),
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('debts.columns.amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: number | string) => `${t('common.currency')} ${Number(amount).toLocaleString()}`,
    },
    {
      title: t('debts.columns.balance'),
      dataIndex: 'balance',
      key: 'balance',
      align: 'right' as const,
      render: (balance: number | string) => `${t('common.currency')} ${Number(balance).toLocaleString()}`,
    },
    {
      title: t('debts.columns.status'),
      dataIndex: 'status',
      key: 'status',
      align: 'right' as const,
      render: (status: string) => (
        <Tag color={status === 'paid' ? 'success' : status === 'partial' ? 'warning' : 'error'}>
          {t(`debts.status.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('common.action'),
      key: 'actions',
      align: 'right' as const,
      render: (_: unknown, record: Debt) => (
        <Space>
          <Link href={route('debts.show', record.id)}>
            <Button icon={<EyeOutlined />} size="small" aria-label={t('common.view')} />
          </Link>
          <Link href={route('debts.payments.create', record.id)}>
            <Button icon={<PlusOutlined />} size="small" aria-label={t('debts.addPayment')} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Typography.Title style={{ color: '#fff' }}>{t('debtors.showTitle', { name: debtor.name })}</Typography.Title>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={2}>{debtor.name}</Title>
          <Space>
            <Link href={route('debtors.edit', debtor.id)}>
              <Button icon={<EditOutlined />}>{t('common.edit')}</Button>
            </Link>
            <Link href={route('debts.create')} data={{ debtor_id: debtor.id }}>
              <Button type="primary" icon={<PlusOutlined />}>{t('debts.addDebt')}</Button>
            </Link>
          </Space>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <Card title={t('debtors.information')}>
            <Descriptions column={1}>
              {debtor.email && <Descriptions.Item label={t('debtors.email')}>{debtor.email}</Descriptions.Item>}
              {debtor.phone && <Descriptions.Item label={t('debtors.phone')}>{debtor.phone}</Descriptions.Item>}
              {debtor.address && <Descriptions.Item label={t('debtors.address')}>{debtor.address}</Descriptions.Item>}
              {debtor.notes && <Descriptions.Item label={t('debtors.notes')}>{debtor.notes}</Descriptions.Item>}
            </Descriptions>
          </Card>

          <Card title={t('debtors.summary')}>
            <Descriptions column={2}>
              <Descriptions.Item label={t('debtors.totalDebts')}>{debtor.debts.length}</Descriptions.Item>
              <Descriptions.Item label={t('debtors.totalAmount')}>
                {t('common.currency')} {debtor.debts.reduce((sum: number, debt: Debt) => sum + Number(debt.amount), 0).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('debtors.outstanding')}>
                <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                  {t('common.currency')} {debtor.debts.reduce((sum: number, debt: Debt) => sum + Number(debt.balance), 0).toLocaleString()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label={t('debtors.paid')}>
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                  {t('common.currency')} {debtor.debts.reduce((sum: number, debt: Debt) => sum + (Number(debt.amount) - Number(debt.balance)), 0).toLocaleString()}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        <Card title={t('debts.title')}>
          <Table
            columns={columns}
            dataSource={debtor.debts}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: t('debts.noDebtsRecorded'),
            }}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
