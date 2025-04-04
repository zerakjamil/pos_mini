import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button, Table, Typography, Tag, Space, Card } from 'antd';
import { PlusCircle, Eye, Edit, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface Category {
  id: number;
  name: string;
  description: string | null;
  color_code: string | null;
  active: boolean;
  products_count: number;
}

interface Props {
  categories: Category[];
}

export default function Index({ categories }: Props) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('categories.title'), href: route('categories.index') }
  ];

  const columns = [
    {
      title: t('categories.name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record: Category) => (
        <Link href={route('categories.show', record.id)}>
          <span style={{
            display: 'inline-block',
            borderLeft: record.color_code ? `4px solid ${record.color_code}` : undefined,
            paddingLeft: '8px'
          }}>
            {record.name}
          </span>
        </Link>
      ),
    },
    {
      title: t('categories.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('categories.products'),
      dataIndex: 'products_count',
      key: 'products_count',
      align: 'center' as const,
    },
    {
      title: t('categories.status'),
      dataIndex: 'active',
      key: 'active',
      align: 'center' as const,
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'default'}>
          {active ? t('common.active') : t('common.inactive')}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Category) => (
        <Space size="small">
          <Link href={route('categories.show', record.id)}>
            <Button type="default" icon={<Eye size={16} />} size="small" aria-label={t('common.view')} />
          </Link>
          <Link href={route('categories.edit', record.id)}>
            <Button type="default" icon={<Edit size={16} />} size="small" aria-label={t('common.edit')} />
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('categories.title')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('categories.title')}</Title>
          <Link href={route('categories.create')}>
            <Button type="primary" icon={<PlusCircle size={16} />}>
              {t('categories.addCategory')}
            </Button>
          </Link>
        </div>

        <Card>
          <Table
            dataSource={categories}
            columns={columns}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: t('categories.noCategoriesFound')
            }}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
