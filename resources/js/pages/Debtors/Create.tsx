import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Card,
    Form,
    Input,
    Button,
    Typography,
    Space
} from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { TextArea } = Input;

interface DebtorForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export default function Create({ auth }) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('debtors.title'), href: route('debtors.index') },
    { title: t('debtors.addDebtor'), href: route('debtors.create') }
  ];

  const { data, setData, post, processing, errors } = useForm<DebtorForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleSubmit = () => {
    post(route('debtors.store'));
  };

  const formatPhoneNumber = (value: string) => {
    // ... (keep the existing formatPhoneNumber function)
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setData('phone', formattedValue);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('debtors.addNewDebtor')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('debtors.addNewDebtor')}</Title>
        </div>

        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label={t('debtors.name')}
              required
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name}
            >
              <Input
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                placeholder={t('debtors.enterDebtorName')}
              />
            </Form.Item>

            <Form.Item
              label={<Space>{t('debtors.phone')}</Space>}
              validateStatus={errors.phone ? 'error' : ''}
              help={errors.phone}
            >
              <Input
                value={data.phone}
                onChange={handlePhoneChange}
                placeholder={t('debtors.phoneFormat')}
                maxLength={14}
              />
            </Form.Item>

            <Form.Item
              label={t('debtors.notes')}
              validateStatus={errors.notes ? 'error' : ''}
              help={errors.notes}
            >
              <TextArea
                rows={3}
                value={data.notes}
                onChange={e => setData('notes', e.target.value)}
                placeholder={t('debtors.additionalNotes')}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href={route('debtors.index')}>
                <Button>{t('common.cancel')}</Button>
              </Link>
              <Button type="primary" htmlType="submit" loading={processing}>
                {t('debtors.saveDebtor')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
