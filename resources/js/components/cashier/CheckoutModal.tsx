import React, { useEffect, useState } from 'react';
import { Modal, InputNumber, Button, Radio, Select, Divider, Row, Col, Space, Tag } from 'antd';
import { usePage } from '@inertiajs/react';
import { Page } from '@inertiajs/core';
import { useTranslation } from 'react-i18next';
import { PlusCircle, X } from 'lucide-react';

interface DebtorType {
    id: string;
    name: string;
    phone?: string;
    debts_sum_balance?: number;
}

interface CheckoutModalProps {
    visible: boolean;
    total: number;
    amountPaid: number | null;
    change: number;
    paymentType: 'cash' | 'debt';
    selectedDebtor: string | null;
    onAmountPaidChange: (value: number | null) => void;
    onPaymentTypeChange: (type: 'cash' | 'debt') => void;
    onDebtorChange: (debtorId: string) => void;
    onComplete: () => void;
    onCancel: () => void;
    loading: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
                                                         visible,
                                                         total,
                                                         amountPaid,
                                                         change,
                                                         paymentType,
                                                         selectedDebtor,
                                                         onAmountPaidChange,
                                                         onPaymentTypeChange,
                                                         onDebtorChange,
                                                         onComplete,
                                                         onCancel,
                                                         loading
                                                     }) => {
    const { t } = useTranslation();
    const pageProps = usePage<Page<{ debtors: DebtorType[] }>>().props;
    const debtors = pageProps.debtors as DebtorType[];

    // Track selected denominations
    const [selectedDenominations, setSelectedDenominations] = useState<number[]>([]);

    // Common Iraqi Dinar denominations - added more common denominations
    const denominations = [
        { value: 5000, color: '#e6f7ff' },
        { value: 10000, color: '#fff7e6' },
        { value: 25000, color: '#f6ffed' },
        { value: 50000, color: '#fff2e8' }
    ];

    // Handle adding a denomination to the total
    const handleAddDenomination = (amount: number) => {
        const newDenominations = [...selectedDenominations, amount];
        setSelectedDenominations(newDenominations);

        // Calculate the new total paid amount
        const newTotal = newDenominations.reduce((sum, value) => sum + value, 0);
        onAmountPaidChange(newTotal);
    };

    // Handle quick payment selection (replaces the current amount)
    const handleQuickAmount = (amount: number) => {
        setSelectedDenominations([amount]);
        onAmountPaidChange(amount);
    };

    // Clear all selected denominations
    const handleClearDenominations = () => {
        setSelectedDenominations([]);
        onAmountPaidChange(null);
    };

    // Set exact amount
    const handleExactAmount = () => {
        setSelectedDenominations([total]);
        onAmountPaidChange(total);
    };

    // Reset selected denominations when modal opens/closes
    useEffect(() => {
        if (visible) {
            if (amountPaid) {
                setSelectedDenominations([amountPaid]);
            } else {
                setSelectedDenominations([]);
            }
        } else {
            setSelectedDenominations([]);
        }
    }, [visible, amountPaid]);

    // Calculate change whenever amountPaid changes
    useEffect(() => {
        if (paymentType === 'cash' && amountPaid !== null) {
            const calculatedChange = amountPaid > total ? amountPaid - total : 0;
            if (calculatedChange !== change) {
                onAmountPaidChange(amountPaid);
            }
        }
    }, [amountPaid, total, paymentType]);

    return (
        <Modal
            title={t('cashier.checkout.title')}
            open={visible}
            onCancel={onCancel}
            width={450}
            bodyStyle={{ padding: '12px', maxHeight: '70vh', overflowY: 'auto' }} // Added max height and scroll
            footer={[
                <Button key="back" onClick={onCancel}>
                    {t('cashier.checkout.cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={onComplete}
                    disabled={paymentType === 'cash' && (!amountPaid || amountPaid < total)}
                >
                    {t('cashier.checkout.complete')}
                </Button>
            ]}
        >
            <div>
                <div className="text-lg font-semibold mb-2 p-2 bg-gray-100 rounded-md">
                    {t('cashier.checkout.total', { amount: total.toFixed(0) })}
                </div>

                <Divider style={{ margin: '8px 0' }} />

                <div className="mb-2">
                    <Radio.Group
                        value={paymentType}
                        onChange={(e) => onPaymentTypeChange(e.target.value)}
                        className="mb-2"
                        buttonStyle="solid"
                        size="middle"
                        style={{ width: '100%' }}
                    >
                        <Radio.Button value="cash" style={{ width: '50%', textAlign: 'center' }}>
                            {t('cashier.checkout.paymentType.cash')}
                        </Radio.Button>
                        <Radio.Button value="debt" style={{ width: '50%', textAlign: 'center' }}>
                            {t('cashier.checkout.paymentType.debt')}
                        </Radio.Button>
                    </Radio.Group>
                </div>

                {paymentType === 'cash' ? (
                    <div>
                        <div className="mb-2">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1">{t('cashier.checkout.amountPaid')}</label>
                            <InputNumber
                                className="w-full"
                                min={0}
                                step={1000}
                                value={amountPaid}
                                onChange={(value) => {
                                    onAmountPaidChange(value as number);
                                    if (value) {
                                        setSelectedDenominations([value as number]);
                                    } else {
                                        setSelectedDenominations([]);
                                    }
                                }}
                                formatter={(value) => `${t('common.currency')} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\IQD\s?|(,*)/g, '')}
                                size="middle"
                                style={{ width: '100%', fontSize: '16px' }}
                                controls={false}
                            />
                        </div>

                        {/* Selected denominations - more compact display */}
                        {selectedDenominations.length > 0 && (
                            <div className="mb-2 p-1 bg-gray-50 rounded border border-gray-200">
                                <div className="flex flex-wrap gap-1 mb-1">
                                    {selectedDenominations.map((amount, index) => (
                                        <Tag
                                            key={index}
                                            color="blue"
                                            style={{ fontSize: '12px', padding: '2px 6px', margin: '2px' }}
                                        >
                                            {Number(amount).toLocaleString()}
                                        </Tag>
                                    ))}
                                    <Tag
                                        color="red"
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            padding: '2px 6px',
                                            margin: '2px'
                                        }}
                                        onClick={handleClearDenominations}
                                    >
                                        <X size={12} />
                                    </Tag>
                                </div>
                                <div className="text-xs text-gray-500 px-2">
                                    {t('common.total')}: {amountPaid?.toLocaleString()} {t('common.currency')}
                                </div>
                            </div>
                        )}

                        {/* Quick payment buttons - more compact grid */}
                        <div className="mb-2">
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1">{t('cashier.checkout.quickPayment')}</label>
                            <Row gutter={[3, 3]}>
                                {denominations.map(denom => (
                                    <Col span={12} key={denom.value}>
                                        <Button
                                            onClick={() => handleAddDenomination(denom.value)}
                                            style={{
                                                width: '100%',
                                                height: '34px',
                                                backgroundColor: denom.color,
                                                fontWeight: 'bold',
                                                padding: '0 4px',
                                                fontSize: '12px'
                                            }}
                                        >
                                            <PlusCircle size={16} style={{ marginRight: '4px' }} />
                                            {Number(denom.value).toLocaleString()}
                                        </Button>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* Common payment amounts - more compact */}
                        <div className="mb-2">
                            <Row gutter={[4, 4]}>
                                <Col span={12}>
                                    <Button
                                        type="primary"
                                        style={{ width: '100%', height: '32px', fontSize: '12px' }}
                                        onClick={handleExactAmount}
                                    >
                                        {t('cashier.checkout.exactAmount')}
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        danger
                                        style={{ width: '100%', height: '32px', fontSize: '12px' }}
                                        onClick={handleClearDenominations}
                                    >
                                        {t('cashier.checkout.clear')}
                                    </Button>
                                </Col>
                            </Row>
                        </div>

                        {/* Change display - more compact */}
                        {change > 0 && (
                            <div className="mt-2 p-2 bg-green-50 rounded-md">
                                <div className="text-base font-semibold text-green-700">
                                    {t('cashier.checkout.change')}: {change.toLocaleString()} IQD
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('cashier.checkout.selectDebtor')}
                            </label>
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                placeholder={t('cashier.checkout.debtorPlaceholder')}
                                optionFilterProp="children"
                                value={selectedDebtor}
                                onChange={onDebtorChange}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={debtors.map((debtor) => ({
                                    value: debtor.id,
                                    label: `${debtor.name}${debtor.phone ? ` (${debtor.phone})` : ''}`,
                                    description: debtor.debts_sum_balance
                                        ? `${t('cashier.checkout.existingDebt')}: ${debtor.debts_sum_balance.toLocaleString()} IQD`
                                        : undefined
                                }))}
                                optionRender={(option) => (
                                    <div>
                                        <div>{option.label}</div>
                                        {option.data.description && (
                                            <div className="text-xs text-red-500">{option.data.description}</div>
                                        )}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="mt-4">
                            <div className="text-sm text-gray-600 mb-2">
                                {t('cashier.checkout.debtDescription')}
                            </div>

                            <div className="p-2 bg-yellow-50 rounded-md text-sm">
                                <div className="font-medium text-yellow-800 mb-1">
                                    {t('cashier.checkout.debtWarning')}
                                </div>
                                <div className="text-yellow-700">
                                    {t('cashier.checkout.debtAmount')}: {Number(total).toLocaleString()} {t('common.currency')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default CheckoutModal;
