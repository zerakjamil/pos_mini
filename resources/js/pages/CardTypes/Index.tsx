import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Button,
  Table,
  Typography,
  Space,
  Popconfirm,
  message
} from 'antd';
import { PlusCircle, Edit, Trash, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface CardType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function Index({ cardTypes, flash }) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('cardTypes.title'), href: route('card-types.index') }
  ];

  if (flash?.success) {
    message.success(flash.success);
  }

  if (flash?.error) {
    message.error(flash.error);
  }

  const columns = [
    {
      title: t('cardTypes.columns.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('cardTypes.columns.description'),
      dataIndex: 'description',
      key: 'description',
      render: (description: string | null) => description || t('cardTypes.noDescription'),
    },
    {
      title: t('cardTypes.columns.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('common.action'),
      key: 'actions',
      align: 'right',
      render: (_, record: CardType) => (
        <Space size="small">
            <Link href={route('card-types.show', record.id)}>
                <Button type={'primary'} icon={<Eye size={16} />} size="small">
                    {t('common.view')}
                </Button>
            </Link>
          <Link href={route('card-types.edit', record.id)}>
            <Button type="primary" icon={<Edit size={16} />} size="small">
              {t('common.edit')}
            </Button>
          </Link>
          <Popconfirm
            title={t('cardTypes.deleteConfirmTitle')}
            description={t('cardTypes.deleteConfirmDescription')}
            onConfirm={() => window.location.href = route('card-types.destroy', record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button danger icon={<Trash size={16} />} size="small">
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('cardTypes.title')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('cardTypes.title')}</Title>
          <Link href={route('card-types.create')}>
            <Button type="primary" icon={<PlusCircle size={16} />}>
              {t('cardTypes.addCardType')}
            </Button>
          </Link>
        </div>

        <Table
          dataSource={cardTypes}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
          locale={{
            emptyText: t('cardTypes.noCardTypesFound')
          }}
        />
      </div>
    </AppLayout>
  );
}
