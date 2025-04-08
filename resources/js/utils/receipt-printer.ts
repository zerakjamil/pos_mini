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
  const receiptWindow = window.open('', '_blank', 'width=300,height=600');

  if (!receiptWindow) {
    console.error('Could not open receipt window');
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-IQ');
  const timeStr = now.toLocaleTimeString('ar-IQ');

  let receiptHtml = `
    <html dir="ltr">
    <head>
      <title>Receipt</title>
      <style>
        @media print {
          @page { margin: 0; }
          body { margin: 0.5cm; }
        }
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 80mm;
          margin: 0 auto;
          padding: 5px;
        }
        .header { text-align: center; margin-bottom: 10px; }
        .store-name { font-size: 16px; font-weight: bold; }
        .store-info { font-size: 10px; margin: 2px 0; }
        .divider { border-top: 1px dotted #000; margin: 5px 0; }
        .item {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
          font-size: 11px;
        }
        .item-total { text-align: right; font-weight: bold; }
        .totals {
          margin-top: 5px;
          text-align: right;
          font-size: 12px;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
        }
        .grand-total {
          font-size: 14px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 10px;
          font-size: 10px;
        }
        .barcode {
          text-align: center;
          margin: 10px 0;
          font-family: 'Courier', monospace;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="store-name">سوپەر ماركێت</div>
        <div class="store-info">Kurdistan Region - Iraq</div>
        <div class="store-info">Tel: 0750 000 0000</div>
        <div class="store-info">VAT Reg: 12345678</div>
        <div class="store-info">Date: ${dateStr}</div>
        <div class="store-info">Time: ${timeStr}</div>
        <div class="store-info">Receipt #: ${transactionNumber || 'N/A'}</div>
      </div>

      <div class="divider"></div>

      <div class="items">
        <div class="item" style="font-weight: bold;">
          <span>Item</span>
          <span>Qty</span>
          <span>Price</span>
        </div>
  `;

  cartItems.forEach(item => {
    receiptHtml += `
      <div class="item">
        <span>${item.name}</span>
        <span>x${item.quantity}</span>
        <span>${Number(item.price).toLocaleString()} د.ع</span>
      </div>
      <div class="item-total">
        <span>${Number(item.subtotal).toLocaleString()} د.ع</span>
      </div>
    `;
  });

  receiptHtml += `
      </div>

      <div class="divider"></div>

      <div class="totals">
        <div class="total-line grand-total">
          <span>Total:</span>
          <span>${Number(total).toLocaleString()} د.ع</span>
        </div>
        <div class="total-line">
          <span>Cash:</span>
          <span>${amountPaid ? Number(amountPaid).toLocaleString() : '0'} د.ع</span>
        </div>
        <div class="total-line">
          <span>Change:</span>
          <span>${Number(change).toLocaleString()} د.ع</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="footer">
        <p>Thank you for shopping with us!</p>
        <p>سوپاس بۆ کڕینەکەت</p>
      </div>

      <div class="barcode">
        |||||||||||||||||||||||||
        ${transactionNumber || 'N/A'}
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `;

  receiptWindow.document.open();
  receiptWindow.document.write(receiptHtml);
  receiptWindow.document.close();

  setTimeout(() => {
    try {
      receiptWindow.print();
    } catch (e) {
      console.error('Print failed:', e);
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
