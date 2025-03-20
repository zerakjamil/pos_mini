export interface ProductType {
  id: string;
  key: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface BarcodeScannerRef {
  focusInput: () => void;
}

export interface Transaction {
  id: number;
  transaction_number: string;
  total_amount: number;
  amount_paid: number;
  change_amount: number;
  payment_method: string;
  cashier_name: string;
  created_at: string;
  updated_at: string;
  items: TransactionItem[];
}

export interface TransactionItem {
  id: number;
  transaction_id: number;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface BreadCrumb {
    title: string;
    href: string;
}
