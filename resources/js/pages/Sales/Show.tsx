import { Head } from '@inertiajs/react';
import { Layout, Space } from 'antd';
import React from 'react';
import { Transaction } from '../../types/cashier';
import SaleHeader from './components/SaleHeader';
import TransactionDetails from './components/TransactionDetails';
import TransactionItemsTable from './components/TransactionItemsTable';
import { usePrintReceipt } from './hooks/usePrintReceipt';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/app-layout';

const { Content, Header, Footer } = Layout;

interface SalesShowProps {
    sale: Transaction;
}

const SalesShow: React.FC<SalesShowProps> = ({ sale }) => {
    const { printReceipt } = usePrintReceipt();
    const { t } = useTranslation('sale/show');

    const handlePrint = () => {
        printReceipt(sale);
    };

    return (
        <AppLayout style={{ minHeight: '100vh' }}>
            <Head title={`${t('sales:sales.sale')} ${sale.transaction_number}`} />

            <Header style={{ background: '#fff', padding: '0 16px' }}>
                <SaleHeader transactionNumber={sale.transaction_number} onPrint={handlePrint} />
            </Header>

            <Content style={{ padding: '24px' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <TransactionDetails sale={sale} />
                    <TransactionItemsTable items={sale.items} totalAmount={sale.total_amount} />
                </Space>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
                {t('app.footer', { year: new Date().getFullYear() })}
            </Footer>
        </AppLayout>
    );
};

export default SalesShow;
