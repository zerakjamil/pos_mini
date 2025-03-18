import React, { useState, useRef, useEffect } from 'react';
import { Layout, Card, Row, Col, message, Button } from 'antd';
import { usePage, Link } from '@inertiajs/react';
import { ArrowLeftOutlined, HistoryOutlined } from '@ant-design/icons';

// Import components
import CashierHeader from '../components/cashier/CashierHeader';
import BarcodeScanner, { BarcodeScannerRef } from '../components/cashier/BarcodeScanner';
import CartTable from '../components/cashier/CartTable';
import TransactionSummary from '../components/cashier/TransactionSummary';
import CheckoutModal from '../components/cashier/CheckoutModal';
import ProductLookupModal from '../components/cashier/ProductLookupModal';

// Import utilities
import { addProductToCart, removeItemFromCart, updateItemQuantity, calculateTotal } from '../utils/cashier-utils';
import { saveTransaction } from '../utils/transaction-service';
import { printReceipt, openCashDrawer } from '../utils/receipt-printer';

// Import types
import { CartItem, ProductType } from '../types/cashier';

const { Content, Footer, Header } = Layout;

const CashierSystem: React.FC = () => {
  // Get products from props
  const { products } = usePage().props as unknown as {
    products: ProductType[]
  };

  // State for cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  // Checkout state
  const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);
  const [amountPaid, setAmountPaid] = useState<number | null>(null);
  const [change, setChange] = useState<number>(0);
  const [processingTransaction, setProcessingTransaction] = useState<boolean>(false);

  // Product lookup state
  const [productLookupVisible, setProductLookupVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Ref for barcode scanner
  const barcodeScannerRef = useRef<BarcodeScannerRef>(null);

  // Update total when cart items change
  useEffect(() => {
    const newTotal = calculateTotal(cartItems);
    setTotal(newTotal);
  }, [cartItems]);

  // Focus barcode scanner on mount
  useEffect(() => {
    if (barcodeScannerRef.current) {
      barcodeScannerRef.current.focusInput();
    }
  }, []);

  // Handle barcode scan
  const handleBarcodeScan = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      handleProductScanned(product);
    } else {
      message.error(`Product with barcode ${barcode} not found`);
    }
  };

  // Handle product lookup
  const handleProductLookup = () => {
    setProductLookupVisible(true);
  };

  // Handle product scanned (from barcode or lookup)
  const handleProductScanned = (product: ProductType) => {
    const updatedCart = addProductToCart(product, cartItems);
    setCartItems(updatedCart);
    message.success(`Added: ${product.name}`);
  };

  // Handle product selection from lookup
  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  // Handle adding product from lookup
  const handleAddProductFromLookup = () => {
    if (selectedProduct) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        handleProductScanned(product);
      }
      setProductLookupVisible(false);
      setSelectedProduct(null);
    }
  };

  // Handle quantity update
  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = updateItemQuantity(itemId, quantity, cartItems);
    setCartItems(updatedCart);
  };

  // Handle item removal
  const handleRemoveItem = (itemId: string) => {
    const updatedCart = removeItemFromCart(itemId, cartItems);
    setCartItems(updatedCart);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning('Cart is empty');
      return;
    }
    setCheckoutModalVisible(true);
    setAmountPaid(total);
    setChange(0);
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

  // Handle transaction completion
  const handleCompleteTransaction = () => {
    if (!amountPaid || amountPaid < total) {
      message.error('Amount paid must be at least equal to the total');
      return;
    }

    setProcessingTransaction(true);

    // Save transaction to database
    saveTransaction({
      cartItems,
      total,
      amountPaid,
      change,
      onSuccess: (data) => {
        // Open cash drawer
        openCashDrawer();

        // Print receipt with transaction number from server
        printReceipt({
          cartItems,
          total,
          amountPaid,
          change,
          transactionNumber: data.transaction_number
        });

        message.success('Transaction completed successfully!');
        message.info(`Change: $${change.toFixed(2)}`);

        // Reset cart after successful transaction
        setTimeout(() => {
          setCartItems([]);
          setTotal(0);
          setCheckoutModalVisible(false);
          setProcessingTransaction(false);

          // Focus barcode scanner for next transaction
          if (barcodeScannerRef.current) {
            barcodeScannerRef.current.focusInput();
          }
        }, 1500);
      },
      onError: (error) => {
        message.error(`Transaction failed: ${error.message || 'Unknown error'}`);
        setProcessingTransaction(false);
      }
    });
  };

  // Handle clear cart
  const handleClearCart = () => {
    setCartItems([]);
    setTotal(0);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/">
              <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
                Back to Dashboard
              </Button>
            </Link>
            <CashierHeader />
          </div>
          <Link href="/sales">
            <Button icon={<HistoryOutlined />} type="primary">
              Sales History
            </Button>
          </Link>
        </div>
      </Header>

      <Content style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Card title="Current Transaction">
              <BarcodeScanner
                ref={barcodeScannerRef}
                onBarcodeScan={handleBarcodeScan}
                onProductLookup={handleProductLookup}
              />

              <CartTable
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                total={total}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Transaction Summary" bordered={false}>
              <TransactionSummary
                cartItems={cartItems}
                total={total}
                onCheckout={handleCheckout}
                onClearCart={handleClearCart}
              />
            </Card>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        POS Cashier System ©{new Date().getFullYear()}
      </Footer>

      {/* Modals */}
      <CheckoutModal
        visible={checkoutModalVisible}
        total={total}
        amountPaid={amountPaid}
        change={change}
        onAmountPaidChange={handleAmountPaidChange}
        onComplete={handleCompleteTransaction}
        onCancel={() => setCheckoutModalVisible(false)}
        loading={processingTransaction}
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
    </Layout>
  );
};

export default CashierSystem;
