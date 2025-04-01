import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, Button, Typography, Tag, Table, Space, Descriptions } from 'antd';
import { EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { PageProps } from '@inertiajs/core';

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
  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Debtors', href: route('debtors.index') },
    { title: debtor.name, href: route('debtors.show', debtor.id) }
  ];

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: number | string) => `$${Number(amount).toFixed(2)}`,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right' as const,
      render: (balance: number | string) => `$${Number(balance).toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'right' as const,
      render: (status: string) => (
        <Tag color={status === 'paid' ? 'success' : status === 'partial' ? 'warning' : 'error'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: unknown, record: Debt) => (
        <Space>
          <Link href={route('debts.show', record.id)}>
            <Button icon={<EyeOutlined />} size="small" />
          </Link>
          <Link href={route('debts.payments.create', record.id)}>
            <Button icon={<PlusOutlined />} size="small" />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Debtor - ${debtor.name}`} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={2}>{debtor.name}</Title>
          <Space>
            <Link href={route('debtors.edit', debtor.id)}>
              <Button icon={<EditOutlined />}>Edit</Button>
            </Link>
            {/* Fix the nested button issue by using a div instead of a button */}
            <Link href={route('debts.create')} data={{ debtor_id: debtor.id }}>
              <Button type="primary" icon={<PlusOutlined />}>Add Debt</Button>
            </Link>
          </Space>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <Card title="Debtor Information">
            <Descriptions column={1}>
              {debtor.email && <Descriptions.Item label="Email">{debtor.email}</Descriptions.Item>}
              {debtor.phone && <Descriptions.Item label="Phone">{debtor.phone}</Descriptions.Item>}
              {debtor.address && <Descriptions.Item label="Address">{debtor.address}</Descriptions.Item>}
              {debtor.notes && <Descriptions.Item label="Notes">{debtor.notes}</Descriptions.Item>}
            </Descriptions>
          </Card>

          <Card title="Summary">
            <Descriptions column={2}>
              <Descriptions.Item label="Total Debts">{debtor.debts.length}</Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                IQD {debtor.debts.reduce((sum: number, debt: Debt) => sum + Number(debt.amount), 0).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Outstanding">
                <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                  IQD {debtor.debts.reduce((sum: number, debt: Debt) => sum + Number(debt.balance), 0).toLocaleString()}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Paid">
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                  IQD {debtor.debts.reduce((sum: number, debt: Debt) => sum + (Number(debt.amount) - Number(debt.balance)), 0).toLocaleString()}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        <Card title="Debts">
          <Table
            columns={columns}
            dataSource={debtor.debts}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: 'No debts recorded for this debtor',
            }}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
