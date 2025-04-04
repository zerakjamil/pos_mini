import { Head, useForm } from '@inertiajs/react';
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

interface Payment {
  id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  notes?: string;
  cardDebt: {
    id: number;
    card_type: string;
    balance: number;
    debtor?: {
      name: string;
    };
  };
}

interface PaymentForm {
  amount: number | null;
  payment_date: string | null;
  payment_method: string;
  notes: string;
  [key: string]: any;
}

interface Props {
  payment: Payment;
  paymentMethods: Record<string, string>;
}

export default function Edit({ payment, paymentMethods }: Props) {
  const { t } = useTranslation();
  const cardDebt = payment.card_debt;
  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('cardDebts.title'), href: route('card-debts.index') },
    { title: cardDebt.card_type, href: route('card-debts.show', cardDebt.id) },
    { title: t('cardDebts.payments.edit'), href: route('payments.edit', payment.id) }
  ];

  const { data, setData, put, processing, errors } = useForm<PaymentForm>({
    amount: payment.amount,
    payment_date: payment.payment_date,
    payment_method: payment.payment_method,
    notes: payment.notes || '',
  });

  const maxAmount = cardDebt.balance + payment.amount;

  const handleSubmit = () => {
    put(route('card-debts.payments.update', payment.id), {
      onSuccess: () => {
        message.success(t('payments.updateSuccess'));
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('payments.editPayment')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Title level={2}>{t('payments.editPayment')}</Title>
        </div>

        <Card>
          <div style={{ marginBottom: '24px' }}>
            <Alert
              message={`${t('cardDebts.cardType')}: ${cardDebt.card_type}`}
              description={
                <div>
                  <p>{`${t('cardDebts.debtor')}: ${cardDebt.debtor?.name}`}</p>
                    <p>{`${t('cardDebts.balance')}: ${Number(cardDebt.balance).toLocaleString()} ${t('common.currency')}`}</p>
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
                max={maxAmount}
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
                  <Option key={key} value={key}>{String(value)}</Option>
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
                {t('payments.updatePayment')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
