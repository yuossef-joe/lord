import type { Product } from "@/types/product";
import type { Order } from "@/types/order";

const PRODUCTION_API_BASE_URL = "https://lord-backend.vercel.app/api";

function getApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!configuredUrl) {
    return PRODUCTION_API_BASE_URL;
  }

  if (
    typeof window !== "undefined" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname) &&
    /localhost|127\.0\.0\.1/.test(configuredUrl)
  ) {
    return PRODUCTION_API_BASE_URL;
  }

  return configuredUrl;
}

function normalizeProduct(product: Record<string, unknown>): Product {
  return {
    ...product,
    _id: product._id ?? product.id,
    salePrice: product.salePrice ?? product.originalPrice,
    specifications: product.specifications ?? product.specs ?? [],
  } as unknown as Product;
}

function normalizeStatus(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/-/g, "_");
}

function normalizeOrder(order: Record<string, unknown>): Order {
  const items = Array.isArray(order.items)
    ? (order.items as Order["items"])
    : [];
  const payments = Array.isArray(order.payments)
    ? (order.payments as Array<Record<string, unknown>>)
    : [];
  const firstPayment = payments[0];

  return {
    ...(order as unknown as Order),
    _id: String(order._id ?? order.id ?? ""),
    items,
    subtotal: Number(order.subtotal ?? 0),
    shipping: Number(order.shipping ?? order.shippingFee ?? 0),
    discount: Number(order.discount ?? order.discountAmount ?? 0),
    total: Number(order.total ?? 0),
    status: normalizeStatus(
      order.status ?? order.orderStatus,
    ) as Order["status"],
    payment: {
      ...((order.payment as Order["payment"] | undefined) ?? {}),
      method: normalizeStatus(
        firstPayment?.paymentMethod ?? "card",
      ) as Order["payment"]["method"],
      amount: Number(firstPayment?.amount ?? order.total ?? 0),
    },
    statusHistory: Array.isArray(order.statusHistory)
      ? order.statusHistory.map((entry) => {
          const historyEntry = entry as Record<string, unknown>;
          return {
            status: normalizeStatus(
              historyEntry.status ?? historyEntry.newStatus,
            ) as Order["status"],
            note:
              historyEntry.note == null ? undefined : String(historyEntry.note),
            timestamp: String(
              historyEntry.timestamp ?? historyEntry.createdAt ?? "",
            ),
          };
        })
      : [],
  };
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("customerToken")
      : null;

  const res = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("customerToken");
      localStorage.removeItem("customerRefreshToken");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "API error" }));
    throw new Error(error.message || "API error");
  }

  return res.json();
}

export const fetchHomeContent = () => apiRequest("/content/home");
export const fetchContentPage = (pageKey: string) =>
  apiRequest(`/content/${pageKey}`);
export const fetchProducts = async (params: string) => {
  const response = await apiRequest<{ data: Array<Record<string, unknown>> }>(
    `/products?${params}`,
  );
  return {
    ...response,
    data: (response.data ?? []).map(normalizeProduct),
  };
};
export const fetchProductBySlug = async (slug: string) => {
  const response = await apiRequest<{ data: Record<string, unknown> }>(
    `/products/${slug}`,
  );
  return {
    ...response,
    data: normalizeProduct(response.data),
  };
};
export const fetchRelatedProducts = async (slug: string) => {
  const response = await apiRequest<{ data: Array<Record<string, unknown>> }>(
    `/products/${slug}/related?limit=4`,
  );
  return {
    ...response,
    data: (response.data ?? []).map(normalizeProduct),
  };
};
export const fetchBrands = () => apiRequest("/brands");
export const fetchProductCategories = () => apiRequest("/product-categories");
export const fetchServices = () =>
  apiRequest(`/services?active=true&_=${Date.now()}`);
export const fetchServiceBySlug = (slug: string) =>
  apiRequest(`/services/${slug}`);
export const fetchServiceTypes = () => apiRequest("/service-types");
export const fetchAboutContent = () => apiRequest("/content/about");
export const fetchAbout = fetchAboutContent;
export const fetchTestimonials = () =>
  apiRequest("/testimonials?approved=true&featured=true");
