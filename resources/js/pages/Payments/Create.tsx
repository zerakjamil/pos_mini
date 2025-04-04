import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Card, DatePicker, Form, Input, InputNumber, message, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Debtor {
    id: number;
    name: string;
}

interface Debt {
    id: number;
    debtor: Debtor;
    description: string;
    amount: number;
    balance: number;
    due_date: string;
}

interface Props {
    debt: Debt;
}

interface PaymentForm {
    amount: number;
    payment_date: string;
    payment_method: string;
    reference_number: string;
    notes: string;

    [key: string]: string | number;
}

export default function Create({ debt }: Props) {
    const { t } = useTranslation();

    const breadcrumbs = [
        { title: t('common.dashboard'), href: route('dashboard') },
        { title: t('debtors.title'), href: route('debtors.index') },
        { title: debt.debtor.name, href: route('debtors.show', debt.debtor.id) },
        { title: t('debts.debt'), href: route('debts.show', debt.id) },
        { title: t('payments.addPayment'), href: route('debts.payments.create', debt.id) },
    ];

    const { data, setData, post, processing, errors } = useForm<PaymentForm>({
        amount: debt.balance,
        payment_date: dayjs().format('YYYY-MM-DD'),
        payment_method: '',
        reference_number: '',
        notes: '',
    });

    const handleSubmit = () => {
        post(route('debts.payments.store', debt.id), {
            onSuccess: () => {
                message.success(t('payments.successMessage'));
            },
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
            <Head title={t('payments.addPaymentTitle', { name: debt.debtor.name })} />

            <div className="container" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Title level={2}>{t('payments.recordPaymentForDebt')}</Title>
                </div>

                <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="debt-summary" style={{ marginBottom: '24px' }}>
                        <p>
                            <strong>{t('debtors.debtor')}:</strong> {debt.debtor.name}
                        </p>
                        <p>
                            <strong>{t('debts.description')}:</strong> {debt.description}
                        </p>
                        <p>
                            <strong>{t('debts.totalAmount')}:</strong> {t('common.currency')} {Number(debt.amount).toLocaleString()}
                        </p>
                        <p>
                            <strong>{t('debts.remainingBalance')}:</strong> {t('common.currency')} {Number(debt.balance).toLocaleString()}
                        </p>
                    </div>

                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label={t('payments.amount')} required validateStatus={errors.amount ? 'error' : ''} help={errors.amount}>
                            <InputNumber
                                style={{ width: '100%' }}
                                value={data.amount}
                                onChange={(value) => setData('amount', value as number)}
                                placeholder={t('payments.enterPaymentAmount')}
                                min={0}
                                max={debt.balance}
                                addonBefore={t('common.currency')}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item label={t('payments.paymentDate')} required validateStatus={errors.payment_date ? 'error' : ''} help={errors.payment_date}>
                            <DatePicker
                                style={{ width: '100%' }}
                                value={data.payment_date ? dayjs(data.payment_date) : undefined}
                                onChange={(date) => setData('payment_date', date ? date.format('YYYY-MM-DD') : '')}
                            />
                        </Form.Item>

                        <Form.Item label={t('payments.paymentMethod')} validateStatus={errors.payment_method ? 'error' : ''} help={errors.payment_method}>
                            <Select
                                value={data.payment_method}
                                onChange={(value) => setData('payment_method', value)}
                                placeholder={t('payments.selectPaymentMethod')}
                                allowClear
                            >
                                {paymentMethods.map((method) => (
                                    <Option key={method.value} value={method.value}>
                                        {method.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label={t('payments.notes')} validateStatus={errors.notes ? 'error' : ''} help={errors.notes}>
                            <TextArea
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder={t('payments.notesPlaceholder')}
                            />
                        </Form.Item>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link href={route('debts.payments.index', debt.id)}>
                                <Button>{t('common.cancel')}</Button>
                            </Link>
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
