import React, { useEffect, useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Page, PageProps } from '@inertiajs/core';
import { Card, Col, message, Row } from 'antd';
import AppLayout from '@/layouts/app-layout';

// Import components and utilities
import BarcodeScanner, { BarcodeScannerRef } from '../components/cashier/BarcodeScanner';
import CartTable from '../components/cashier/CartTable';
import CheckoutModal from '../components/cashier/CheckoutModal';
import ProductLookupModal from '../components/cashier/ProductLookupModal';
import TransactionSummary from '../components/cashier/TransactionSummary';
import { addProductToCart, calculateTotal, removeItemFromCart, updateItemQuantity } from '../utils/cashier-utils';
import { openCashDrawer, printReceipt } from '../utils/receipt-printer';

// Import types
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

// Define proper types to replace "any"
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
    [key: string]: any; // Add index signature to satisfy FormDataType constraint
}

// Define error type
interface TransactionError {
    message?: string;
    [key: string]: any;
}

const CashierSystem: React.FC = () => {
    // Page props and config
    const { products } = usePage<Page<CashierPageProps>>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Cashier', href: route('cashier') },
    ];

    // Cart state
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);

    // Transaction state
    const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);
    const [amountPaid, setAmountPaid] = useState<number | null>(null);
    const [change, setChange] = useState<number>(0);
    const [processingTransaction, setProcessingTransaction] = useState<boolean>(false);

    // Product lookup state
    const [productLookupVisible, setProductLookupVisible] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    // Refs
    const barcodeScannerRef = useRef<BarcodeScannerRef>(null);

    // Extract setData along with post, processing, reset from useForm
    const { data, setData, post, processing, reset } = useForm<SaleFormData>({
        payment_method: 'cash',
        items: [],
        total_amount: 0,
        amount_paid: 0,
        change: 0,
    });

    // Effects
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

                    // Hardware interactions
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

    // Transaction handling
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

    // Format cart items for API submission with proper typing
    const prepareItemsForSubmission = (items: CartItem[]): SaleItemSubmission[] => {
        return items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price,
        }));
    };

    // Submit transaction to the server - Fix post method call
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

        // Build the form data based on local state
        const formData: SaleFormData = {
            payment_method: 'cash',
            items: prepareItemsForSubmission(cartItems),
            total_amount: total,
            amount_paid: amountPaid,
            change: change,
        };

        // Update the form's internal state with the current data
        setData(formData);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cashier System" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                        <Card title="Current Transaction" className="h-full">
                            <BarcodeScanner ref={barcodeScannerRef} onBarcodeScan={handleBarcodeScan} onProductLookup={handleProductLookup} />

                            <CartTable cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} total={total} />
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title="Transaction Summary" bordered={false} className="h-full">
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
