"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { Product } from "@/types/product";
import { CartItem, GuestCartItem } from "@/types/cart";
import {
  fetchCart,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeCartItem as removeCartItemApi,
  clearServerCart,
  applyCouponApi,
  removeCouponApi,
} from "@/lib/api";
import {
  getGuestCart,
  addItemToGuestCart,
  updateGuestCartQuantity,
  removeItemFromGuestCart,
  clearGuestCart,
  getGuestCartItemCount,
  getGuestCartSubtotal,
} from "@/lib/cart";
import { useAuth } from "./AuthContext";
import { debounce } from "@/lib/utils";

interface CartContextType {
  items: (CartItem | GuestCartItem)[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode: string | null;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<(CartItem | GuestCartItem)[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const total = Math.max(0, subtotal + shipping - discount);

  // Load cart on mount or auth change
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          const data = (await fetchCart()) as {
            data: {
              items: CartItem[];
              coupon?: { code: string };
              discount?: number;
              shipping?: number;
            };
          };
          setItems(data.data.items || []);
          setCouponCode(data.data.coupon?.code || null);
          setDiscount(data.data.discount || 0);
          setShipping(data.data.shipping || 0);
        } else {
          const guestCart = getGuestCart();
          setItems(guestCart.items);
          setCouponCode(null);
          setDiscount(0);
        }
      } catch {
        // Fallback to guest cart
        const guestCart = getGuestCart();
        setItems(guestCart.items);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [isAuthenticated]);

  const addItem = async (product: Product, quantity: number = 1) => {
    if (isAuthenticated) {
      await addToCartApi(product._id, quantity);
      const data = (await fetchCart()) as { data: { items: CartItem[] } };
      setItems(data.data.items || []);
    } else {
      const cart = addItemToGuestCart(product, quantity);
      setItems([...cart.items]);
    }
  };

  // Debounced API update for quantity changes
  const debouncedUpdate = useRef(
    debounce(async (itemId: string, quantity: number) => {
      if (isAuthenticated) {
        try {
          await updateCartItemApi(itemId, quantity);
        } catch {
          // Reload cart on error
          const data = (await fetchCart()) as { data: { items: CartItem[] } };
          setItems(data.data.items || []);
        }
      }
    }, 500),
  ).current;

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (isAuthenticated) {
        // Optimistic update
        setItems((prev) =>
          prev.map((item) =>
            "_id" in item && item._id === itemId
              ? { ...item, quantity, lineTotal: item.unitPrice * quantity }
              : item,
          ),
        );
        debouncedUpdate(itemId, quantity);
      } else {
        const cart = updateGuestCartQuantity(itemId, quantity);
        setItems([...cart.items]);
      }
    },
    [isAuthenticated, debouncedUpdate],
  );

  const removeItem = async (itemId: string) => {
    if (isAuthenticated) {
      await removeCartItemApi(itemId);
      setItems((prev) =>
        prev.filter((item) => !("_id" in item && item._id === itemId)),
      );
    } else {
      const cart = removeItemFromGuestCart(itemId);
      setItems([...cart.items]);
    }
  };

  const clearCartAction = async () => {
    if (isAuthenticated) {
      await clearServerCart();
    } else {
      clearGuestCart();
    }
    setItems([]);
    setCouponCode(null);
    setDiscount(0);
  };

  const applyCoupon = async (code: string) => {
    const data = (await applyCouponApi(code)) as {
      data: { discount: number; code: string };
    };
    setCouponCode(data.data.code);
    setDiscount(data.data.discount);
  };

  const removeCoupon = async () => {
    await removeCouponApi();
    setCouponCode(null);
    setDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        discount,
        total,
        couponCode,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart: clearCartAction,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
