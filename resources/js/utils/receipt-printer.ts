import { CartItem } from "../types/cashier";

interface InvoiceData {
    cartItems: CartItem[];
    total: number;
    customer: {
        name: string;
        tel: string;
        address: string;
        email: string;
        exportTo: string;
    };
    salesInfo: {
        quoteNumber: string;
        quoteDate: string;
        validity: string;
        salesRef: string;
    };
    bankDetails: {
        bankName: string;
        accountName: string;
        accountNumber: string;
        swiftCode: string;
        iban: string;
        currency: string;
        address: string;
    };
    transactionNumber: string;
}

// Add a new function to print invoice by transaction number
export const printInvoiceByTransactionNumber = async (transactionNumber: string): Promise<void> => {
    try {
        // Fetch the sale details from the server
        const response = await fetch(`/api/sales/${transactionNumber}`);

        if (!response.ok) {
            throw new Error('Failed to fetch sale details');
        }

        const saleData = await response.json();

        // Format the data for the invoice printer - using all available properties dynamically
        const invoiceData: InvoiceData = {
            cartItems: saleData.items.map((item: any) => ({
                id: item.product_id || item.id,
                name: item.product_name || item.name,
                quantity: item.quantity,
                price: item.unit_price || item.price,
                subtotal: item.subtotal || (item.quantity * item.price),
                exteriorColor: item.exterior_color || item.exteriorColor || '',
                interiorColor: item.interior_color || item.interiorColor || '',
                modelYear: item.model_year || item.modelYear || '',
                chassisNumbers: item.chassis_numbers || item.chassisNumbers || []
            })),
            total: saleData.total_amount || saleData.total || 0,
            customer: {
                name: saleData.customer_name || saleData.debtor?.name || '',
                tel: saleData.customer_tel || saleData.debtor?.phone || '',
                address: saleData.customer_address || '',
                email: saleData.customer_email || '',
                exportTo: saleData.export_to || 'Iraq'
            },
            salesInfo: {
                quoteNumber: saleData.transaction_number || transactionNumber,
                quoteDate: saleData.created_at ? new Date(saleData.created_at).toLocaleDateString('en-US') : new Date().toLocaleDateString('en-US'),
                validity: saleData.validity || '7 days',
                salesRef: saleData.sales_ref || saleData.reference || ''
            },
            bankDetails: saleData.bank_details || {
                bankName: 'WIO BUSINESS',
                accountName: 'DELUXE CARS FZE',
                accountNumber: '9756950749',
                swiftCode: 'WIOBAEAD',
                iban: 'AE140860000009756950749',
                currency: 'AED',
                address: 'Etihad Airways centre, Floor 5, Al Monira, abu dhabi'
            },
            transactionNumber: transactionNumber,
            paymentMethod: saleData.payment_method || 'cash',
            paymentType: saleData.payment_type || 'cash',
            amountPaid: saleData.amount_paid || 0,
            change: saleData.change || 0,
            notes: saleData.notes || ''
        };

        // Call the invoice printer function with the formatted data
        printProformaInvoice(invoiceData);
    } catch (error) {
        console.error('Error printing invoice:', error);
        // Fallback to a simple invoice if we can't fetch the details
        printSimpleInvoice(transactionNumber);
    }
};

