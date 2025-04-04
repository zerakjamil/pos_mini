import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button, Form, Input, Switch, Card, Typography, Space, ColorPicker } from 'antd';
import { ArrowLeft } from 'lucide-react';
import type { Color } from 'antd/es/color-picker';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { TextArea } = Input;

interface Category {
  id: number;
  name: string;
  description: string | null;
  color_code: string | null;
  active: boolean;
}

interface Props {
  category: Category;
}

export default function Edit({ category }: Props) {
  const { t } = useTranslation();
  const [colorHex, setColorHex] = useState<string>(category.color_code || '#1677ff');

  const { data, setData, put, processing, errors } = useForm({
    name: category.name,
    description: category.description || '',
    color_code: category.color_code || '#1677ff',
    active: category.active,
  });

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('categories.title'), href: route('categories.index') },
    { title: category.name, href: route('categories.show', category.id) },
    { title: t('common.edit'), href: route('categories.edit', category.id) },
  ];

  const handleSubmit = () => {
    put(route('categories.update', category.id));
  };

  const handleColorChange = (color: Color) => {
    const hex = color.toHexString();
    setColorHex(hex);
    setData('color_code', hex);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('categories.editTitle', { name: category.name })} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('categories.editTitle', { name: category.name })}</Title>
          <Space>
            <Button icon={<ArrowLeft size={16} />} onClick={() => window.history.back()}>
              {t('common.back')}
            </Button>
          </Space>
        </div>

        <Card>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label={t('categories.name')}
              required
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name}
            >
              <Input
                value={data.name}
                onChange={e => setData('name', e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={t('categories.description')}
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description}
            >
              <TextArea
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                rows={4}
              />
            </Form.Item>

            <Form.Item
              label={t('categories.color')}
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
              label={t('categories.status')}
              validateStatus={errors.active ? 'error' : ''}
              help={errors.active}
            >
              <Switch
                checked={data.active}
                onChange={checked => setData('active', checked)}
              />
              <span style={{ marginLeft: '8px' }}>
                {data.active ? t('common.active') : t('common.inactive')}
              </span>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={processing}>
                {t('categories.updateCategory')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
