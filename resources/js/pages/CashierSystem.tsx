import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Page, PageProps } from '@inertiajs/core';
import { Card, Col, message, Row } from 'antd';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from 'react-i18next';

import '../i18n';

import BarcodeScanner, { BarcodeScannerRef } from '../components/cashier/BarcodeScanner';
import CartTable from '../components/cashier/CartTable';
import CheckoutModal from '../components/cashier/CheckoutModal';
import ProductLookupModal from '../components/cashier/ProductLookupModal';
import TransactionSummary from '../components/cashier/TransactionSummary';
import { addProductToCart, calculateTotal, removeItemFromCart, updateItemQuantity } from '../utils/cashier-utils';
import { openCashDrawer, printReceipt } from '../utils/receipt-printer';

import { CartItem, ProductType } from '@/types/cashier';

interface CashierPageProps extends PageProps {
    products: ProductType[];
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
    items: SaleItemSubmission[];
    total_amount: number;
    amount_paid: number;
    change: number;
    [key: string]: any;
}

interface TransactionError {
    message?: string;
    [key: string]: any;
}

const CashierSystem: React.FC = () => {
    const { t } = useTranslation();
    const { products } = usePage<Page<CashierPageProps>>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Cashier', href: route('cashier') },
    ];

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);

    const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);
    const [amountPaid, setAmountPaid] = useState<number | null>(null);
    const [change, setChange] = useState<number>(0);
    const [processingTransaction, setProcessingTransaction] = useState<boolean>(false);

    const [productLookupVisible, setProductLookupVisible] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const barcodeScannerRef = useRef<BarcodeScannerRef>(null);

    const { data, setData, post, processing, reset } = useForm<SaleFormData>({
        payment_method: 'cash',
        items: [],
        total_amount: 0,
        amount_paid: 0,
        change: 0,
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
                onSuccess: (response: TransactionResponse) => {
                    console.log('Transaction successful, server response:', response);
                    const transactionNumber = response.props?.flash?.transaction_number || response.data?.transaction_number;

                    openCashDrawer();
                    printReceipt({
                        cartItems,
                        total,
                        amountPaid,
                        change,
                        transactionNumber,
                    });

                    // User feedback
                    message.success('Transaction completed successfully!');
                    message.info(`Change: IQD ${change.toFixed(0)}`);

                    // Reset state
                    setTimeout(() => {
                        setCartItems([]);
                        setTotal(0);
                        setCheckoutModalVisible(false);
                        setProcessingTransaction(false);
                        reset();

                        if (barcodeScannerRef.current) {
                            barcodeScannerRef.current.focusInput();
                        }
                    }, 1500);
                },
                onError: (errors: TransactionError) => {
                    console.error('Transaction failed, error response:', errors);
                    const errorMessage =
                        typeof errors === 'string'
                            ? errors
                            : errors.message || Object.values(errors).flat().join(', ') || 'Unknown error occurred';

                    message.error(`Transaction failed: ${errorMessage}`);
                    setProcessingTransaction(false);
                },
                onFinish: () => {
                    if (barcodeScannerRef.current) {
                        barcodeScannerRef.current.focusInput();
                    }
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
    };

    const handleAmountPaidChange = (value: number | null) => {
        console.log('Amount changed to:', value);
        setAmountPaid(value);
        setChange(value && value >= total ? value - total : 0);
    };

    const prepareItemsForSubmission = (items: CartItem[]): SaleItemSubmission[] => {
        return items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price,
        }));
    };

    const submitTransaction = () => {
        if (cartItems.length === 0) {
            message.error('Cannot complete transaction: Cart is empty');
            return;
        }

        if (!amountPaid || amountPaid < total) {
            message.error('Amount paid must be at least equal to the total');
            return;
        }

        setProcessingTransaction(true);

        const formData: SaleFormData = {
            payment_method: 'cash',
            items: prepareItemsForSubmission(cartItems),
            total_amount: total,
            amount_paid: amountPaid,
            change: change,
        };

        setData(formData);
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

            {/* Modals */}
            <CheckoutModal
                visible={checkoutModalVisible}
                total={total}
                amountPaid={amountPaid}
                change={change}
                onAmountPaidChange={handleAmountPaidChange}
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
