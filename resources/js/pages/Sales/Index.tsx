import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Table, Typography, Button, Layout, Card, Space } from 'antd';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content, Header, Footer } = Layout;

interface Transaction {
  id: number;
  transaction_number: string;
  total_amount: number;
  amount_paid: number;
  change_amount: number;
  payment_method: string;
  cashier_name: string;
  created_at: string;
  updated_at: string;
}

interface SalesIndexProps {
  transactions: Transaction[];
}

const SalesIndex: React.FC<SalesIndexProps> = ({ transactions }) => {
  const columns = [
    {
      title: 'Transaction #',
      dataIndex: 'transaction_number',
      key: 'transaction_number',
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => method.charAt(0).toUpperCase() + method.slice(1),
    },
    {
      title: 'Cashier',
      dataIndex: 'cashier_name',
      key: 'cashier_name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Transaction) => (
        <Link href={`/sales/${record.id}`}>
          <Button type="primary" icon={<EyeOutlined />} size="small">
            View
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Head title="Sales History" />

      <Header style={{ background: '#fff', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/">
              <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
                Back to Dashboard
              </Button>
            </Link>
            <Title level={4} style={{ margin: 0 }}>Sales History</Title>
          </div>
          <Link href="/cashier">
            <Button type="primary">
              New Sale
            </Button>
          </Link>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Card>
          <Table
            columns={columns}
            dataSource={transactions}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
          />
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        POS System ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default SalesIndex;
