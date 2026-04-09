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

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

  const res = await fetch(`${API_BASE_URL}/cms${endpoint}`, {
    ...options,
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

// ─── Auth ────────────────────────────────────────────
export const cmsLogin = (username: string, password: string) =>
  cmsApiRequest<{
    token: string;
    admin: { id: string; username: string; role: string };
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

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
export const fetchOrders = (params: string) =>
  cmsApiRequest<PaginatedResponse<Order>>(`/orders?${params}`);

export const fetchOrder = (id: string) =>
  cmsApiRequest<ApiResponse<Order>>(`/orders/${id}`);

export const updateOrderStatus = (id: string, status: string, note?: string) =>
  cmsApiRequest(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, note }),
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

// ─── Customers ───────────────────────────────────────
export const fetchCustomers = (params: string) =>
  cmsApiRequest<PaginatedResponse<Customer>>(`/customers?${params}`);

export const fetchCustomer = (id: string) =>
  cmsApiRequest<ApiResponse<Customer>>(`/customers/${id}`);

export const toggleCustomerStatus = (id: string, isActive: boolean) =>
  cmsApiRequest(`/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });

// ─── Products ────────────────────────────────────────
export const fetchProducts = (params: string) =>
  cmsApiRequest<PaginatedResponse<Product>>(`/products?${params}`);

export const fetchProduct = (id: string) =>
  cmsApiRequest<ApiResponse<Product>>(`/products/${id}`);

export const createProduct = (data: FormData) =>
  cmsApiRequest("/products", { method: "POST", body: data });

export const updateProduct = (id: string, data: FormData) =>
  cmsApiRequest(`/products/${id}`, { method: "PUT", body: data });

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

export const createBrand = (data: FormData) =>
  cmsApiRequest("/brands", { method: "POST", body: data });

export const updateBrand = (id: string, data: FormData) =>
  cmsApiRequest(`/brands/${id}`, { method: "PUT", body: data });

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
export const fetchServices = (params?: string) =>
  cmsApiRequest<PaginatedResponse<Service>>(
    `/services${params ? `?${params}` : ""}`,
  );

export const fetchService = (id: string) =>
  cmsApiRequest<ApiResponse<Service>>(`/services/${id}`);

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
export const fetchInquiries = (params: string) =>
  cmsApiRequest<PaginatedResponse<Inquiry>>(`/inquiries?${params}`);

export const fetchInquiry = (id: string) =>
  cmsApiRequest<ApiResponse<Inquiry>>(`/inquiries/${id}`);

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

export const fetchServiceRequests = (params: string) =>
  cmsApiRequest<PaginatedResponse<ServiceRequest>>(
    `/service-requests?${params}`,
  );

export const fetchServiceRequest = (id: string) =>
  cmsApiRequest<ApiResponse<ServiceRequest>>(`/service-requests/${id}`);

export const updateServiceRequestStatus = (id: string, status: string) =>
  cmsApiRequest(`/service-requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// ─── Coupons ─────────────────────────────────────────
export const fetchCoupons = (params?: string) =>
  cmsApiRequest<PaginatedResponse<Coupon>>(
    `/coupons${params ? `?${params}` : ""}`,
  );

export const fetchCoupon = (id: string) =>
  cmsApiRequest<ApiResponse<Coupon>>(`/coupons/${id}`);

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

export const updateContentPage = (
  slug: string,
  data: Record<string, unknown>,
) =>
  cmsApiRequest(`/content/${slug}`, {
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
