import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button, Form, Input, Switch, Card, Typography, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';

const { Title } = Typography;
const { TextArea } = Input;

export default function Create() {
  const [colorHex, setColorHex] = useState<string>('#1677ff');

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    color_code: '#1677ff',
    active: true,
  });

  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Categories', href: route('categories.index') },
    { title: 'Create', href: route('categories.create') }
  ];

  const handleSubmit = () => {
    post(route('categories.store'));
  };

  const handleColorChange = (color: Color) => {
    const hex = color.toHexString();
    setColorHex(hex);
    setData('color_code', hex);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Category" />

      <div className="container" style={{ padding: '24px' }}>
        <Title level={2}>Create Category</Title>

        <Card>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Name"
              required
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name}
            >
              <Input
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder="Enter category name"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description}
            >
              <TextArea
                value={data.description || ''}
                onChange={e => setData('description', e.target.value)}
                placeholder="Enter description"
                rows={4}
              />
            </Form.Item>

            <Form.Item
              label="Color"
              validateStatus={errors.color_code ? 'error' : ''}
              help={errors.color_code}
            >
              <ColorPicker
                value={colorHex}
                onChange={handleColorChange}
                showText
              />
            </Form.Item>

            <Form.Item
              label="Status"
              validateStatus={errors.active ? 'error' : ''}
              help={errors.active}
            >
              <Switch
                checked={data.active}
                onChange={checked => setData('active', checked)}
              />
              <span style={{ marginLeft: '8px' }}>{data.active ? 'Active' : 'Inactive'}</span>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={processing}>
                Create Category
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
