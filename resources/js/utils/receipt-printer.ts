import { CartItem } from "../types/cashier";

interface ReceiptData {
  cartItems: CartItem[];
  total: number;
  amountPaid: number | null;
  change: number;
  transactionNumber?: string;
}

export const printReceipt = (data: ReceiptData): void => {
  const { cartItems, total, amountPaid, change, transactionNumber } = data;

  // Open a new window with the receipt
  const receiptWindow = window.open('', '_blank', 'width=300,height=600');

  if (!receiptWindow) {
    console.error('Could not open receipt window. Please check your popup blocker settings.');
    return;
  }

  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  // Generate receipt HTML
  let receiptHtml = `
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 300px;
          margin: 0 auto;
          padding: 10px;
        }
        .header {
          text-align: center;
          margin-bottom: 10px;
        }
        .store-name {
          font-size: 16px;
          font-weight: bold;
        }
        .store-info {
          font-size: 10px;
        }
        .divider {
          border-top: 1px dashed #000;
          margin: 10px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .item-name {
          flex: 2;
        }
        .item-qty {
          flex: 1;
          text-align: center;
        }
        .item-price {
          flex: 1;
          text-align: right;
        }
        .totals {
          margin-top: 10px;
          text-align: right;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
        }
        .thank-you {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
        }
        .transaction-number {
          text-align: center;
          font-weight: bold;
          margin-top: 10px;
        }
        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        @media print {
          body {
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .actions {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="store-name">POS SYSTEM STORE</div>
        <div class="store-info">123 Main Street, City, State ZIP</div>
        <div class="store-info">Tel: (123) 456-7890</div>
        <div class="store-info">Date: ${dateStr} Time: ${timeStr}</div>
      </div>

      <div class="transaction-number">Transaction #: ${transactionNumber || 'N/A'}</div>

      <div class="divider"></div>

      <div class="items">
        <div class="item" style="font-weight: bold;">
          <div class="item-name">Item</div>
          <div class="item-qty">Qty</div>
          <div class="item-price">Price</div>
        </div>
  `;

  // Add items to receipt
  cartItems.forEach(item => {
    receiptHtml += `
      <div class="item">
        <div class="item-name">${item.name}</div>
        <div class="item-qty">${item.quantity}</div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="item">
        <div class="item-name"></div>
        <div class="item-qty"></div>
        <div class="item-price">$${item.subtotal.toFixed(2)}</div>
      </div>
    `;
  });

  // Add totals to receipt
  receiptHtml += `
      </div>

      <div class="divider"></div>

      <div class="totals">
        <div class="total-line">
          <div>Subtotal:</div>
          <div>$${total.toFixed(2)}</div>
        </div>
        <div class="total-line">
          <div>Tax:</div>
          <div>$0.00</div>
        </div>
        <div class="total-line" style="font-weight: bold;">
          <div>Total:</div>
          <div>$${total.toFixed(2)}</div>
        </div>
        <div class="total-line">
          <div>Amount Paid:</div>
          <div>$${amountPaid ? amountPaid.toFixed(2) : '0.00'}</div>
        </div>
        <div class="total-line">
          <div>Change:</div>
          <div>$${change.toFixed(2)}</div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="thank-you">
        Thank you for your purchase!
      </div>

      <div class="actions">
        <button onclick="window.print()">Print Receipt</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `;

  // Write the HTML to the new window and print
  receiptWindow.document.open();
  receiptWindow.document.write(receiptHtml);
  receiptWindow.document.close();

  // Auto-print if supported
  setTimeout(() => {
    try {
      receiptWindow.print();
    } catch (e) {
      console.error('Failed to auto-print:', e);
    }
  }, 500);
};

export const openCashDrawer = (): void => {
  // In a real application, this would use a hardware API
  // For example, using a receipt printer's cash drawer kick command
  // or a direct connection to a cash drawer via USB/Serial
  console.log('HARDWARE: Opening cash drawer');

  // For demonstration purposes, show a message
  const cashDrawerElement = document.createElement('div');
  cashDrawerElement.style.position = 'fixed';
  cashDrawerElement.style.top = '50%';
  cashDrawerElement.style.left = '50%';
  cashDrawerElement.style.transform = 'translate(-50%, -50%)';
  cashDrawerElement.style.padding = '20px';
  cashDrawerElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  cashDrawerElement.style.color = 'white';
  cashDrawerElement.style.borderRadius = '5px';
  cashDrawerElement.style.zIndex = '9999';
  cashDrawerElement.textContent = '💰 Cash drawer opened!';

  document.body.appendChild(cashDrawerElement);

  setTimeout(() => {
    document.body.removeChild(cashDrawerElement);
  }, 2000);
};
