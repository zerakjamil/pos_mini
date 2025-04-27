import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, InputNumber, Radio, Input, Button, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { createSafeTransaction } from '../services/safeTransactionService';
import { SafeTransaction } from '@/types/safe';
import { formatCurrency } from '@/utils/format';

interface NewTransactionModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (transaction: SafeTransaction) => void;
    safeAccounts: {
        id: string;
        name: string;
        balance: number;
    }[];
}

const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
    visible,
    onCancel,
    onSuccess,
    safeAccounts
}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [transactionType, setTransactionType] = useState('betweenAccounts');
    const [senderAccount, setSenderAccount] = useState<string | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [hasSufficientFunds, setHasSufficientFunds] = useState(true);

    useEffect(() => {
        // Reset form when modal becomes visible
        if (visible) {
            form.resetFields();
            setTransactionType('betweenAccounts');
            setSenderAccount(null);
            setAmount(0);
            setHasSufficientFunds(true);
        }
    }, [visible, form]);

    useEffect(() => {
        if (senderAccount && amount) {
            const sender = safeAccounts.find(account => account.id === senderAccount);
            if (sender) {
                setHasSufficientFunds(sender.balance >= amount);
            }
        }
    }, [senderAccount, amount, safeAccounts]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            const transactionData = {
                transaction_type: values.transactionType,
                sender_id: values.senderId,
                receiver_id: values.receiverId,
                amount: values.amount,
                description: values.description || '',
            };
            
            const response = await createSafeTransaction(transactionData);
            onSuccess(response);
            
        } catch (error) {
            console.error('Failed to create transaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSenderChange = (value: string) => {
        setSenderAccount(value);
        // Check if we need to update the funds status
        if (amount > 0) {
            const sender = safeAccounts.find(account => account.id === value);
            if (sender) {
                setHasSufficientFunds(sender.balance >= amount);
            }
        }
    };

    const handleAmountChange = (value: number | null) => {
        const newAmount = value || 0;
        setAmount(newAmount);
        
        if (senderAccount) {
            const sender = safeAccounts.find(account => account.id === senderAccount);
            if (sender) {
                setHasSufficientFunds(sender.balance >= newAmount);
            }
        }
    };

    // Filter out the selected sender from receiver options
    const getReceiverOptions = () => {
        return safeAccounts.filter(account => account.id !== senderAccount);
    };

    return (
        <Modal
            title={t('safe.create')}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    transactionType: 'betweenAccounts',
                }}
            >
                <Form.Item
                    name="transactionType"
                    label={t('safe.transactionType')}
                >
                    <Radio.Group 
                        onChange={(e) => setTransactionType(e.target.value)}
                        value={transactionType}
                    >
                        <Radio value="betweenAccounts">{t('safe.betweenAccounts')}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="senderId"
                    label={t('safe.senderAccount')}
                    rules={[{ required: true, message: t('safe.senderRequired') }]}
                >
                    <Select 
                        placeholder={t('safe.selectSender')}
                        onChange={handleSenderChange}
                        options={safeAccounts.map(account => ({
                            label: `${account.name} (${formatCurrency(account.balance)})`,
                            value: account.id
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    name="receiverId"
                    label={t('safe.receiverAccount')}
                    rules={[{ required: true, message: t('safe.receiverRequired') }]}
                >
                    <Select 
                        placeholder={t('safe.selectReceiver')}
                        options={getReceiverOptions().map(account => ({
                            label: `${account.name} (${formatCurrency(account.balance)})`,
                            value: account.id
                        }))}
                        disabled={!senderAccount}
                    />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label={t('safe.amount')}
                    rules={[
                        { required: true, message: t('safe.amountRequired') },
                        { type: 'number', min: 0.01, message: t('safe.amountPositive') },
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                        onChange={handleAmountChange}
                        min={0.01}
                        step={0.01}
                    />
                </Form.Item>

                {senderAccount && amount > 0 && (
                    <Alert
                        message={hasSufficientFunds ? t('safe.sufficientFunds') : t('safe.insufficientFunds')}
                        type={hasSufficientFunds ? 'success' : 'error'}
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Form.Item
                    name="description"
                    label={t('safe.description')}
                >
                    <Input.TextArea 
                        rows={4}
                        placeholder={t('safe.descriptionPlaceholder')}
                    />
                </Form.Item>

                <Form.Item className="mb-0 text-right">
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        {t('common.cancel')}
                    </Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        disabled={!hasSufficientFunds}
                    >
                        {t('safe.submit')}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewTransactionModal;