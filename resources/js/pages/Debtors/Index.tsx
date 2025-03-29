// resources/js/Pages/Debtors/Index.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  Table,
  Button,
  Typography,
  Tag,
  Space
} from 'antd';
import { PlusCircle, Eye, Edit, Trash } from 'lucide-react';

const { Title } = Typography;

interface Debtor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  debts_count: number;
  debts_amount_sum: number;
  debts_balance_sum: number;
}

interface Props {
  debtors: Debtor[];
}

interface ColumnType {
  title: string;
  dataIndex?: string;
  key: string;
  render?: (text: any, record: Debtor) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

export default function Index({ debtors }: Props) {
  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Debtors', href: route('debtors.index') }
  ];

  const columns: ColumnType[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Link href={route('debtors.show', record.id)}>
          {record.name}
        </Link>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div>{record.email}</div>
          <div>{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Debts',
      dataIndex: 'debts_count',
      key: 'debts_count',
      align: 'right',
    },
    {
      title: 'Total Amount',
      dataIndex: 'debts_amount_sum',
      key: 'debts_amount_sum',
      align: 'right',
      render: (amount) => amount ? `IQD ${Number(amount).toLocaleString()}` : 'IQD 0',
    },
    {
      title: 'Balance',
      dataIndex: 'debts_balance_sum',
      key: 'debts_balance_sum',
      align: 'right',
      render: (balance) => {
        const value = balance || 0;
        return (
          <Tag color={value > 0 ? 'warning' : 'success'}>
            IQD {Number(value).toLocaleString()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Link href={route('debtors.show', record.id)}>
            <Button type="default" icon={<Eye size={16} />} size="small" />
          </Link>
          <Link href={route('debtors.edit', record.id)}>
            <Button type="default" icon={<Edit size={16} />} size="small" />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Debtors" />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>Debtors</Title>
          <Link href={route('debtors.create')}>
            <Button type="primary" icon={<PlusCircle size={16} />}>
              Add Debtor
            </Button>
          </Link>
        </div>

        <Card>
          <Table
            dataSource={debtors}
            columns={columns}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            locale={{
              emptyText: 'No debtors found'
            }}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
