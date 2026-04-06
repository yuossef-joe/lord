# Frontend Development Tasks — CMS Panel (Admin Dashboard)

**Developer:** Frontend Developer
**Project Duration:** 5 weeks
**Technology Stack:** React 18+ + Vite + TypeScript + Tailwind CSS + React Router DOM v6 + Radix UI + Zod + React Hook Form + Lucide React + Motion (Framer Motion)
**Last Updated:** April 6, 2026

### Referenced Documents

- Business Requirements Document — `BRD.md`
- UI/UX Design Requirements — `UI-UX-Design-Requirements.md`
- Technical Specifications — `Technical-Specifications-Frontend-Backend.md`

**This project includes:**

1. CMS Authentication (Admin Login with JWT)
2. Dashboard with Revenue & Order Analytics
3. Order Management (List, Detail, Status Updates, Refunds)
4. Customer Management (List, Detail, Enable/Disable)
5. Product Management (CRUD with Images, Specs, SEO)
6. Brand & Category Management
7. Service Management
8. Inquiry & Service Request Management
9. Coupon & Promotions Management
10. Content Page Management (Home, About)
11. Testimonials Management (Approve/Reject)
12. FAQ Management
13. Settings (General, Contact, Email, SEO, Brands, Paymob, Shipping)

**Out of Scope** (per BRD — do NOT implement):

- Public website (separate project — `FRONTEND-MAIN-WEBSITE-TASKS.md`)
- Inventory / Warehouse Management (WMS)
- ERP / Accounting integration
- Native mobile apps
- Live chat / chatbot
- IoT / smart home integration
- Multi-currency (EGP only)
- Loyalty / rewards program
- Customer product reviews system
- SMS notifications
- Third-party shipping API integration

---

## **PHASE 1: PROJECT SETUP** (Day 1–2)

### Task 1.1: Initialize Vite + React Project

- [ ] Create new Vite app: `npm create vite@latest lord-cms -- --template react-ts`
- [ ] Navigate to project folder: `cd lord-cms`
- [ ] Install dependencies: `npm install`
- [ ] Start development server: `npm run dev`
- [ ] Verify app runs on `localhost:5173`

### Task 1.2: Install Essential Dependencies

```bash
# Routing
npm install react-router-dom

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-toast @radix-ui/react-checkbox @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-popover

# Form validation
npm install zod react-hook-form @hookform/resolvers

# Icons (per Tech Specs — Lucide React)
npm install lucide-react

# Toast notifications
npm install react-toastify

# Charts (dashboard analytics)
npm install recharts

# Date utilities
npm install date-fns

# Rich text editor (for content pages, product descriptions)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link

# Image upload / drag-and-drop
npm install react-dropzone

# Data table
npm install @tanstack/react-table

# Animation & Motion
npm install motion                           # Motion (formerly Framer Motion) — import from "motion/react"
npm install @formkit/auto-animate            # Zero-config list/layout animations (add/remove/reorder)
npm install react-countup                    # Animated number counting (dashboard stats)
npm install lottie-react                     # Lottie JSON animations (loading, success, empty states)
```

> **Important — Motion (Framer Motion) Usage:**
>
> - Framer Motion has been rebranded to **Motion**. Install `motion` (not `framer-motion`).
> - Import from `"motion/react"` — e.g. `import { motion, AnimatePresence } from "motion/react"`
> - Key APIs: `<motion.div>`, `AnimatePresence`, `layout` prop, `whileHover`, `whileTap`, `stagger`
> - Respect `prefers-reduced-motion`: wrap animations in `useReducedMotion()` hook checks

### Task 1.3: Configure Tailwind CSS

- [ ] Install Tailwind: `npm install -D tailwindcss @tailwindcss/forms postcss autoprefixer`
- [ ] Initialize: `npx tailwindcss init -p`
- [ ] Add brand colors to `tailwind.config.ts`:

```typescript
// tailwind.config.ts
const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lord-navy": "#172041",
        "lord-teal": "#0DBACA",
        "lord-silver": "#BEBEBE",
        "lord-frost": "#4DB8D4",
        "off-white": "#F8FAFB",
        "light-gray": "#F1F3F5",
        "medium-gray": "#6C757D",
        "dark-charcoal": "#1A1A2E",
        success: "#28A745",
        warning: "#FFC107",
        error: "#DC3545",
        info: "#17A2B8",
        "sidebar-bg": "#0F172A",
        "sidebar-hover": "#1E293B",
        "sidebar-active": "#0DBACA",
      },
      fontFamily: {
        inter: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
      },
      maxWidth: {
        container: "1440px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

- [ ] Import Google Fonts (Inter) in `index.html`
- [ ] Set up base styles in `src/index.css`

### Task 1.4: Project Structure Setup

```
src/
├── main.tsx                   # App entry point
├── App.tsx                    # Router + auth provider
├── index.css                  # Global styles + Tailwind directives
├── pages/
│   ├── LoginPage.tsx          # CMS login
│   ├── DashboardPage.tsx      # Main dashboard
│   ├── orders/
│   │   ├── OrdersPage.tsx     # Orders list
│   │   └── OrderDetailPage.tsx # Order detail + status updates
│   ├── customers/
│   │   ├── CustomersPage.tsx  # Customers list
│   │   └── CustomerDetailPage.tsx # Customer detail + orders
│   ├── products/
│   │   ├── ProductsPage.tsx   # Products list
│   │   ├── ProductCreatePage.tsx  # Create product
│   │   └── ProductEditPage.tsx    # Edit product
│   ├── brands/
│   │   └── BrandsPage.tsx     # Brands & categories management
│   ├── services/
│   │   ├── ServicesPage.tsx   # Services list
│   │   ├── ServiceCreatePage.tsx
│   │   └── ServiceEditPage.tsx
│   ├── inquiries/
│   │   └── InquiriesPage.tsx  # Inquiries & service requests (tabbed)
│   ├── coupons/
│   │   ├── CouponsPage.tsx    # Coupons list
│   │   ├── CouponCreatePage.tsx
│   │   └── CouponEditPage.tsx
│   ├── content/
│   │   └── ContentPage.tsx    # Home + About page content editor
│   ├── testimonials/
│   │   └── TestimonialsPage.tsx
│   ├── faqs/
│   │   ├── FaqsPage.tsx
│   │   ├── FaqCreatePage.tsx
│   │   └── FaqEditPage.tsx
│   └── settings/
│       └── SettingsPage.tsx   # Settings (7 tabs)
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx        # CMS sidebar navigation
│   │   ├── Header.tsx         # Top header bar
│   │   ├── MainLayout.tsx     # Sidebar + Header + content area
│   │   └── AuthLayout.tsx     # Login page layout (no sidebar)
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DataTable.tsx      # Reusable data table with sort/filter/pagination
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── StatusBadge.tsx    # Order status, payment status badges
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── SearchInput.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── StatsCard.tsx      # Dashboard stat widget
│   │   ├── Pagination.tsx
│   │   ├── ImageUpload.tsx    # Drag-and-drop image upload
│   │   ├── RichTextEditor.tsx # TipTap rich text editor wrapper
│   │   ├── DateRangePicker.tsx
│   │   └── FormField.tsx      # Reusable form field wrapper
│   ├── dashboard/
│   │   ├── RevenueChart.tsx
│   │   ├── RecentOrdersTable.tsx
│   │   ├── LatestInquiries.tsx
│   │   └── QuickActions.tsx
│   ├── orders/
│   │   ├── OrderStatusTimeline.tsx
│   │   ├── OrderItemsTable.tsx
│   │   ├── StatusUpdateModal.tsx
│   │   ├── RefundModal.tsx
│   │   └── OrderFilters.tsx
│   ├── customers/
│   │   ├── CustomerOrderHistory.tsx
│   │   └── CustomerStatusToggle.tsx
│   ├── products/
│   │   ├── ProductForm.tsx     # Tabbed form (General, Specs, Images, SEO)
│   │   ├── SpecificationsForm.tsx
│   │   ├── ImageManager.tsx    # Upload, reorder, set primary, delete
│   │   └── SeoForm.tsx
│   ├── coupons/
│   │   └── CouponForm.tsx
│   ├── content/
│   │   ├── HomeContentEditor.tsx
│   │   └── AboutContentEditor.tsx
│   ├── testimonials/
│   │   └── TestimonialReviewModal.tsx
│   └── settings/
│       ├── GeneralSettings.tsx
│       ├── ContactSettings.tsx
│       ├── EmailSettings.tsx
│       ├── SeoSettings.tsx
│       ├── BrandSettings.tsx
│       ├── PaymobSettings.tsx
│       └── ShippingSettings.tsx
├── lib/
│   ├── api.ts                 # API client (fetch wrapper)
│   ├── auth.ts                # CMS auth helpers
│   ├── utils.ts               # General utilities (formatCurrency, formatDate, etc.)
│   └── animations.ts          # Motion animation presets & variants
├── context/
│   └── AuthContext.tsx         # CMS admin authentication state
├── hooks/
│   ├── useAuth.ts             # Auth hook
│   ├── usePagination.ts       # Pagination hook
│   ├── useDebounce.ts         # Debounce hook for search
│   └── useReducedMotion.ts    # Reduced motion preference detection
├── types/
│   ├── product.ts             # Product, Brand, Category, ProductImage
│   ├── order.ts               # Order, OrderItem, OrderStatusHistory, Payment, Refund
│   ├── customer.ts            # Customer, CustomerAddress
│   ├── service.ts             # Service, ServiceType
│   ├── inquiry.ts             # Inquiry, ServiceRequest, InquiryNote
│   ├── coupon.ts              # Coupon, CouponUsage
│   ├── content.ts             # ContentPage, Testimonial, FAQ
│   ├── settings.ts            # SiteSettings, ContactSettings, etc.
│   └── common.ts              # ApiResponse, PaginatedResponse, DashboardStats
└── routes/
    └── index.tsx              # Route definitions with lazy loading
