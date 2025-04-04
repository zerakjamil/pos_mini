import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button, Card, Descriptions, Table, Typography, Tag, Space, Popconfirm } from 'antd';
import { Edit, Trash, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  color_code: string | null;
  active: boolean;
  products: Product[];
}

interface Props {
  category: Category;
}

export default function Show({ category }: Props) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('dashboard.title'), href: route('dashboard') },
    { title: t('categories.title'), href: route('categories.index') },
    { title: category.name, href: route('categories.show', category.id) }
  ];

  const productColumns = [
    {
      title: t('products.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => (
        <Link href={route('product.show', record.id)}>
          {text}
        </Link>
      ),
    },
    {
      title: t('products.price'),
      dataIndex: 'price',
      key: 'price',
      align: 'right' as const,
      render: (price: number) => `${t('common.currency')} ${Number(price).toLocaleString()}`,
    },
    {
      title: t('products.stock'),
      dataIndex: 'stock',
      key: 'stock',
      align: 'right' as const,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('categories.categoryTitle', { name: category.name })} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('categories.categoryTitle', { name: category.name })}</Title>
          <Space>
            <Link href={route('categories.index')}>
              <Button icon={<ArrowLeft size={16} />}>
                {t('categories.backToCategories')}
              </Button>
            </Link>

            <Link href={route('categories.edit', category.id)}>
              <Button type="primary" icon={<Edit size={16} />}>
                {t('common.edit')}
              </Button>
            </Link>

            <Popconfirm
              title={t('categories.deleteConfirmTitle')}
              description={t('categories.deleteConfirmDescription')}
              onConfirm={() => {
                window.location.href = route('categories.destroy', category.id);
              }}
              okText={t('common.yes')}
              cancelText={t('common.no')}
              disabled={category.products.length > 0}
            >
              <Button
                type="primary"
                danger
                icon={<Trash size={16} />}
                disabled={category.products.length > 0}
              >
                {t('common.delete')}
              </Button>
            </Popconfirm>
          </Space>
        </div>

        <Card style={{ marginBottom: '24px' }}>
          <Descriptions title={t('categories.details')} bordered>
            <Descriptions.Item label={t('categories.name')} span={3}>{category.name}</Descriptions.Item>
            <Descriptions.Item label={t('categories.description')} span={3}>{category.description || t('categories.noDescription')}</Descriptions.Item>
            <Descriptions.Item label={t('categories.color')}>
              {category.color_code ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    background: category.color_code,
                    marginRight: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '2px'
                  }}></div>
                  {category.color_code}
                </div>
              ) : t('categories.noColor')}
            </Descriptions.Item>
            <Descriptions.Item label={t('categories.status')}>
              <Tag color={category.active ? 'success' : 'default'}>
                {category.active ? t('common.active') : t('common.inactive')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('categories.productsCount')}>{category.products.length}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title={t('categories.productsInCategory')}>
          <Table
            dataSource={category.products}
            columns={productColumns}
            rowKey="id"
            pagination={category.products.length > 10 ? { pageSize: 10 } : false}
            locale={{
              emptyText: t('categories.noProductsInCategory')
            }}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
