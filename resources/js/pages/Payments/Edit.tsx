// resources/js/Pages/Payments/Edit.tsx
import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  InputNumber,
  Typography,
  Descriptions,
  Select,
  message,
  Popconfirm
} from 'antd';
import { Trash } from 'lucide-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PaymentForm {
  amount: number;
  payment_date: string;
  payment_method: string;
  reference_number: string;
  notes: string;
}

export default function Edit({ payment, auth }) {
  const debt = payment.debt;
  const breadcrumbs = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Debts', href: route('debts.index') },
    { title: debt.description, href: route('debts.show', debt.id) },
    { title: 'Edit Payment', href: route('payments.edit', payment.id) }
  ];

  const { data, setData, put, delete: destroy, processing, errors } = useForm<PaymentForm>({
    amount: payment.amount,
    payment_date: payment.payment_date,
    payment_method: payment.payment_method || 'cash',
    reference_number: payment.reference_number || '',
    notes: payment.notes || '',
  });

  const handleSubmit = () => {
    put(route('payments.update', payment.id), {
      onSuccess: () => {
        message.success('Payment updated successfully');
      }
    });
  };

  const handleDelete = () => {
    destroy(route('payments.destroy', payment.id), {
      onSuccess: () => {
        message.success('Payment deleted successfully');
      }
    });
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Payment" />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>Edit Payment</Title>
          <Popconfirm
            title="Delete payment"
            description="Are you sure you want to delete this payment?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash size={16} />}>Delete Payment</Button>
          </Popconfirm>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Card title="Debt Information">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Debtor">{debt.debtor.name}</Descriptions.Item>
              <Descriptions.Item label="Description">{debt.description}</Descriptions.Item>
              <Descriptions.Item label="Due Date">{new Date(debt.due_date).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Total Amount">${debt.amount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Balance">
                <Text strong type={debt.balance > 0 ? "danger" : "success"}>
                  ${debt.balance.toFixed(2)}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Payment Details">
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                amount: data.amount,
                payment_date: data.payment_date ? dayjs(data.payment_date) : null,
                payment_method: data.payment_method,
                reference_number: data.reference_number,
                notes: data.notes,
              }}
            >
              <Form.Item
                label="Amount"
                required
                validateStatus={errors.amount ? 'error' : ''}
                help={errors.amount}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.01}
                  step={0.01}
                  precision={2}
                  formatter={(value) => `$ ${value}`}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as string}
                  value={data.amount}
                  onChange={(value) => setData('amount', value as number)}
                />
              </Form.Item>

              <Form.Item
                label="Payment Date"
                required
                validateStatus={errors.payment_date ? 'error' : ''}
                help={errors.payment_date}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  value={data.payment_date ? dayjs(data.payment_date) : null}
                  onChange={(date) => setData('payment_date', date ? date.format('YYYY-MM-DD') : '')}
                />
              </Form.Item>

              <Form.Item
                label="Payment Method"
                validateStatus={errors.payment_method ? 'error' : ''}
                help={errors.payment_method}
              >
                <Select
                  value={data.payment_method}
                  onChange={(value) => setData('payment_method', value)}
                >
                  {paymentMethods.map(method => (
                    <Option key={method.value} value={method.value}>{method.label}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Reference Number"
                validateStatus={errors.reference_number ? 'error' : ''}
                help={errors.reference_number}
              >
                <Input
                  value={data.reference_number}
                  onChange={(e) => setData('reference_number', e.target.value)}
                  placeholder="Check #, Receipt #, etc."
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
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder="Additional notes about this payment"
                />
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link href={route('payments.show', payment.id)}>
                  <Button>Cancel</Button>
                </Link>
                <Button type="primary" htmlType="submit" loading={processing}>
                  Update Payment
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
