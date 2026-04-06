import {
  MOCK_PRODUCTS,
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_SERVICES,
  MOCK_TESTIMONIALS,
  MOCK_FAQS,
  MOCK_CONTACT_SETTINGS,
  MOCK_ABOUT_CONTENT,
  MOCK_SITE_SETTINGS,
  MOCK_SHIPPING_SETTINGS,
  MOCK_HOME_CONTENT,
  MOCK_CUSTOMER,
  MOCK_ADDRESSES,
  MOCK_ORDERS,
} from "./mock-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  if (USE_MOCK) {
    throw new Error("MOCK_MODE");
  }

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("customerToken")
      : null;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
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

// ─── Mock-aware wrapper ──────────────────────────────────
async function withMock<T>(
  apiFn: () => Promise<T>,
  mockFn: () => T,
): Promise<T> {
  if (USE_MOCK) return mockFn();
  try {
    return await apiFn();
  } catch {
    if (typeof window !== "undefined") {
      console.warn("[Lord API] Backend unreachable, using mock data");
    }
    return mockFn();
  }
}

// ─── Public endpoints ────────────────────────────────────
export const fetchHomeContent = () =>
  withMock(
    () => apiRequest("/content/home"),
    () => ({ data: MOCK_HOME_CONTENT }) as never,
  );

export const fetchProducts = (params: string) =>
  withMock(
    () => apiRequest(`/products?${params}`),
    () => {
      const url = new URLSearchParams(params);
      let items = [...MOCK_PRODUCTS];
      const brand = url.get("brand");
      const category = url.get("category");
      const search = url.get("search");
      const featured = url.get("featured");
      const sort = url.get("sort");
      const page = parseInt(url.get("page") || "1");
      const limit = parseInt(url.get("limit") || "12");

      if (featured === "true") items = items.filter((p) => p.isFeatured);
      if (brand)
        items = items.filter(
          (p) => p.brand._id === brand || p.brand.slug === brand,
        );
      if (category)
        items = items.filter(
          (p) => p.category._id === category || p.category.slug === category,
        );
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.modelNumber.toLowerCase().includes(q),
        );
      }
      if (sort === "price_asc")
        items.sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
        );
      else if (sort === "price_desc")
        items.sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
        );
      else if (sort === "newest")
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      const total = items.length;
      const totalPages = Math.ceil(total / limit);
      const paged = items.slice((page - 1) * limit, page * limit);

      return {
        data: paged,
        pagination: { page, limit, total, totalPages },
      } as never;
    },
  );

export const fetchProductBySlug = (slug: string) =>
  withMock(
    () => apiRequest(`/products/${slug}`),
    () => {
      const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
      if (!product) throw new Error("Product not found");
      return { data: product } as never;
    },
  );

export const fetchRelatedProducts = (slug: string) =>
  withMock(
    () => apiRequest(`/products/${slug}/related?limit=4`),
    () => {
      const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
      const related = MOCK_PRODUCTS.filter(
        (p) =>
          p.slug !== slug &&
          (p.brand._id === product?.brand._id ||
            p.category._id === product?.category._id),
      ).slice(0, 4);
      return { data: related } as never;
    },
  );

export const fetchBrands = () =>
  withMock(
    () => apiRequest("/brands"),
    () => ({ data: MOCK_BRANDS }) as never,
  );

export const fetchProductCategories = () =>
  withMock(
    () => apiRequest("/product-categories"),
    () => ({ data: MOCK_CATEGORIES }) as never,
  );

export const fetchServices = () =>
  withMock(
    () => apiRequest("/services?active=true"),
    () => ({ data: MOCK_SERVICES }) as never,
  );

export const fetchServiceBySlug = (slug: string) =>
  withMock(
    () => apiRequest(`/services/${slug}`),
    () => {
      const svc = MOCK_SERVICES.find((s) => s.slug === slug);
      return { data: svc } as never;
    },
  );

export const fetchServiceTypes = () =>
  withMock(
    () => apiRequest("/service-types"),
    () =>
      ({
        data: MOCK_SERVICES.map((s) => ({ _id: s._id, name: s.name })),
      }) as never,
  );

export const fetchAboutContent = () =>
  withMock(
    () => apiRequest("/content/about"),
    () => ({ data: MOCK_ABOUT_CONTENT }) as never,
  );
export const fetchAbout = fetchAboutContent;

export const fetchTestimonials = () =>
  withMock(
    () => apiRequest("/testimonials?approved=true&featured=true"),
    () => ({ data: MOCK_TESTIMONIALS }) as never,
  );
