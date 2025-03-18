import { CartItem } from "../types/cashier";

/**
 * Print a receipt for the transaction
 *
 * @param cartItems Items in the cart
 * @param total Total amount
 * @param amountPaid Amount paid by customer
 * @param change Change to give back to customer
 */
export const printReceipt = (
  cartItems: CartItem[],
  total: number,
  amountPaid: number | null,
  change: number
): void => {
  // In a real application, this would connect to a receipt printer
  // For now, we'll just log to console
  console.log('=== RECEIPT ===');
  console.log('Date:', new Date().toLocaleString());
  console.log('Items:');

  cartItems.forEach(item => {
    console.log(`${item.name} x ${item.quantity} @ $${item.price.toFixed(2)} = $${item.subtotal.toFixed(2)}`);
  });

  console.log('-------------');
  console.log(`Total: $${total.toFixed(2)}`);
  console.log(`Paid: $${amountPaid?.toFixed(2) || '0.00'}`);
  console.log(`Change: $${change.toFixed(2)}`);
  console.log('Thank you for your purchase!');
  console.log('===============');
};

/**
 * Open the cash drawer
 */
export const openCashDrawer = (): void => {
  // In a real application, this would send a command to open the cash drawer
  // For now, we'll just log to console
  console.log('Opening cash drawer...');
};
