import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button, Card, Descriptions, Table, Typography, Tag, Space, Popconfirm } from 'antd';
import { Edit, Trash, ArrowLeft } from 'lucide-react';

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
  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Categories', href: route('categories.index') },
    { title: category.name, href: route('categories.show', category.id) }
  ];

  const productColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => (
        <Link href={route('products.show', record.id)}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right' as const,
      render: (price: number) => `IQD ${Number(price).toLocaleString()}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      align: 'right' as const,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Category: ${category.name}`} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>Category: {category.name}</Title>
          <Space>
            <Link href={route('categories.index')}>
              <Button icon={<ArrowLeft size={16} />}>
                Back to Categories
              </Button>
            </Link>

            <Link href={route('categories.edit', category.id)}>
              <Button type="primary" icon={<Edit size={16} />}>
                Edit
              </Button>
            </Link>

            <Popconfirm
              title="Delete this category?"
              description="Are you sure you want to delete this category? This action cannot be undone."
              onConfirm={() => {
                // Call route to delete category
                window.location.href = route('categories.destroy', category.id);
              }}
              okText="Yes"
              cancelText="No"
              disabled={category.products.length > 0}
            >
              <Button
                type="primary"
                danger
                icon={<Trash size={16} />}
                disabled={category.products.length > 0}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        </div>

        <Card style={{ marginBottom: '24px' }}>
          <Descriptions title="Category Details" bordered>
            <Descriptions.Item label="Name" span={3}>{category.name}</Descriptions.Item>
            <Descriptions.Item label="Description" span={3}>{category.description || 'No description'}</Descriptions.Item>
            <Descriptions.Item label="Color">
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
              ) : 'No color'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={category.active ? 'success' : 'default'}>
                {category.active ? 'Active' : 'Inactive'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Products">{category.products.length}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Products in this Category">
          <Table
            dataSource={category.products}
            columns={productColumns}
            rowKey="id"
            pagination={category.products.length > 10 ? { pageSize: 10 } : false}
            locale={{
              emptyText: 'No products in this category'
            }}
          />
        </Card>
      </div>
    </AppLayout>
  );
}
