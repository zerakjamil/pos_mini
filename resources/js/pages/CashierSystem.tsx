import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, message } from 'antd';
import { usePage } from '@inertiajs/react';
import { ProductType, CartItem } from '../types/cashier';
import { addProductToCart, calculateTotal } from '../utils/cashier-utils';
import { printReceipt, openCashDrawer } from '../utils/receipt-service';
import DashboardLayout from '@/layouts/DashboardLayout';

// Components
import CashierHeader from '../components/cashier/CashierHeader';
import BarcodeScanner from '../components/cashier/BarcodeScanner';
import CartTable from '../components/cashier/CartTable';
import TransactionSummary from '../components/cashier/TransactionSummary';
import CheckoutModal from '../components/cashier/CheckoutModal';
import ProductLookupModal from '../components/cashier/ProductLookupModal';

const CashierSystem: React.FC = () => {
  // Get products from props
  const { products = [] } = usePage().props as unknown as {
    products: ProductType[]
  };

  // State for cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  // Modal states
  const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);
  const [productLookupVisible, setProductLookupVisible] = useState<boolean>(false);

  // Reference to the BarcodeScanner component
  const barcodeScannerRef = useRef<{ focusInput: () => void }>(null);

  // Checkout states
  const [amountPaid, setAmountPaid] = useState<number | null>(null);
  const [change, setChange] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Calculate total whenever cart items change
  useEffect(() => {
    const newTotal = calculateTotal(cartItems);
    setTotal(newTotal);
  }, [cartItems]);

  // Handle barcode scan
  const handleBarcodeScanned = (barcode: string) => {
    // Find product by barcode
    const product = products.find(p => p.barcode === barcode);

    if (product) {
      handleAddProductToCart(product);
      message.success(`Added: ${product.name}`);
    } else {
      message.error(`Product not found for barcode: ${barcode}`);
    }
  };

  // Add product to cart
  const handleAddProductToCart = (product: ProductType) => {
    setCartItems(prevItems => addProductToCart(product, prevItems));
  };

  // Remove item from cart
  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity, subtotal: quantity * item.price }
          : item
      )
    );
  };

  // Product lookup functions
  const showProductLookup = () => {
    setProductLookupVisible(true);
    setSelectedProduct(null);
  };

  const handleProductSelect = () => {
    if (selectedProduct) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        handleAddProductToCart(product);
        message.success(`Added: ${product.name}`);
      }
    }
    setProductLookupVisible(false);
    setSelectedProduct(null);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Cart is empty');
      return;
    }

    setCheckoutModalVisible(true);
    setAmountPaid(total);
  };

  // Handle amount paid change
  const handleAmountPaidChange = (value: number | null) => {
    setAmountPaid(value);
    if (value && value >= total) {
      setChange(value - total);
    } else {
      setChange(0);
    }
  };

  // Complete transaction
  const completeTransaction = () => {
    if (!amountPaid || amountPaid < total) {
      message.error('Amount paid must be at least equal to the total');
      return;
    }

    // Print receipt
    printReceipt(cartItems, total, amountPaid, change);

    // Open cash drawer
    openCashDrawer();

    message.success('Transaction completed successfully!');
    message.info(`Change: $${change.toFixed(2)}`);

    // Reset cart after successful transaction
    setTimeout(() => {
      setCartItems([]);
      setCheckoutModalVisible(false);
      setAmountPaid(null);
      setChange(0);

      // Focus the barcode input after transaction is complete
      if (barcodeScannerRef.current) {
        barcodeScannerRef.current.focusInput();
      }
    }, 1500);
  };

  // Cancel checkout
  const cancelCheckout = () => {
    setCheckoutModalVisible(false);
    setAmountPaid(null);
    setChange(0);
  };

  return (
    <div className="cashier-system">
      <CashierHeader />

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title="Current Transaction" bordered={false}>
            <BarcodeScanner
              ref={barcodeScannerRef}
              onBarcodeScan={handleBarcodeScanned}
              onProductLookup={showProductLookup}
            />

            <CartTable
              cartItems={cartItems}
              total={total}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Transaction Summary" bordered={false}>
            <TransactionSummary
              cartItems={cartItems}
              total={total}
              onCheckout={handleCheckout}
              onClearCart={() => setCartItems([])}
            />
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <CheckoutModal
        visible={checkoutModalVisible}
        total={total}
        amountPaid={amountPaid}
        change={change}
        onAmountPaidChange={handleAmountPaidChange}
        onComplete={completeTransaction}
        onCancel={cancelCheckout}
      />

      <ProductLookupModal
        visible={productLookupVisible}
        products={products}
        selectedProduct={selectedProduct}
        onProductSelect={setSelectedProduct}
        onOk={handleProductSelect}
        onCancel={() => setProductLookupVisible(false)}
      />
    </div>
  );
};

// Apply the DashboardLayout to this component
CashierSystem.layout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default CashierSystem;
