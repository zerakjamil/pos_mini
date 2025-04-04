
import { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CardDebtForm {
  debtor_id: number | null;
  card_type: string;
  card_value: number | null;
  quantity: number | null;
  description: string;
  due_date: string | null;
}

export default function Edit({ cardDebt, debtors, cardTypes }) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('cardDebts.title'), href: route('card-debts.index') },
    { title: t('cardDebts.editTitle', { cardType: cardDebt.card_type }), href: route('card-debts.edit', cardDebt.id) }
  ];

  const { data, setData, put, processing, errors } = useForm<CardDebtForm>({
    debtor_id: cardDebt.debtor_id,
    card_type: cardDebt.card_type,
    card_value: cardDebt.card_value,
    quantity: cardDebt.quantity,
    description: cardDebt.description || '',
    due_date: cardDebt.due_date,
  });

  const [totalAmount, setTotalAmount] = useState<number>(
    (cardDebt.card_value || 0) * (cardDebt.quantity || 0)
  );

  const calculateTotal = (cardValue: number | null, quantity: number | null) => {
    if (cardValue && quantity) {
      return cardValue * quantity;
    }
    return 0;
  };

  const updateAmount = (value: number | null, field: string) => {
    if (field === 'card_value') {
      setTotalAmount(calculateTotal(value, data.quantity));
    } else if (field === 'quantity') {
      setTotalAmount(calculateTotal(data.card_value, value));
    }
  };

  const handleSubmit = () => {
    put(route('card-debts.update', cardDebt.id), {
      onSuccess: () => {
        message.success(t('cardDebts.updateSuccess'));
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('cardDebts.editTitle', { cardType: cardDebt.card_type })} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Title level={2}>{t('cardDebts.editCardDebt')}</Title>
        </div>

        <Card>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              debtor_id: data.debtor_id,
              card_type: data.card_type,
              card_value: data.card_value,
              quantity: data.quantity,
              description: data.description,
              due_date: data.due_date ? dayjs(data.due_date) : null
            }}
          >
            <Form.Item
              label={t('cardDebts.debtor')}
              validateStatus={errors.debtor_id ? 'error' : ''}
              help={errors.debtor_id}
              required
            >
              <Select
                placeholder={t('cardDebts.selectDebtor')}
                value={data.debtor_id || undefined}
                onChange={(value) => setData('debtor_id', value)}
              >
                {debtors.map((debtor) => (
                  <Option key={debtor.id} value={debtor.id}>{debtor.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t('cardDebts.cardType')}
              validateStatus={errors.card_type ? 'error' : ''}
              help={errors.card_type}
              required
            >
              <Select
                placeholder={t('cardDebts.selectCardType')}
                value={data.card_type || undefined}
                onChange={(value) => setData('card_type', value)}
              >
                {cardTypes.map((cardType) => (
                  <Option key={cardType.name} value={cardType.name}>{cardType.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t('cardDebts.cardValue')}
              validateStatus={errors.card_value ? 'error' : ''}
              help={errors.card_value}
              required
            >
              <InputNumber
                placeholder={t('cardDebts.enterCardValue')}
                style={{ width: '100%' }}
                value={data.card_value || undefined}
                onChange={(value) => {
                  setData('card_value', value);
                  updateAmount(value, 'card_value');
                }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              label={t('cardDebts.quantity')}
              validateStatus={errors.quantity ? 'error' : ''}
              help={errors.quantity}
              required
            >
              <InputNumber
                placeholder={t('cardDebts.enterQuantity')}
                style={{ width: '100%' }}
                min={1}
                value={data.quantity || undefined}
                onChange={(value) => {
                  setData('quantity', value);
                  updateAmount(value, 'quantity');
                }}
              />
            </Form.Item>

            <Form.Item label={t('cardDebts.totalAmount')}>
              <InputNumber
                style={{ width: '100%' }}
                value={totalAmount}
                disabled
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              label={t('cardDebts.description')}
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description}
            >
              <TextArea
                placeholder={t('cardDebts.enterDescription')}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={3}
              />
            </Form.Item>

            <Form.Item
              label={t('cardDebts.dueDate')}
              validateStatus={errors.due_date ? 'error' : ''}
              help={errors.due_date}
              required
            >
              <DatePicker
                style={{ width: '100%' }}
                value={data.due_date ? dayjs(data.due_date) : null}
                onChange={(date) => setData('due_date', date ? date.format('YYYY-MM-DD') : null)}
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => window.history.back()}>
                {t('common.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" loading={processing}>
                {t('cardDebts.updateCardDebt')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
