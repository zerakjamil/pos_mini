// resources/js/Pages/Debtors/Create.tsx
import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Card,
    Form,
    Input,
    Button,
    Typography, Space
} from 'antd';

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
  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Debtors', href: route('debtors.index') },
    { title: 'Add Debtor', href: route('debtors.create') }
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
        const digits = value.replace(/\D/g, '');

        let formattedNumber = '';
        if (digits.length > 0) {
            formattedNumber += digits.substring(0, 4);

            if (digits.length > 4) {
                formattedNumber += '-' + digits.substring(4, 7);
            }

            if (digits.length > 7) {
                formattedNumber += '-' + digits.substring(7, 9);
            }

            if (digits.length > 9) {
                formattedNumber += '-' + digits.substring(9, 11);
            }
        }

        return formattedNumber;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        setData('phone', formattedValue);
    };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add New Debtor" />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>Add New Debtor</Title>
        </div>

        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
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
                placeholder="Enter debtor's name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email}
            >
              <Input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder="Enter email address"
              />
            </Form.Item>

              <Form.Item
                  label={
                      <Space>
                          Phone
                      </Space>
                  }
                  validateStatus={errors.phone ? 'error' : ''}
                  help={errors.phone}
              >
                  <Input
                      value={data.phone}
                      onChange={handlePhoneChange}
                      placeholder="075X-XXX-XX-XX"
                      maxLength={14} // 4 + 3 + 2 + 2 digits + 3 hyphens
                  />
              </Form.Item>

            <Form.Item
              label="Address"
              validateStatus={errors.address ? 'error' : ''}
              help={errors.address}
            >
              <TextArea
                rows={3}
                value={data.address}
                onChange={e => setData('address', e.target.value)}
                placeholder="Enter address"
              />
            </Form.Item>

            <Form.Item
              label="Notes"
              validateStatus={errors.notes ? 'error' : ''}
              help={errors.notes}
            >
              <TextArea
                rows={3}
                value={data.notes}
                onChange={e => setData('notes', e.target.value)}
                placeholder="Additional notes about this debtor"
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href={route('debtors.index')}>
                <Button>Cancel</Button>
              </Link>
              <Button type="primary" htmlType="submit" loading={processing}>
                Save Debtor
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
