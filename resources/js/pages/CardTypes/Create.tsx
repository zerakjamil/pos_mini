import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message
} from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { TextArea } = Input;

interface CardTypeForm {
  name: string;
  description: string;
}

export default function Create() {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('cardTypes.title'), href: route('card-types.index') },
    { title: t('cardTypes.create'), href: route('card-types.create') }
  ];

  const { data, setData, post, processing, errors } = useForm<CardTypeForm>({
    name: '',
    description: '',
  });

  const handleSubmit = () => {
    post(route('card-types.store'), {
      onSuccess: () => {
        message.success(t('cardTypes.createSuccess'));
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('cardTypes.createTitle')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Title level={2}>{t('cardTypes.createNewCardType')}</Title>
        </div>

        <Card>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              name: data.name,
              description: data.description,
            }}
          >
            <Form.Item
              label={t('cardTypes.name')}
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name}
              required
            >
              <Input
                placeholder={t('cardTypes.enterName')}
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={t('cardTypes.description')}
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description}
            >
              <TextArea
                placeholder={t('cardTypes.enterDescription')}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={3}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => window.history.back()}>
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={processing}>
                {t('cardTypes.createCardType')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
