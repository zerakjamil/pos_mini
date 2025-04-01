// resources/js/Pages/Payments/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Card, DatePicker, Form, Input, InputNumber, message, Select, Typography } from 'antd';
import dayjs from 'dayjs';

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
    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Debtors', href: route('debtors.index') },
        { title: debt.debtor.name, href: route('debtors.show', debt.debtor.id) },
        { title: 'Debt', href: route('debts.show', debt.id) },
        { title: 'Add Payment', href: route('debts.payments.create', debt.id) },
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
                message.success('Payment recorded successfully');
            },
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
            <Head title={`Add Payment - ${debt.debtor.name}`} />

            <div className="container" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Title level={2}>Record Payment for Debt</Title>
                </div>

                <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="debt-summary" style={{ marginBottom: '24px' }}>
                        <p>
                            <strong>Debtor:</strong> {debt.debtor.name}
                        </p>
                        <p>
                            <strong>Description:</strong> {debt.description}
                        </p>
                        <p>
                            <strong>Total Amount:</strong> IQD {Number(debt.amount).toLocaleString()}
                        </p>
                        <p>
                            <strong>Remaining Balance:</strong> IQD {Number(debt.balance).toLocaleString()}
                        </p>
                    </div>

                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item label="Amount" required validateStatus={errors.amount ? 'error' : ''} help={errors.amount}>
                            <InputNumber
                                style={{ width: '100%' }}
                                value={data.amount}
                                onChange={(value) => setData('amount', value as number)}
                                placeholder="Enter payment amount"
                                min={0}
                                max={debt.balance}
                                addonBefore="IQD"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <Form.Item label="Payment Date" required validateStatus={errors.payment_date ? 'error' : ''} help={errors.payment_date}>
                            <DatePicker
                                style={{ width: '100%' }}
                                value={data.payment_date ? dayjs(data.payment_date) : undefined}
                                onChange={(date) => setData('payment_date', date ? date.format('YYYY-MM-DD') : '')}
                            />
                        </Form.Item>

                        <Form.Item label="Payment Method" validateStatus={errors.payment_method ? 'error' : ''} help={errors.payment_method}>
                            <Select
                                value={data.payment_method}
                                onChange={(value) => setData('payment_method', value)}
                                placeholder="Select payment method"
                                allowClear
                            >
                                {paymentMethods.map((method) => (
                                    <Option key={method.value} value={method.value}>
                                        {method.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Reference Number" validateStatus={errors.reference_number ? 'error' : ''} help={errors.reference_number}>
                            <Input
                                value={data.reference_number}
                                onChange={(e) => setData('reference_number', e.target.value)}
                                placeholder="Check number, transaction ID, etc."
                            />
                        </Form.Item>

                        <Form.Item label="Notes" validateStatus={errors.notes ? 'error' : ''} help={errors.notes}>
                            <TextArea
                                rows={3}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Additional notes about this payment"
                            />
                        </Form.Item>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link href={route('debts.payments.index', debt.id)}>
                                <Button>Cancel</Button>
                            </Link>
                            <Button type="primary" htmlType="submit" loading={processing}>
                                Record Payment
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </AppLayout>
    );
}
