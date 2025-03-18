export interface ProductType {
  id: string;
  key: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  barcode: string;
}

export interface CartItem extends ProductType {
  quantity: number;
  subtotal: number;
}

export interface BarcodeScannerRef {
  focusInput: () => void;
}
