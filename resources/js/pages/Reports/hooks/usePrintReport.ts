import { formatCurrency, formatPercentage } from '../utils/formatters';
import { ProfitData } from '../types/types';

export const usePrintReport = () => {
  const printReport = (activeTab: string, data: ProfitData[]): void => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const reportTitle = activeTab === 'daily'
      ? 'Daily Sales Report'
      : activeTab === 'weekly'
        ? 'Weekly Sales Report'
        : 'Monthly Sales Report';

    // Calculate totals for summary
    const totalRevenue = data.reduce((sum, item) => sum + item.total_revenue, 0);
    const totalProfit = data.reduce((sum, item) => sum + item.gross_profit, 0);
    const totalCost = data.reduce((sum, item) => sum + item.cost_of_goods, 0);
    const avgMargin = totalRevenue > 0 ? totalProfit / totalRevenue : 0;

    let tableHtml = `
      <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #1890ff; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; font-weight: bold; text-align: left; }
          .summary { margin-top: 20px; font-weight: bold; }
          .print-date { text-align: right; margin-bottom: 20px; }
          .formula-box { border: 1px solid #ddd; padding: 10px; margin: 10px 0; background-color: #f9f9f9; }
          .currency { text-align: right; }
          .percent { text-align: right; }
          .count { text-align: center; }
          tfoot td { font-weight: bold; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="print-date">Generated: ${new Date().toLocaleString()}</div>
        <h1>${reportTitle}</h1>

        <div class="formula-box">
          <h3>How Profits Are Calculated:</h3>
          <p>• <strong>Cost of Goods</strong> = (Batch Price ÷ Units per Batch) × Quantity Sold</p>
          <p>• <strong>Gross Profit</strong> = Total Revenue − Cost of Goods</p>
          <p>• <strong>Profit Margin</strong> = (Gross Profit ÷ Total Revenue) × 100%</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Sales Count</th>
              <th>Total Revenue</th>
              <th>Cost of Goods</th>
              <th>Gross Profit</th>
              <th>Profit Margin</th>
            </tr>
          </thead>
          <tbody>
    `;

    data.forEach((item) => {
      tableHtml += `
        <tr>
            <td>${item.date}</td>
            <td class="count">${item.sales_count.toLocaleString('en-US')}</td>
            <td class="currency">${formatCurrency(item.total_revenue)}</td>
            <td class="currency">${formatCurrency(item.cost_of_goods)}</td>
            <td class="currency">${formatCurrency(item.gross_profit)}</td>
            <td class="percent">${formatPercentage(item.profit_margin)}</td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">Total</td>
                <td class="currency">${formatCurrency(totalRevenue)}</td>
                <td class="currency">${formatCurrency(totalCost)}</td>
                <td class="currency">${formatCurrency(totalProfit)}</td>
                <td class="percent">${formatPercentage(avgMargin)}</td>
            </tr>
        </tfoot>
        </table>
        <div class="summary">
            <p>Total Revenue: ${formatCurrency(totalRevenue)}</p>
            <p>Total Cost: ${formatCurrency(totalCost)}</p>
            <p>Total Profit: ${formatCurrency(totalProfit)}</p>
            <p>Average Profit Margin: ${formatPercentage(avgMargin)}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(tableHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return { printReport };
};