export const fetchFaqs = (category?: string) =>
  withMock(
    () =>
      apiRequest(`/faqs?active=true${category ? `&category=${category}` : ""}`),
    () => {
      const items = category
        ? MOCK_FAQS.filter((f) => f.category === category)
        : MOCK_FAQS;
      return { data: items } as never;
    },
  );

export const fetchContactSettings = () =>
  withMock(
    () => apiRequest("/settings/contact"),
    () => ({ data: MOCK_CONTACT_SETTINGS }) as never,
  );

export const fetchSiteSettings = () =>
  withMock(
    () => apiRequest("/settings/site"),
    () => ({ data: MOCK_SITE_SETTINGS }) as never,
  );

export const fetchShippingSettings = () =>
  withMock(
    () => apiRequest("/settings/shipping"),
    () => ({ data: MOCK_SHIPPING_SETTINGS }) as never,
  );

// ─── Inquiry & service request endpoints ─────────────────
export const submitContactForm = (data: Record<string, unknown>) =>
  withMock(
    () =>
      apiRequest("/inquiries/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    () => ({ success: true, message: "Mock: contact form submitted" }) as never,
  );
export const submitInquiry = (data: Record<string, unknown>) =>
  withMock(
    () =>
      apiRequest("/inquiries", { method: "POST", body: JSON.stringify(data) }),
    () => ({ success: true, message: "Mock: inquiry submitted" }) as never,
  );
export const submitServiceRequest = (data: Record<string, unknown>) =>
  withMock(
    () =>
      apiRequest("/service-requests", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    () =>
      ({ success: true, message: "Mock: service request submitted" }) as never,
  );

// ─── Cart endpoints ──────────────────────────────────────
export const fetchCart = () =>
  withMock(
    () => apiRequest("/cart"),
    () =>
      ({
        data: {
          _id: "cart-mock",
          items: [],
          itemCount: 0,
          subtotal: 0,
          shipping: 0,
          discount: 0,
          total: 0,
        },
      }) as never,
  );
export const addToCart = (productId: string, quantity: number) =>
  withMock(
    () =>
      apiRequest("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      }),
    () => ({ success: true }) as never,
  );
export const updateCartItem = (itemId: string, quantity: number) =>
  withMock(
    () =>
      apiRequest(`/cart/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      }),
    () => ({ success: true }) as never,
  );
export const removeCartItem = (itemId: string) =>
  withMock(
    () => apiRequest(`/cart/items/${itemId}`, { method: "DELETE" }),
    () => ({ success: true }) as never,
  );
export const clearServerCart = () =>
  withMock(
    () => apiRequest("/cart", { method: "DELETE" }),
    () => ({ success: true }) as never,
  );
export const applyCouponApi = (code: string) =>
  withMock(
    () =>
      apiRequest("/cart/coupon", {
        method: "POST",
        body: JSON.stringify({ code }),
      }),
    () => ({ data: { discount: 500, code } }) as never,
  );
export const removeCouponApi = () =>
  withMock(
    () => apiRequest("/cart/coupon", { method: "DELETE" }),
    () => ({ success: true }) as never,
  );
export const mergeCart = () =>
  withMock(
    () => apiRequest("/cart/merge", { method: "POST" }),
    () => ({ success: true }) as never,
  );

// ─── Customer auth endpoints ─────────────────────────────
export const registerCustomer = (data: Record<string, unknown>) =>
  withMock(
    () =>
      apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    () =>
      ({
        success: true,
        message: "Mock: registration successful. Check email for OTP.",
      }) as never,
  );
export const verifyEmail = (data: { email: string; otp: string }) =>
  withMock(
    () =>
      apiRequest("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    () =>
      ({
        success: true,
        data: {
          tokens: { accessToken: "mock-token", refreshToken: "mock-refresh" },
          customer: MOCK_CUSTOMER,
        },
      }) as never,
  );
export const resendOtp = (email: string) =>
  withMock(
    () =>
      apiRequest("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    () => ({ success: true }) as never,
  );
export const loginCustomer = (email: string, password: string) =>
  withMock(
    () =>
      apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    () =>
      ({
        data: {
          tokens: { accessToken: "mock-token", refreshToken: "mock-refresh" },
          customer: MOCK_CUSTOMER,
        },
      }) as never,
  );
export const logoutCustomer = () =>
  withMock(
    () => apiRequest("/auth/logout", { method: "POST" }),
    () => ({ success: true }) as never,
  );
export const refreshTokenApi = (refreshToken: string) =>
  withMock(
    () =>
      apiRequest("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }),
    () =>
      ({
        data: {
          accessToken: "mock-token-new",
          refreshToken: "mock-refresh-new",
        },
      }) as never,
  );
export const forgotPassword = (email: string) =>
  withMock(
    () =>
      apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    () => ({ success: true, message: "Mock: OTP sent to email" }) as never,
  );
export const resetPassword = (data: {
  email: string;
  otp: string;
  newPassword: string;
}) =>
  withMock(
    () =>
      apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    () => ({ success: true }) as never,
  );

// ─── Customer account endpoints ──────────────────────────
export const fetchProfile = () =>
  withMock(
    () => apiRequest("/account/profile"),
    () => ({ data: MOCK_CUSTOMER }) as never,
  );
export const updateProfile = (data: Record<string, unknown>) =>
  withMock(
    () =>
      apiRequest("/account/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    () => ({ data: { ...MOCK_CUSTOMER, ...data } }) as never,
  );
export const updateCustomerProfile = updateProfile;
export const changePassword = (data: Record<string, unknown>) =>
  withMock(
    () =>
      apiRequest("/account/change-password", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    () => ({ success: true }) as never,
  );
export const fetchAddresses = () =>
  withMock(
    () => apiRequest("/account/addresses"),
    () => ({ data: MOCK_ADDRESSES }) as never,
  );
export const fetchCustomerAddresses = fetchAddresses;
export const addAddress = (data: Record<string, unknown>) =>
  withMock(
    () =>
      apiRequest("/account/addresses", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    () =>
      ({
        data: { _id: `addr-${Date.now()}`, ...data, isDefault: false },
      }) as never,
  );
export const addCustomerAddress = addAddress;
export const updateAddress = (id: string, data: Record<string, unknown>) =>
  withMock(
    () =>
      apiRequest(`/account/addresses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    () => ({ data: { _id: id, ...data } }) as never,
  );
export const updateCustomerAddress = updateAddress;
export const deleteAddress = (id: string) =>
  withMock(
    () => apiRequest(`/account/addresses/${id}`, { method: "DELETE" }),
    () => ({ success: true }) as never,
  );
export const deleteCustomerAddress = deleteAddress;
export const setDefaultAddress = (id: string) =>
  withMock(
    () => apiRequest(`/account/addresses/${id}/default`, { method: "PATCH" }),
    () => ({ success: true }) as never,
  );
export const fetchOrders = (params?: string) =>
  withMock(
    () => apiRequest(`/account/orders${params || ""}`),
    () =>
      ({
        data: MOCK_ORDERS,
        pagination: {
          page: 1,
          limit: 10,
          total: MOCK_ORDERS.length,
          totalPages: 1,
        },
      }) as never,
  );
export const fetchCustomerOrders = fetchOrders;
export const fetchOrderDetail = (id: string) =>
  withMock(
    () => apiRequest(`/account/orders/${id}`),
    () => {
      const order = MOCK_ORDERS.find(
        (o) => o._id === id || o.orderNumber === id,
      );
      if (!order) throw new Error("Order not found");
      return { data: order } as never;
    },
  );
export const cancelOrder = (id: string) =>
  withMock(
    () => apiRequest(`/account/orders/${id}/cancel`, { method: "POST" }),
    () => ({ success: true }) as never,
  );

// ─── Checkout & payment endpoints ────────────────────────
export const createOrder = (data: Record<string, unknown>) =>
  withMock(
    () => apiRequest("/orders", { method: "POST", body: JSON.stringify(data) }),
    () =>
      ({
        data: {
          ...MOCK_ORDERS[0],
          _id: `order-${Date.now()}`,
          orderNumber: `ORD-${Date.now()}`,
        },
      }) as never,
  );
export const initiatePayment = (orderId: string) =>
  withMock(
    () => apiRequest(`/orders/${orderId}/pay`, { method: "POST" }),
    () =>
      ({
        data: { paymentUrl: "#mock-payment", iframeId: "mock-iframe" },
      }) as never,
  );
export const fetchOrderConfirmation = (orderId: string) =>
  withMock(
    () => apiRequest(`/orders/${orderId}/confirmation`),
    () => {
      const order = MOCK_ORDERS.find(
        (o) => o._id === orderId || o.orderNumber === orderId,
      );
      return { data: order || MOCK_ORDERS[0] } as never;
    },
  );
export const validateCoupon = (code: string) =>
  withMock(
    () =>
      apiRequest("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({ code }),
      }),
    () =>
      ({
        data: { valid: true, code, discountType: "fixed", discountValue: 500 },
      }) as never,
  );
export const trackOrder = (orderNumber: string) =>
  withMock(
    () => apiRequest(`/orders/track/${orderNumber}`),
    () => {
      const order = MOCK_ORDERS.find((o) => o.orderNumber === orderNumber);
      if (!order) throw new Error("Order not found");
      return { data: order } as never;
    },
  );