```

### Task 1.5: Setup Routing

**File:** `src/routes/index.tsx` + `src/App.tsx`

- [ ] Configure React Router DOM v6 routes:

```typescript
// Route structure
/login                          → LoginPage (public)
/                               → DashboardPage (protected)
/orders                         → OrdersPage (protected)
/orders/:id                     → OrderDetailPage (protected)
/customers                      → CustomersPage (protected)
/customers/:id                  → CustomerDetailPage (protected)
/products                       → ProductsPage (protected)
/products/create                → ProductCreatePage (protected)
/products/:id/edit              → ProductEditPage (protected)
/brands                         → BrandsPage (protected)
/services                       → ServicesPage (protected)
/services/create                → ServiceCreatePage (protected)
/services/:id/edit              → ServiceEditPage (protected)
/inquiries                      → InquiriesPage (protected)
/coupons                        → CouponsPage (protected)
/coupons/create                 → CouponCreatePage (protected)
/coupons/:id/edit               → CouponEditPage (protected)
/content                        → ContentPage (protected)
/testimonials                   → TestimonialsPage (protected)
/faqs                           → FaqsPage (protected)
/faqs/create                    → FaqCreatePage (protected)
/faqs/:id/edit                  → FaqEditPage (protected)
/settings                       → SettingsPage (protected)
```

- [ ] Lazy-load all page components with `React.lazy()` + `Suspense`
- [ ] Protected route wrapper: redirects to `/login` if not authenticated
- [ ] 404 catch-all route

### Task 1.6: Setup API Service

**File:** `src/lib/api.ts`

- [ ] Create fetch wrapper with base URL from environment variable
- [ ] Add CMS JWT token to all requests
- [ ] Handle 401 responses → auto-logout + redirect to `/login`
- [ ] Handle error responses consistently

```typescript
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function cmsApiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = localStorage.getItem("cmsToken");

  const res = await fetch(`${API_BASE_URL}/cms${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("cmsToken");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "API error");
  }

  return res.json();
}

// CMS Auth
export const cmsLogin = (username: string, password: string) =>
  cmsApiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
export const cmsLogout = () =>
  cmsApiRequest("/auth/logout", { method: "POST" });

// Dashboard
export const fetchDashboardStats = () => cmsApiRequest("/dashboard/stats");
export const fetchRevenueChart = (period: string) =>
  cmsApiRequest(`/dashboard/revenue?period=${period}`);
export const fetchRecentOrders = (limit: number) =>
  cmsApiRequest(`/dashboard/recent-orders?limit=${limit}`);
export const fetchLatestInquiries = (limit: number) =>
  cmsApiRequest(`/dashboard/latest-inquiries?limit=${limit}`);

// Orders
export const fetchOrders = (params: string) =>
  cmsApiRequest(`/orders?${params}`);
export const fetchOrder = (id: string) => cmsApiRequest(`/orders/${id}`);
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

// Customers
export const fetchCustomers = (params: string) =>
  cmsApiRequest(`/customers?${params}`);
export const fetchCustomer = (id: string) => cmsApiRequest(`/customers/${id}`);
export const toggleCustomerStatus = (id: string, isActive: boolean) =>
  cmsApiRequest(`/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });

// Products
export const fetchProducts = (params: string) =>
  cmsApiRequest(`/products?${params}`);
export const fetchProduct = (id: string) => cmsApiRequest(`/products/${id}`);
export const createProduct = (data: FormData) =>
  cmsApiRequest("/products", { method: "POST", body: data, headers: {} });
export const updateProduct = (id: string, data: FormData) =>
  cmsApiRequest(`/products/${id}`, { method: "PUT", body: data, headers: {} });
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

// Brands
export const fetchBrands = () => cmsApiRequest("/brands");
export const createBrand = (data: FormData) =>
  cmsApiRequest("/brands", { method: "POST", body: data, headers: {} });
export const updateBrand = (id: string, data: FormData) =>
  cmsApiRequest(`/brands/${id}`, { method: "PUT", body: data, headers: {} });
export const deleteBrand = (id: string) =>
  cmsApiRequest(`/brands/${id}`, { method: "DELETE" });

// Product Categories
export const fetchProductCategories = () =>
  cmsApiRequest("/product-categories");
