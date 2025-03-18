export interface ProductType {
  key: string;
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
}

export interface CartItem extends ProductType {
  quantity: number;
  subtotal: number;
}

export interface CheckoutData {
  total: number;
  amountPaid: number | null;
  change: number;
}
