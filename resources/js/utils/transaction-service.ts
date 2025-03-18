import axios from 'axios';
import { CartItem } from '../types/cashier';

interface TransactionData {
  cartItems: CartItem[];
  total: number;
  amountPaid: number | null;
  change: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface TransactionResponse {
  success: boolean;
  transaction_number: string;
  id: number;
}

export const saveTransaction = async ({
  cartItems,
  total,
  amountPaid,
  change,
  onSuccess,
  onError
}: TransactionData): Promise<void> => {
  try {
    // Format the data for the API
    const transactionData = {
      items: cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.subtotal
      })),
      total_amount: total,
      amount_paid: amountPaid,
      change_amount: change,
      payment_method: 'cash' // Default to cash for now, could be expanded later
    };

    // Send the data to the server using CSRF protection
    const response = await axios.post<TransactionResponse>('/api/transactions', transactionData, {
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Handle success
    if (response.data.success && onSuccess) {
      onSuccess(response.data);
    }
  } catch (error) {
    // Handle error
    if (onError) {
      onError(error);
    } else {
      console.error('Error saving transaction:', error);
    }
  }
};

export const getTransaction = async (id: number): Promise<any> => {
  try {
    const response = await axios.get(`/api/transactions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};
