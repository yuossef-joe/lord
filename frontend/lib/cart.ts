// Cart helpers for guest cart (localStorage)

import { GuestCart, GuestCartItem } from "@/types/cart";
import { Product } from "@/types/product";

const CART_KEY = "lord_cart";

export function getGuestCart(): GuestCart {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { items: [] };
    return JSON.parse(raw);
  } catch {
    return { items: [] };
  }
}

export function saveGuestCart(cart: GuestCart): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearGuestCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export function addItemToGuestCart(
  product: Product,
  quantity: number = 1,
): GuestCart {
  const cart = getGuestCart();
  const existingIndex = cart.items.findIndex(
    (item) => item.productId === product._id,
  );

  if (existingIndex >= 0) {
    const newQty = Math.min(
      cart.items[existingIndex].quantity + quantity,
      product.stockQuantity,
    );
    cart.items[existingIndex].quantity = newQty;
    cart.items[existingIndex].lineTotal =
      newQty * cart.items[existingIndex].unitPrice;
  } else {
    const unitPrice = product.salePrice || product.price;
    cart.items.push({
      productId: product._id,
      product,
      quantity: Math.min(quantity, product.stockQuantity),
      unitPrice,
      lineTotal: unitPrice * quantity,
    });
  }

  saveGuestCart(cart);
  return cart;
}

export function updateGuestCartQuantity(
  productId: string,
  quantity: number,
): GuestCart {
  const cart = getGuestCart();
  const item = cart.items.find((i) => i.productId === productId);
  if (item) {
    item.quantity = Math.max(1, Math.min(quantity, item.product.stockQuantity));
    item.lineTotal = item.unitPrice * item.quantity;
  }
  saveGuestCart(cart);
  return cart;
}

export function removeItemFromGuestCart(productId: string): GuestCart {
  const cart = getGuestCart();
  cart.items = cart.items.filter((i) => i.productId !== productId);
  saveGuestCart(cart);
  return cart;
}

export function getGuestCartItemCount(cart: GuestCart): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getGuestCartSubtotal(cart: GuestCart): number {
  return cart.items.reduce((sum, item) => sum + item.lineTotal, 0);
}
