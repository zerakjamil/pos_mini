import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Button,
  Tabs,
  Tag,
  Typography,
  Space
} from 'antd';
import { PlusCircle, Eye, Edit, PlusCircle as PaymentIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CardDebtTable from '@/pages/CardDebts/components/CardDebtTable';

const { Title } = Typography;
const { TabPane } = Tabs;

interface Debtor {
  id: number;
  name: string;
}

interface CardDebt {
  id: number;
  debtor_id: number;
  debtor?: Debtor;
  card_type: string;
  card_value: number;
  quantity: number;
  description: string;
  due_date: string;
  amount: number;
  balance: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
}

interface Props {
  cardDebts: CardDebt[];
  auth: any;
}

export default function Index({ cardDebts }: Props) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('cardDebts.title'), href: route('card-debts.index') }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'success';
      case 'partial': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: t('cardDebts.columns.debtor'),
      dataIndex: 'debtor',
      key: 'debtor',
      render: (_, record) => (
        <Link href={route('debtors.show', record.debtor_id)}>
          {record.debtor?.name}
        </Link>
      ),
    },
    {
      title: t('cardDebts.columns.cardType'),
      dataIndex: 'card_type',
      key: 'card_type',
    },
    {
      title: t('cardDebts.columns.cardValue'),
      dataIndex: 'card_value',
      key: 'card_value',
      align: 'right',
      render: (value) => `${t('common.currency')} ${Number(value).toLocaleString()}`,
    },
    {
      title: t('cardDebts.columns.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
    },
    {
      title: t('cardDebts.columns.dueDate'),
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('cardDebts.columns.amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => `${t('common.currency')} ${Number(amount).toLocaleString()}`,
    },
    {
      title: t('cardDebts.columns.balance'),
      dataIndex: 'balance',
      key: 'balance',
      align: 'right',
      render: (balance) => `${t('common.currency')} ${Number(balance).toLocaleString()}`,
    },
    {
      title: t('cardDebts.columns.status'),
      dataIndex: 'status',
      key: 'status',
      align: 'right',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {t(`cardDebts.status.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('common.action'),
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Link href={route('card-debts.show', record.id)}>
            <Button type="default" icon={<Eye size={16} />} size="small" aria-label={t('common.view')} />
          </Link>
          <Link href={route('card-debts.edit', record.id)}>
            <Button type="default" icon={<Edit size={16} />} size="small" aria-label={t('common.edit')} />
          </Link>
          <Link href={route('card-debts.payments.create', record.id)}>
            <Button type="default" icon={<PaymentIcon size={16} />} size="small" aria-label={t('cardDebts.addPayment')} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('cardDebts.title')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('cardDebts.title')}</Title>
          <Link href={route('card-debts.create')}>
            <Button type="primary" icon={<PlusCircle size={16} />}>
              {t('cardDebts.addCardDebt')}
            </Button>
          </Link>
        </div>

        <Tabs defaultActiveKey="all">
          <TabPane tab={t('cardDebts.tabs.all')} key="all">
            <CardDebtTable cardDebts={cardDebts} columns={columns} />
          </TabPane>
          <TabPane tab={t('cardDebts.tabs.pending')} key="pending">
            <CardDebtTable cardDebts={cardDebts.filter(debt => debt.status === 'pending')} columns={columns} />
          </TabPane>
          <TabPane tab={t('cardDebts.tabs.partial')} key="partial">
            <CardDebtTable cardDebts={cardDebts.filter(debt => debt.status === 'partial')} columns={columns} />
          </TabPane>
          <TabPane tab={t('cardDebts.tabs.paid')} key="paid">
            <CardDebtTable cardDebts={cardDebts.filter(debt => debt.status === 'paid')} columns={columns} />
          </TabPane>
          <TabPane tab={t('cardDebts.tabs.overdue')} key="overdue">
            <CardDebtTable cardDebts={cardDebts.filter(debt => debt.status === 'overdue')} columns={columns} />
          </TabPane>
        </Tabs>
      </div>
    </AppLayout>
  );
}
