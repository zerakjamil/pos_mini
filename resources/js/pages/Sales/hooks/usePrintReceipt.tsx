import { Transaction } from '../../../types/cashier';
import { generateReceipt } from '../../../utils/receiptGenerator';

export const usePrintReceipt = () => {
  const printReceipt = (sale: Transaction) => {
    // Open a new window with the receipt
    const receiptWindow = window.open('', '_blank', 'width=300,height=600');

    if (!receiptWindow) {
      console.error('Could not open receipt window. Please check your popup blocker settings.');
      return;
    }

    const receiptHtml = generateReceipt(sale);

    receiptWindow.document.open();
    receiptWindow.document.write(receiptHtml);
    receiptWindow.document.close();

    setTimeout(() => {
      try {
        receiptWindow.print();
      } catch (e) {
        console.error('Failed to auto-print:', e);
      }
    }, 500);
  };

  return { printReceipt };
};