export const createProductCategory = (data: any) =>
  cmsApiRequest("/product-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateProductCategory = (id: string, data: any) =>
  cmsApiRequest(`/product-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteProductCategory = (id: string) =>
  cmsApiRequest(`/product-categories/${id}`, { method: "DELETE" });

// Services
export const fetchServices = (params?: string) =>
  cmsApiRequest(`/services${params ? `?${params}` : ""}`);
export const fetchService = (id: string) => cmsApiRequest(`/services/${id}`);
export const createService = (data: any) =>
  cmsApiRequest("/services", { method: "POST", body: JSON.stringify(data) });
export const updateService = (id: string, data: any) =>
  cmsApiRequest(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteService = (id: string) =>
  cmsApiRequest(`/services/${id}`, { method: "DELETE" });
export const fetchServiceTypes = () => cmsApiRequest("/service-types");
export const createServiceType = (data: any) =>
  cmsApiRequest("/service-types", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Inquiries & Service Requests
export const fetchInquiries = (params: string) =>
  cmsApiRequest(`/inquiries?${params}`);
export const fetchInquiry = (id: string) => cmsApiRequest(`/inquiries/${id}`);
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
  cmsApiRequest(`/service-requests?${params}`);
export const fetchServiceRequest = (id: string) =>
  cmsApiRequest(`/service-requests/${id}`);
export const updateServiceRequestStatus = (id: string, status: string) =>
  cmsApiRequest(`/service-requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Coupons
export const fetchCoupons = (params?: string) =>
  cmsApiRequest(`/coupons${params ? `?${params}` : ""}`);
export const fetchCoupon = (id: string) => cmsApiRequest(`/coupons/${id}`);
export const createCoupon = (data: any) =>
  cmsApiRequest("/coupons", { method: "POST", body: JSON.stringify(data) });
export const updateCoupon = (id: string, data: any) =>
  cmsApiRequest(`/coupons/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteCoupon = (id: string) =>
  cmsApiRequest(`/coupons/${id}`, { method: "DELETE" });
export const fetchCouponUsage = (id: string) =>
  cmsApiRequest(`/coupons/${id}/usage`);

// Content Pages
export const fetchContentPage = (slug: string) =>
  cmsApiRequest(`/content/${slug}`);
export const updateContentPage = (slug: string, data: any) =>
  cmsApiRequest(`/content/${slug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// Testimonials
export const fetchTestimonials = (params?: string) =>
  cmsApiRequest(`/testimonials${params ? `?${params}` : ""}`);
export const createTestimonial = (data: any) =>
  cmsApiRequest("/testimonials", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateTestimonial = (id: string, data: any) =>
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
export const toggleFeatured = (id: string, featured: boolean) =>
  cmsApiRequest(`/testimonials/${id}/featured`, {
    method: "PATCH",
    body: JSON.stringify({ featured }),
  });

// FAQs
export const fetchFaqs = (params?: string) =>
  cmsApiRequest(`/faqs${params ? `?${params}` : ""}`);
export const fetchFaq = (id: string) => cmsApiRequest(`/faqs/${id}`);
export const createFaq = (data: any) =>
  cmsApiRequest("/faqs", { method: "POST", body: JSON.stringify(data) });
export const updateFaq = (id: string, data: any) =>
  cmsApiRequest(`/faqs/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteFaq = (id: string) =>
  cmsApiRequest(`/faqs/${id}`, { method: "DELETE" });
export const reorderFaqs = (orderedIds: string[]) =>
  cmsApiRequest("/faqs/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });

// Settings
export const fetchSettings = (group: string) =>
  cmsApiRequest(`/settings/${group}`);
export const updateSettings = (group: string, data: any) =>
  cmsApiRequest(`/settings/${group}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const testEmailSettings = () =>
  cmsApiRequest("/settings/email/test", { method: "POST" });
export const testPaymobConnection = () =>
  cmsApiRequest("/settings/paymob/test", { method: "POST" });
```

### Task 1.7: Setup CMS Authentication Context

**File:** `src/context/AuthContext.tsx`

- [ ] Create context for CMS admin authentication
- [ ] Store CMS JWT token in localStorage under key `cmsToken`
- [ ] Provide `login()`, `logout()`, `isAuthenticated`, `admin` state
- [ ] On mount: check for existing token, validate it
- [ ] Auto-redirect to `/login` when token expires

### Task 1.8: Setup TypeScript Types

**File:** `src/types/` directory

- [ ] Create all TypeScript interfaces matching API response shapes from Tech Specs §9
- [ ] Product, Brand, ProductCategory, ProductImage
- [ ] Order, OrderItem, OrderStatusHistory, Payment, Refund
- [ ] Customer, CustomerAddress (Customer includes `nationalId: string`)
- [ ] Service, ServiceType
- [ ] Inquiry, InquiryNote, ServiceRequest (ServiceRequest includes `installationAddress?: string`)
- [ ] Coupon, CouponUsage
- [ ] Testimonial, FAQ, ContentPage
- [ ] SiteSettings, ContactSettings, EmailSettings, SeoSettings, PaymobSettings, ShippingSettings
- [ ] DashboardStats, RevenueData
- [ ] Common: ApiResponse, PaginatedResponse, etc.

### Task 1.9: Setup Animation Utilities & Presets

**File:** `src/lib/animations.ts`

- [ ] Create reusable Motion animation variant presets for the CMS dashboard:

```typescript
// lib/animations.ts
import { type Variants } from "motion/react";

// Fade in from below (for page content reveals)
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Scale in (for modals, cards)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// Stagger children (for grids, stat cards, table rows)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// Slide in from left (for sidebar)
export const slideInLeft: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: { x: "-100%", transition: { duration: 0.2, ease: "easeIn" } },
};

// Slide down (for dropdowns, notification panels)
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -10, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// Backdrop overlay fade
export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

// Page transition (route change)
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
};

// Table row entrance
export const tableRowEnter: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

// Notification badge bounce
export const badgeBounce: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

// Sidebar collapse/expand
export const sidebarCollapse = {
  expanded: { width: 260 },
  collapsed: { width: 64 },
  transition: { type: "spring", damping: 20, stiffness: 200 },
};
```

**File:** `src/hooks/useReducedMotion.ts`

- [ ] Detect `prefers-reduced-motion` media query; disable non-essential animations when active
- [ ] Provide `shouldAnimate` boolean; all animated components should check this

---

## **PHASE 2: CMS LOGIN PAGE** (Day 3)

### Task 2.1: Login Page

**File:** `src/pages/LoginPage.tsx`

- [ ] Full-screen centered card on Navy `#172041` background
- [ ] Lord logo (full primary) above the form
- [ ] **Login form:**
  - Username input (44px height, 8px border-radius)
  - Password input + show/hide toggle (Eye / EyeOff from Lucide)
  - "Login" Primary button (full-width, Teal `#0DBACA`)
- [ ] Error state: Red alert "Invalid credentials"
- [ ] Loading state: button disabled + spinner; use `motion.span animate={{ rotate: 360 }}` for spinner
- [ ] On success: store token → redirect to `/` (dashboard)
- [ ] Form validation: Zod (username required, password required)
- [ ] No "Register" or "Forgot Password" — CMS accounts are managed server-side only

**Motion Animations (Login Page):**

- [ ] **Lord logo:** `motion.img initial={{ opacity: 0, y: -20 }}` → `animate={{ opacity: 1, y: 0 }}` (duration: 0.5s, ease: easeOut)
- [ ] **Login card:** `motion.div` with `scaleIn` variant (fade + scale from 0.95→1, duration: 0.3s, delay: 0.15s)
- [ ] **Form fields:** `staggerContainer` → each field as `staggerItem` (fade in + translate Y, 0.08s stagger)
- [ ] **Error shake:** On invalid credentials, card uses `motion.div animate={{ x: [0, -8, 8, -4, 4, 0] }}` (shake animation, 400ms)
- [ ] **Login button:** `motion.button whileTap={{ scale: 0.97 }}`; loading state spinner uses `motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}`
- [ ] **Background:** Optional — subtle animated gradient or floating particle motif on Navy background

**API Integration:**

- [ ] `POST /api/cms/auth/login` → `{ token, admin: { id, username, role } }`

---

## **PHASE 3: LAYOUT — SIDEBAR, HEADER, MAIN** (Day 4–5)

### Task 3.1: Sidebar Navigation

**File:** `src/components/layout/Sidebar.tsx`

- [ ] Width: 260px (desktop), collapsible to 64px (icon-only mode)
- [ ] Background: Dark Navy `#0F172A`
- [ ] **Lord logo** at top: full logo (expanded) / icon mark (collapsed)
- [ ] **12 navigation items** — each with Lucide icon + label:

| #   | Label                | Icon (Lucide)   | Route           |
| --- | -------------------- | --------------- | --------------- |
| 1   | Dashboard            | LayoutDashboard | `/`             |
| 2   | Orders               | ShoppingBag     | `/orders`       |
| 3   | Customers            | Users           | `/customers`    |
| 4   | Products             | Package         | `/products`     |
| 5   | Brands & Categories  | Layers          | `/brands`       |
| 6   | Services             | Wrench          | `/services`     |
| 7   | Inquiries & Requests | MessageSquare   | `/inquiries`    |
| 8   | Coupons & Promos     | Tag             | `/coupons`      |
| 9   | Content Pages        | FileText        | `/content`      |
| 10  | Testimonials         | Star            | `/testimonials` |
| 11  | FAQs                 | HelpCircle      | `/faqs`         |
| 12  | Settings             | Settings        | `/settings`     |

- [ ] Active item: Teal left border (3px) + Teal text + darker bg `#1E293B`
- [ ] Hover: bg `#1E293B`, text White
- [ ] Item text: 14px Inter Medium; icon size: 20px
- [ ] Collapse toggle: ChevronLeft/ChevronRight icon at bottom of sidebar
- [ ] Mobile: full-screen overlay with slide-in from left; X button to close
- [ ] **Order badge:** Red notification dot next to "Orders" if pending orders > 0
- [ ] **Inquiry badge:** Red dot next to "Inquiries & Requests" if new inquiries > 0

**Motion Animations (Sidebar):**

- [ ] **Collapse/expand:** `motion.aside animate={{ width: isCollapsed ? 64 : 260 }}` with spring transition (damping: 20, stiffness: 200); nav labels use `AnimatePresence` → `motion.span` fades out/in with width transition
- [ ] **Active indicator:** `motion.div layoutId="sidebarActiveIndicator"` — the Teal left border (3px) animates smoothly between active items using shared layout animation
- [ ] **Nav item hover:** `motion.a whileHover={{ backgroundColor: "#1E293B", x: 4 }}` — subtle right-shift + bg transition (150ms)
- [ ] **Logo transition:** `AnimatePresence mode="wait"` — full logo ↔ icon mark crossfade on collapse/expand
- [ ] **Mobile overlay:** `AnimatePresence` → backdrop `motion.div overlayFade` + sidebar panel `motion.nav slideInLeft` (spring physics)
- [ ] **Notification badges:** `motion.span` with `badgeBounce` animation on count change (`key={count}` for re-trigger)
- [ ] **Chevron toggle:** `motion.span animate={{ rotate: isCollapsed ? 180 : 0 }}` (200ms spring)

### Task 3.2: Header Bar

**File:** `src/components/layout/Header.tsx`

- [ ] Height: 64px
- [ ] Background: White, bottom border `1px solid #E8EAED`
- [ ] Left: page title (dynamic, based on current route); breadcrumb below
- [ ] Right: notification bell icon (with count badge), admin name, admin avatar/initials circle, logout dropdown
- [ ] Mobile: hamburger menu icon (opens sidebar overlay)

**Motion Animations (Header):**

- [ ] **Page title transition:** `AnimatePresence mode="wait"` → `motion.h1 key={routeTitle}` fades out/in on route change (opacity + slight Y translate)
- [ ] **Notification bell:** `motion.button whileHover={{ scale: 1.1 }}` + `whileTap={{ scale: 0.95 }}`; on new notification: bell rings with `animate={{ rotate: [0, -15, 15, -10, 10, 0] }}` (300ms)
- [ ] **Notification badge:** `motion.span` with `badgeBounce` variant on count change; `AnimatePresence` for appear/disappear
- [ ] **User dropdown:** `AnimatePresence` → `motion.div slideDown` variant (fade + slide from top, 200ms)
- [ ] **Breadcrumb:** `motion.nav initial={{ opacity: 0, x: -10 }}` → `animate={{ opacity: 1, x: 0 }}` on route change

### Task 3.3: Main Layout

**File:** `src/components/layout/MainLayout.tsx`

- [ ] Compose: Sidebar (left) + vertical stack (Header + main content area)
- [ ] Content area: `padding: 24px`, `max-width: 1440px`, `background: #F8FAFB`
- [ ] Scrollable content area (not full page scroll)
- [ ] Wrap all protected routes in this layout
- [ ] Login page uses separate `AuthLayout.tsx` (no sidebar/header)

**Motion Animations (Main Layout):**

- [ ] **Page transition wrapper:** Wrap `<Outlet />` (or page content) in `AnimatePresence mode="wait"` + `motion.main key={location.pathname}` with `pageTransition` variants (fade + Y translate, 250ms enter, 120ms exit)
- [ ] **Sidebar width transition:** Content area adjusts width smoothly when sidebar collapses/expands using `motion.div animate={{ marginLeft: isCollapsed ? 64 : 260 }}` (spring)
- [ ] **Suspense fallback:** Show `LoadingSpinner` component with fade-in animation during lazy-loaded route loading

---

## **PHASE 4: DASHBOARD PAGE** (Day 6–8)

### Task 4.1: Dashboard Stats Cards

**File:** `src/pages/DashboardPage.tsx` + `src/components/common/StatsCard.tsx`

- [ ] 4 stat cards in a row (2x2 on mobile):

| Stat Card        | Icon (Lucide) | Color   | API Field        |
| ---------------- | ------------- | ------- | ---------------- |
| Revenue Today    | DollarSign    | Teal    | `revenueToday`   |
| New Orders Today | ShoppingBag   | Info    | `newOrdersToday` |
| Pending Orders   | Clock         | Warning | `pendingOrders`  |
| Total Products   | Package       | Navy    | `totalProducts`  |

- [ ] **StatsCard component:** Icon circle (48px, colored bg) → value (display-lg, Bold) → label (body-sm, Medium Gray)
- [ ] Value format: Revenue → "EGP X,XXX"; Counts → plain number

**Motion Animations (Stats Cards):**

- [ ] **Cards stagger:** `motion.div staggerContainer` wrapper → each `StatsCard` as `motion.div staggerItem` (fade up + 0.08s stagger between cards)
- [ ] **Card hover:** `motion.div whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(23,32,65,0.12)" }}` (spring, 200ms)
- [ ] **Animated counters:** Use `react-countup` with `enableScrollSpy` for stat values: `<CountUp end={revenueToday} duration={1.5} separator="," prefix="EGP " />` — numbers count up from 0 on initial render
- [ ] **Icon circle pulse:** On initial load, icon circles animate `scale: [0.8, 1.1, 1]` (spring, once)
- [ ] **Value update:** When stats refresh (auto-refresh), number change animates smoothly with `react-countup` (counts from old → new value)

**API Integration:**

- [ ] `GET /api/cms/dashboard/stats`

### Task 4.2: Revenue Chart

**File:** `src/components/dashboard/RevenueChart.tsx`

- [ ] Line or area chart using Recharts
- [ ] Period selector: Today | This Week | This Month | This Year (tabs/buttons)
- [ ] X-axis: time periods; Y-axis: revenue (EGP)
- [ ] Teal line/fill color, grid lines Light Gray
- [ ] Tooltip on hover: date + revenue value
- [ ] Card container: White bg, 12px radius, 24px padding

**Motion Animations (Revenue Chart):**

- [ ] **Chart card entrance:** `motion.div fadeInUp` on initial render (delay: 0.2s after stats cards)
- [ ] **Recharts animation:** Use Recharts' built-in `isAnimationActive` + `animationDuration={800}` + `animationEasing="ease-out"` for line/area draw animation
- [ ] **Period tab switch:** `motion.div layoutId="chartPeriodIndicator"` for smooth sliding active tab indicator; chart data animates with Recharts' built-in transition
- [ ] **Tooltip:** Use custom Recharts tooltip with `motion.div scaleIn` animation on hover

**API Integration:**

- [ ] `GET /api/cms/dashboard/revenue?period=week`

### Task 4.3: Recent Orders Table

**File:** `src/components/dashboard/RecentOrdersTable.tsx`

- [ ] Last 10 orders in a compact table
- [ ] Columns: Order #, Customer Name, Items, Total (EGP), Status (badge), Date
- [ ] Status badges: color-coded (see StatusBadge component)
- [ ] Click row → navigates to `/orders/:id`
- [ ] "View All Orders" link at bottom → `/orders`
- [ ] Card container: White bg, 12px radius

**Motion Animations (Recent Orders Table):**

- [ ] **Table card entrance:** `motion.div fadeInUp` (delay: 0.3s after chart)
- [ ] **Table rows:** `staggerContainer` → each `motion.tr staggerItem` fades in from left (0.04s stagger, total animation < 500ms for 10 rows)
- [ ] **Row hover:** `motion.tr whileHover={{ backgroundColor: "#F8FAFB" }}` (100ms transition)
- [ ] **Status badge:** `motion.span` with subtle `scaleIn` animation on render

**API Integration:**

- [ ] `GET /api/cms/dashboard/recent-orders?limit=10`

### Task 4.4: Latest Inquiries Widget

**File:** `src/components/dashboard/LatestInquiries.tsx`

- [ ] Last 5 inquiries in a compact list
- [ ] Each item: name, type badge (Purchase / Service / General), date, status dot (New = red, In Progress = amber, Resolved = green)
- [ ] Click → navigates to `/inquiries` with filter
- [ ] "View All" link → `/inquiries`

**Motion Animations (Latest Inquiries):**

- [ ] **Widget card entrance:** `motion.div fadeInUp` (delay: 0.3s)
- [ ] **Inquiry items:** `staggerContainer` → each item `staggerItem` (0.06s stagger)
- [ ] **Status dot:** `motion.span` with pulse animation for "New" status (`animate={{ scale: [1, 1.3, 1] }}` repeat every 2s) to draw admin attention
- [ ] **Item hover:** `motion.div whileHover={{ x: 4, backgroundColor: "#F8FAFB" }}` (150ms)

**API Integration:**

- [ ] `GET /api/cms/dashboard/latest-inquiries?limit=5`

### Task 4.5: Quick Actions

**File:** `src/components/dashboard/QuickActions.tsx`

- [ ] 4 action buttons/cards:
  - "Add Product" (Plus + Package icons) → `/products/create`
  - "View Orders" (ShoppingBag icon) → `/orders`
  - "Manage Content" (FileText icon) → `/content`
  - "Settings" (Settings icon) → `/settings`
- [ ] Small cards in a horizontal row; click navigates

**Motion Animations (Quick Actions):**

- [ ] **Cards stagger:** `staggerContainer` → each action card `staggerItem` (0.06s stagger)
- [ ] **Card hover:** `motion.a whileHover={{ y: -3, boxShadow: "0 6px 16px rgba(23,32,65,0.1)" }}` + `whileTap={{ scale: 0.97 }}`
- [ ] **Icon hover:** Icon inside card uses `motion.div whileHover={{ rotate: [0, -5, 5, 0] }}` (subtle wiggle, 300ms)

### Task 4.6: Assemble Dashboard Page

**File:** `src/pages/DashboardPage.tsx`

- [ ] Layout: Stats cards (top row) → Revenue chart (left, 60%) + Latest inquiries (right, 40%) → Recent orders (full width) → Quick actions (bottom)
- [ ] Page title: "Dashboard"
- [ ] Loading skeletons for all widgets — use shimmer/pulse animation on skeleton elements
- [ ] Auto-refresh every 60 seconds (optional); on data refresh, use `react-countup` to animate number transitions from old→new values

**Motion Animations (Dashboard Page):**

- [ ] **Page entrance:** Entire page wrapped in `motion.div pageTransition` variant on route enter
- [ ] **Section stagger:** Stats → Chart/Inquiries → Orders → Quick Actions stagger in with 0.15s delay between sections
- [ ] **Loading → Content transition:** `AnimatePresence mode="wait"` → skeleton exits with fade → real content enters with `fadeInUp`
- [ ] **Empty states:** Use **Lottie** animation (`lottie-react`) for empty dashboard illustrations (e.g., no orders yet)

---

## **PHASE 5: ORDER MANAGEMENT** (Day 9–12)

### Task 5.1: Orders List Page

**File:** `src/pages/orders/OrdersPage.tsx`

- [ ] Page title: "Orders"
- [ ] **Filters bar:**
  - Status dropdown: All, Pending Payment, Confirmed, Processing, Shipped, Delivered, Cancelled, Refunded
  - Date range picker (from–to)
  - Search: by order number, customer name, or email
  - "Export CSV" button (optional)
- [ ] **Data Table** (reusable `DataTable` component):
  - Columns: Order # (link), Customer, Items Count, Total (EGP), Payment Status (badge), Order Status (badge), Date, Actions (eye icon → detail)
  - Sortable columns: Date, Total, Status
  - Pagination (10/25/50 per page)
- [ ] Status badges per UI/UX spec:
  - **Order Status:** Pending Payment (Gray), Confirmed (Blue), Processing (Amber), Shipped (Teal), Delivered (Green), Cancelled (Red), Refunded (Purple)
  - **Payment Status:** Pending (Gray), Paid (Green), Failed (Red), Refunded (Purple)
- [ ] Click row or eye icon → `/orders/:id`

**API Integration:**

- [ ] `GET /api/cms/orders?page=1&limit=10&status=all&search=&dateFrom=&dateTo=`

### Task 5.2: Order Detail Page

**File:** `src/pages/orders/OrderDetailPage.tsx`

- [ ] Breadcrumb: Dashboard > Orders > Order #LORD-XXXXXXXX
- [ ] **Order Summary Card:**
  - Order number (large, bold)
  - Order date + time
  - Current status badge (large)
  - Payment method + status badge
  - Paymob transaction ID (copyable)
- [ ] **Order Status Timeline** (`OrderStatusTimeline` component):
  - Visual vertical stepper: Placed → Confirmed → Processing → Shipped → Delivered
  - Each step: status name, timestamp, admin note
  - Current step highlighted in Teal; completed in Green; upcoming in Gray
  - **Motion:** Timeline steps use `staggerContainer` + `staggerItem`; connecting line grows with `motion.div animate={{ height: "100%" }}` (sequential, 200ms per segment); completed step circles pulse `scale: [1, 1.15, 1]` on render (spring)
- [ ] **Status Update Action:**
  - "Update Status" button → opens modal with:
    - Next valid status options (dropdown) — enforce lifecycle rules:
      - `pending_payment` → `confirmed` (auto on payment) or `cancelled`
      - `confirmed` → `processing` or `cancelled`
      - `processing` → `shipped`
      - `shipped` → `delivered`
    - Optional note text area
    - Confirm button
  - When updating to `shipped`: show tracking number + carrier inputs
  - **Motion (Status Modal):** Wrap modal in `AnimatePresence` → backdrop `motion.div overlayFade` + content `motion.div scaleIn` (scale 0.95→1, 200ms); success state shows **Lottie** green checkmark animation before auto-closing
- [ ] **Order Items Table:**
  - Product image (thumbnail 48px), name, brand, model, SKU, quantity, unit price, line total
  - Subtotal, Shipping, Discount (coupon code shown), Grand Total (bold)
- [ ] **Customer Information:**
  - Name, national ID, email, phone
  - Link to customer detail: "View Customer" → `/customers/:id`
- [ ] **Shipping Address:**
  - Full address display
- [ ] **Payment Information:**
  - Payment method (Credit Card / Mobile Wallet / Installment)
  - Card brand + last 4 digits (if card)
  - Paymob transaction ID
  - Payment date
  - Payment status badge
- [ ] **Refund Section** (if applicable):
  - "Process Refund" button (only if status = `delivered` or `shipped`)
  - Refund modal: amount (pre-filled with total), reason, confirmation; **Motion:** `AnimatePresence` → `scaleIn` variant + danger-themed confirmation (red CTA with `whileTap={{ scale: 0.97 }}`)
  - Refund history: amount, date, reason, Paymob refund ID; new refund entries animate in with `fadeInUp`
- [ ] **Print / Export:** "Print Order" button — opens print-friendly view
- [ ] **Notes:** Admin notes list + "Add Note" input

**API Integration:**

- [ ] `GET /api/cms/orders/:id`
- [ ] `PATCH /api/cms/orders/:id/status` — `{ status, note }`
- [ ] `PATCH /api/cms/orders/:id/tracking` — `{ trackingNumber, carrier }`
- [ ] `POST /api/cms/orders/:id/refund` — `{ amount, reason }`

---

## **PHASE 6: CUSTOMER MANAGEMENT** (Day 13–14)

### Task 6.1: Customers List Page

**File:** `src/pages/customers/CustomersPage.tsx`

- [ ] Page title: "Customers"
- [ ] **Filters:** Search (name, email, phone), Status (All, Active, Disabled)
- [ ] **Data Table:**
  - Columns: Name, National ID, Email, Phone, Orders Count, Total Spent (EGP), Status (Active/Disabled badge), Joined Date, Actions
  - Sortable: Name, Orders Count, Total Spent, Joined Date
  - Pagination
- [ ] Status toggle: Green "Active" / Red "Disabled" — click to toggle (with confirmation); **Motion:** toggle switch uses `motion.div layout` for smooth knob sliding + background color transition
- [ ] Click row → `/customers/:id`

**API Integration:**

- [ ] `GET /api/cms/customers?page=1&limit=10&search=&status=all`

### Task 6.2: Customer Detail Page

**File:** `src/pages/customers/CustomerDetailPage.tsx`

- [ ] Breadcrumb: Dashboard > Customers > [Customer Name]
- [ ] **Customer Info Card:**
  - Name, national ID (14-digit Egyptian National ID), email, phone, registration date, last login
  - Email verification status badge (Verified ✅ / Unverified ❌)
  - Account status: Active / Disabled toggle with confirmation modal
- [ ] **Customer Stats:** Total orders, Total spent (EGP), Last order date
- [ ] **Order History Table:**
  - Customer's orders in reverse chronological order
  - Columns: Order #, Date, Items, Total (EGP), Status badge
  - Click → `/orders/:id`
  - Pagination
- [ ] **Saved Addresses List:**
  - Customer's saved addresses (read-only in CMS)
  - Label, recipient, phone, full address, default indicator

**API Integration:**

- [ ] `GET /api/cms/customers/:id`
- [ ] `PATCH /api/cms/customers/:id/status` — `{ isActive: true/false }`
- [ ] Customer orders fetched as part of customer detail response

---

## **PHASE 7: PRODUCT MANAGEMENT** (Day 15–19)

### Task 7.1: Products List Page

**File:** `src/pages/products/ProductsPage.tsx`

- [ ] Page title: "Products"
- [ ] **"+ Add Product"** Primary button → `/products/create`
- [ ] **Filters:** Search (name, model), Brand dropdown, Category dropdown, Stock status (All, In Stock, Out of Stock), Featured toggle
- [ ] **Data Table:**
  - Columns: Image (thumbnail 48px), Name, Brand, Category, Price (EGP), Stock Qty, Featured (star icon toggle), Active (toggle), Actions (Edit, Delete)
  - Sortable: Name, Price, Stock, Created Date
  - Pagination (10/25/50 per page)
- [ ] Stock warnings: Red text/highlight when `stockQuantity < 5`
- [ ] Featured toggle: Star icon — click to toggle featured status inline; **Motion:** `motion.svg animate={{ scale: [1, 1.3, 1], fill: isFeatured ? "#FFC107" : "transparent" }}` (300ms spring)
- [ ] Active toggle: Switch — click to toggle active/inactive; **Motion:** `motion.div layout` for smooth knob slide + bg color transition
- [ ] Delete: Trash icon → confirmation modal (with `AnimatePresence` → `scaleIn` variant) "Are you sure? This cannot be undone."
- [ ] Edit icon → `/products/:id/edit`

**API Integration:**

- [ ] `GET /api/cms/products?page=1&limit=10&search=&brand=&category=&stock=&featured=`
- [ ] `PATCH /api/cms/products/:id/featured` — `{ featured: true/false }`
- [ ] `DELETE /api/cms/products/:id`

### Task 7.2: Product Create / Edit Page

**File:** `src/pages/products/ProductCreatePage.tsx` + `src/pages/products/ProductEditPage.tsx`

- [ ] Same form component (`ProductForm`) used for both create and edit
- [ ] Edit page: pre-populate form with existing product data
- [ ] **Tabbed Form** (4 tabs using Radix UI Tabs):

#### Tab 1: General Information

- [ ] Product name (required)
- [ ] Slug (auto-generated from name, editable)
- [ ] Brand (dropdown — required)
- [ ] Category (dropdown — required)
- [ ] Model number (required)
- [ ] Short description (textarea)
- [ ] Full description (Rich Text Editor — TipTap)
- [ ] Price (EGP, required, number input)
- [ ] Sale price (EGP, optional, must be less than price)
- [ ] Stock quantity (number input, min 0)
- [ ] Active toggle (default: true)
- [ ] Featured toggle (default: false)

#### Tab 2: Specifications

**File:** `src/components/products/SpecificationsForm.tsx`

- [ ] Key-value pairs (dynamic, add/remove rows):
  - Key (text input): Capacity, Type, EER/SEER, Voltage, Refrigerant, Dimensions, Weight, Color, Warranty, etc.
  - Value (text input): corresponding values
- [ ] "Add Specification" button → appends new row; new row enters with `motion.div initial={{ opacity: 0, height: 0 }}` → `animate={{ opacity: 1, height: "auto" }}` (200ms)
- [ ] Remove button (X icon) per row; row exits with `AnimatePresence` → `motion.div exit={{ opacity: 0, x: -20, height: 0 }}` (200ms)
- [ ] Drag-to-reorder (optional); use `@formkit/auto-animate` on spec rows container for smooth reorder

#### Tab 3: Images

**File:** `src/components/products/ImageManager.tsx`

- [ ] Drag-and-drop upload zone (react-dropzone)
- [ ] Accept: JPEG, PNG, WebP; max 5MB per image; max 10 images per product
- [ ] Image preview grid (thumbnails with aspect ratio maintained)
- [ ] Set primary image: star icon on each thumbnail
- [ ] Reorder images: drag-and-drop reordering; use `@formkit/auto-animate` on the image grid for smooth reorder/add/remove animations
- [ ] Delete image: X icon with confirmation; image exits with `AnimatePresence` → `motion.div exit={{ opacity: 0, scale: 0.8 }}` (200ms)
- [ ] Alt text input per image (for SEO/accessibility)
- [ ] Upload progress bar per image — `motion.div animate={{ width: progress + "%" }}` with spring transition

#### Tab 4: SEO

**File:** `src/components/products/SeoForm.tsx`

- [ ] Meta title (auto-populated from product name; editable; max 60 chars; character counter)
- [ ] Meta description (textarea; max 160 chars; character counter)
- [ ] SEO preview: mock Google search result display showing title + description + URL
- [ ] Slug preview: `lord-ac.com/products/[slug]`

### Task 7.3: Form Actions

- [ ] "Save as Draft" → saves with `active: false`
- [ ] "Publish" → saves with `active: true`
- [ ] "Cancel" → navigates back to `/products` (with unsaved changes warning)
- [ ] Form validation: Zod schema — all required fields
- [ ] Success toast: "Product created/updated successfully"
- [ ] Error handling: field-level errors from API

**API Integration:**

- [ ] Create: `POST /api/cms/products` (multipart/form-data for images)
- [ ] Update: `PUT /api/cms/products/:id` (multipart/form-data)
- [ ] Fetch for edit: `GET /api/cms/products/:id`

---

## **PHASE 8: BRANDS & CATEGORIES** (Day 20)

### Task 8.1: Brands & Categories Page

**File:** `src/pages/brands/BrandsPage.tsx`

- [ ] **Two sections** (tabs or side-by-side):

#### Brands Section

- [ ] List of brands in a card grid (2–3 columns)
- [ ] **Brand Card:** Logo thumbnail, name, slug, product count, active toggle
- [ ] "Add Brand" button → modal form (with `AnimatePresence` → backdrop `overlayFade` + content `scaleIn`):
  - Name (EN + AR)
  - Slug (auto-generated)
  - Logo upload (image)
  - Description (EN + AR)
  - Active toggle
- [ ] Edit → same modal pre-filled
- [ ] Delete → confirmation modal (with `AnimatePresence` → `scaleIn` + danger variant); prevent if brand has products

**Motion Animations (Brands & Categories):**

- [ ] **Brand cards:** `staggerContainer` → each card `staggerItem` (fade up, 0.06s stagger)
- [ ] **Card hover:** `motion.div whileHover={{ y: -3, boxShadow: "0 6px 16px rgba(23,32,65,0.1)" }}`
- [ ] **Active toggle:** `motion.div layout` for smooth knob slide
- [ ] **Category table rows:** Use `@formkit/auto-animate` on `<tbody>` for automatic row add/remove animations
- [ ] **All modals:** Consistent `AnimatePresence` → `overlayFade` + `scaleIn` pattern

#### Categories Section

- [ ] List of product categories in a simple table
- [ ] Columns: Name (EN + AR), Slug, Product Count, Sort Order, Active, Actions
- [ ] "Add Category" button → modal form:
  - Name (EN + AR)
  - Slug (auto-generated)
  - Description (EN + AR)
  - Sort order (number)
  - Active toggle
- [ ] Edit → same modal pre-filled
- [ ] Delete → confirmation modal (prevent if category has products)

**API Integration:**

- [ ] Brands: `GET/POST/PUT/DELETE /api/cms/brands`
- [ ] Categories: `GET/POST/PUT/DELETE /api/cms/product-categories`

---

## **PHASE 9: SERVICES, INQUIRIES, COUPONS** (Day 21–24)

### Task 9.1: Services Management Page

**File:** `src/pages/services/ServicesPage.tsx` + Create/Edit pages

- [ ] Page title: "Services"
- [ ] "Add Service" Primary button → `/services/create`
- [ ] **Data Table:** Name, Service Type, Active toggle, Sort Order, Actions (Edit, Delete)
- [ ] **Service Form** (create/edit):
  - Service type (dropdown: Installation, Maintenance, Repair, Delivery, Spare Parts)
  - Name (EN + AR)
  - Slug
  - Description (EN + AR, Rich Text)
  - Scope / What's Included (list of bullet points); use `@formkit/auto-animate` for add/remove bullet animation
  - Applicable unit types (multi-select checkboxes)
  - Active toggle
  - Sort order
- [ ] Delete: confirmation modal

**API Integration:**

- [ ] `GET/POST/PUT/DELETE /api/cms/services`
- [ ] `GET /api/cms/service-types`

### Task 9.2: Inquiries & Service Requests Page

**File:** `src/pages/inquiries/InquiriesPage.tsx`

- [ ] **3 Tabs** (Radix UI Tabs):
  - **Purchase Inquiries** — inquiries of type "product" or "purchase"
  - **Service Requests** — service request submissions
  - **General Inquiries** — inquiries of type "general", "order-support"

#### Each tab shows a data table:

- [ ] **Purchase Inquiries columns:** Name, Email, Phone, Product (link), Source, Status (badge), Date, Actions
- [ ] **Service Requests columns:** Name, Phone, Service Type, Urgency (badge), Status (badge), Date, Actions
- [ ] **General Inquiries columns:** Name, Email, Type, Message (truncated), Status (badge), Date, Actions

- [ ] **Note:** For Installation-type service requests, display the **installation location address** prominently in the detail view

- [ ] **Status badges:**
  - New (Red dot)
  - In Progress (Amber)
  - Contacted (Blue)
  - Resolved (Green)
  - Closed (Gray)

- [ ] **Inquiry Detail Modal** (click row or eye icon); **Motion:** `AnimatePresence` → backdrop `overlayFade` + content `motion.div scaleIn` (200ms):
  - Full info: name, email, phone, type, message, product (if applicable), source page, submitted date
  - For Installation-type service requests: display **installation location address** as a highlighted field
  - Status update dropdown
  - Admin notes: list of notes + "Add Note" input; use `@formkit/auto-animate` on notes list for automatic add animation
  - Quick actions: "Mark as Contacted", "Mark as Resolved", "Close" — buttons use `motion.button whileTap={{ scale: 0.97 }}`

- [ ] **Filters per tab:** Status, Date range, Search

**API Integration:**

- [ ] `GET /api/cms/inquiries?type=product&status=new&page=1`
- [ ] `PATCH /api/cms/inquiries/:id/status`
- [ ] `POST /api/cms/inquiries/:id/notes`
- [ ] `GET /api/cms/service-requests?page=1&status=all`
- [ ] `PATCH /api/cms/service-requests/:id/status`

### Task 9.3: Coupons & Promotions Page

**File:** `src/pages/coupons/CouponsPage.tsx` + Create/Edit pages

- [ ] Page title: "Coupons & Promotions"
- [ ] "Create Coupon" Primary button → `/coupons/create`
- [ ] **Data Table:**
  - Columns: Code, Type (% / Fixed), Value, Min Order (EGP), Usage (used/limit), Start Date, End Date, Active, Actions
  - Sort by: Code, Start Date, End Date, Usage
- [ ] Active toggle inline
- [ ] "View Usage" action → modal showing list of orders that used the coupon; **Motion:** modal uses `AnimatePresence` → `overlayFade` + `scaleIn`; usage list rows stagger in

#### Coupon Form (create/edit):

**File:** `src/components/coupons/CouponForm.tsx`

- [ ] Code (uppercase, unique, required) — auto-generate button
- [ ] Type: Percentage (%) or Fixed Amount (EGP) — radio buttons
- [ ] Value: percentage (1–100) or fixed amount (EGP)
- [ ] Minimum order amount (EGP, optional)
- [ ] Maximum discount amount (EGP, optional — for percentage type)
- [ ] Usage limit per coupon (total, optional)
- [ ] Usage limit per customer (optional)
- [ ] Start date (required)
- [ ] End date (required)
- [ ] Active toggle
- [ ] Form validation: Zod schema
  - End date must be after start date
  - Value appropriate to type (percentage max 100)

**API Integration:**

- [ ] `GET/POST/PUT/DELETE /api/cms/coupons`
- [ ] `GET /api/cms/coupons/:id/usage`

---

## **PHASE 10: CONTENT, TESTIMONIALS, FAQS** (Day 25–28)

### Task 10.1: Content Pages Management

**File:** `src/pages/content/ContentPage.tsx`

- [ ] **2 sub-tabs:** Home Page | About Page

#### Home Page Editor

**File:** `src/components/content/HomeContentEditor.tsx`

- [ ] **Hero Section:**
  - Headline (EN + AR)
  - Tagline (EN + AR)
  - CTA 1 label + URL
  - CTA 2 label + URL
- [ ] **Stats Section:** 4 stat items — each with value + label (EN + AR)
- [ ] **SEO:** Meta title, meta description
- [ ] "Save" Primary button; success toast; **Motion:** button `whileTap={{ scale: 0.97 }}`; on save success, brief green checkmark animation

#### About Page Editor

**File:** `src/components/content/AboutContentEditor.tsx`

- [ ] Company story (Rich Text, EN + AR)
- [ ] Mission statement (EN + AR)
- [ ] Vision statement (EN + AR)
- [ ] SEO: meta title, meta description
- [ ] "Save" Primary button; success toast; **Motion:** `whileTap={{ scale: 0.97 }}`

**API Integration:**

- [ ] `GET /api/cms/content/home`
- [ ] `PUT /api/cms/content/home`
- [ ] `GET /api/cms/content/about`
- [ ] `PUT /api/cms/content/about`

### Task 10.2: Testimonials Management

**File:** `src/pages/testimonials/TestimonialsPage.tsx`

- [ ] Page title: "Testimonials"
- [ ] "Add Testimonial" Primary button → modal form
- [ ] **Filters:** Status (All, Pending, Approved, Rejected), Featured toggle
- [ ] **Data Table:**
  - Columns: Customer Name, Rating (stars), Quote (truncated), Status badge (Pending/Approved/Rejected), Featured (star toggle), Date, Actions
- [ ] **Actions per row:**
  - ✅ Approve (if pending) — green checkmark icon; **Motion:** row bg flashes green briefly (`motion.tr animate={{ backgroundColor: ["#D4EDDA", "transparent"] }}` 600ms) on approve
  - ❌ Reject (if pending) — red X icon; **Motion:** row bg flashes red briefly
  - ⭐ Toggle Featured — star icon; **Motion:** `motion.svg animate={{ scale: [1, 1.3, 1], fill: isFeatured ? "#FFC107" : "transparent" }}` (300ms spring)
  - ✏️ Edit — pencil icon
  - 🗑️ Delete — trash icon with confirmation modal (`AnimatePresence` → `scaleIn`)

#### Testimonial Form (create/edit modal):

- [ ] Customer name (required)
- [ ] Location (optional)
- [ ] Rating: 1–5 star selector
- [ ] Quote text (textarea, required)
- [ ] Status: Pending / Approved / Rejected
- [ ] Featured toggle

**API Integration:**

- [ ] `GET/POST/PUT/DELETE /api/cms/testimonials`
- [ ] `PATCH /api/cms/testimonials/:id/approve`
- [ ] `PATCH /api/cms/testimonials/:id/reject`
- [ ] `PATCH /api/cms/testimonials/:id/featured`

### Task 10.3: FAQ Management

**File:** `src/pages/faqs/FaqsPage.tsx` + Create/Edit pages

- [ ] Page title: "FAQs"
- [ ] "Add FAQ" Primary button → `/faqs/create`
- [ ] **Filters:** Category dropdown (Products, Installation, Maintenance & Repair, Warranty, Delivery, Ordering & Payment, General), Active toggle
- [ ] **Data Table:**
  - Columns: Question (EN, truncated), Category badge, Sort Order, Active toggle, Actions (Edit, Delete, Drag handle)
  - Drag-to-reorder rows — use `@formkit/auto-animate` on `<tbody>` for smooth reorder animations
- [ ] Delete: confirmation modal (`AnimatePresence` → `scaleIn`)

#### FAQ Form (create/edit):

- [ ] Question (EN + AR, required)
- [ ] Answer (EN + AR, Rich Text editor)
- [ ] Category (dropdown, required)
- [ ] Sort order (number)
- [ ] Active toggle

**API Integration:**

- [ ] `GET/POST/PUT/DELETE /api/cms/faqs`
- [ ] `PATCH /api/cms/faqs/reorder` — `{ orderedIds: [...] }`

---

## **PHASE 11: SETTINGS** (Day 29–31)

### Task 11.1: Settings Page (7 Tabs)

**File:** `src/pages/settings/SettingsPage.tsx`

- [ ] Page title: "Settings"
- [ ] **7 tabs** (Radix UI Tabs): General | Contact | Email | SEO | Brands | Paymob | Shipping
- [ ] Each tab is a separate component; each has its own "Save" button
- [ ] Success toast on save; error handling for validation

**Motion Animations (Settings Page):**

- [ ] **Active tab indicator:** `motion.div layoutId="settingsTabIndicator"` — the active tab underline/highlight slides smoothly between tabs using shared layout animation
- [ ] **Tab content switch:** `AnimatePresence mode="wait"` → outgoing tab content fades out (`opacity: 0, x: -10`, 120ms) → incoming tab content fades in (`opacity: 0, x: 10` → `opacity: 1, x: 0`, 200ms)
- [ ] **Save button:** `motion.button whileTap={{ scale: 0.97 }}`; success state: button briefly shows checkmark with `AnimatePresence mode="wait"` switching between "Save" text → checkmark → "Save" text
- [ ] **Test Connection/Email buttons:** Loading spinner uses `motion.span animate={{ rotate: 360 }}` + result indicator (`scaleIn` green checkmark or red X)

#### Tab 1: General Settings

**File:** `src/components/settings/GeneralSettings.tsx`

- [ ] Site name (EN + AR)
- [ ] Site tagline (EN + AR)
- [ ] Site logo upload
- [ ] Favicon upload
- [ ] Default language (AR / EN)
- [ ] Currency symbol ("EGP" — read-only)
- [ ] Timezone

#### Tab 2: Contact Settings

**File:** `src/components/settings/ContactSettings.tsx`

- [ ] Address (EN + AR)
- [ ] Phone number
- [ ] WhatsApp number (wa.me/ link preview)
- [ ] Email address
- [ ] Working hours (text field or structured input)
- [ ] Google Maps embed URL
- [ ] Social media links: Facebook URL, Instagram URL, WhatsApp URL
- [ ] "Test Contact Link" (opens new tab with WhatsApp link preview)

#### Tab 3: Email Settings

**File:** `src/components/settings/EmailSettings.tsx`

- [ ] SMTP Host
- [ ] SMTP Port
- [ ] SMTP Username
- [ ] SMTP Password (masked input)
- [ ] From Email address
- [ ] From Name
- [ ] "Send Test Email" button — sends test email to admin; shows success/error result
- [ ] Email templates preview (optional — list of 18 email types from Tech Specs §10):
  - Welcome, Email Verification, Password Reset, Order Confirmed, Payment Received, Order Processing, Order Shipped, Order Delivered, Order Cancelled, Refund Processed, New Inquiry Received, Inquiry Status Update, Service Request Received, Service Request Status Update, Account Disabled, Account Enabled, New Order Admin, Low Stock Alert Admin

#### Tab 4: SEO Settings

**File:** `src/components/settings/SeoSettings.tsx`

- [ ] Default meta title (EN + AR)
- [ ] Default meta description (EN + AR)
- [ ] OG image upload (default Open Graph image)
- [ ] Google Analytics tracking ID
- [ ] Google Search Console verification code
- [ ] robots.txt content (textarea, editable)

#### Tab 5: Brand Settings

**File:** `src/components/settings/BrandSettings.tsx`

- [ ] Quick reference to brand management → link to `/brands`
- [ ] Authorized dealer certificate images: Carrier + Midea (upload)
- [ ] Partner logos display order

#### Tab 6: Paymob Settings

**File:** `src/components/settings/PaymobSettings.tsx`

- [ ] Paymob API Key (masked input)
- [ ] Paymob Secret Key (masked input)
- [ ] Paymob Merchant ID
- [ ] Card Integration ID
- [ ] Wallet Integration ID
- [ ] Installment Integration ID (optional)
- [ ] Iframe ID
- [ ] HMAC Secret (masked)
- [ ] Environment toggle: Sandbox / Production
- [ ] "Test Connection" button — verifies credentials, shows success/error
- [ ] Status indicator: "Connected" (green) / "Not configured" (gray) / "Error" (red)

#### Tab 7: Shipping Settings

**File:** `src/components/settings/ShippingSettings.tsx`

- [ ] Flat rate shipping fee (EGP, number input)
- [ ] Free shipping threshold (EGP — orders above this amount get free shipping; 0 = no free shipping)
- [ ] Estimated delivery time (text: "3–5 business days")
- [ ] Shipping note (displayed to customers at checkout)
- [ ] Available governorates (multi-select checklist of Egyptian governorates — determines where Lord ships)

**API Integration:**

- [ ] `GET /api/cms/settings/:group` — group: general, contact, email, seo, brands, paymob, shipping
- [ ] `PUT /api/cms/settings/:group` — updates settings for that group
- [ ] `POST /api/cms/settings/email/test` — sends test email
- [ ] `POST /api/cms/settings/paymob/test` — tests Paymob connection

---

## **PHASE 12: RESPONSIVE DESIGN & POLISH** (Day 32–33)

### Task 12.1: Responsive Layout

- [ ] **Desktop (≥1024px):** Full sidebar (260px) + content area
- [ ] **Tablet (768–1023px):** Collapsed sidebar (64px, icon-only) + full content
- [ ] **Mobile (<768px):** No sidebar; hamburger menu → overlay sidebar; full-width content
- [ ] All data tables: horizontal scroll on mobile (with scroll indicator shadow)
- [ ] Forms: single-column on mobile; multi-column on desktop
- [ ] Modals: full-screen on mobile; centered card on desktop
- [ ] Dashboard stats: 2x2 grid on mobile
- [ ] Dashboard charts: full-width on mobile

### Task 12.2: Reusable Data Table Component

**File:** `src/components/common/DataTable.tsx`

- [ ] Built with @tanstack/react-table
- [ ] Features:
  - Column sorting (click header to sort asc/desc); sort icon uses `motion.svg animate={{ rotate: isAsc ? 0 : 180 }}` (150ms)
  - Search input (debounced, 300ms)
  - Column visibility toggle
  - Row selection (checkbox, optional)
  - Pagination controls (prev/next, page numbers, items per page dropdown)
  - Loading state: skeleton rows with shimmer animation
  - Empty state: "No data found" with icon; use **Lottie** empty state animation
  - Row click handler (for navigation)
  - Action column with icon buttons

**Motion Animations (DataTable):**

- [ ] **Table body:** Use `@formkit/auto-animate` on `<tbody>` for automatic row add/remove/reorder animations when data changes (filter, sort, paginate)
- [ ] **Row hover:** `motion.tr whileHover={{ backgroundColor: "#F8FAFB" }}` (100ms)
- [ ] **Page change:** `AnimatePresence mode="wait"` on table body → old rows fade out, new rows fade in with `staggerContainer` / `staggerItem` (fast: 0.03s stagger)
- [ ] **Empty state transition:** `AnimatePresence mode="wait"` → table exits → empty state enters with `scaleIn`
- [ ] **Action icon buttons:** `motion.button whileHover={{ scale: 1.15 }}` + `whileTap={{ scale: 0.9 }}`

### Task 12.3: Common UI Components Polish

- [ ] **ConfirmDialog.tsx** — Reusable confirmation modal: title, description, confirm/cancel buttons, danger variant (red confirm button); **Motion:** `AnimatePresence` → backdrop `overlayFade` + dialog `scaleIn`; confirm button `whileTap={{ scale: 0.97 }}`
- [ ] **EmptyState.tsx** — Centered icon + title + description + optional CTA; **Motion:** `motion.div fadeInUp` entrance; icon uses subtle `animate={{ y: [0, -5, 0] }}` floating animation (3s, repeat); optionally use **Lottie** animation for illustration
- [ ] **Badge.tsx** — Variants: default (gray), success (green), warning (amber), error (red), info (blue), teal; **Motion:** `motion.span` with `scaleIn` on render (100ms)
- [ ] **StatusBadge.tsx** — Maps order status / payment status / inquiry status to correct badge variant; **Motion:** on status change, `AnimatePresence mode="wait"` → old badge exits (`opacity: 0, scale: 0.8`) → new badge enters (`scaleIn`)
- [ ] **SearchInput.tsx** — Debounced search input with Search icon + clear button; **Motion:** clear button appears with `AnimatePresence` → `motion.button scaleIn`
- [ ] **DateRangePicker.tsx** — Two date inputs (from/to) with calendar popover; **Motion:** calendar popover uses `AnimatePresence` → `slideDown` variant
- [ ] **FormField.tsx** — Label + input + error message wrapper; integrates with React Hook Form; **Motion:** error message appears with `motion.p initial={{ opacity: 0, y: -5 }}` → `animate={{ opacity: 1, y: 0 }}` (150ms)
- [ ] **ImageUpload.tsx** — Drag-and-drop zone (react-dropzone); preview; progress; delete; **Motion:** drop zone `whileHover={{ borderColor: "#0DBACA", scale: 1.01 }}`; upload progress bar `motion.div animate={{ width }}` (spring); preview grid uses `@formkit/auto-animate`
- [ ] **RichTextEditor.tsx** — TipTap wrapper: bold, italic, lists, headings, links, images

### Task 12.4: Toast Notifications

- [ ] Same configuration as main website (react-toastify)
- [ ] Success, error, warning, info variants
- [ ] Auto-dismiss after 5s
- [ ] Position: top-right
- [ ] **Motion:** Toast enter/exit uses built-in react-toastify transitions; optionally enhance with `motion` custom transitions

### Task 12.5: Loading & Error States

- [ ] Skeleton loaders for all tables and cards — use shimmer/pulse animation (CSS `@keyframes` or `motion.div` gradient animation)
- [ ] Full-page loading spinner for route transitions; Lord fan icon rotating using `motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}`; OR use **Lottie** animation
- [ ] API error handling: toast notifications + inline error messages
- [ ] 404 page: "Page not found" + "Go to Dashboard" CTA; use **Lottie** 404 illustration animation
- [ ] Network error: "Connection lost" banner — `motion.div` slides down from top with `slideDown` variant; auto-hides when connection restored

### Task 12.6: Animation & Motion Polish

- [ ] **Verify all Motion animations:** Ensure every component uses the correct animation preset from `lib/animations.ts`
- [ ] **Performance audit:** Check animation FPS (target 60fps); use `transform` and `opacity` only (GPU-accelerated); avoid animating `width`/`height` directly
- [ ] **Reduced motion:** Verify `prefers-reduced-motion` is respected globally — all non-essential animations disabled; only opacity transitions remain
- [ ] **Animation consistency:** All durations follow spec: micro-interactions (100–200ms), modals (200ms), page transitions (250ms), stagger (0.04–0.08s)
- [ ] **Lottie assets:** Ensure all Lottie JSON files are optimized (< 50KB each); loading spinner, success checkmark, empty states, 404 page
- [ ] **Auto-animate lists:** Verify `@formkit/auto-animate` is applied to: image manager grid, FAQ rows, admin notes list, category table rows
- [ ] **CountUp numbers:** Verify `react-countup` works on: dashboard stats (initial load + auto-refresh transitions)
- [ ] **All modals consistent:** Every modal uses `AnimatePresence` → backdrop `overlayFade` + content `scaleIn`
- [ ] **All toggle switches:** Use `motion.div layout` for smooth knob sliding animation
- [ ] **Loading skeletons:** Shimmer animation consistent across all skeleton components

---

## **PHASE 13: TESTING & DEPLOYMENT** (Day 34–35)

### Task 13.1: End-to-End Testing

- [ ] Test complete admin flows:
  1. Login → Dashboard renders correctly with live data
  2. View orders → click order → update status → add tracking → verify timeline
  3. View customers → click customer → view order history → toggle disable/enable
  4. Create product (all 4 tabs) → verify on products list → edit product → delete product
  5. Manage brands (create, edit, delete) → manage categories
  6. Create service → edit → delete
  7. View inquiries (all 3 tabs) → update status → add note → mark resolved
  8. Create coupon → view usage → edit → delete
  9. Edit home content → edit about content → verify on public site
  10. Manage testimonials (create, approve, reject, feature, delete)
  11. Manage FAQs (create, edit, reorder, delete)
  12. Update all 7 settings tabs → verify settings saved
  13. Process a refund on a delivered order
  14. Test Paymob connection from settings
  15. Test email from settings
- [ ] Test with realistic data (10+ products, 20+ orders, 50+ customers)

### Task 13.2: Cross-Browser Testing

- [ ] Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] Test on iPad (tablet layout)
- [ ] Test on mobile (overlay sidebar, table scroll)

### Task 13.3: Build for Production

- [ ] Set environment variables: `VITE_API_URL`
- [ ] Run `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Check bundle size; ensure no console errors

### Task 13.4: Deployment

- [ ] Deploy to VPS, Netlify, or Vercel
- [ ] Configure CMS subdomain (e.g., `cms.lord-ac.com` or `admin.lord-ac.com`)
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure environment variables in deployment
- [ ] Restrict CMS access by IP or authentication (production security)
- [ ] Test live CMS end-to-end

### Task 13.5: Documentation

- [ ] Create README with setup instructions
- [ ] Document environment variables needed
- [ ] Document folder structure and component naming conventions
- [ ] Document CMS user guide (optional — for admin users)

---

## **TECHNICAL STACK SUMMARY**

### Core Technologies

| Technology            | Purpose                                                                   |
| --------------------- | ------------------------------------------------------------------------- |
| React 18+             | UI library                                                                |
| Vite                  | Build tool + dev server                                                   |
| TypeScript            | Type safety                                                               |
| Tailwind CSS          | Styling (utility-first)                                                   |
| React Router DOM v6   | Client-side routing                                                       |
| Radix UI              | Accessible headless UI components                                         |
| Zod                   | Schema validation (forms)                                                 |
| React Hook Form       | Form state management                                                     |
| Lucide React          | Icon library (per Tech Specs)                                             |
| @tanstack/react-table | Data tables (sorting, pagination, filtering)                              |
| Recharts              | Dashboard charts (revenue, analytics)                                     |
| TipTap                | Rich text editor (content, product descriptions)                          |
| react-dropzone        | Image drag-and-drop upload                                                |
| react-toastify        | Toast notifications                                                       |
| date-fns              | Date formatting and utilities                                             |
| motion                | Animation library (formerly Framer Motion) — `import from "motion/react"` |
| @formkit/auto-animate | Zero-config list/layout animations (drag, add/remove)                     |
| react-countup         | Animated number counting (dashboard stats)                                |
| lottie-react          | Lottie JSON animations (loading, success, empty states)                   |

### Recommended `package.json` Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-accordion": "^1.1.0",
    "@radix-ui/react-toast": "^1.0.0",
    "@radix-ui/react-checkbox": "^1.0.0",
    "@radix-ui/react-select": "^1.2.0",
    "@radix-ui/react-switch": "^1.0.0",
    "@radix-ui/react-popover": "^1.0.0",
    "@tanstack/react-table": "^8.10.0",
    "recharts": "^2.10.0",
    "@tiptap/react": "^2.1.0",
    "@tiptap/starter-kit": "^2.1.0",
    "@tiptap/extension-image": "^2.1.0",
    "@tiptap/extension-link": "^2.1.0",
    "react-dropzone": "^14.2.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "lucide-react": "^0.300.0",
    "react-toastify": "^9.1.3",
    "date-fns": "^3.0.0",
    "motion": "^12.0.0",
    "@formkit/auto-animate": "^0.9.0",
    "react-countup": "^6.5.0",
    "lottie-react": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "@tailwindcss/forms": "^0.5.7",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0"
  }
}
```

### Design Tokens (from UI/UX Document)

| Token              | Value                                      |
| ------------------ | ------------------------------------------ |
| **Lord Navy**      | `#172041` — headers, primary text          |
| **Lord Teal**      | `#0DBACA` — CTAs, links, badges, active    |
| **Lord Silver**    | `#BEBEBE` — borders, dividers, muted       |
| **Lord Frost**     | `#4DB8D4` — gradients, hover states        |
| **Off-White**      | `#F8FAFB` — content area background        |
| **Dark Charcoal**  | `#1A1A2E` — body text                      |
| **Sidebar BG**     | `#0F172A` — sidebar background             |
| **Sidebar Hover**  | `#1E293B` — sidebar item hover/active bg   |
| **Sidebar Active** | `#0DBACA` — active item text + left border |
| **Font**           | Inter (Google Fonts)                       |
| **Max Width**      | 1440px (content area)                      |
| **Sidebar Width**  | 260px expanded, 64px collapsed             |
| **Header Height**  | 64px                                       |
| **Border Radius**  | Cards: 12px, Buttons: 8px, Inputs: 8px     |
| **Input Height**   | 44px                                       |
| **Anim: Micro**    | 100–200ms (hover, tap, toggle)             |
| **Anim: Modal**    | 200ms (scale-in, fade)                     |
| **Anim: Page**     | 250ms enter, 120ms exit                    |
| **Anim: Stagger**  | 0.04–0.08s between children                |
| **Anim: Spring**   | damping: 20–25, stiffness: 200             |

---

## **IMPORTANT NOTES**

### Best Practices

1. **Component Reusability** — DataTable, FormField, Modal, Badge, StatusBadge are used across many pages
2. **TypeScript Everywhere** — Strict mode; type all props, API responses, forms
3. **Error Handling** — Always handle API errors; show toast notifications; never show raw errors
4. **Loading States** — Skeleton loaders for tables/cards; spinner for form submissions
5. **Form Validation** — Validate all forms client-side (Zod) before API call
6. **Confirmation Dialogs** — Always confirm destructive actions (delete, disable, status changes)
7. **Optimistic Updates** — Toggle switches (featured, active, status) can update UI immediately, then sync
8. **URL-Based Filters** — Store filter/sort/page state in URL query params so admin can bookmark/share
9. **Lazy Loading** — All route components loaded with `React.lazy()` + `Suspense`
10. **Session Security** — CMS token stored in localStorage; auto-expire; re-authenticate on 401

### Common Pitfalls to Avoid

- ❌ Don't forget to clear forms after successful create operations
- ❌ Don't allow deleting brands/categories that have associated products (show error)
- ❌ Don't expose Paymob keys in client-side code — display masked values
- ❌ Don't skip confirmation modals for destructive actions
- ❌ Don't hardcode API URLs — use `VITE_API_URL` environment variable
- ❌ Don't use `react-icons` — use `lucide-react` per Tech Specs
- ❌ Don't skip empty states for tables and lists
- ❌ Don't allow invalid order status transitions (enforce lifecycle rules)
- ❌ Don't forget pagination — never load all records at once
- ❌ Don't skip mobile layout — admin will use CMS on tablets too
- ❌ Don't forget `prefers-reduced-motion` for animation accessibility — check `useReducedMotion()` hook
- ❌ Don't use `framer-motion` import — use `motion/react` (Framer Motion is now Motion)
- ❌ Don't over-animate in the CMS — keep animations subtle and functional (not decorative)
- ❌ Don't forget `AnimatePresence` for exit animations on all modals and overlays
- ❌ Don't animate layout-triggering properties (width/height) directly — use `transform` and `opacity` for 60fps

---

**Build it step by step. Test each phase before moving on. Good luck!** 🔧📊
