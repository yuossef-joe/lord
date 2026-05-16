import type {
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
  RevenueDataPoint,
  Order,
  Customer,
  Product,
  Brand,
  ProductCategory,
  Service,
  ServiceType,
  Inquiry,
  ServiceRequest,
  Coupon,
  CouponUsage,
  ContentPage,
  Testimonial,
  FAQ,
} from "@/types";

const PRODUCTION_API_BASE_URL = "https://lord-backend.vercel.app/api";

function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (!configuredUrl) {
    return PRODUCTION_API_BASE_URL;
  }

  if (
    !["localhost", "127.0.0.1"].includes(window.location.hostname) &&
    /localhost|127\.0\.0\.1/.test(configuredUrl)
  ) {
    return PRODUCTION_API_BASE_URL;
  }

  return configuredUrl;
}

async function cmsApiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem("cmsToken");

  const headers: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Only set Content-Type if body is not FormData
  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${getApiBaseUrl()}/cms${endpoint}`, {
    ...options,
    cache: "no-store",
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("cmsToken");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "API error" }));
    throw new Error(error.message || "API error");
  }

  return res.json();
}

function normalizeService(service: Service & Record<string, unknown>): Service {
  const content =
    service.content && typeof service.content === "object"
      ? (service.content as Record<string, unknown>)
      : {};
  const type =
    (service.type as Service["type"] | undefined) ??
    (service.serviceType as Service["type"] | undefined);

  return {
    ...service,
    type: type ?? { id: "", name: "", slug: "" },
    scopeOfWork: Array.isArray(content.bullets)
      ? (content.bullets as string[])
      : [],
    applicableUnitTypes: Array.isArray(content.applicableUnitTypes)
      ? (content.applicableUnitTypes as string[])
      : [],
    estimatedDuration:
      content.estimatedTime == null ? undefined : String(content.estimatedTime),
    pricingType:
      content.pricingType == null ? undefined : String(content.pricingType),
    price: content.price == null ? undefined : Number(content.price),
    imageUrl: content.imageUrl == null ? undefined : String(content.imageUrl),
  };
}

function normalizeCustomer(
  customer: Customer & Record<string, unknown>,
): Customer {
  const orders = Array.isArray(customer.orders)
    ? (customer.orders as Array<Record<string, unknown>>)
    : [];
  const totalSpent =
    customer.totalSpent ??
    orders.reduce((sum, order) => {
      const total = Number(order.grandTotal ?? order.total ?? 0);
      return sum + (Number.isFinite(total) ? total : 0);
    }, 0);

  return {
    ...customer,
    emailVerified: Boolean(
      customer.emailVerified ?? customer.isEmailVerified ?? false,
    ),
    ordersCount: Number(customer.ordersCount ?? orders.length ?? 0),
    totalSpent: Number(totalSpent ?? 0),
    addresses: Array.isArray(customer.addresses) ? customer.addresses : [],
  };
}

function normalizeProduct(product: Product & Record<string, unknown>): Product {
  const brand = product.brand as Product["brand"] | undefined;
  const category = product.category as Product["category"] | undefined;
  const images = Array.isArray(product.images)
    ? product.images
    : Array.isArray(product.productImages)
      ? (product.productImages as Product["images"])
      : [];

  return {
    ...product,
    brand: brand ?? {
      id: String(product.brandId ?? ""),
      name: "",
      slug: "",
      isActive: true,
      createdAt: "",
      updatedAt: "",
    },
    category: category ?? {
      id: String(product.categoryId ?? ""),
      name: "",
      slug: "",
      sortOrder: 0,
      isActive: true,
      createdAt: "",
      updatedAt: "",
    },
    images,
    price: Number(product.price ?? 0),
    originalPrice:
      product.originalPrice == null ? undefined : Number(product.originalPrice),
    stockQuantity: Number(product.stockQuantity ?? 0),
    specifications:
      (product.specifications as Product["specifications"] | undefined) ??
      (product.specs as Product["specifications"] | undefined) ??
      [],
  };
}

function normalizeCoupon(coupon: Coupon & Record<string, unknown>): Coupon {
  return {
    ...coupon,
    type: (coupon.type ??
      coupon.discountType ??
      "percentage") as Coupon["type"],
    value: Number(coupon.value ?? coupon.discountValue ?? 0),
    minOrderAmount:
      coupon.minOrderAmount == null && coupon.minimumOrderAmount == null
        ? undefined
        : Number(coupon.minOrderAmount ?? coupon.minimumOrderAmount),
    usedCount: Number(coupon.usedCount ?? coupon.usageCount ?? 0),
    startDate: String(
      coupon.startDate ?? coupon.startsAt ?? coupon.createdAt ?? "",
    ),
    endDate: String(coupon.endDate ?? coupon.endsAt ?? ""),
  };
}

function normalizeStatus(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/-/g, "_");
}

function normalizeOrder(order: Order & Record<string, unknown>): Order {
  const snapshot =
    order.customerSnapshot && typeof order.customerSnapshot === "object"
      ? (order.customerSnapshot as Record<string, unknown>)
      : {};
  const customer = order.customer as Order["customer"] | undefined;
  const payments = Array.isArray(order.payments)
    ? (order.payments as Array<Record<string, unknown>>)
    : [];
  const payment = order.payment as Order["payment"] | undefined;
  const firstPayment = payments[0];
  const guestName = String(
    customer?.name ?? order.guestName ?? snapshot.name ?? "Guest Customer",
  );
  const guestEmail = String(
    customer?.email ?? order.guestEmail ?? snapshot.email ?? "",
  );
  const guestPhone = String(
    customer?.phone ?? order.guestPhone ?? snapshot.phone ?? "",
  );

  return {
    ...order,
    customer: customer ?? {
      id: String(order.customerId ?? ""),
      name: guestName,
      email: guestEmail,
      phone: guestPhone,
      nationalId: String(order.guestNationalId ?? snapshot.nationalId ?? ""),
    },
    items: Array.isArray(order.items) ? order.items : [],
    subtotal: Number(order.subtotal ?? 0),
    shippingFee: Number(order.shippingFee ?? 0),
    discount: Number(order.discount ?? order.discountAmount ?? 0),
    grandTotal: Number(order.grandTotal ?? order.total ?? 0),
    currency: String(order.currency ?? "EGP"),
    payment: payment ?? {
      method: normalizeStatus(
        firstPayment?.paymentMethod ?? "cash_on_delivery",
      ) as Order["payment"]["method"],
      status: normalizeStatus(
        firstPayment?.status ?? order.paymentStatus ?? "pending",
      ) as Order["payment"]["status"],
      amount: Number(firstPayment?.amount ?? order.total ?? 0),
    },
    status: normalizeStatus(
      order.status ?? order.orderStatus ?? "pending_payment",
    ) as Order["status"],
    statusHistory: Array.isArray(order.statusHistory)
      ? order.statusHistory.map((entry) => {
          const historyEntry = entry as unknown as Record<string, unknown>;
          return {
            status: normalizeStatus(
              historyEntry.status ?? historyEntry.newStatus ?? "",
            ) as Order["status"],
            timestamp: String(
              historyEntry.timestamp ?? historyEntry.createdAt ?? "",
            ),
            note:
              historyEntry.note == null ? undefined : String(historyEntry.note),
            updatedBy:
              historyEntry.updatedBy == null && historyEntry.changedBy == null
                ? undefined
                : String(historyEntry.updatedBy ?? historyEntry.changedBy),
          };
        })
      : [],
    refunds: Array.isArray(order.refunds) ? order.refunds : [],
    notes: Array.isArray(order.notes) ? order.notes : [],
  };
}

function normalizeInquiryNote(note: Record<string, unknown>) {
  return {
    id: String(note.id ?? ""),
    note: String(note.note ?? note.content ?? ""),
    createdBy: String(note.createdBy ?? "Staff"),
    createdAt: String(note.createdAt ?? ""),
  };
}

function normalizeInquiry(inquiry: Inquiry & Record<string, unknown>): Inquiry {
  return {
    ...inquiry,
    name: String(inquiry.name ?? ""),
    email: String(inquiry.email ?? ""),
    phone: String(inquiry.phone ?? ""),
    inquiryType: normalizeStatus(
      inquiry.inquiryType ?? "general",
    ) as Inquiry["inquiryType"],
    message: String(inquiry.message ?? ""),
    source: String(inquiry.source ?? "website"),
    status: normalizeStatus(inquiry.status ?? "new") as Inquiry["status"],
    notes: Array.isArray(inquiry.notes)
      ? inquiry.notes.map((note) =>
          normalizeInquiryNote(note as unknown as Record<string, unknown>),
        )
      : [],
  };
}

function normalizeServiceRequest(
  request: ServiceRequest & Record<string, unknown>,
): ServiceRequest {
  return {
    ...request,
    name: String(request.name ?? ""),
    phone: String(request.phone ?? ""),
    email: request.email == null ? undefined : String(request.email),
    serviceTypeId: String(request.serviceTypeId ?? ""),
    serviceTypeName: String(
      request.serviceTypeName ?? request.serviceType ?? "Service request",
    ),
    urgency: (normalizeStatus(request.urgency ?? "normal") ||
      "normal") as ServiceRequest["urgency"],
    installationAddress:
      request.installationAddress == null
        ? undefined
        : String(request.installationAddress),
    message: request.message == null ? undefined : String(request.message),
    status: normalizeStatus(
      request.status ?? "new",
    ) as ServiceRequest["status"],
    notes: Array.isArray(request.notes)
      ? request.notes.map((note) =>
          normalizeInquiryNote(note as unknown as Record<string, unknown>),
        )
      : [],
  };
}

// ─── Auth ────────────────────────────────────────────
export const cmsLogin = async (email: string, password: string) => {
  const response = await cmsApiRequest<
    ApiResponse<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; name: string; email: string; role: string };
    }>
  >("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return {
    token: response.data.accessToken,
    refreshToken: response.data.refreshToken,
    admin: {
      ...response.data.user,
      username: response.data.user.email,
    },
  };
};

export const cmsLogout = () =>
  cmsApiRequest("/auth/logout", { method: "POST" });

// ─── Dashboard ───────────────────────────────────────
export const fetchDashboardStats = () =>
  cmsApiRequest<ApiResponse<DashboardStats>>("/dashboard/stats");

export const fetchRevenueChart = (period: string) =>
  cmsApiRequest<ApiResponse<RevenueDataPoint[]>>(
    `/dashboard/revenue?period=${period}`,
  );

export const fetchRecentOrders = (limit: number) =>
  cmsApiRequest<ApiResponse<Order[]>>(
    `/dashboard/recent-orders?limit=${limit}`,
  );

export const fetchLatestInquiries = (limit: number) =>
  cmsApiRequest<ApiResponse<Inquiry[]>>(
    `/dashboard/latest-inquiries?limit=${limit}`,
  );

// ─── Orders ──────────────────────────────────────────
export const fetchOrders = async (params: string) => {
  const response = await cmsApiRequest<PaginatedResponse<Order>>(
    `/orders?${params}`,
  );
  return {
    ...response,
    data: response.data.map((order) =>
      normalizeOrder(order as Order & Record<string, unknown>),
    ),
  };
};

export const fetchOrder = async (id: string) => {
  const response = await cmsApiRequest<ApiResponse<Order>>(`/orders/${id}`);
  return {
    ...response,
    data: normalizeOrder(response.data as Order & Record<string, unknown>),
  };
};

export const createOrder = (data: Record<string, unknown>) =>
  cmsApiRequest<ApiResponse<Order>>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateOrder = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest<ApiResponse<Order>>(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const updateOrderStatus = (id: string, status: string, note?: string) =>
  cmsApiRequest(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, note }),
  });

export const updateOrderPaymentStatus = (id: string, status: string) =>
  cmsApiRequest(`/orders/${id}/payment-status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const addTrackingInfo = (
  id: string,
  trackingNumber: string,
  carrier: string,
) =>
  cmsApiRequest(`/orders/${id}/tracking`, {
    method: "PATCH",
    body: JSON.stringify({ trackingNumber, carrier }),
  });

