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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const debt = payment.debt;
  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('debts.title'), href: route('debts.index') },
    { title: debt.description, href: route('debts.show', debt.id) },
    { title: t('payments.editPayment'), href: route('payments.edit', payment.id) }
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
        message.success(t('payments.updateSuccess'));
      }
    });
  };

  const handleDelete = () => {
    destroy(route('payments.destroy', payment.id), {
      onSuccess: () => {
        message.success(t('payments.deleteSuccess'));
      }
    });
  };

  const paymentMethods = [
    { value: 'cash', label: t('payments.methods.cash') },
    { value: 'bank_transfer', label: t('payments.methods.bankTransfer') },
    { value: 'check', label: t('payments.methods.check') },
    { value: 'credit_card', label: t('payments.methods.creditCard') },
    { value: 'other', label: t('payments.methods.other') },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('payments.editPayment')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Title level={2}>{t('payments.editPayment')}</Title>
          <Popconfirm
            title={t('payments.deleteConfirmTitle')}
            description={t('payments.deleteConfirmDescription')}
            onConfirm={handleDelete}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<Trash size={16} />}>{t('payments.deletePayment')}</Button>
          </Popconfirm>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <Card title={t('debts.debtInformation')}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label={t('debtors.debtor')}>{debt.debtor.name}</Descriptions.Item>
              <Descriptions.Item label={t('categories.description')}>{debt.description}</Descriptions.Item>
              <Descriptions.Item label={t('debts.dueDate')}>{new Date(debt.due_date).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label={t('debts.totalAmount')}>{t('common.currency')}{Number(debt.amount).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label={t('debts.balance')}>
                <Text strong type={debt.balance > 0 ? "danger" : "success"}>
                  {t('common.currency')}{Number(debt.balance).toLocaleString()}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={t('payments.paymentDetails')}>
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
                label={t('payments.amount')}
                required
                validateStatus={errors.amount ? 'error' : ''}
                help={errors.amount}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.01}
                  step={0.01}
                  precision={2}
                  formatter={(value) => `${t('common.currency')} ${value}`}
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as string}
                  value={data.amount}
                  onChange={(value) => setData('amount', value as number)}
                />
              </Form.Item>

              <Form.Item
                label={t('payments.paymentDate')}
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
                label={t('payments.paymentMethod')}
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
                label={t('payments.referenceNumber')}
                validateStatus={errors.reference_number ? 'error' : ''}
                help={errors.reference_number}
              >
                <Input
                  value={data.reference_number}
                  onChange={(e) => setData('reference_number', e.target.value)}
                  placeholder={t('payments.referenceNumberPlaceholder')}
                />
              </Form.Item>

              <Form.Item
                label={t('payments.notes')}
                validateStatus={errors.notes ? 'error' : ''}
                help={errors.notes}
              >
                <TextArea
                  rows={3}
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  placeholder={t('payments.notesPlaceholder')}
                />
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link href={route('payments.show', payment.id)}>
                  <Button>{t('common.cancel')}</Button>
                </Link>
                <Button type="primary" htmlType="submit" loading={processing}>
                  {t('payments.updatePayment')}
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
