import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Page, PageProps } from '@inertiajs/core';
import { Card, Col, message, Row, Space, Select, Tooltip, Button } from 'antd';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from 'react-i18next';

import '../i18n';

import BarcodeScanner, { BarcodeScannerRef } from '../components/cashier/BarcodeScanner';
import CartTable from '../components/cashier/CartTable';
import CheckoutModal from '../components/cashier/CheckoutModal';
import ProductLookupModal from '../components/cashier/ProductLookupModal';
import TransactionSummary from '../components/cashier/TransactionSummary';
import { addProductToCart, calculateTotal, removeItemFromCart, updateItemQuantity } from '../utils/cashier-utils';
import { openCashDrawer, printReceipt, printReceiptByTransactionNumber } from '../utils/receipt-printer';

import { CartItem, ProductType } from '@/types/cashier';
import { UserOutlined } from '@ant-design/icons';

interface DebtorType {
    id: string;
    name: string;
    phone?: string;
    debts_sum_balance?: number;
}

interface CashierPageProps extends PageProps {
    products: ProductType[];
    debtors: DebtorType[];
}

interface TransactionResponse {
    props?: {
        flash?: {
            transaction_number?: string;
        };
    };
    data?: {
        transaction_number?: string;
    };
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface SaleItemSubmission {
    id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface SaleFormData {
    payment_method: string;
    payment_type: 'cash' | 'debt'; // Add this field
    items: SaleItemSubmission[];
    total_amount: number;
    amount_paid: number;
    change: number;
    debtor_id?: string;
    [key: string]: any;
}

interface TransactionError {
    message?: string;
    [key: string]: any;
}

const CashierSystem: React.FC = () => {
    const { t } = useTranslation();
    const pageProps = usePage<Page<CashierPageProps>>().props;
    const products = pageProps.products as ProductType[];
    const debtors = pageProps.debtors as DebtorType[];

    const { flash } = usePage().props;

    useEffect(() => {
        // Check if flash exists and has success property
        if (flash && flash.success) {
            message.success(flash.success);

            // If there's a transaction number, you can handle receipt printing here
            if (flash.transaction_number) {
                printReceiptByTransactionNumber(flash.transaction_number);
                openCashDrawer();
            }

            // Reset the cart and other state after successful transaction
            setCartItems([]);
            setTotal(0);
            setAmountPaid(null);
            setChange(0);
            setSelectedDebtor(null);
            setPaymentType('cash');
        }

        // Check if flash exists and has error property
        if (flash && flash.error) {
            message.error(flash.error);
        }
    }, [flash]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Cashier', href: route('cashier') },
    ];

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [selectedDebtor, setSelectedDebtor] = useState<string | null>(null);
    const [creatingDebt, setCreatingDebt] = useState<boolean>(false);

    const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);
    const [amountPaid, setAmountPaid] = useState<number | null>(null);
    const [change, setChange] = useState<number>(0);
    const [processingTransaction, setProcessingTransaction] = useState<boolean>(false);

    const [productLookupVisible, setProductLookupVisible] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const [paymentType, setPaymentType] = useState<'cash' | 'debt'>('cash');

    const barcodeScannerRef = useRef<BarcodeScannerRef>(null);

    const { data, setData, post, processing, reset } = useForm<SaleFormData>({
        payment_method: 'cash',
        payment_type: 'cash',
        items: [],
        total_amount: 0,
        amount_paid: 0,
        change: 0,
        debtor_id: undefined,
    });

    useEffect(() => {
        setTotal(calculateTotal(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (barcodeScannerRef.current) {
            barcodeScannerRef.current.focusInput();
        }
    }, []);

    useEffect(() => {
        if (processingTransaction) {
            post(route('sales.store'), {
                preserveScroll: true,
                onStart: () => setProcessingTransaction(true),
                onFinish: () => {
                    setProcessingTransaction(false);
                    setCheckoutModalVisible(false);
                },
            });
        }
    }, [data, processingTransaction]);

    // Cart management functions
    const handleBarcodeScan = (barcode: string) => {
        const product = products.find((p) => p.barcode === barcode);
        if (product) {
            handleProductScanned(product);
        } else {
            message.error(`Product with barcode ${barcode} not found`);
        }
    };

    const handleProductLookup = () => {
        setProductLookupVisible(true);
    };

    const handleProductScanned = (product: ProductType) => {
        setCartItems(addProductToCart(product, cartItems));
        message.success(`Added: ${product.name}`);
    };

    const handleProductSelect = (productId: string) => {
        setSelectedProduct(productId);
    };

    const handleAddProductFromLookup = () => {
        if (selectedProduct) {
            const product = products.find((p) => p.id === selectedProduct);
            if (product) {
                handleProductScanned(product);
            }
            setProductLookupVisible(false);
            setSelectedProduct(null);
        }
    };

    const handleAddAsDebt = () => {
        if (cartItems.length === 0) {
            message.warning('Cart is empty');
            return;
        }

        if (!selectedDebtor) {
            message.warning('Please select a debtor first');
            return;
        }

        setPaymentType('debt');
        setCheckoutModalVisible(true);
    };

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        setCartItems(updateItemQuantity(itemId, quantity, cartItems));
    };

    const handleRemoveItem = (itemId: string) => {
        setCartItems(removeItemFromCart(itemId, cartItems));
    };

    const handleClearCart = () => {
        setCartItems([]);
        setTotal(0);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            message.warning('Cart is empty');
            return;
        }
        setCheckoutModalVisible(true);
        setAmountPaid(total);
        setChange(0);
        setPaymentType('cash'); // Reset to cash payment by default
    };

    const handleAmountPaidChange = (value: number | null) => {
        console.log('Amount changed to:', value);
        setAmountPaid(value);
        setChange(value && value >= total ? value - total : 0);
    };

    const submitTransaction = () => {
        setProcessingTransaction(true);

        // Prepare the items data
        const itemsData = cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price
        }));

        // Set the payment method based on payment type
        const paymentMethod = paymentType === 'debt' ? 'debt' : 'cash';

        // Set the form data based on payment type
        setData({
            payment_method: paymentMethod, // Set payment method based on payment type
            payment_type: paymentType,
            items: itemsData,
            total_amount: total,
            amount_paid: paymentType === 'cash' ? amountPaid || 0 : 0,
            change: paymentType === 'cash' ? change : 0,
            debtor_id: paymentType === 'debt' ? selectedDebtor : undefined,
        });

        // Submit the form
        post(route('sales.store'), {
            onStart: () => setProcessingTransaction(true),
            onFinish: () => {
                setProcessingTransaction(false);
                setCheckoutModalVisible(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('cashier.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                        <Card title={t('cashier.currentTransaction')} className="h-full">
                            <BarcodeScanner ref={barcodeScannerRef} onBarcodeScan={handleBarcodeScan} onProductLookup={handleProductLookup} />
                            <CartTable cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} total={total} />
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title={t('cashier.transactionSummary')} bordered={false} className="h-full">
                            <TransactionSummary cartItems={cartItems} total={total} onCheckout={handleCheckout} onClearCart={handleClearCart} />
                        </Card>
                    </Col>
                </Row>
            </div>

            <CheckoutModal
                visible={checkoutModalVisible}
                total={total}
                amountPaid={amountPaid}
                change={change}
                paymentType={paymentType}
                selectedDebtor={selectedDebtor}
                onAmountPaidChange={handleAmountPaidChange}
                onPaymentTypeChange={setPaymentType}
                onDebtorChange={setSelectedDebtor}
                onComplete={submitTransaction}
                onCancel={() => setCheckoutModalVisible(false)}
                loading={processingTransaction || processing}
            />

            <ProductLookupModal
                visible={productLookupVisible}
                products={products}
                selectedProduct={selectedProduct}
                onProductSelect={handleProductSelect}
                onOk={handleAddProductFromLookup}
                onCancel={() => {
                    setProductLookupVisible(false);
                    setSelectedProduct(null);
                }}
            />
        </AppLayout>
    );
};

export default CashierSystem;
