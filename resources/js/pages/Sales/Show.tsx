import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Typography, Button, Layout, Card, Descriptions, Table, Divider, Space } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { Transaction, TransactionItem } from '../../types/cashier';

const { Title } = Typography;
const { Content, Header, Footer } = Layout;

interface SalesShowProps {
  sale: Transaction;
}

const SalesShow: React.FC<SalesShowProps> = ({ sale }) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      render: (subtotal: number) => `$${subtotal.toFixed(2)}`,
    },
  ];

  const handlePrint = () => {
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
          <div class="item-price">$${item.unit_price.toFixed(2)}</div>
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
            <div>$${sale.total_amount.toFixed(2)}</div>
          </div>
          <div class="total-line">
            <div>Tax:</div>
            <div>$0.00</div>
          </div>
          <div class="total-line" style="font-weight: bold;">
            <div>Total:</div>
            <div>$${sale.total_amount.toFixed(2)}</div>
          </div>
          <div class="total-line">
            <div>Amount Paid:</div>
            <div>$${sale.amount_paid.toFixed(2)}</div>
          </div>
          <div class="total-line">
            <div>Change:</div>
            <div>$${sale.change_amount.toFixed(2)}</div>
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Head title={`Sale ${sale.transaction_number}`} />

      <Header style={{ background: '#fff', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/sales">
              <Button icon={<ArrowLeftOutlined />} style={{ marginRight: 16 }}>
                Back to Sales
              </Button>
            </Link>
            <Title level={4} style={{ margin: 0 }}>Transaction: {sale.transaction_number}</Title>
          </div>
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            Print Receipt
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="Transaction Details">
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="Transaction Number">{sale.transaction_number}</Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(sale.created_at).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Cashier">{sale.cashier_name}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">{sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)}</Descriptions.Item>
              <Descriptions.Item label="Total Amount">${sale.total_amount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Amount Paid">${sale.amount_paid.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Change">${sale.change_amount.toFixed(2)}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Items">
            <Table
              columns={columns}
              dataSource={sale.items}
              rowKey="id"
              pagination={false}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} align="right">
                      <strong>Total:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong>${sale.total_amount.toFixed(2)}</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </Card>
        </Space>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        POS System ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default SalesShow;
