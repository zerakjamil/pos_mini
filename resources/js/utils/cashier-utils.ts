import { CartItem, ProductType } from "../types/cashier";

/**
 * Calculate the total price of all items in the cart
 */
export const calculateTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
};

/**
 * Add a product to the cart
 * If the product already exists in the cart, increase its quantity
 */
export const addProductToCart = (product: ProductType, cartItems: CartItem[]): CartItem[] => {
  // Check if the product is already in the cart
  const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

  if (existingItemIndex >= 0) {
    // Product exists, update quantity
    const updatedItems = [...cartItems];
    const existingItem = updatedItems[existingItemIndex];
    const newQuantity = existingItem.quantity + 1;

    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: newQuantity,
      subtotal: product.price * newQuantity
    };

    return updatedItems;
  } else {
    // Product doesn't exist, add it
    return [
      ...cartItems,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price
      }
    ];
  }
};

/**
 * Update the quantity of an item in the cart
 * If quantity is 0 or less, remove the item
 */
export const updateItemQuantity = (itemId: string, quantity: number, cartItems: CartItem[]): CartItem[] => {
  if (quantity <= 0) {
    return removeItemFromCart(itemId, cartItems);
  }

  return cartItems.map(item =>
    item.id === itemId
      ? { ...item, quantity, subtotal: item.price * quantity }
      : item
  );
};

/**
 * Remove an item from the cart
 */
export const removeItemFromCart = (itemId: string, cartItems: CartItem[]): CartItem[] => {
  return cartItems.filter(item => item.id !== itemId);
};

/**
 * Clear all items from the cart
 */
export const clearCart = (): CartItem[] => {
  return [];
};

/**
 * Format a price as a currency string
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

/**
 * Generate a unique transaction ID
 */
export const generateTransactionId = (): string => {
  return `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const generateReceiptContent = (
  cartItems: CartItem[],
  total: number,
  amountPaid: number | null,
  change: number
): string => {
  return `
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 300px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1px dashed #000;
          padding-bottom: 10px;
        }
        .header h2 {
          margin: 5px 0;
          font-size: 18px;
        }
        .header p {
          margin: 5px 0;
        }
        .items {
          margin-bottom: 20px;
        }
        .item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .item-name {
          flex: 1;
        }
        .item-qty {
          width: 30px;
          text-align: center;
        }
        .item-price {
          width: 70px;
          text-align: right;
        }
        .total-section {
          border-top: 1px dashed #000;
          padding-top: 10px;
          margin-top: 10px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 10px;
          border-top: 1px dashed #000;
          padding-top: 10px;
        }
        @media print {
          body {
            background-color: white;
            width: 100%;
            padding: 0;
          }
          button {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>POS SYSTEM</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Time: ${new Date().toLocaleTimeString()}</p>
        <p>Cashier: John Doe</p>
        <p>Transaction #: ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
      </div>

      <div class="items">
        <div class="item" style="font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 10px;">
          <div class="item-name">Item</div>
          <div class="item-qty">Qty</div>
          <div class="item-price">Price</div>
        </div>
        ${cartItems.map(item => `
          <div class="item">
            <div class="item-name">${item.name}</div>
            <div class="item-qty">${item.quantity}</div>
            <div class="item-price">$${item.subtotal.toFixed(2)}</div>
          </div>
        `).join('')}
      </div>

      <div class="total-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax (0%):</span>
          <span>$0.00</span>
        </div>
        <div class="total-row" style="font-size: 14px;">
          <span>TOTAL:</span>
          <span>$${total.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Amount Paid:</span>
          <span>$${amountPaid?.toFixed(2) || '0.00'}</span>
        </div>
        <div class="total-row">
          <span>Change:</span>
          <span>$${change.toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your purchase!</p>
        <p>Please come again</p>
      </div>
    </body>
    </html>
  `;
};