// Simple invoice with just the transaction number
const printSimpleInvoice = (transactionNumber: string): void => {
    const invoiceWindow = window.open('', '_blank', 'width=800,height=800');

    if (!invoiceWindow) {
        console.error('Could not open invoice window');
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US');

    let invoiceHtml = `
    <html>
    <head>
      <title>Proforma Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          margin: 0;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .company-info {
          text-align: left;
        }
        .logo {
          text-align: center;
        }
        .invoice-title {
          text-align: right;
          font-size: 18px;
          font-weight: bold;
        }
        .customer-info {
          margin-bottom: 20px;
        }
        .info-row {
          display: flex;
          margin-bottom: 5px;
        }
        .info-label {
          width: 80px;
          font-weight: bold;
        }
        .info-value {
          flex-grow: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .footer {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }
        .signature {
          width: 45%;
        }
        .page-number {
          text-align: center;
          margin-top: 20px;
        }
        .buttons {
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <p>P.O.BOX : 93934</p>
          <p>00971 4 262 7925</p>
          <p>www.deluxecarsfze.com</p>
          <p>deluxecarsfze@gmail.com</p>
          <p>Al Aweer Free Auto Zone Showroom No. 143</p>
          <p>Dubai, UAE</p>
        </div>
        <div class="logo">
          <h2>DELUXE CARS FZE</h2>
        </div>
        <div class="invoice-title">
          <p>Proforma Invoice</p>
          <p>Sales Quote # : ${transactionNumber}</p>
          <p>Quote Date : ${dateStr}</p>
        </div>
      </div>

      <div class="customer-info">
        <div class="info-row">
          <div class="info-label">Name</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">Tel</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">Address</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">email</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">Export To</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">Note</div>
          <div class="info-value">: </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Ext. Color</th>
            <th>Int. Color</th>
            <th>Model Year</th>
            <th>QTY</th>
            <th>Unit Price IQD</th>
            <th>Total Amount IQD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="8">No items available</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <div class="signature">
          <p>Customer Acceptance</p>
          <div style="border-bottom: 1px solid #000; height: 40px;"></div>
        </div>
        <div class="signature">
          <p>Prepared by</p>
          <div style="border-bottom: 1px solid #000; height: 40px;"></div>
        </div>
      </div>

      <div class="page-number">
        Page 1 of 1
      </div>

      <div class="buttons">
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `;

    invoiceWindow.document.open();
    invoiceWindow.document.write(invoiceHtml);
    invoiceWindow.document.close();

    setTimeout(() => {
        try {
            invoiceWindow.print();
        } catch (e) {
            console.error('Print failed:', e);
        }
    }, 500);
};

export const printProformaInvoice = (data: InvoiceData): void => {
    const { cartItems, total, customer, salesInfo, bankDetails, transactionNumber, paymentMethod, paymentType, amountPaid, change, notes } = data;

    // Check if cartItems is undefined or not an array
    if (!cartItems || !Array.isArray(cartItems)) {
        console.error('Invalid cartItems:', cartItems);
        // Fall back to simple invoice
        printSimpleInvoice(transactionNumber);
        return;
    }

    const invoiceWindow = window.open('', '_blank', 'width=800,height=800');

    if (!invoiceWindow) {
        console.error('Could not open invoice window');
        return;
    }

    const now = new Date();
    const dateStr = salesInfo.quoteDate || now.toLocaleDateString('en-US');
    const totalPages = Math.ceil(cartItems.length / 2) || 1;
    const totalItems = cartItems.length;

    // Group items by page
    const itemsPerPage = 2;
    const pages = [];

    for (let i = 0; i < totalPages; i++) {
        const startIdx = i * itemsPerPage;
        const endIdx = Math.min(startIdx + itemsPerPage, totalItems);
        pages.push(cartItems.slice(startIdx, endIdx));
    }

    // Create HTML for each page
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const pageItems = pages[pageIndex];
        const pageNumber = pageIndex + 1;
        const isLastPage = pageNumber === totalPages;

        let invoiceHtml = `
      <html>
      <head>
        <title>Proforma Invoice</title>
        <style>
          @media print {
            @page { margin: 0.5cm; }
            body { margin: 0; }
            .buttons { display: none; }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .company-info {
            text-align: left;
            font-size: 11px;
            line-height: 1.2;
          }
          .logo {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .logo-text {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .logo-subtext {
            font-size: 14px;
            letter-spacing: 4px;
          }
          .invoice-title {
            text-align: right;
            font-size: 18px;
            font-weight: bold;
          }
          .customer-info {
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            margin-bottom: 5px;
          }
          .info-label {
            width: 80px;
            font-weight: normal;
          }
          .info-value {
            flex-grow: 1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }
          th {
            background-color: #f2f2f2;
          }
          .chassis-list {
            padding-left: 20px;
            margin: 5px 0;
          }
          .footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
          }
          .signature {
            width: 45%;
          }
          .page-number {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
          }
          .total-section {
            width: 100%;
            margin-top: 20px;
          }
          .total-section table {
            width: 100%;
          }
          .total-section td {
            text-align: right;
          }
          .bank-details {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
          }
          .bank-column {
            width: 48%;
          }
          .bank-column-title {
            font-weight: bold;
            margin-bottom: 5px;
            text-align: center;
          }
          .terms-column {
            width: 48%;
          }
          .buttons {
            text-align: center;
            margin-top: 20px;
          }
          .amount-in-words {
            margin: 10px 0;
            font-style: italic;
          }
          .payment-info {
            margin: 10px 0;
            padding: 5px;
            background-color: #f9f9f9;
            border: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <p>P.O.BOX : 93934</p>
            <p>00971 4 262 7925</p>
            <p>www.deluxecarsfze.com</p>
            <p>deluxecarsfze@gmail.com</p>
            <p>Al Aweer Free Auto Zone Showroom No. 143</p>
            <p>Dubai, UAE</p>
          </div>
          <div class="logo">
            <div class="logo-text">DELUXE CARS</div>
            <div class="logo-subtext">F Z E</div>
          </div>
          <div class="invoice-title">
            <p>Proforma Invoice</p>
            <table style="border:none; width: auto; float: right;">
              <tr>
                <td style="border:none; padding: 2px; text-align: left;">Sales Quote #</td>
                <td style="border:none; padding: 2px; text-align: left;">: ${salesInfo.quoteNumber}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px; text-align: left;">Quote Date</td>
                <td style="border:none; padding: 2px; text-align: left;">: ${dateStr}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px; text-align: left;">Validity</td>
                <td style="border:none; padding: 2px; text-align: left;">: ${salesInfo.validity}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px; text-align: left;">Sales Ref</td>
                <td style="border:none; padding: 2px; text-align: left;">: ${salesInfo.salesRef}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="customer-info">
          <div class="info-row">
            <div class="info-label">Name</div>
            <div class="info-value">: ${customer.name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tel</div>
            <div class="info-value">: ${customer.tel}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Address</div>
            <div class="info-value">: ${customer.address}</div>
          </div>
          <div class="info-row">
            <div class="info-label">email</div>
            <div class="info-value">: ${customer.email}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Export To</div>
            <div class="info-value">: ${customer.exportTo}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Note</div>
            <div class="info-value">: ${notes || ''}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Ext. Color</th>
              <th>Int. Color</th>
              <th>Model Year</th>
              <th>QTY</th>
              <th>Unit Price IQD</th>
              <th>Total Amount IQD</th>
            </tr>
          </thead>
          <tbody>
    `;

        // Add page items
        pageItems.forEach((item, index) => {
            const itemNumber = pageIndex * itemsPerPage + index + 1;

            invoiceHtml += `
        <tr>
          <td>${itemNumber}</td>
          <td>
            ${item.name}
            ${item.chassisNumbers && item.chassisNumbers.length > 0 ?
                `<div>CHASSIS:</div>
               <div class="chassis-list">
                 ${item.chassisNumbers.map((chassis: string) => `${chassis}<br>`).join('')}
               </div>` : ''}
          </td>
          <td>${item.exteriorColor || ''}</td>
          <td>${item.interiorColor || ''}</td>
          <td>${item.modelYear || ''}</td>
          <td>${item.quantity}</td>
          <td>${Number(item.price).toLocaleString()}</td>
          <td>${Number(item.subtotal).toLocaleString()}</td>
        </tr>
      `;
        });

        // Add empty rows if needed for spacing
        if (pageItems.length < itemsPerPage && !isLastPage) {
            for (let i = pageItems.length; i < itemsPerPage; i++) {
                invoiceHtml += `
          <tr>
            <td colspan="8">&nbsp;</td>
          </tr>
        `;
            }
        }

        invoiceHtml += `
          </tbody>
        </table>
    `;

        // Add total section only on the last page
        if (isLastPage) {
            // Add payment info section
            invoiceHtml += `
        <div class="payment-info">
          <strong>Payment Information:</strong>
          <div>Payment Type: ${(paymentType || '').toUpperCase()}</div>
          <div>Payment Method: ${(paymentMethod || '').toUpperCase()}</div>
          ${paymentType === 'cash' ? `
          <div>Amount Paid: ${Number(amountPaid || 0).toLocaleString()} IQD</div>
          <div>Change: ${Number(change || 0).toLocaleString()} IQD</div>
          ` : ''}
        </div>
        `;
            
            invoiceHtml += `
        <div class="total-section">
          <table>
            <tr>
              <td style="text-align: left; width: 70%;">Total of Units</td>
              <td style="width: 15%;">${cartItems.reduce((sum, item) => sum + item.quantity, 0)}</td>
              <td style="width: 15%;">Total Amount</td>
              <td style="width: 15%;">${Number(total).toLocaleString()} IQD</td>
            </tr>
            <tr>
              <td style="text-align: left;" colspan="2"></td>
              <td>VAT</td>
              <td>0.00 IQD</td>
            </tr>
            <tr>
              <td style="text-align: left;" colspan="2" class="amount-in-words">
                ${convertNumberToWords(total)} Only
              </td>
              <td style="font-weight: bold;">Grand Total</td>
              <td style="font-weight: bold;">${Number(total).toLocaleString()} IQD</td>
            </tr>
          </table>
        </div>

        <div class="bank-details">
          <div class="bank-column">
            <div class="bank-column-title">Bank Detail</div>
            <table style="border:none;">
              <tr>
                <td style="border:none; padding: 2px;">Bank Name:</td>
                <td style="border:none; padding: 2px;">${bankDetails.bankName}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Account Name:</td>
                <td style="border:none; padding: 2px;">${bankDetails.accountName}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Account No.:</td>
                <td style="border:none; padding: 2px;">${bankDetails.accountNumber}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">SWIFT CODE:</td>
                <td style="border:none; padding: 2px;">${bankDetails.swiftCode}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">IBAN (${bankDetails.currency}):</td>
                <td style="border:none; padding: 2px;">${bankDetails.iban}</td>
              </tr>
            </table>
          </div>
          <div class="terms-column">
            <div class="bank-column-title">Terms & Conditions</div>
            <table style="border:none;">
              <tr>
                <td style="border:none; padding: 2px;">Payment Terms:</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px; font-weight: bold;">BANK Details</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">TITLE:- ${bankDetails.accountName}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">BANK NAME:- ${bankDetails.bankName}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">ACCOUNT NO:- ${bankDetails.accountNumber}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">IBAN NO:- ${bankDetails.iban}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">SWIFT CODE:- ${bankDetails.swiftCode}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">ACCOUNT CURRENCY:- ${bankDetails.currency}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">ADDRESS: ${bankDetails.address}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Inco terms:</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Delivery:</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Vehicle availability:</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
            </table>
          </div>
        </div>
      `;
        }

        invoiceHtml += `
        <div class="footer">
          <div class="signature">
            <p>Customer Acceptance</p>
            <div style="border-bottom: 1px solid #000; height: 40px;"></div>
          </div>
          <div class="signature">
            <p>Prepared by</p>
            <div style="border-bottom: 1px solid #000; height: 40px;"></div>
            <p>Dubai - UAE</p>
          </div>
        </div>

        <div class="page-number">
          Page ${pageNumber} of ${totalPages}
        </div>

        <div class="buttons">
          <button onclick="window.print()" style="padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 10px;">Print Receipt</button>
          <button onclick="window.close()" style="padding: 10px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
      </body>
      </html>
    `;

        if (pageIndex === 0) {
            // For the first page, write to the existing window
            invoiceWindow.document.open();
            invoiceWindow.document.write(invoiceHtml);
            invoiceWindow.document.close();
        } else {
            // For subsequent pages, open new windows
            const newWindow = window.open('', `_blank_${pageIndex}`, 'width=800,height=800');
            if (newWindow) {
                newWindow.document.open();
                newWindow.document.write(invoiceHtml);
                newWindow.document.close();
            }
        }
    }
    
    // Focus the window to bring it to the front
    if (invoiceWindow) {
        invoiceWindow.focus();
    }
    
    // Don't automatically trigger print - let user click the button instead
    // This avoids browser security restrictions that might block automatic printing
}

