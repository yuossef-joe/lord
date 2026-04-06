import { Product } from "./product";

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
  };
}

export interface GuestCartItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface GuestCart {
  items: GuestCartItem[];
  couponCode?: string;
}
