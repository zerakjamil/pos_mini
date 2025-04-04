import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  Typography,
  Descriptions,
  Button,
  Space,
  Popconfirm,
  Divider
} from 'antd';
import { Edit, Trash, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface CardType {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  cardType: CardType;
}

export default function Show({ cardType }: Props) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('cardTypes.title'), href: route('card-types.index') },
    { title: cardType.name, href: route('card-types.show', cardType.id) }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${t('cardTypes.title')} - ${cardType.name}`} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap' }}>
          <Title level={2}>{cardType.name}</Title>
          <Space>
            <Link href={route('card-types.index')}>
              <Button icon={<ArrowLeft size={16} />}>
                {t('common.back')}
              </Button>
            </Link>
            <Link href={route('card-types.edit', cardType.id)}>
              <Button type="primary" icon={<Edit size={16} />}>
                {t('common.edit')}
              </Button>
            </Link>
            <Popconfirm
              title={t('cardTypes.deleteConfirmTitle')}
              description={t('cardTypes.deleteConfirmDescription')}
              onConfirm={() => window.location.href = route('card-types.destroy', cardType.id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
            >
              <Button danger icon={<Trash size={16} />}>
                {t('common.delete')}
              </Button>
            </Popconfirm>
          </Space>
        </div>

        <Card>
          <Descriptions title={t('cardTypes.details')} bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label={t('cardTypes.name')}>
              {cardType.name}
            </Descriptions.Item>
            <Descriptions.Item label={t('cardTypes.description')}>
              {cardType.description || t('cardTypes.noDescription')}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.createdAt')}>
              {new Date(cardType.created_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.updatedAt')}>
              {new Date(cardType.updated_at).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </AppLayout>
  );
}
