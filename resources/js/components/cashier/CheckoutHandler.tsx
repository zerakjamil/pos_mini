import React from 'react';
import { message } from 'antd';
import { CartItem } from '../../types/cashier';
import { saveTransaction } from '../../utils/transaction-service';
import { printReceipt, openCashDrawer } from '../../utils/receipt-printer';

interface CheckoutHandlerProps {
  cartItems: CartItem[];
  total: number;
  amountPaid: number | null;
  change: number;
  onCheckoutComplete: () => void;
}

const CheckoutHandler: React.FC<CheckoutHandlerProps> = ({
  cartItems,
  total,
  amountPaid,
  change,
  onCheckoutComplete
}) => {
  const handleCheckout = () => {
    // Save the transaction to the database
    saveTransaction({
      cartItems,
      total,
      amountPaid,
      change,
      onSuccess: (data) => {
        // Show success message
        message.success('Transaction completed successfully!');

        // Open cash drawer
        openCashDrawer();

        // Print receipt with the transaction number from the server
        printReceipt({
          cartItems,
          total,
          amountPaid,
          change,
          transactionNumber: data.transaction_number
        });

        // Call the parent component's callback to reset the cart
        onCheckoutComplete();
      },
      onError: (error) => {
        // Show error message
        message.error('Failed to complete transaction: ' + (error.message || 'Unknown error'));

        // We might still want to print a receipt even if saving failed
        printReceipt({
          cartItems,
          total,
          amountPaid,
          change
        });
      }
    });
  };

  return null; // This is a utility component, no UI needed
};

export default CheckoutHandler;