export const processRefund = (id: string, amount: number, reason: string) =>
  cmsApiRequest(`/orders/${id}/refund`, {
    method: "POST",
    body: JSON.stringify({ amount, reason }),
  });

export const archiveOrder = (id: string) =>
  cmsApiRequest(`/orders/${id}`, { method: "DELETE" });

// ─── Customers ───────────────────────────────────────
export const fetchCustomers = async (params: string) => {
  const response = await cmsApiRequest<PaginatedResponse<Customer>>(
    `/customers?${params}`,
  );
  return {
    ...response,
    data: response.data.map((customer) =>
      normalizeCustomer(customer as Customer & Record<string, unknown>),
    ),
  };
};

export const fetchCustomer = async (id: string) => {
  const response = await cmsApiRequest<ApiResponse<Customer>>(
    `/customers/${id}`,
  );
  return {
    ...response,
    data: normalizeCustomer(
      response.data as Customer & Record<string, unknown>,
    ),
  };
};

export const createCustomer = (data: Record<string, unknown>) =>
  cmsApiRequest<ApiResponse<Customer>>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCustomer = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest<ApiResponse<Customer>>(`/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const toggleCustomerStatus = (id: string, isActive: boolean) =>
  cmsApiRequest(`/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });

export const deactivateCustomer = (id: string) =>
  cmsApiRequest(`/customers/${id}`, { method: "DELETE" });

