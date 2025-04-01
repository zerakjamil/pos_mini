import React from 'react';
import { Button, Divider, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { CartItem } from '@/types/cashier';

const { Title } = Typography;

interface TransactionSummaryProps {
    cartItems: CartItem[];
    total: number;
    onCheckout: () => void;
    onClearCart: () => void;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ cartItems, total, onCheckout, onClearCart }) => {
    const { t } = useTranslation();

    return (
        <div className="flex h-full flex-col">
            <div className="mb-4 flex-grow">
                <div className="mb-4 flex justify-between">
                    <Title level={4}>{t('cashier.summary.total')}:</Title>
                    <Title level={4}>{t('common.currency')} {total.toFixed(0)}</Title>
                </div>

                <Divider />

                <div className="mb-4">
                    <p>{t('cashier.summary.items')}: {cartItems.length}</p>
                    <p>{t('cashier.summary.totalQuantity')}: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
            </div>

            <div className="mt-auto flex flex-col gap-2">
                <Button
                    type="primary"
                    size="large"
                    block
                    onClick={onCheckout}
                    disabled={cartItems.length === 0}
                >
                    {t('cashier.cart.checkout')}
                </Button>

                <Button
                    danger
                    size="large"
                    block
                    onClick={onClearCart}
                    disabled={cartItems.length === 0}
                >
                    {t('cashier.cart.clear')}
                </Button>
            </div>
        </div>
    );
};

export default TransactionSummary;