export const fetchFaqs = (category?: string) =>
  apiRequest(`/faqs?active=true${category ? `&category=${category}` : ""}`);
export const fetchContactSettings = () => apiRequest("/settings/contact");
export const fetchSiteSettings = () => apiRequest("/settings/site");
export const fetchShippingSettings = () => apiRequest("/settings/shipping");
export const fetchShippingOptions = (params: string) =>
  apiRequest(`/shipping/options?${params}`);

export const submitContactForm = (data: Record<string, unknown>) =>
  apiRequest("/inquiries/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const submitInquiry = (data: Record<string, unknown>) =>
  apiRequest("/inquiries", { method: "POST", body: JSON.stringify(data) });
export const submitServiceRequest = (data: Record<string, unknown>) =>
  apiRequest("/service-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchCart = () => apiRequest("/cart");
export const addToCart = (productId: string, quantity: number) =>
  apiRequest("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
export const updateCartItem = (itemId: string, quantity: number) =>
  apiRequest(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
export const removeCartItem = (itemId: string) =>
  apiRequest(`/cart/items/${itemId}`, { method: "DELETE" });
export const clearServerCart = () => apiRequest("/cart", { method: "DELETE" });
export const applyCouponApi = (code: string) =>
  apiRequest("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
export const mergeCart = () => apiRequest("/cart/merge", { method: "POST" });

export const registerCustomer = (data: Record<string, unknown>) =>
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const verifyEmail = (data: { email: string; otp: string }) =>
  apiRequest("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const resendOtp = (email: string) =>
  apiRequest("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
export const loginCustomer = (email: string, password: string) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
export const logoutCustomer = () =>
  apiRequest("/auth/logout", { method: "POST" });
export const refreshTokenApi = (refreshToken: string) =>
  apiRequest("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
export const forgotPassword = (email: string) =>
  apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
export const resetPassword = (data: {
  email: string;
  otp: string;
  newPassword: string;
}) =>
  apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchProfile = () => apiRequest("/account/profile");
export const updateProfile = (data: Record<string, unknown>) =>
  apiRequest("/account/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const updateCustomerProfile = updateProfile;
export const changePassword = (data: Record<string, unknown>) =>
  apiRequest("/account/change-password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const fetchAddresses = () => apiRequest("/account/addresses");
export const fetchCustomerAddresses = fetchAddresses;
export const addAddress = (data: Record<string, unknown>) =>
  apiRequest("/account/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const addCustomerAddress = addAddress;
export const updateAddress = (id: string, data: Record<string, unknown>) =>
  apiRequest(`/account/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const updateCustomerAddress = updateAddress;
export const deleteAddress = (id: string) =>
  apiRequest(`/account/addresses/${id}`, { method: "DELETE" });
export const deleteCustomerAddress = deleteAddress;
export const setDefaultAddress = (id: string) =>
  apiRequest(`/account/addresses/${id}/default`, { method: "PATCH" });
export const fetchOrders = async (params?: string) => {
  const response = await apiRequest<{ data: Array<Record<string, unknown>> }>(
    `/account/orders${params || ""}`,
  );
  return {
    ...response,
    data: (response.data ?? []).map(normalizeOrder),
  };
};
export const fetchCustomerOrders = fetchOrders;
export const fetchOrderDetail = async (id: string) => {
  const response = await apiRequest<{ data: Record<string, unknown> }>(
    `/account/orders/${id}`,
  );
  return {
    ...response,
    data: normalizeOrder(response.data),
  };
};
export const cancelOrder = (id: string) =>
  apiRequest(`/account/orders/${id}/cancel`, { method: "POST" });

export const createOrder = (data: Record<string, unknown>) =>
  apiRequest("/orders", { method: "POST", body: JSON.stringify(data) });
export const initiatePayment = (orderId: string) =>
  apiRequest(`/orders/${orderId}/pay`, { method: "POST" });
export const fetchOrderConfirmation = (orderId: string) =>
  apiRequest(`/orders/${orderId}/confirmation`);
export const validateCoupon = (code: string) =>
  apiRequest("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
export const trackOrder = (orderNumber: string) =>
  apiRequest(`/orders/track/${orderNumber}`);