// ─── Shipping ─────────────────────────────────────────
export const fetchShippingZones = () =>
  cmsApiRequest<ApiResponse<unknown[]>>("/shipping/zones");

export const createShippingZone = (data: Record<string, unknown>) =>
  cmsApiRequest("/shipping/zones", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateShippingZone = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest(`/shipping/zones/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteShippingZone = (id: string) =>
  cmsApiRequest(`/shipping/zones/${id}`, { method: "DELETE" });

export const fetchShippingMethods = () =>
  cmsApiRequest<ApiResponse<unknown[]>>("/shipping/methods");

export const createShippingMethod = (data: Record<string, unknown>) =>
  cmsApiRequest("/shipping/methods", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateShippingMethod = (
  id: string,
  data: Record<string, unknown>,
) =>
  cmsApiRequest(`/shipping/methods/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteShippingMethod = (id: string) =>
  cmsApiRequest(`/shipping/methods/${id}`, { method: "DELETE" });

// ─── Products ────────────────────────────────────────
export const fetchProducts = async (params: string) => {
  const response = await cmsApiRequest<PaginatedResponse<Product>>(
    `/products?${params}`,
  );
  return {
    ...response,
    data: response.data.map((product) =>
      normalizeProduct(product as Product & Record<string, unknown>),
    ),
  };
};

export const fetchProduct = async (id: string) => {
  const response = await cmsApiRequest<ApiResponse<Product>>(`/products/${id}`);
  return {
    ...response,
    data: normalizeProduct(response.data as Product & Record<string, unknown>),
  };
};

export const createProduct = (data: Record<string, unknown>) =>
  cmsApiRequest("/products", { method: "POST", body: JSON.stringify(data) });

export const updateProduct = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteProduct = (id: string) =>
  cmsApiRequest(`/products/${id}`, { method: "DELETE" });

export const toggleProductFeatured = (id: string, featured: boolean) =>
  cmsApiRequest(`/products/${id}/featured`, {
    method: "PATCH",
    body: JSON.stringify({ featured }),
  });

export const updateProductStock = (id: string, stockQuantity: number) =>
  cmsApiRequest(`/products/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ stockQuantity }),
  });

// ─── Brands ──────────────────────────────────────────
export const fetchBrands = () => cmsApiRequest<ApiResponse<Brand[]>>("/brands");

export const createBrand = (data: Record<string, unknown>) =>
  cmsApiRequest("/brands", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateBrand = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest(`/brands/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteBrand = (id: string) =>
  cmsApiRequest(`/brands/${id}`, { method: "DELETE" });

// ─── Categories ──────────────────────────────────────
export const fetchProductCategories = () =>
  cmsApiRequest<ApiResponse<ProductCategory[]>>("/product-categories");

export const createProductCategory = (data: Record<string, unknown>) =>
  cmsApiRequest("/product-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateProductCategory = (
  id: string,
  data: Record<string, unknown>,
) =>
  cmsApiRequest(`/product-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteProductCategory = (id: string) =>
  cmsApiRequest(`/product-categories/${id}`, { method: "DELETE" });

// ─── Services ────────────────────────────────────────
export const fetchServices = async (params?: string) => {
  const response = await cmsApiRequest<
    PaginatedResponse<Service & Record<string, unknown>>
  >(`/services${params ? `?${params}` : ""}`);
  return {
    ...response,
    data: response.data.map(normalizeService),
  };
};

export const fetchService = async (id: string) => {
  const response = await cmsApiRequest<
    ApiResponse<Service & Record<string, unknown>>
  >(`/services/${id}`);
  return {
    ...response,
    data: normalizeService(response.data),
  };
};

export const createService = (data: Record<string, unknown>) =>
  cmsApiRequest("/services", { method: "POST", body: JSON.stringify(data) });

export const updateService = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteService = (id: string) =>
  cmsApiRequest(`/services/${id}`, { method: "DELETE" });

export const fetchServiceTypes = () =>
  cmsApiRequest<ApiResponse<ServiceType[]>>("/service-types");

// ─── Inquiries ───────────────────────────────────────
export const fetchInquiries = async (params: string) => {
  const response = await cmsApiRequest<PaginatedResponse<Inquiry>>(
    `/inquiries?${params}`,
  );
  return {
    ...response,
    data: Array.isArray(response.data)
      ? response.data.map((inquiry) =>
          normalizeInquiry(inquiry as Inquiry & Record<string, unknown>),
        )
      : [],
  };
};

export const fetchInquiry = async (id: string) => {
  const response = await cmsApiRequest<ApiResponse<Inquiry>>(
    `/inquiries/${id}`,
  );
  return {
    ...response,
    data: normalizeInquiry(response.data as Inquiry & Record<string, unknown>),
  };
};

export const updateInquiryStatus = (id: string, status: string) =>
  cmsApiRequest(`/inquiries/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const addInquiryNote = (id: string, note: string) =>
  cmsApiRequest(`/inquiries/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });

export const fetchServiceRequests = async (params: string) => {
  const response = await cmsApiRequest<PaginatedResponse<ServiceRequest>>(
    `/service-requests?${params}`,
  );
  return {
    ...response,
    data: Array.isArray(response.data)
      ? response.data.map((request) =>
          normalizeServiceRequest(
            request as ServiceRequest & Record<string, unknown>,
          ),
        )
      : [],
  };
};

export const fetchServiceRequest = async (id: string) => {
  const response = await cmsApiRequest<ApiResponse<ServiceRequest>>(
    `/service-requests/${id}`,
  );
  return {
    ...response,
    data: normalizeServiceRequest(
      response.data as ServiceRequest & Record<string, unknown>,
    ),
  };
};

export const updateServiceRequestStatus = (id: string, status: string) =>
  cmsApiRequest(`/service-requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// ─── Coupons ─────────────────────────────────────────
export const fetchCoupons = async (params?: string) => {
  const response = await cmsApiRequest<PaginatedResponse<Coupon>>(
    `/coupons${params ? `?${params}` : ""}`,
  );
  return {
    ...response,
    data: response.data.map((coupon) =>
      normalizeCoupon(coupon as Coupon & Record<string, unknown>),
    ),
  };
};

export const fetchCoupon = async (id: string) => {
  const response = await cmsApiRequest<ApiResponse<Coupon>>(`/coupons/${id}`);
  return {
    ...response,
    data: normalizeCoupon(response.data as Coupon & Record<string, unknown>),
  };
};

export const createCoupon = (data: Record<string, unknown>) =>
  cmsApiRequest("/coupons", { method: "POST", body: JSON.stringify(data) });

export const updateCoupon = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest(`/coupons/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCoupon = (id: string) =>
  cmsApiRequest(`/coupons/${id}`, { method: "DELETE" });

export const fetchCouponUsage = (id: string) =>
  cmsApiRequest<ApiResponse<CouponUsage[]>>(`/coupons/${id}/usage`);

// ─── Content ─────────────────────────────────────────
export const fetchContentPage = (slug: string) =>
  cmsApiRequest<ApiResponse<ContentPage>>(`/content/${slug}`);

export const fetchContentPages = () =>
  cmsApiRequest<ApiResponse<ContentPage[]>>("/content");

export const createContentPage = (data: Record<string, unknown>) =>
  cmsApiRequest<ApiResponse<ContentPage>>("/content", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateContentPage = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest(`/content/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// ─── Testimonials ────────────────────────────────────
export const fetchTestimonials = (params?: string) =>
  cmsApiRequest<PaginatedResponse<Testimonial>>(
    `/testimonials${params ? `?${params}` : ""}`,
  );

export const createTestimonial = (data: Record<string, unknown>) =>
  cmsApiRequest("/testimonials", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTestimonial = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest(`/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteTestimonial = (id: string) =>
  cmsApiRequest(`/testimonials/${id}`, { method: "DELETE" });

export const approveTestimonial = (id: string) =>
  cmsApiRequest(`/testimonials/${id}/approve`, { method: "PATCH" });

export const rejectTestimonial = (id: string) =>
  cmsApiRequest(`/testimonials/${id}/reject`, { method: "PATCH" });

export const toggleTestimonialFeatured = (id: string, featured: boolean) =>
  cmsApiRequest(`/testimonials/${id}/featured`, {
    method: "PATCH",
    body: JSON.stringify({ featured }),
  });

// ─── FAQs ────────────────────────────────────────────
export const fetchFaqs = (params?: string) =>
  cmsApiRequest<PaginatedResponse<FAQ>>(`/faqs${params ? `?${params}` : ""}`);

export const fetchFaq = (id: string) =>
  cmsApiRequest<ApiResponse<FAQ>>(`/faqs/${id}`);

export const createFaq = (data: Record<string, unknown>) =>
  cmsApiRequest("/faqs", { method: "POST", body: JSON.stringify(data) });

export const updateFaq = (id: string, data: Record<string, unknown>) =>
  cmsApiRequest(`/faqs/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteFaq = (id: string) =>
  cmsApiRequest(`/faqs/${id}`, { method: "DELETE" });

export const reorderFaqs = (orderedIds: string[]) =>
  cmsApiRequest("/faqs/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });

// ─── Settings ────────────────────────────────────────
export const fetchSettings = <T>(group: string) =>
  cmsApiRequest<ApiResponse<T>>(`/settings/${group}`);

export const updateSettings = (group: string, data: Record<string, unknown>) =>
  cmsApiRequest(`/settings/${group}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const testEmailSettings = () =>
  cmsApiRequest("/settings/email/test", { method: "POST" });

export const testPaymobConnection = () =>
  cmsApiRequest("/settings/paymob/test", { method: "POST" });
