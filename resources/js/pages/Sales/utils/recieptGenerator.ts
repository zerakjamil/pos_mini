import { Transaction } from '../types/management';

export const generateReceipt = (sale: Transaction): string => {
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
        @media print {
          body {
            width: 100%;
            margin: 0;
            padding: 0;
          }
          button {
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

      <div class="transaction-number">Transaction #: ${sale.transaction_number}</div>

      <div class="divider"></div>

      <div class="items">
        <div class="item" style="font-weight: bold;">
          <div class="item-name">Item</div>
          <div class="item-qty">Qty</div>
          <div class="item-price">Price</div>
        </div>
  `;

  // Add items to receipt
  sale.items.forEach(item => {
    receiptHtml += `
      <div class="item">
        <div class="item-name">${item.product_name}</div>
        <div class="item-qty">${item.quantity}</div>
        <div class="item-price">IQD ${Number(item.unit_price).toLocaleString()}</div>
      </div>
      <div class="item">
        <div class="item-name"></div>
        <div class="item-qty"></div>
        <div class="item-price">IQD ${Number(item.subtotal).toLocaleString()}</div>
      </div>
    `;
  });

  receiptHtml += `
      </div>

      <div class="divider"></div>

      <div class="totals">
        <div class="total-line" style="font-weight: bold;">
          <div>Total:</div>
          <div>IQD ${Number(sale.total_amount).toLocaleString()}</div>
        </div>
        <div class="total-line">
          <div>Amount Paid:</div>
          <div>IQD ${Number(sale.amount_paid).toLocaleString()}</div>
        </div>
        <div class="total-line">
          <div>Change:</div>
          <div>IQD ${Number(sale.change_amount).toLocaleString()}</div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="thank-you">
        Thank you for your purchase!
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()">Print Receipt</button>
      </div>
    </body>
    </html>
  `;

  return receiptHtml;
};
