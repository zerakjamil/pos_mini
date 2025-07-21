const a=i=>{const n=new Date,t=n.toLocaleDateString(),d=n.toLocaleTimeString();let e=`
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
        <div class="store-info">Date: ${t} Time: ${d}</div>
      </div>

      <div class="transaction-number">Transaction #: ${i.transaction_number}</div>

      <div class="divider"></div>

      <div class="items">
        <div class="item" style="font-weight: bold;">
          <div class="item-name">Item</div>
          <div class="item-qty">Qty</div>
          <div class="item-price">Price</div>
        </div>
  `;return i.items.forEach(o=>{e+=`
      <div class="item">
        <div class="item-name">${o.product_name}</div>
        <div class="item-qty">${o.quantity}</div>
        <div class="item-price">IQD ${Number(o.unit_price).toLocaleString()}</div>
      </div>
      <div class="item">
        <div class="item-name"></div>
        <div class="item-qty"></div>
        <div class="item-price">IQD ${Number(o.subtotal).toLocaleString()}</div>
      </div>
    `}),e+=`
      </div>

      <div class="divider"></div>

      <div class="totals">
        <div class="total-line" style="font-weight: bold;">
          <div>Total:</div>
          <div>IQD ${Number(i.total_amount).toLocaleString()}</div>
        </div>
        <div class="total-line">
          <div>Amount Paid:</div>
          <div>IQD ${Number(i.amount_paid).toLocaleString()}</div>
        </div>
        <div class="total-line">
          <div>Change:</div>
          <div>IQD ${Number(i.change_amount).toLocaleString()}</div>
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
  `,e},s=()=>({printReceipt:n=>{const t=window.open("","_blank","width=300,height=600");if(!t){console.error("Could not open receipt window. Please check your popup blocker settings.");return}const d=a(n);t.document.open(),t.document.write(d),t.document.close(),setTimeout(()=>{try{t.print()}catch(e){console.error("Failed to auto-print:",e)}},500)}});export{s as usePrintReceipt};
//# sourceMappingURL=usePrintReceipt-CWNTg7mg.js.map
