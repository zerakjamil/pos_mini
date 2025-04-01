// resources/js/Pages/Debts/Create.tsx
import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  Select,
  InputNumber,
  Typography,
  message
} from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface DebtForm {
  debtor_id: number | null;
  amount: number | null;
  description: string;
  due_date: string;
}

export default function Create({ debtors, auth }) {
  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Debts', href: route('debts.index') },
    { title: 'Create', href: route('debts.create') }
  ];

  const { data, setData, post, processing, errors } = useForm<DebtForm>({
    debtor_id: null,
    amount: null,
    description: '',
    due_date: '',
  });

  const handleSubmit = () => {
    post(route('debts.store'), {
      onSuccess: () => {
        message.success('Debt created successfully');
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Debt" />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Title level={2}>Create New Debt</Title>
        </div>

        <Card>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              debtor_id: data.debtor_id,
              amount: data.amount,
              description: data.description,
              due_date: data.due_date ? dayjs(data.due_date) : null,
            }}
          >
            <Form.Item
              label="Debtor"
              required
              validateStatus={errors.debtor_id ? 'error' : ''}
              help={errors.debtor_id}
            >
              <Select
                placeholder="Select a debtor"
                value={data.debtor_id}
                onChange={(value) => setData('debtor_id', value)}
                showSearch
                optionFilterProp="children"
              >
                {debtors.map(debtor => (
                  <Option key={debtor.id} value={debtor.id}>{debtor.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Amount"
              required
              validateStatus={errors.amount ? 'error' : ''}
              help={errors.amount}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    value={data.amount}
                    onChange={(value) => setData('amount', value as number)}
                    placeholder="Enter debt amount"
                    min={0}
                    addonBefore="IQD"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/IQD\s?|(,*)/g, '')}
                />
            </Form.Item>

            <Form.Item
              label="Description"
              required
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description}
            >
              <TextArea
                rows={3}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Enter debt description"
              />
            </Form.Item>

            <Form.Item
              label="Due Date"
              required
              validateStatus={errors.due_date ? 'error' : ''}
              help={errors.due_date}
            >
              <DatePicker
                style={{ width: '100%' }}
                value={data.due_date ? dayjs(data.due_date) : null}
                onChange={(date) => setData('due_date', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href={route('debts.index')}>
                <Button>Cancel</Button>
              </Link>
              <Button type="primary" htmlType="submit" loading={processing}>
                Create Debt
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
