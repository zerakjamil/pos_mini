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
  due_date: string;
}

export default function Create({ debtors, cardTypes, auth }) {
  const { t } = useTranslation();

  const breadcrumbs = [
    { title: t('common.dashboard'), href: route('dashboard') },
    { title: t('cardDebts.title'), href: route('card-debts.index') },
    { title: t('common.create'), href: route('card-debts.create') }
  ];

  const { data, setData, post, processing, errors } = useForm<CardDebtForm>({
    debtor_id: null,
    card_type: '',
    card_value: null,
    quantity: 1,
    description: '',
    due_date: '',
  });

  const [totalAmount, setTotalAmount] = useState<number>(0);

  const calculateTotal = (cardValue: number | null, quantity: number | null) => {
    if (cardValue && quantity) {
      return cardValue * quantity;
    }
    return 0;
  };

  const updateAmount = (value: number | null, field: string) => {
    if (field === 'card_value') {
      setData('card_value', value);
      setTotalAmount(calculateTotal(value, data.quantity));
    } else if (field === 'quantity') {
      setData('quantity', value);
      setTotalAmount(calculateTotal(data.card_value, value));
    }
  };

  const handleSubmit = () => {
    post(route('card-debts.store'), {
      onSuccess: () => {
        message.success(t('cardDebts.createSuccess'));
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('cardDebts.createTitle')} />

      <div className="container" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Title level={2}>{t('cardDebts.createNewCardDebt')}</Title>
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
              due_date: data.due_date ? dayjs(data.due_date) : null,
            }}
          >
            <Form.Item
              label={t('cardDebts.debtor')}
              required
              validateStatus={errors.debtor_id ? 'error' : ''}
              help={errors.debtor_id}
            >
              <Select
                placeholder={t('cardDebts.selectDebtor')}
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
              label={t('cardDebts.cardType')}
              required
              validateStatus={errors.card_type ? 'error' : ''}
              help={errors.card_type}
            >
              <Select
                placeholder={t('cardDebts.selectCardType')}
                value={data.card_type}
                onChange={(value) => setData('card_type', value)}
              >
                {cardTypes.map(type => (
                  <Option key={type.id} value={type.name}>{type.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t('cardDebts.cardValue')}
              required
              validateStatus={errors.card_value ? 'error' : ''}
              help={errors.card_value}
            >
              <InputNumber
                style={{ width: '100%' }}
                value={data.card_value}
                onChange={(value) => updateAmount(value as number, 'card_value')}
                placeholder={t('cardDebts.enterCardValue')}
                min={0}
                addonBefore={t('common.currency')}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/IQD\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              label={t('cardDebts.quantity')}
              required
              validateStatus={errors.quantity ? 'error' : ''}
              help={errors.quantity}
            >
              <InputNumber
                style={{ width: '100%' }}
                value={data.quantity}
                onChange={(value) => updateAmount(value as number, 'quantity')}
                placeholder={t('cardDebts.enterQuantity')}
                min={1}
              />
            </Form.Item>

            <Form.Item
              label={t('cardDebts.totalAmount')}
            >
              <InputNumber
                style={{ width: '100%' }}
                value={totalAmount}
                disabled
                addonBefore={t('common.currency')}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>

            <Form.Item
              label={t('cardDebts.description')}
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description}
            >
              <TextArea
                rows={3}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder={t('cardDebts.enterDescription')}
              />
            </Form.Item>

            <Form.Item
              label={t('cardDebts.dueDate')}
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
              <Link href={route('card-debts.index')}>
                <Button>{t('common.cancel')}</Button>
              </Link>
              <Button type="primary" htmlType="submit" loading={processing}>
                {t('cardDebts.createCardDebt')}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
