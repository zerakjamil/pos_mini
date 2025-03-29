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
      const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Debts', href: route('debts.index') }
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
          title: 'Debtor',
          dataIndex: 'debtor',
          key: 'debtor',
          render: (_, record) => (
            <Link href={route('debtors.show', record.debtor_id)}>
              {record.debtor?.name}
            </Link>
          ),
        },
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: 'Due Date',
          dataIndex: 'due_date',
          key: 'due_date',
          render: (date) => new Date(date).toLocaleDateString(),
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          align: 'right',
          render: (amount) => `IQD ${Number(amount).toLocaleString()}`,
        },
        {
          title: 'Balance',
          dataIndex: 'balance',
          key: 'balance',
          align: 'right',
          render: (balance) => `IQD ${balance.toLocaleString()}`,
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          align: 'right',
          render: (status) => (
            <Tag color={getStatusColor(status)}>
              {status.toUpperCase()}
            </Tag>
          ),
        },
        {
          title: 'Actions',
          key: 'actions',
          align: 'right',
          render: (_, record) => (
            <Space size="small">
              <Link href={route('debts.show', record.id)}>
                <Button type="default" icon={<Eye size={16} />} size="small" />
              </Link>
              <Link href={route('debts.edit', record.id)}>
                <Button type="default" icon={<Edit size={16} />} size="small" />
              </Link>
              <Link href={route('debts.payments.create', record.id)}>
                <Button type="default" icon={<PaymentIcon size={16} />} size="small" />
              </Link>
            </Space>
          ),
        },
      ];
console.log(debts)
      return (
        <AppLayout breadcrumbs={breadcrumbs}>
          <Head title="Debts" />

          <div className="container" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Title level={2}>Debts</Title>
              <Link href={route('debts.create')}>
                <Button type="primary" icon={<PlusCircle size={16} />}>
                  Add Debt
                </Button>
              </Link>
            </div>

            <Tabs defaultActiveKey="all">
              <TabPane tab="All" key="all">
                <DebtTable debts={debts} columns={columns} />
              </TabPane>
              <TabPane tab="Pending" key="pending">
                <DebtTable debts={debts.filter(debt => debt.status === 'pending')} columns={columns} />
              </TabPane>
              <TabPane tab="Partial" key="partial">
                <DebtTable debts={debts.filter(debt => debt.status === 'partial')} columns={columns} />
              </TabPane>
              <TabPane tab="Paid" key="paid">
                <DebtTable debts={debts.filter(debt => debt.status === 'paid')} columns={columns} />
              </TabPane>
              <TabPane tab="Overdue" key="overdue">
                <DebtTable debts={debts.filter(debt => debt.status === 'overdue')} columns={columns} />
              </TabPane>
            </Tabs>
          </div>
        </AppLayout>
      );
    }