// Helper function to convert number to words
function convertNumberToWords(num: number): string {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    function convertLessThanThousand(n: number): string {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
    }

    function convertRecursively(n: number): string {
        if (n < 1000) return convertLessThanThousand(n);
        if (n < 1000000) return convertLessThanThousand(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convertRecursively(n % 1000) : '');
        if (n < 1000000000) return convertLessThanThousand(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 !== 0 ? ' ' + convertRecursively(n % 1000000) : '');
        return convertLessThanThousand(Math.floor(n / 1000000000)) + ' Billion' + (n % 1000000000 !== 0 ? ' ' + convertRecursively(n % 1000000000) : '');
    }

    return convertRecursively(Math.floor(num));
}

// Keep original functions for backward compatibility
export const printReceipt = (data: any): void => {
    console.warn('printReceipt is deprecated. Use printProformaInvoice instead.');
    // Convert old format to new format
    const invoiceData: InvoiceData = {
        cartItems: data.cartItems.map((item: any) => ({
            ...item,
            exteriorColor: 'WHITE',
            interiorColor: '',
            modelYear: '2024',
            chassisNumbers: []
        })),
        total: data.total,
        customer: {
            name: '',
            tel: '',
            address: '',
            email: '',
            exportTo: ''
        },
        salesInfo: {
            quoteNumber: data.transactionNumber,
            quoteDate: new Date().toLocaleDateString('en-US'),
            validity: '',
            salesRef: ''
        },
        bankDetails: {
            bankName: '',
            accountName: '',
            accountNumber: '',
            swiftCode: '',
            iban: '',
            currency: '',
            address: ''
        },
        transactionNumber: data.transactionNumber
    };

    printProformaInvoice(invoiceData);
};

export const printReceiptByTransactionNumber = async (transactionNumber: string): Promise<void> => {
    console.warn('printReceiptByTransactionNumber is deprecated. Use printInvoiceByTransactionNumber instead.');
    printInvoiceByTransactionNumber(transactionNumber);
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
