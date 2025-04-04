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
  message,
  Alert
} from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PaymentForm {
  amount: number | null;
  payment_date: string | null;
  payment_method: string;
  notes?: string;
}

export default function Create({ cardDebt, paymentMethods }) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('cardDebts.title'), href: route('card-debts.index') },
    { title: cardDebt.card_type, href: route('card-debts.show', cardDebt.id) },
    { title: t('cardDebts.payments.create'), href: route('card-debts.payments.create', cardDebt.id) }
  ];

  const { data, setData, post, processing, errors } = useForm<PaymentForm>({
    amount: null,
    payment_date: dayjs().format('YYYY-MM-DD'),
    payment_method: 'cash',
    notes: '',
  });

  const handleSubmit = () => {
    post(route('card-debts.payments.store', cardDebt.id), {
      onSuccess: () => {
        message.success(t('cardDebts.payments.success'));
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('payments.addPaymentTitle', { name: cardDebt.card_type })} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Title level={2}>{t('payments.recordPaymentForDebt')}</Title>
        </div>

        <Card>
          <div style={{ marginBottom: '24px' }}>
            <Alert
              message={`${t('cardDebts.cardType')}: ${cardDebt.card_type}`}
              description={
                <div>
                  <p>{`${t('cardDebts.debtor')}: ${cardDebt.debtor?.name}`}</p>
                  <p>{`${t('cardDebts.balance')}: ${cardDebt.balance.toLocaleString()} ${t('common.currency')}`}</p>
                </div>
              }
              type="info"
              showIcon
            />
          </div>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              amount: data.amount,
              payment_date: data.payment_date ? dayjs(data.payment_date) : null,
              payment_method: data.payment_method,
              notes: data.notes,
            }}
          >
            <Form.Item
              label={t('payments.amount')}
              validateStatus={errors.amount ? 'error' : ''}
              help={errors.amount}
              required
            >
              <InputNumber
                placeholder={t('payments.enterPaymentAmount')}
                style={{ width: '100%' }}
                value={data.amount || undefined}
                onChange={(value) => setData('amount', value)}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                max={cardDebt.balance}
              />
            </Form.Item>

            <Form.Item
              label={t('payments.paymentDate')}
              validateStatus={errors.payment_date ? 'error' : ''}
              help={errors.payment_date}
              required
            >
              <DatePicker
                style={{ width: '100%' }}
                value={data.payment_date ? dayjs(data.payment_date) : null}
                onChange={(date) => setData('payment_date', date ? date.format('YYYY-MM-DD') : null)}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              label={t('payments.paymentMethod')}
              validateStatus={errors.payment_method ? 'error' : ''}
              help={errors.payment_method}
              required
            >
              <Select
                placeholder={t('payments.selectPaymentMethod')}
                value={data.payment_method}
                onChange={(value) => setData('payment_method', value)}
              >
                {Object.entries(paymentMethods).map(([key, value]) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t('payments.notes')}
              validateStatus={errors.notes ? 'error' : ''}
              help={errors.notes}
            >
              <TextArea
                placeholder={t('payments.notesPlaceholder')}
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                rows={3}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => window.history.back()}>
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={processing}>
                {t('payments.recordPayment')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
