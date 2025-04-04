import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button, Form, Input, Switch, Card, Typography, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { TextArea } = Input;

export default function Create() {
  const { t } = useTranslation();
  const [colorHex, setColorHex] = useState<string>('#1677ff');

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    color_code: '#1677ff',
    active: true,
  });

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('categories.title'), href: route('categories.index') },
    { title: t('categories.create'), href: route('categories.create') }
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
      <Head title={t('categories.createCategory')} />

      <div className="container" style={{ padding: '24px' }}>
        <Title level={2}>{t('categories.createCategory')}</Title>

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
                placeholder={t('categories.enterCategoryName')}
              />
            </Form.Item>

            <Form.Item
              label={t('categories.description')}
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description}
            >
              <TextArea
                value={data.description || ''}
                onChange={e => setData('description', e.target.value)}
                placeholder={t('categories.enterDescription')}
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
                {t('categories.createCategory')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
