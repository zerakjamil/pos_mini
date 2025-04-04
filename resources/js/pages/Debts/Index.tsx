import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Button,
  Tabs,
  Tag,
  Typography,
  Space
} from 'antd';
import DebtTable from '@/components/Debt/DebtTable';
import { PlusCircle, Eye, Edit, PlusCircle as PaymentIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { TabPane } = Tabs;

interface Debtor {
  id: number;
  name: string;
}

interface Debt {
  id: number;
  debtor_id: number;
  debtor?: Debtor;
  description: string;
  due_date: string;
  amount: number;
  balance: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
}

interface Props {
  debts: Debt[];
  auth: any;
}

interface ColumnType {
  title: string;
  dataIndex?: string;
  key: string;
  render?: (text: any, record: Debt) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

export default function Index({ debts }: Props) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('debts.title'), href: route('debts.index') }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const columns: ColumnType[] = [
    {
      title: t('debts.columns.debtor'),
      dataIndex: 'debtor',
      key: 'debtor',
      render: (_, record) => (
        <Link href={route('debtors.show', record.debtor_id)}>
          {record.debtor?.name}
        </Link>
      ),
    },
    {
      title: t('debts.columns.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('debts.columns.dueDate'),
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('debts.columns.amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => `${t('common.currency')} ${Number(amount).toLocaleString()}`,
    },
    {
      title: t('debts.columns.balance'),
      dataIndex: 'balance',
      key: 'balance',
      align: 'right',
      render: (balance) => `${t('common.currency')} ${Number(balance).toLocaleString()}`,
    },
    {
      title: t('debts.columns.status'),
      dataIndex: 'status',
      key: 'status',
      align: 'right',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {t(`debts.status.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('common.action'),
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Link href={route('debts.show', record.id)}>
            <Button type="default" icon={<Eye size={16} />} size="small" aria-label={t('common.view')} />
          </Link>
          <Link href={route('debts.edit', record.id)}>
            <Button type="default" icon={<Edit size={16} />} size="small" aria-label={t('common.edit')} />
          </Link>
          <Link href={route('debts.payments.create', record.id)}>
            <Button type="default" icon={<PaymentIcon size={16} />} size="small" aria-label={t('debts.addPayment')} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('debts.title')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('debts.title')}</Title>
          <Link href={route('debts.create')}>
            <Button type="primary" icon={<PlusCircle size={16} />}>
              {t('debts.addDebt')}
            </Button>
          </Link>
        </div>

        <Tabs defaultActiveKey="all">
          <TabPane tab={t('debts.tabs.all')} key="all">
            <DebtTable debts={debts} columns={columns} />
          </TabPane>
          <TabPane tab={t('debts.tabs.pending')} key="pending">
            <DebtTable debts={debts.filter(debt => debt.status === 'pending')} columns={columns} />
          </TabPane>
          <TabPane tab={t('debts.tabs.partial')} key="partial">
            <DebtTable debts={debts.filter(debt => debt.status === 'partial')} columns={columns} />
          </TabPane>
          <TabPane tab={t('debts.tabs.paid')} key="paid">
            <DebtTable debts={debts.filter(debt => debt.status === 'paid')} columns={columns} />
          </TabPane>
          <TabPane tab={t('debts.tabs.overdue')} key="overdue">
            <DebtTable debts={debts.filter(debt => debt.status === 'overdue')} columns={columns} />
          </TabPane>
        </Tabs>
      </div>
    </AppLayout>
  );
}
