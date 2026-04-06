# Frontend Development Tasks — Main Website + Customer Account

**Developer:** Frontend Developer
**Project Duration:** 6 weeks
**Technology Stack:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS + Radix UI + Zod + React Hook Form + Lucide React + Motion (Framer Motion)
**Last Updated:** April 6, 2026

### Referenced Documents

- Business Requirements Document — `BRD.md`
- UI/UX Design Requirements — `UI-UX-Design-Requirements.md`
- Technical Specifications — `Technical-Specifications-Frontend-Backend.md`

**This project includes:**

1. Public Website (Home, Products, Product Detail, Services, About, Contact, FAQ)
2. Product Catalog with Filtering & Search
3. Shopping Cart System (Guest + Authenticated)
4. Customer Authentication (Register, Login, Email Verification, Password Reset)
5. Checkout & Payment Integration (Paymob Accept)
6. Customer Account Dashboard (Orders, Addresses, Profile)
7. Bilingual Support (Arabic RTL / English LTR)

**Out of Scope** (per BRD — do NOT implement):

- CMS / Admin panel (separate project — `FRONTEND-DASHBOARD-TASKS.md`)
- Inventory / Warehouse Management (WMS)
- ERP / Accounting integration
- Native mobile apps (responsive web only)
- Live chat / chatbot
- IoT / smart home integration
- Multi-currency (EGP only)
- Loyalty / rewards program
- Customer product reviews (testimonials are CMS-managed)
- SMS notifications
- Third-party shipping API integration

---

## **PHASE 1: PROJECT SETUP** (Day 1–2)

### Task 1.1: Initialize Next.js Project

- [ ] Create new Next.js app: `npx create-next-app@latest lord-website`
- [ ] Choose options: TypeScript ✅, ESLint ✅, Tailwind CSS ✅, App Router ✅, `src/` directory ❌, import alias `@/*` ✅
- [ ] Navigate to project folder: `cd lord-website`
- [ ] Start development server: `npm run dev`
- [ ] Verify app runs on `localhost:3000`

### Task 1.2: Install Essential Dependencies

```bash
# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-toast @radix-ui/react-checkbox @radix-ui/react-select @radix-ui/react-slider

# Form validation
npm install zod react-hook-form @hookform/resolvers

# Icons (per Tech Specs — Lucide React)
npm install lucide-react

# Toast notifications
npm install react-toastify

# Image carousel / slider
npm install swiper

# Cookie management (for language toggle + guest cart session)
npm install js-cookie
npm install -D @types/js-cookie

# Animation & Motion
npm install motion                           # Motion (formerly Framer Motion) — import from "motion/react"
npm install react-intersection-observer      # Viewport detection for scroll-triggered animations
npm install react-countup                    # Animated number counting (stats, dashboard)
npm install @formkit/auto-animate            # Zero-config list/layout animations (add/remove/reorder)
npm install lottie-react                     # Lottie JSON animations (loading, success, empty states)
```

> **Important — Motion (Framer Motion) Usage:**
>
> - Framer Motion has been rebranded to **Motion**. Install `motion` (not `framer-motion`).
> - Import from `"motion/react"` — e.g. `import { motion, AnimatePresence } from "motion/react"`
> - Key APIs: `<motion.div>`, `AnimatePresence`, `useScroll`, `useTransform`, `useInView`, `useSpring`, `stagger`, `spring`, `layout` prop
> - Respect `prefers-reduced-motion`: wrap animations in `useReducedMotion()` hook checks

### Task 1.3: Configure Tailwind CSS

- [ ] Add brand colors to `tailwind.config.ts`:

```typescript
// tailwind.config.ts
const config = {
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
      },
      fontFamily: {
        inter: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
        cairo: ["Cairo", "Noto Sans Arabic", "Segoe UI", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
      borderRadius: {
        card: "12px",
        button: "8px",
        input: "8px",
      },
    },
  },
};
```

- [ ] Import Google Fonts (Inter + Cairo) in `app/layout.tsx`
- [ ] Set up base styles in `app/globals.css` (body font, colors, etc.)

### Task 1.4: Project Structure Setup

```
app/
├── page.tsx                    # Home page
├── layout.tsx                  # Root layout (fonts, metadata, providers)
├── globals.css                 # Global styles
├── products/
│   ├── page.tsx               # Products listing page
│   └── [slug]/
│       └── page.tsx           # Product detail page
├── services/
│   └── page.tsx               # After-sales services page
├── about/
│   └── page.tsx               # About Lord page
├── contact/
│   └── page.tsx               # Contact page
├── faq/
│   └── page.tsx               # FAQ page
├── cart/
│   └── page.tsx               # Shopping cart page
├── checkout/
│   └── page.tsx               # Checkout page (multi-step)
├── order-confirmation/
│   └── [orderId]/
│       └── page.tsx           # Order confirmation page
├── login/
│   └── page.tsx               # Customer login
├── register/
│   └── page.tsx               # Customer registration
├── verify-email/
│   └── page.tsx               # Email OTP verification
├── forgot-password/
│   └── page.tsx               # Forgot password flow
├── account/                   # Customer dashboard (protected)
│   ├── layout.tsx             # Account layout (sidebar/tabs)
│   ├── page.tsx               # Account dashboard
│   ├── orders/
│   │   ├── page.tsx           # My orders list
│   │   └── [id]/
│   │       └── page.tsx       # Order detail page
│   ├── addresses/
│   │   └── page.tsx           # My addresses
│   └── profile/
│       └── page.tsx           # My profile + change password

components/
├── common/                    # Shared / reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Breadcrumb.tsx
│   ├── LoadingSpinner.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── QuantitySelector.tsx
│   ├── PriceDisplay.tsx
│   ├── OrderStatusBadge.tsx
│   ├── ImagePlaceholder.tsx
│   ├── LanguageToggle.tsx
│   ├── FloatingWhatsApp.tsx
│   ├── SeoHead.tsx
│   ├── MiniCart.tsx
│   └── CartBadge.tsx
├── home/                      # Home page sections
│   ├── HeroSection.tsx
│   ├── FeaturedProducts.tsx
│   ├── ServicesOverview.tsx
│   ├── WhyChooseLord.tsx
│   ├── TestimonialsCarousel.tsx
│   ├── CtaBand.tsx
│   └── ContactStrip.tsx
├── products/                  # Products page components
│   ├── ProductGrid.tsx
│   ├── ProductCard.tsx
│   ├── FilterSidebar.tsx
│   ├── SortDropdown.tsx
│   ├── BrandTabs.tsx
│   ├── QuickViewModal.tsx
│   └── EmptyState.tsx
├── product-detail/            # Product detail page
│   ├── ImageGallery.tsx
│   ├── ProductInfo.tsx
│   ├── SpecsTable.tsx
│   ├── RelatedProducts.tsx
│   └── AddToCartSection.tsx
├── services/                  # Services page components
│   ├── ServiceCard.tsx
│   └── ServiceDetail.tsx
├── about/                     # About page components
│   ├── CompanyStory.tsx
│   ├── MissionVision.tsx
│   ├── AuthorizedDealer.tsx
│   └── StatsSection.tsx
├── contact/                   # Contact page components
│   ├── ContactForm.tsx
│   ├── ContactInfo.tsx
│   ├── GoogleMap.tsx
│   └── SocialLinks.tsx
├── faq/                       # FAQ page components
│   ├── FaqAccordion.tsx
│   └── CategoryTabs.tsx
├── cart/                      # Cart page components
│   ├── CartItemList.tsx
│   ├── CartItem.tsx
│   ├── PriceSummary.tsx
│   ├── CouponInput.tsx
│   └── EmptyCart.tsx
├── checkout/                  # Checkout components
│   ├── CheckoutStepper.tsx
│   ├── ShippingAddressStep.tsx
│   ├── OrderReviewStep.tsx
│   ├── PaymentStep.tsx
│   ├── OrderSummary.tsx
│   └── GuestCheckoutForm.tsx
├── auth/                      # Authentication components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   ├── OtpInput.tsx
│   ├── ForgotPasswordForm.tsx
│   └── PasswordStrengthBar.tsx
└── account/                   # Customer account components
    ├── AccountSidebar.tsx
    ├── OrderCard.tsx
    ├── OrderTimeline.tsx
    ├── AddressCard.tsx
    ├── AddressForm.tsx
    └── ProfileForm.tsx

lib/
├── api.ts                     # API client (fetch wrapper)
├── auth.ts                    # Auth helpers (token management)
├── cart.ts                    # Cart helpers (localStorage for guest)
├── utils.ts                   # General utilities
├── validations.ts             # Zod schemas for forms
└── animations.ts              # Motion animation presets & variants

hooks/
├── useScrollReveal.ts         # Intersection observer + motion fade-in
├── useAnimatedCounter.ts      # Animated number counting hook
└── useReducedMotion.ts        # Reduced motion preference detection

context/
├── AuthContext.tsx             # Customer authentication state
├── CartContext.tsx             # Cart state (guest + authenticated)
└── LanguageContext.tsx         # Language toggle (AR/EN)

types/
├── product.ts                 # Product, Brand, Category types
├── cart.ts                    # Cart, CartItem types
├── order.ts                   # Order, OrderItem, Payment types
├── customer.ts                # Customer, Address types
├── service.ts                 # Service, ServiceType types
├── inquiry.ts                 # Inquiry, ServiceRequest types
└── common.ts                  # Shared types (ApiResponse, Pagination, etc.)

public/
└── images/                    # Static images, placeholder assets
```

### Task 1.5: Setup API Service

**File:** `lib/api.ts`

- [ ] Create fetch wrapper with base URL from environment variable
- [ ] Add JWT token to authenticated requests
- [ ] Handle 401 responses (auto-logout + redirect to login)
- [ ] Handle error responses consistently

```typescript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
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
    localStorage.removeItem("customerToken");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "API error");
  }

  return res.json();
}

// Public endpoints
export const fetchHomeContent = () => apiRequest("/content/home");
export const fetchProducts = (params: string) =>
  apiRequest(`/products?${params}`);
export const fetchProductBySlug = (slug: string) =>
  apiRequest(`/products/${slug}`);
export const fetchRelatedProducts = (slug: string) =>
  apiRequest(`/products/${slug}/related?limit=4`);
export const fetchBrands = () => apiRequest("/brands");
export const fetchProductCategories = () => apiRequest("/product-categories");
export const fetchServices = () => apiRequest("/services?active=true");
export const fetchServiceBySlug = (slug: string) =>
  apiRequest(`/services/${slug}`);
export const fetchServiceTypes = () => apiRequest("/service-types");
export const fetchAboutContent = () => apiRequest("/content/about");
export const fetchTestimonials = () =>
  apiRequest("/testimonials?approved=true&featured=true");
export const fetchFaqs = (category?: string) =>
  apiRequest(`/faqs?active=true${category ? `&category=${category}` : ""}`);
export const fetchContactSettings = () => apiRequest("/settings/contact");
export const fetchSiteSettings = () => apiRequest("/settings/site");
export const fetchShippingSettings = () => apiRequest("/settings/shipping");

// Inquiry & service request endpoints
export const submitInquiry = (data: any) =>
  apiRequest("/inquiries", { method: "POST", body: JSON.stringify(data) });
export const submitServiceRequest = (data: any) =>
  apiRequest("/service-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Cart endpoints
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
export const clearCart = () => apiRequest("/cart", { method: "DELETE" });
export const applyCoupon = (code: string) =>
  apiRequest("/cart/coupon", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
export const removeCoupon = () =>
  apiRequest("/cart/coupon", { method: "DELETE" });
export const mergeCart = () => apiRequest("/cart/merge", { method: "POST" });

// Customer auth endpoints
export const registerCustomer = (data: any) =>
  apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const verifyEmail = (email: string, otp: string) =>
  apiRequest("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
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
export const refreshToken = (refreshToken: string) =>
  apiRequest("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
export const forgotPassword = (email: string) =>
  apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
export const resetPassword = (
  email: string,
  otp: string,
  newPassword: string,
) =>
  apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, newPassword }),
  });

// Customer account endpoints
export const fetchProfile = () => apiRequest("/account/profile");
export const updateProfile = (data: any) =>
  apiRequest("/account/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const changePassword = (currentPassword: string, newPassword: string) =>
  apiRequest("/account/change-password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
export const fetchAddresses = () => apiRequest("/account/addresses");
export const addAddress = (data: any) =>
  apiRequest("/account/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateAddress = (id: string, data: any) =>
  apiRequest(`/account/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
export const deleteAddress = (id: string) =>
  apiRequest(`/account/addresses/${id}`, { method: "DELETE" });
export const setDefaultAddress = (id: string) =>
  apiRequest(`/account/addresses/${id}/default`, { method: "PATCH" });
export const fetchOrders = (params?: string) =>
  apiRequest(`/account/orders${params ? `?${params}` : ""}`);
export const fetchOrderDetail = (id: string) =>
  apiRequest(`/account/orders/${id}`);
export const cancelOrder = (id: string) =>
  apiRequest(`/account/orders/${id}/cancel`, { method: "POST" });

// Checkout & payment endpoints
export const createOrder = (data: any) =>
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
export const trackOrder = (orderNumber: string, email: string) =>
  apiRequest(`/orders/track/${orderNumber}?email=${email}`);
```

### Task 1.6: Setup Authentication Context

**File:** `context/AuthContext.tsx`

- [ ] Create context for customer authentication
- [ ] Store access token and refresh token in localStorage
- [ ] Provide `login()`, `logout()`, `register()`, `isAuthenticated` state
- [ ] On mount: check for existing token, verify it, set customer data
- [ ] On login: merge guest cart into customer cart via `POST /api/cart/merge`
- [ ] Auto-refresh access token before expiry using refresh token

### Task 1.7: Setup Cart Context

**File:** `context/CartContext.tsx`

- [ ] Create context for shopping cart state
- [ ] **Guest cart:** Store in localStorage under key `lord_cart`; read on mount
- [ ] **Authenticated cart:** Fetch from `GET /api/cart` on mount (when logged in)
- [ ] **Cart merge on login:** Call `POST /api/cart/merge` after login; then fetch server cart
- [ ] Provide: `items[]`, `itemCount`, `subtotal`, `addItem()`, `updateQuantity()`, `removeItem()`, `clearCart()`, `applyCoupon()`, `removeCoupon()`
- [ ] Cart badge count updates across all pages via context
- [ ] Debounce quantity updates (500ms) before API call

### Task 1.8: Setup TypeScript Types

**File:** `types/` directory

- [ ] Create all TypeScript interfaces matching API response shapes from Tech Specs
- [ ] Product, Brand, ProductCategory, ProductImage
- [ ] Cart, CartItem
- [ ] Order, OrderItem, OrderStatusHistory, Payment
- [ ] Customer, CustomerAddress (Customer includes `nationalId: string`)
- [ ] Service, ServiceType
- [ ] Inquiry, ServiceRequest (ServiceRequest includes `installationAddress?: string`)
- [ ] Testimonial, FAQ, ContentPage, SiteSettings
- [ ] Common: ApiResponse, PaginatedResponse, etc.

### Task 1.9: Setup Animation Utilities & Presets

**File:** `lib/animations.ts`

- [ ] Create reusable Motion animation variant presets:

```typescript
// lib/animations.ts
import { type Variants } from "motion/react";

// Fade in from below (for scroll reveals)
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Fade in from left (for LTR content)
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Fade in from right (for RTL content)
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Scale up (for cards, modals)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Stagger children (for grids, lists)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// Stagger item (child of staggerContainer)
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Slide down (for dropdowns, mini-cart)
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

// Slide in from right (for mobile menu, drawers)
export const slideInRight: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: { x: "100%", transition: { duration: 0.2, ease: "easeIn" } },
};

// Backdrop overlay fade
export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Cart badge bounce
export const badgeBounce: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

// Page transition
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

// Floating action button pulse
export const floatingPulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

// Skeleton shimmer (CSS keyframe alternative in Tailwind)
export const shimmer: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
  },
};
```

**File:** `hooks/useScrollReveal.ts`

- [ ] Create custom hook combining `react-intersection-observer` with Motion:

```typescript
import { useInView } from "react-intersection-observer";
import { useAnimation } from "motion/react";
import { useEffect } from "react";

export function useScrollReveal(threshold = 0.15) {
  const controls = useAnimation();
  const { ref, inView } = useInView({ threshold, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  return { ref, controls, inView };
}
```

**File:** `hooks/useReducedMotion.ts`

- [ ] Detect `prefers-reduced-motion` media query; disable non-essential animations when active
- [ ] Provide `shouldAnimate` boolean; all animated components should check this

---

## **PHASE 2: LAYOUT & SHARED COMPONENTS** (Day 3–5)

### Task 2.1: Create Navbar Component

**File:** `components/common/Navbar.tsx`

- [ ] Lord full logo (primary), max-height 48px, left-aligned
- [ ] Navigation links: Home, Products, Services, About, Contact — center-aligned
- [ ] Active link: Lord Teal `#0DBACA` with 2px underline bar
- [ ] Language toggle (AR / EN) — right side
- [ ] CTA button: "Request Service" — Primary button (Teal)
- [ ] **Cart icon** (ShoppingCart from Lucide) — right side, before CTA
  - Item count badge: Teal circle, White text, 18px, positioned top-right of icon
  - Click → opens `MiniCart` dropdown
  - Cart state from `CartContext`
- [ ] **Account menu** (UserCircle from Lucide) — right side
  - Logged out: shows "Login / Register" link
  - Logged in: shows dropdown with customer name, "My Orders", "My Addresses", "Profile", "Logout"
- [ ] Mobile: hamburger icon → full-screen slide-in overlay from right (includes cart + account links)
- [ ] Height: 72px desktop, 64px mobile
- [ ] Background: White; on scroll: `backdrop-filter: blur(12px)` + subtle shadow
- [ ] Sticky position

**Motion Animations (Navbar):**

- [ ] **Navbar reveal on load:** `motion.header` with `initial={{ y: -72 }}` → `animate={{ y: 0 }}` (spring, damping: 20)
- [ ] **Scroll shadow:** Use `useScroll()` + `useTransform()` from `motion/react` to animate `boxShadow` and `backdropFilter` based on scroll position
- [ ] **Nav link hover:** `motion.a` with `whileHover={{ color: "#0DBACA" }}` + animated Teal underline bar using `layoutId="activeLink"` for shared layout animation between active links
- [ ] **Account dropdown:** Wrap in `AnimatePresence` → `motion.div` with `slideDown` variant (fade + slide from top)
- [ ] **Mobile menu:** `AnimatePresence` → backdrop `motion.div` with `overlayFade` + menu panel `motion.nav` with `slideInRight` variant (spring physics); stagger nav items with `staggerContainer` / `staggerItem`
- [ ] **Hamburger icon:** Animate hamburger ↔ X morphing using `motion.span` with rotation + position transitions

**Styling:**

- Desktop: `flex items-center justify-between max-w-[1280px] mx-auto`
- Mobile menu: full-screen overlay with `AnimatePresence` + `slideInRight` animation
- Active link underline: animated `motion.span layoutId="navIndicator"` for smooth sliding underline between links

### Task 2.2: Create Mini Cart Dropdown

**File:** `components/common/MiniCart.tsx`

- [ ] Triggered from navbar cart icon click
- [ ] Width: 360px
- [ ] Scrollable item list (max 4 visible): thumbnail (48px), name, qty, price
- [ ] Footer: Subtotal (bold) + "View Cart" (Secondary button → `/cart`) + "Checkout" (Primary button → `/checkout`)
- [ ] Empty state: cart icon illustration + "Your cart is empty" + "Browse Products" link; use **Lottie** animation for empty cart illustration (`lottie-react`)
- [ ] Close on: click outside, Escape key, X button
- [ ] Data from `CartContext`

**Motion Animations (MiniCart):**

- [ ] Wrap entire dropdown in `AnimatePresence mode="wait"` → `motion.div` with `slideDown` variant (opacity 0→1, y -10→0, height 0→auto)
- [ ] **Cart items:** Use `@formkit/auto-animate` on the items list container for automatic add/remove item animations
- [ ] **Item remove:** `AnimatePresence` → item exits with `opacity: 0, x: -20, height: 0` transition
- [ ] **Subtotal number:** Animate price change with `motion.span` using `key={subtotal}` for re-render animation

### Task 2.3: Create Footer Component

**File:** `components/common/Footer.tsx`

- [ ] Background: Navy `#172041`
- [ ] 4-column layout (desktop): Logo + tagline + Carrier/Midea logos | Quick Links | Services | Contact Info
- [ ] Quick Links: Home, Products, Services, About, Contact, FAQ
- [ ] Services: Installation, Maintenance, Repair, Delivery, Spare Parts
- [ ] Contact Info: Address, Phone (tel: link), WhatsApp (wa.me/ link), Email (mailto: link)
- [ ] Link hover color: Teal `#0DBACA`
- [ ] Bottom bar: Copyright "© 2026 Lord Air Conditioning" + social media icons (Facebook, Instagram, WhatsApp)
- [ ] Separator: `1px solid rgba(255,255,255,0.1)`
- [ ] Mobile: single-column stacked, collapsible sections with `AnimatePresence` collapse/expand animation
- [ ] Data: Fetch from `GET /api/settings/contact` and `GET /api/brands`

**Motion Animations (Footer):**

- [ ] **Scroll reveal:** Entire footer fades in when scrolled into view using `useScrollReveal()` + `fadeInUp` variants
- [ ] **Column stagger:** 4 footer columns animate in with `staggerContainer` / `staggerItem` (0.1s delay between columns)
- [ ] **Link hover:** `motion.a` with `whileHover={{ x: 4 }}` (subtle right-shift) + color transition to Teal
- [ ] **Social icons:** `motion.a` with `whileHover={{ scale: 1.15, y: -2 }}` + `whileTap={{ scale: 0.95 }}`
- [ ] **Mobile collapsible sections:** `AnimatePresence` + `motion.div` with height auto-animation for accordion-style expand/collapse

### Task 2.4: Create Shared Components

**File:** `components/common/`

- [ ] **Breadcrumb.tsx** — `body-sm` (14px), Medium Gray, ">" separator, last item Navy; uses array of `{label, href}` props
- [ ] **LoadingSpinner.tsx** — Lord fan icon (from logo "O") rotating 360° continuously using `motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}`; OR use **Lottie** animation (`lottie-react`) with a custom Lord-branded loading animation JSON; center on screen
- [ ] **Button.tsx** — Reusable with variants: Primary (Teal bg, White text), Secondary (transparent, Navy border), Ghost (transparent, Teal text), Danger (Red bg, White text); sizes: Small (36px), Medium (44px), Large (48px); disabled + loading states; **Motion:** `motion.button` with `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.98 }}`, loading state spinner uses `motion.span animate={{ rotate: 360 }}`
- [ ] **Card.tsx** — White bg, `1px solid #E8EAED`, 12px radius, 24px padding; **Motion:** `motion.div` with `whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(23,32,65,0.12)" }}` transition (200ms spring)
- [ ] **QuantitySelector.tsx** — Reusable −/+ buttons with number input; min/max props; debounced onChange (500ms); `min 1, max = stockQuantity`
- [ ] **PriceDisplay.tsx** — Handles sale price (strike-through original), currency formatting "EGP X,XXX", "Out of Stock" badge
- [ ] **OrderStatusBadge.tsx** — Color-coded badge per status: Confirmed (Info Blue), Processing (Amber), Shipped (Teal), Delivered (Green), Cancelled (Red), Refunded (Gray)
- [ ] **ImagePlaceholder.tsx** — Light Gray `#F1F3F5` with Lord icon mark, shimmer animation while loading
- [ ] **LanguageToggle.tsx** — "AR" / "EN" text button; persisted in cookie/localStorage; triggers `dir` attribute swap on `<html>`
- [ ] **FloatingWhatsApp.tsx** — Fixed bottom-right, 60px circle, Green `#25D366`, WhatsApp icon (white), links to `https://wa.me/{number}`; **Motion:** `motion.a` with `whileHover={{ scale: 1.1 }}`, `whileTap={{ scale: 0.95 }}`, idle `floatingPulse` animation (subtle scale breathing 1→1.05→1 every 2s), entrance animation: `initial={{ scale: 0, opacity: 0 }}` → `animate={{ scale: 1, opacity: 1 }}` with spring (delay 1s after page load)
- [ ] **SeoHead.tsx** — Dynamic `<title>`, `<meta description>`, Open Graph tags, JSON-LD schema markup per page
- [ ] **CartBadge.tsx** — Teal circle with White item count; **Motion:** `motion.span` with `key={itemCount}` to trigger re-mount animation; uses `badgeBounce` variant (scale 1→1.3→1, 400ms); `AnimatePresence` for badge appear/disappear when count goes from 0↔1+

### Task 2.5: Create Toast Notification Setup

- [ ] Configure react-toastify with 4 variants matching UI/UX spec:
  - Success: green left border `#28A745`, green bg `#F0FFF4`
  - Error: red left border `#DC3545`, red bg `#FFF5F5`
  - Warning: amber left border `#FFC107`, amber bg `#FFFBEB`
  - Info: blue left border `#17A2B8`, blue bg `#F0F9FF`
- [ ] Toast position: top-right, slide-in animation

### Task 2.6: Page Transition Wrapper

**File:** `components/common/PageTransition.tsx`

- [ ] Create a reusable page transition wrapper using `motion.div` with `pageTransition` variants
- [ ] Wrap all page content in `<PageTransition>` for consistent enter/exit animations
- [ ] Use `AnimatePresence mode="wait"` in root layout to enable exit animations between route changes
- [ ] Animation: fade + subtle Y translate (8px) — 300ms ease-out enter, 150ms ease-in exit
- [ ] Respect `prefers-reduced-motion` — disable transition if user prefers reduced motion

### Task 2.7: Scroll Reveal Section Wrapper

**File:** `components/common/ScrollReveal.tsx`

- [ ] Reusable wrapper component that triggers `fadeInUp` animation when section scrolls into viewport
- [ ] Uses `useScrollReveal()` hook (intersection observer + motion controls)
- [ ] Props: `direction` ("up" | "left" | "right" | "scale"), `delay` (number), `duration` (number), `once` (boolean, default true)
- [ ] Usage: wrap any section → `<ScrollReveal direction="up" delay={0.2}>...</ScrollReveal>`
- [ ] Check `useReducedMotion()` — if true, render children without animation wrapper

---

## **PHASE 3: HOME PAGE** (Day 6–8)

### Task 3.1: Hero Section

**File:** `components/home/HeroSection.tsx`

- [ ] Full-width hero with Lord branding
- [ ] Headline: "Authorized Carrier & Midea Dealer" (`display-xl`, 56px desktop / 36px mobile, Extra Bold 800)
- [ ] Tagline: "Air Conditioning — Since 1986" (`body-lg`, 18px)
- [ ] Authorized dealer badges: Carrier oval logo + Midea logo (equal size, side by side, min 80px each)
- [ ] Dual CTA buttons:
  - **"Shop Now"** → Primary button (Teal) → links to `/products`
  - **"Our Services"** → Secondary button (transparent, Navy border) → links to `/services`
- [ ] Background: White or subtle gradient (Teal → Frost `#0DBACA` → `#4DB8D4`)
- [ ] Vertical padding: 96px desktop, 48px mobile

**Motion Animations (Hero):**

- [ ] **Headline:** `motion.h1` with `initial={{ opacity: 0, y: 30 }}` → `animate={{ opacity: 1, y: 0 }}` (duration: 0.7s, ease: easeOut, delay: 0.1)
- [ ] **Tagline:** `motion.p` same as headline with delay: 0.3s
- [ ] **CTA buttons:** `motion.div` container with `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}` (delay: 0.5s); buttons have `whileHover={{ scale: 1.03 }}` + `whileTap={{ scale: 0.97 }}`
- [ ] **Brand logos:** `motion.div` with `initial={{ opacity: 0, scale: 0.8 }}` → `animate={{ opacity: 1, scale: 1 }}` (delay: 0.7s, spring animation)
- [ ] **Animated snowflake/wind motif:** Use floating `motion.div` particles with `animate={{ y: [0, -15, 0], x: [0, 5, 0], rotate: [0, 180, 360] }}` on `repeat: Infinity` (duration: 8s, ease: linear); respect `prefers-reduced-motion`
- [ ] **Background gradient shift:** Optional — subtle animated gradient using `motion.div` with `animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}` (very slow, 15s cycle)

**API Integration:**

- [ ] Fetch from `GET /api/content/home` — hero text, tagline, CTA labels
- [ ] Fetch from `GET /api/brands` — Carrier/Midea logos, authorized dealer badge info

### Task 3.2: Featured Products Section

**File:** `components/home/FeaturedProducts.tsx`

- [ ] Section title: "Featured Products" (`display-lg`, 44px Bold)
- [ ] 4-column product card grid (desktop), 2-column (tablet), 1-column (mobile)
- [ ] Uses `ProductCard` component (see Task 4.2)
- [ ] "View All Products" link → `/products`
- [ ] Background: Off-White `#F8FAFB`, padding 64px vertical

**Motion Animations (Featured Products):**

- [ ] **Section title:** `ScrollReveal direction="up"` wrapper
- [ ] **Product cards grid:** `motion.div` with `staggerContainer` variant; each `ProductCard` wrapped in `motion.div` with `staggerItem` variant (stagger delay: 0.1s between cards)
- [ ] **Cards enter:** Fade in + translate Y 20px→0 as they scroll into view (triggerOnce)

**API Integration:**

- [ ] Fetch from `GET /api/products?featured=true&limit=8`

### Task 3.3: Services Overview Section

**File:** `components/home/ServicesOverview.tsx`

- [ ] Section title: "Our Services" (`display-lg`)
- [ ] 5 icon cards in horizontal row (desktop), wrap to 2+3 or stack on mobile
- [ ] **Service Card:** Icon (48px, Teal) → Service name (`heading-3`) → Description 2 lines max (`body-sm`) → "Learn More" Ghost link
- [ ] Services: Installation, Periodic Maintenance, Emergency Repair, Spare Parts, Delivery
- [ ] Background: White, padding 64px vertical

**Motion Animations (Services Overview):**

- [ ] **Section title:** `ScrollReveal direction="up"`
- [ ] **Service cards:** `staggerContainer` → each card as `staggerItem` with stagger delay 0.15s
- [ ] **Icon animation:** `motion.div` with `whileInView={{ rotate: [0, -10, 10, 0] }}` on the service icon (subtle attention-getting wiggle on scroll into view, triggerOnce)
- [ ] **Card hover:** `motion.div` with `whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(23,32,65,0.12)" }}`

**API Integration:**

- [ ] Fetch from `GET /api/services?active=true`

### Task 3.4: Why Choose Lord Section

**File:** `components/home/WhyChooseLord.tsx`

- [ ] 4 stat cards in a row (2x2 on mobile)
- [ ] **Stat Card:** Large number (`display-lg`, Teal `#0DBACA`) → Label (`body-sm`, Medium Gray)
- [ ] Stats: "Since 1986", "XX+ Units Installed", "Authorized Dealer", "Full After-Sales Support"
- [ ] Background: Off-White `#F8FAFB`

**Motion Animations (Why Choose Lord):**

- [ ] **Stat cards stagger:** `staggerContainer` wrapper → each stat card as `staggerItem` (fade up + stagger 0.15s)
- [ ] **Animated counters:** Use `react-countup` with `enableScrollSpy` so numbers count up when scrolled into view: `<CountUp end={1986} duration={2.5} enableScrollSpy scrollSpyOnce />`; format with commas for large numbers
- [ ] **Stat card hover:** `motion.div` with `whileHover={{ scale: 1.03, y: -4 }}` (spring transition)
- [ ] **Icon circle pulse:** Teal icon circles animate `scale: [1, 1.1, 1]` once on scroll into view

**API Integration:**

- [ ] Stats from `GET /api/content/home` (stats JSON field)

### Task 3.5: Testimonials Carousel

**File:** `components/home/TestimonialsCarousel.tsx`

- [ ] Auto-rotating carousel (5s interval, pause on hover)
- [ ] **Testimonial Card:** Star rating (Amber `#FFC107`) → Quote text (`body-lg`, italic) → Customer name + location (`body-sm`)
- [ ] Background: Navy `#172041`, text White, padding 64px vertical
- [ ] Navigation arrows + dot indicators
- [ ] Use Swiper library for carousel

**Motion Animations (Testimonials):**

- [ ] **Section reveal:** `ScrollReveal direction="up"` on entire section
- [ ] **Slide transition:** Swiper `fadeEffect` or custom — each testimonial card fades + scales in (`scaleIn` variant)
- [ ] **Star rating:** Stars animate in one-by-one with 0.1s stagger delay using `motion.span` (scale 0→1, spring)
- [ ] **Quote marks:** Large decorative quote marks animate `opacity: 0→0.2` + `scale: 0.5→1` (decorative background element)
- [ ] **Navigation arrows:** `motion.button` with `whileHover={{ scale: 1.1 }}` + `whileTap={{ scale: 0.9 }}`

**API Integration:**

- [ ] Fetch from `GET /api/testimonials?approved=true&featured=true`

### Task 3.6: CTA Band

**File:** `components/home/CtaBand.tsx`

- [ ] Full-width Teal gradient (`#0DBACA` → `#4DB8D4`)
- [ ] Headline: "Need help choosing? Request a free consultation" (White, `heading-2`)
- [ ] CTA button: "Contact Us" — Secondary style (White border on Teal bg) → links to `/contact`
- [ ] Padding: 48px vertical

**Motion Animations (CTA Band):**

- [ ] `ScrollReveal direction="up"` wrapper
- [ ] Headline text uses `motion.h2` with typewriter-style fade (`initial={{ opacity: 0, y: 10 }}` → `animate={{ opacity: 1, y: 0 }}`)
- [ ] CTA button: `whileHover={{ scale: 1.05 }}` + `whileTap={{ scale: 0.95 }}` with subtle glow effect on hover

### Task 3.7: Contact Strip

**File:** `components/home/ContactStrip.tsx`

- [ ] Address, phone (clickable `tel:` link), WhatsApp (clickable `wa.me/` link), email, working hours
- [ ] Embedded Google Maps thumbnail → links to `/contact`
- [ ] Icon for each item (MapPin, Phone, MessageCircle, Mail, Clock from Lucide)

**Motion Animations (Contact Strip):**

- [ ] **Icon items:** Stagger animation — each contact info item fades in from left with 0.1s stagger
- [ ] **Icon hover:** `motion.div` with `whileHover={{ scale: 1.1, color: "#0DBACA" }}`

**API Integration:**

- [ ] Fetch from `GET /api/settings/contact`

### Task 3.8: Assemble Home Page

**File:** `app/page.tsx`

- [ ] Import all home sections
- [ ] Arrange in order: Hero → Featured Products → Services Overview → Why Choose Lord → Testimonials → CTA Band → Contact Strip
- [ ] **Scroll reveal animations:** Each section wrapped in `<ScrollReveal>` component — triggers `fadeInUp` animation on viewport entry using `react-intersection-observer` + Motion; `triggerOnce: true`
- [ ] **Page transition:** Wrap entire page content in `<PageTransition>` for route enter/exit animation
- [ ] **Scroll progress indicator:** Optional — `motion.div` fixed at top, width animated by `useScroll()` + `useTransform(scrollYProgress, [0,1], ["0%", "100%"])` — Teal gradient bar showing scroll progress
- [ ] Loading states for each section — use skeleton shimmer animation
- [ ] Error handling (graceful fallback)
- [ ] SEO: JSON-LD `LocalBusiness` schema + dynamic meta tags

---

## **PHASE 4: PRODUCTS PAGE & PRODUCT DETAIL** (Day 9–14)

### Task 4.1: Products Listing Page

**File:** `app/products/page.tsx`

- [ ] Page header: Breadcrumb (Home > Products), title "Our Products" (`heading-1`), product count "Showing X of Y products"
- [ ] Layout: Filter sidebar (left, 240px, desktop) + product grid (right)
- [ ] Tablet: collapsible horizontal filter bar
- [ ] Mobile: "Filter" button → bottom sheet / modal
- [ ] Sort dropdown above grid
- [ ] Pagination at bottom
- [ ] Loading state: skeleton cards
- [ ] SEO: dynamic meta tags

**API Integration:**

- [ ] Fetch from `GET /api/products` with query params (brand, type, capacity, price, search, sort, page, limit)
- [ ] Fetch from `GET /api/brands` for filter options
- [ ] Fetch from `GET /api/product-categories` for type filter options

### Task 4.2: Product Card Component

**File:** `components/products/ProductCard.tsx`

- [ ] Image container (1:1 ratio, 12px top corners, light gray placeholder while loading)
- [ ] Brand badge: top-left overlay (Carrier = Navy `#172041`, Midea = Teal `#0DBACA`, 12px caption, White text)
- [ ] Optional badges: "New Arrival" (Green), "Bestseller" (Red), "Featured" (Amber)
- [ ] Product name (`heading-3`, 22px Semi-Bold)
- [ ] Capacity + Type (`body-sm`, Medium Gray)
- [ ] Price (`heading-4`, Teal `#0DBACA`); or "Out of Stock" badge if `stockQuantity = 0`
- [ ] **"Add to Cart"** Primary button (Teal); disabled with "Out of Stock" if stock = 0
- [ ] Quick View eye icon on hover → opens `QuickViewModal`
- [ ] Card: White bg, `1px solid #E8EAED`, 12px radius, 24px padding

**Motion Animations (Product Card):**

- [ ] **Card hover:** `motion.div` with `whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(23,32,65,0.12)" }}` (spring transition, 200ms)
- [ ] **Image hover zoom:** `motion.img` inside `overflow-hidden` container → `whileHover={{ scale: 1.08 }}` (300ms ease-out)
- [ ] **Quick View icon:** Appears on card hover with `motion.button` `initial={{ opacity: 0, scale: 0.8 }}` → parent hover triggers `animate={{ opacity: 1, scale: 1 }}`
- [ ] **Add to Cart button:** `motion.button` with `whileTap={{ scale: 0.95 }}`; on click: animate to checkmark — spinner rotates (`motion.span rotate: 360`), then morphs to green checkmark with `AnimatePresence mode="wait"` switching between Cart icon → Spinner → Checkmark
- [ ] **Badge entrance:** Brand badge uses `motion.span` with `initial={{ opacity: 0, x: -10 }}` → `animate={{ opacity: 1, x: 0 }}` (delay: 0.2s)
- [ ] Product name links to `/products/[slug]`

### Task 4.3: Filter Sidebar

**File:** `components/products/FilterSidebar.tsx`

- [ ] **Brand:** Checkboxes (Carrier, Midea) with brand logos
- [ ] **Type:** Multi-select checkboxes (Split, Multi-Split, Cassette, Duct, Central, VRF/VRV, Window, Portable)
- [ ] **Capacity:** Range slider (BTU/ton)
- [ ] **Price:** Range slider (EGP)
- [ ] "Clear All Filters" button (Ghost style)
- [ ] Active filter tags displayed as removable badges above product grid; use `@formkit/auto-animate` on the filter tags container for automatic add/remove animations
- [ ] On filter change: update URL query params + re-fetch products

**Motion Animations (Filter Sidebar):**

- [ ] **Mobile bottom sheet:** `AnimatePresence` → `motion.div` slides up from bottom (`initial={{ y: "100%" }}` → `animate={{ y: 0 }}`, spring) with backdrop `overlayFade`
- [ ] **Filter section expand/collapse:** `motion.div` with `animate={{ height: "auto" }}` using `layout` prop for smooth accordion
- [ ] **Active filter tags:** `AnimatePresence` → each tag uses `motion.span` with `initial={{ opacity: 0, scale: 0.8 }}` → `animate={{ opacity: 1, scale: 1 }}` → `exit={{ opacity: 0, scale: 0.8, width: 0 }}`
- [ ] **Product grid re-render:** Use `@formkit/auto-animate` on the product grid container — products animate in/out when filters change (fade + translate)

### Task 4.4: Sort Dropdown & Brand Tabs

**File:** `components/products/SortDropdown.tsx` + `components/products/BrandTabs.tsx`

- [ ] Sort dropdown: Price (Low → High), Price (High → Low), Name (A–Z), Newest First
- [ ] Brand tabs (optional): "All" | "Carrier" | "Midea" — above sort, below page header

### Task 4.5: Quick View Modal

**File:** `components/products/QuickViewModal.tsx`

- [ ] Radix UI dialog modal (640px max-width)
- [ ] Product image, specs summary, price, quantity selector, "Add to Cart" button
- [ ] "View Full Details" link → `/products/[slug]`

**Motion Animations (Quick View Modal):**

- [ ] **Backdrop:** `motion.div` with `overlayFade` variant (fade in/out)
- [ ] **Modal content:** `motion.div` with `scaleIn` variant (`initial={{ opacity: 0, scale: 0.9 }}` → `animate={{ opacity: 1, scale: 1 }}`, spring) + `exit={{ opacity: 0, scale: 0.95 }}`
- [ ] **Content stagger:** Image and info sections stagger in with 0.1s delay

### Task 4.6: Product Detail Page

**File:** `app/products/[slug]/page.tsx`

- [ ] **Breadcrumb:** Home > Products > [Brand] > [Product Name]
- [ ] **Image Gallery** (left column, 50% desktop):
  - Main image (large, 16:9 or 4:3 ratio)
  - Thumbnail strip below (horizontal scroll, 5 visible)
  - Click thumbnail → update main image
  - Click main image → lightbox with zoom using `motion.img` with `layoutId="product-image"` for shared layout transition (seamless expand from gallery to lightbox); zoom: `animate={{ scale: 1.5 }}` with pan gesture
  - Swipe on mobile touch devices — use `motion.div drag="x"` for swipe gesture support
  - Brand badge: top-right of main image
- [ ] **Product Info** (right column, 50% desktop):
  - Brand logo (40px height) + "Authorized Dealer" badge (shield shape, Navy border, 8px radius)
  - Product name (`heading-1`, 36px Bold)
  - Model number (`body-sm`, Medium Gray)
  - Capacity + Type (`body-lg`)
  - Price: large bold (`display-lg`, Teal); strike-through original price if on sale
  - **Stock indicator:** Green "In Stock" or Red "Out of Stock" badge
  - **Quantity selector:** −/+ buttons with number input; min 1, max = `stockQuantity`; default 1
  - **Feature highlights:** checkmark icon list (Teal checkmarks)
  - **CTA Section:**
    - "Add to Cart" → Primary button (Large, 48px, Teal); on click: spinner → checkmark + "Added!"
    - "Buy Now" → Secondary button (Navy border) → adds to cart + redirects to `/checkout`
    - "Contact Us" → Ghost link with phone icon
- [ ] **Specifications Table:** Two-column key-value table (Brand, Model, Type, Capacity, EER/SEER, Voltage, Refrigerant, Dimensions, Weight, Color, Warranty)
- [ ] **Product Description:** Rich text from CMS
- [ ] **Related Products:** "You May Also Like" — 4 product cards, horizontal scroll on mobile; use `staggerContainer` + `staggerItem` for card entrance animations
- [ ] **Mobile:** Stacked — Image → Info → Specs → Description → Related
- [ ] **SEO:** JSON-LD `Product` schema with `offers`, `price`, `availability`

**Motion Animations (Product Detail):**

- [ ] **Image gallery:** `motion.img` with `layoutId` for smooth image swapping; thumbnail-to-main transition animates size + position
- [ ] **Product info:** `fadeInRight` animation (stagger: name → model → price → stock → CTAs, 0.1s between)
- [ ] **Specs table rows:** `staggerContainer` → each row fades in from left with 0.05s stagger on scroll into view
- [ ] **Add to Cart button:** `whileTap={{ scale: 0.95 }}`; success state: `AnimatePresence` toggles between cart icon → spinner → animated green checkmark (Lottie "success" animation)
- [ ] **Quantity selector:** `motion.span` on the number — `key={quantity}` for re-mount animation (subtle scale bounce on change)
- [ ] **Tab content (Specs/Description):** `AnimatePresence mode="wait"` — tab content fades out/in on tab switch

**API Integration:**

- [ ] Fetch from `GET /api/products/:slug` — full product details
- [ ] Fetch from `GET /api/products/:slug/related?limit=4` — related products

---

## **PHASE 5: SERVICES, ABOUT, CONTACT, FAQ PAGES** (Day 15–18)

### Task 5.1: After-Sales Services Page

**File:** `app/services/page.tsx`

- [ ] Breadcrumb: Home > Services
- [ ] Title: "Our Services" (`heading-1`)
- [ ] Tagline: "Complete after-sales support for your air conditioning" (`body-lg`, Medium Gray)
- [ ] 5 service cards (3-column desktop, 2-column tablet, 1-column mobile):
  - Installation, Periodic Maintenance, Emergency Repair, Spare Parts Supply, Delivery
  - **Service Card:** Icon (48px, Teal) → Name (`heading-3`) → Description → "What's included" expandable list → Applicable unit types badges → "Request This Service" Primary CTA
  - Card: White bg, 12px radius, 24px padding; `motion.div whileHover={{ y: -6 }}` with shadow transition
- [ ] Service detail sections: click/scroll to full description, scope, inclusions; expandable sections use `AnimatePresence` + `motion.div` with height auto-animation
- [ ] CTA Band (bottom): "Need urgent service? Call us now" + phone + WhatsApp button (Navy bg, White text)

**Motion Animations (Services Page):**

- [ ] **Service cards:** `staggerContainer` → `staggerItem` with `fadeInUp` per card (stagger 0.12s)
- [ ] **Service icon:** `motion.div whileInView={{ rotate: [0, -5, 5, 0] }}` subtle wiggle on scroll into view
- [ ] **Expandable detail:** `AnimatePresence` → `motion.div initial={{ height: 0, opacity: 0 }}` → `animate={{ height: "auto", opacity: 1 }}` with `layout` prop
- [ ] **CTA Band:** `ScrollReveal direction="up"` + button `whileHover={{ scale: 1.05 }}`

**API Integration:**

- [ ] Fetch from `GET /api/services?active=true`
- [ ] Fetch from `GET /api/service-types`

### Task 5.2: About Page

**File:** `app/about/page.tsx`

- [ ] Breadcrumb: Home > About
- [ ] Company Story section: narrative text, optional milestone timeline (1986 → present)
- [ ] Mission / Vision cards: side-by-side (desktop), stacked (mobile)
- [ ] Authorized Dealer section: Carrier logo + certificate + Midea logo + certificate (lightbox on click)
- [ ] Stats section: 4 stat cards (Years in business, Units installed, Customers served, Service visits) — Off-White bg; **use `react-countup` with `enableScrollSpy` for animated number counting**
- [ ] Team / Credentials section

**Motion Animations (About Page):**

- [ ] **Company story:** `ScrollReveal direction="left"` for text; timeline milestones stagger in from alternating left/right using `motion.div` with `whileInView` and stagger
- [ ] **Mission/Vision cards:** `staggerContainer` → 2 cards stagger in (0.2s delay)
- [ ] **Dealer certificates:** `motion.img whileHover={{ scale: 1.03 }}` — lightbox uses `layoutId` shared layout for smooth expand
- [ ] **Stats counters:** `react-countup enableScrollSpy` counts up when in view; cards use `staggerItem`

**API Integration:**

- [ ] Fetch from `GET /api/content/about`
- [ ] Fetch from `GET /api/brands`

### Task 5.3: Contact Page

**File:** `app/contact/page.tsx`

- [ ] Layout: Two-column desktop (form left, info right), stacked on mobile
- [ ] **Contact Form** (left):
  - Fields: Name (required), Email (required), Phone (required), Inquiry Type (dropdown: Purchase Inquiry, Order Support, Installation, Maintenance, Repair, Delivery, General), Message (textarea, required)
  - Client-side validation: Zod + React Hook Form
  - Submit button: "Send Message" Primary (Large, Teal)
  - Error state: Red border + 13px error text below field
  - Success: green checkmark + toast "Thank you! We'll contact you within 1 hour."
  - Loading: button disabled with spinner
  - **Motion:** Submit button uses `motion.button whileTap={{ scale: 0.97 }}`; on success, form fields reset with `@formkit/auto-animate` on form container; success checkmark uses **Lottie** animation
- [ ] **Contact Information** (right): Address, Phone (tel:), WhatsApp (wa.me/), Email (mailto:), Working hours, Social icons (Facebook, Instagram, WhatsApp)

**Motion Animations (Contact Page):**

- [ ] **Two-column layout:** Left column `fadeInLeft`, right column `fadeInRight` (scroll triggered)
- [ ] **Contact info items:** `staggerContainer` → each item (address, phone, etc.) as `staggerItem` fading in from right
- [ ] **Social icons:** `motion.a whileHover={{ scale: 1.15, y: -2 }}` + `whileTap={{ scale: 0.95 }}`
- [ ] **Map section:** `ScrollReveal direction="up"` with slight delay
- [ ] **Google Maps:** Full-width embedded map below; Lord location pin; "Get Directions" link
- [ ] Honeypot field (hidden anti-spam field)

**API Integration:**

- [ ] Submit to `POST /api/inquiries` — `{ name, email, phone, inquiryType, message, source: "contact-page" }`
- [ ] Fetch from `GET /api/settings/contact`

### Task 5.4: FAQ Page

**File:** `app/faq/page.tsx`

- [ ] Breadcrumb: Home > FAQ
- [ ] Title: "Frequently Asked Questions" (`heading-1`)
- [ ] **Category Tabs:** Products | Installation | Maintenance & Repair | Warranty | Delivery | Ordering & Payment | General
- [ ] Active tab: Teal underline
- [ ] **FAQ Accordion** (Radix UI Accordion):
  - Question (`heading-4`, 18px Semi-Bold) — clickable to expand/collapse
  - Answer (`body`, 16px) — **Motion:** `AnimatePresence` → `motion.div initial={{ height: 0, opacity: 0 }}` → `animate={{ height: "auto", opacity: 1 }}` (duration: 0.3s, ease: easeOut)
  - Chevron icon: `motion.span animate={{ rotate: isOpen ? 180 : 0 }}` (200ms spring transition)
  - Border-bottom separator between items
  - **FAQ items stagger:** On initial page load, FAQ items stagger in with `staggerContainer` + `staggerItem` (0.05s delay between items)
- [ ] CTA at bottom: "Can't find your answer?" + "Contact Us" button → `/contact`

**API Integration:**

- [ ] Fetch from `GET /api/faqs?active=true`
- [ ] Filter by category: `GET /api/faqs?category=installation&active=true`

---

## **PHASE 6: SHOPPING CART** (Day 19–21)

### Task 6.1: Cart Page

**File:** `app/cart/page.tsx`

- [ ] Page header: "Shopping Cart" (`heading-1`) with item count + breadcrumb (Home > Cart)
- [ ] **Cart Items List:**
  - Product image (80px), name, brand, model, unit price
  - Quantity selector (−/+ buttons; min 1, max = stockQuantity)
  - Line total (quantity × unit price)
  - Remove item button (Trash2 icon with confirmation tooltip "Remove from cart?")
  - Updates debounced (500ms) → calls API
- [ ] **Price Summary Sidebar** (desktop) / **Bottom Sticky Bar** (mobile):
  - Subtotal
  - Shipping (flat rate from settings or "Free" if subtotal ≥ threshold)
  - Discount (if coupon applied — shows code + discount amount)
  - **Grand Total** (bold, large, Teal)
- [ ] **Coupon Input:** Text input + "Apply" button; success: green badge; error: red text "Invalid code"
- [ ] **CTAs:** "Proceed to Checkout" Primary button (full-width mobile, disabled if empty) + "Continue Shopping" Ghost link → `/products`
- [ ] **Empty State:** Use **Lottie** animation for empty cart illustration (animated empty box or cart); "Your cart is empty" + "Browse Products" Primary CTA
- [ ] **Stock Warning:** If stock dropped below cart quantity, amber warning + auto-adjust; warning appears with `motion.div initial={{ opacity: 0, y: -10 }}` → `animate={{ opacity: 1, y: 0 }}`

**Motion Animations (Cart Page):**

- [ ] **Cart items list:** Use `@formkit/auto-animate` on the cart items container — items animate smoothly when added, removed, or reordered
- [ ] **Item remove:** `AnimatePresence` → item exits with `motion.div exit={{ opacity: 0, x: -50, height: 0 }}` (300ms)
- [ ] **Quantity change:** Price values use `motion.span key={price}` for re-render animation (subtle scale bounce)
- [ ] **Price summary:** Numbers animate changes with `react-countup` (count from old value to new value, 500ms)
- [ ] **Coupon success/error:** `AnimatePresence` → success badge slides in (`fadeInLeft`); error message fades in
- [ ] **Empty state transition:** `AnimatePresence mode="wait"` — cart content exits → empty state enters with `scaleIn` variant
- [ ] **Proceed to Checkout button:** `motion.button whileHover={{ scale: 1.02 }}` + `whileTap={{ scale: 0.98 }}`

**API Integration:**

- [ ] Guest: Read/write from localStorage (`lord_cart` key); sync on page load
- [ ] Authenticated: `GET /api/cart`, `PATCH /api/cart/items/:itemId`, `DELETE /api/cart/items/:itemId`
- [ ] Coupon: `POST /api/cart/coupon`, `DELETE /api/cart/coupon`
- [ ] Shipping: `GET /api/settings/shipping` (flat rate, free threshold)

---

## **PHASE 7: CUSTOMER AUTHENTICATION** (Day 22–25)

### Task 7.1: Login Page

**File:** `app/login/page.tsx`

- [ ] Centered card (max 440px) on Off-White background; Lord logo above
- [ ] Email + Password inputs; "Show password" eye toggle (Eye / EyeOff from Lucide)
- [ ] "Login" Primary button (full-width, Teal)
- [ ] "Forgot Password?" link below password field
- [ ] "Don't have an account? Register" link at bottom
- [ ] Error: generic red alert "Invalid email or password" — `motion.div initial={{ opacity: 0, y: -10 }}` → `animate={{ opacity: 1, y: 0 }}` (shake animation on error: `animate={{ x: [0, -10, 10, -5, 5, 0] }}` 400ms)
- [ ] On success: store tokens → merge cart → redirect to previous page or `/account`
- [ ] Form validation: Zod + React Hook Form

**Motion Animations (Auth Pages):**

- [ ] **Auth card entrance:** `motion.div` with `scaleIn` variant (card fades + scales from 0.95→1 on page load)
- [ ] **Form fields:** `staggerContainer` → each input field as `staggerItem` (subtle fade in, 0.05s stagger)
- [ ] **Error shake:** Invalid login triggers `animate={{ x: [0, -10, 10, -5, 5, 0] }}` on the form card (400ms)
- [ ] **Success redirect:** Brief green flash / checkmark animation before redirect

**API Integration:**

- [ ] `POST /api/auth/login` → `{ accessToken, refreshToken, customer }`
- [ ] On success: `POST /api/cart/merge` to merge guest cart

### Task 7.2: Register Page

**File:** `app/register/page.tsx`

- [ ] Same centered card style as Login
- [ ] Fields: Full name, National ID (14-digit Egyptian National ID), Email, Phone, Password, Confirm Password
- [ ] Real-time validation (Zod): email format, national ID (exactly 14 digits, numeric), password min 8 chars, 1 uppercase, 1 number
- [ ] Password strength indicator bar (red → amber → green)
- [ ] "Create Account" Primary button
- [ ] "Already have an account? Login" link
- [ ] On success: redirect to `/verify-email` with email param

**API Integration:**

- [ ] `POST /api/auth/register` — `{ name, nationalId, email, phone, password }`

### Task 7.3: Email Verification Page

**File:** `app/verify-email/page.tsx`

- [ ] Centered card with email icon illustration
- [ ] 6 separate digit inputs (auto-focus next on input, paste support for full code)
- [ ] "Resend code in 60s" countdown timer; "Resend Code" link after timer expires
- [ ] "Verify Email" Primary button
- [ ] Success: **Lottie** green checkmark animation → auto-redirect to `/login` after 2 sec

**Motion Animations (Verify Email):**

- [ ] **OTP input boxes:** `staggerContainer` → each box fades in with 0.05s stagger; on input, box briefly scales (`animate={{ scale: [1, 1.1, 1] }}` 200ms)
- [ ] **Countdown timer:** Number animates with `motion.span key={seconds}` for re-render animation
- [ ] **Success state:** `AnimatePresence mode="wait"` → form exits → Lottie success checkmark enters with scale animation

**API Integration:**

- [ ] `POST /api/auth/verify-email` — `{ email, otp }`
- [ ] `POST /api/auth/resend-otp` — `{ email }`

### Task 7.4: Forgot Password Flow

**File:** `app/forgot-password/page.tsx`

- [ ] Multi-step within same page:
  - **Step 1:** Email input → "Send Reset Code" CTA
  - **Step 2:** 6-digit OTP input (same UX as email verification)
  - **Step 3:** New password + confirm password; strength indicator → "Reset Password" CTA
  - **Step 4:** Success message → "Go to Login" link; Lottie success animation
- [ ] Each step validates before proceeding

**Motion Animations (Forgot Password):**

- [ ] **Step transitions:** `AnimatePresence mode="wait"` — each step slides out left → next step slides in from right (or reverse on "Back")
- [ ] **Progress dots:** Animated dot indicator — active dot scales up with `motion.div animate={{ scale: 1.3 }}` (spring)

**API Integration:**

- [ ] `POST /api/auth/forgot-password` — `{ email }`
- [ ] `POST /api/auth/reset-password` — `{ email, otp, newPassword }`

### Task 7.5: Auth Guard Component

**File:** Middleware or wrapper component

- [ ] Protect `/account/*` routes: redirect to `/login` if not authenticated
- [ ] After login: redirect back to originally requested URL
- [ ] Use Next.js middleware (`middleware.ts`) to check for auth cookie/token on `/account` routes

---

## **PHASE 8: CHECKOUT & PAYMENT (PAYMOB)** (Day 26–30)

### Task 8.1: Checkout Page

**File:** `app/checkout/page.tsx`

- [ ] Layout: Two columns — Left: step forms (60%) + Right: order summary sidebar (40%); single column on mobile
- [ ] **Progress Stepper:** 1. Shipping → 2. Review → 3. Payment → 4. Confirmation
  - Completed steps: Teal filled circle + checkmark
  - Current step: bold text + Teal border
  - Upcoming: gray circle + gray text
  - **Motion:** Stepper progress line animates width with `motion.div animate={{ width: stepProgress + "%" }}` (spring transition); completed step checkmark appears with `motion.svg initial={{ pathLength: 0 }}` → `animate={{ pathLength: 1 }}` (SVG path draw animation, 400ms)
- [ ] **Step transitions:** `AnimatePresence mode="wait"` — current step form exits (`opacity: 0, x: -20`) → next step enters (`opacity: 0, x: 20` → `opacity: 1, x: 0`); direction reverses on "Back" button
- [ ] **Guest Checkout:** Option for unregistered users — "Checkout as Guest" (name, national ID, email, phone required) or "Login / Register" links

### Task 8.2: Step 1 — Shipping Address

**File:** `components/checkout/ShippingAddressStep.tsx`

- [ ] Logged-in users: display saved address cards (selectable radio); pre-select default address
- [ ] New address form: recipient name, phone, address line 1, address line 2 (optional), city, governorate (dropdown of Egyptian governorates), postal code
- [ ] "Save this address for future orders" checkbox (logged-in only)
- [ ] Guest checkout form: name, national ID (14 digits, validated), email, phone + address fields
- [ ] "Continue to Review" Primary CTA; "Back to Cart" Ghost link
- [ ] Validation: Zod schema — all required fields

**API Integration:**

- [ ] `GET /api/account/addresses` — fetch saved addresses (authenticated)
- [ ] `POST /api/account/addresses` — save new address (if checkbox checked)

### Task 8.3: Step 2 — Order Review

**File:** `components/checkout/OrderReviewStep.tsx`

- [ ] Read-only items list: thumbnail, name, qty, unit price, line total
- [ ] Shipping address display with "Edit" link (returns to Step 1)
- [ ] Price breakdown: Subtotal + Shipping + Discount = **Total (EGP)**
- [ ] "Proceed to Payment" Primary CTA; "Back" Ghost link

### Task 8.4: Step 3 — Payment (Paymob)

**File:** `components/checkout/PaymentStep.tsx`

- [ ] Payment method radio selection:
  - **Credit/Debit Card** — Visa/Mastercard icons
  - **Mobile Wallet** — Vodafone Cash, Etisalat Cash, Orange Money icons
  - **Installments** — Calendar icon + available plan info (if configured)
- [ ] On select + confirm → backend creates Paymob order and returns payment key
- [ ] Redirect to Paymob hosted payment page OR embed Paymob iframe (using `PAYMOB_IFRAME_ID`)
- [ ] Loading overlay: "Processing payment..." + Lord fan spinner + "Please do not close this page"
- [ ] Error state: red alert + "Retry" button + "Use different payment method" option
- [ ] Trust signals: Lock icon + "Secured by Paymob" + Visa/Mastercard logos

**API Integration:**

- [ ] `POST /api/orders` — create order from cart data
- [ ] `POST /api/orders/:id/pay` — initiate Paymob payment, returns `{ paymentKey, iframeUrl }`
- [ ] Handle Paymob redirect callback (success/failure query params)

### Task 8.5: Order Confirmation Page

**File:** `app/order-confirmation/[orderId]/page.tsx`

- [ ] Green checkmark animation: use **Lottie** animation (`lottie-react`) for a polished animated green circle + checkmark; or `motion.svg` with `pathLength` animation (circle draws 0→1, then checkmark draws 0→1, 800ms total) + "Order placed successfully!" heading fades in after checkmark completes
- [ ] Order number (e.g., `#LORD-20260001`) with copy button; number appears with `motion.span initial={{ opacity: 0, y: 10 }}` → `animate={{ opacity: 1, y: 0 }}` (delay: 0.5s after checkmark)
- [ ] Items summary, total, payment method, shipping address
- [ ] Paymob transaction ID and payment receipt details
- [ ] Estimated delivery: "3–5 business days" (from CMS settings)
- [ ] CTAs: "Track My Order" Primary → `/account/orders/[id]` + "Continue Shopping" Secondary → `/products`
- [ ] Email note: "Confirmation email sent to [email]"
- [ ] Cart is cleared after successful order

**API Integration:**

- [ ] `GET /api/orders/:id/confirmation` — fetch order confirmation data

---

## **PHASE 9: CUSTOMER ACCOUNT DASHBOARD** (Day 31–35)

### Task 9.1: Account Layout

**File:** `app/account/layout.tsx`

- [ ] Protected layout (Auth Guard — redirect to `/login` if not authenticated)
- [ ] **Desktop:** Left sidebar (Account navigation) + main content area
- [ ] **Mobile:** Top tabs (horizontal scrollable) + full-width content
- [ ] **Welcome bar:** "Welcome back, [First Name]" + last login date
- [ ] Account sidebar/tabs: My Orders, My Addresses, My Profile, Change Password, Logout

**Motion Animations (Account Layout):**

- [ ] **Sidebar active indicator:** `motion.div layoutId="accountActiveTab"` for smooth sliding highlight between tabs
- [ ] **Page content transition:** `AnimatePresence mode="wait"` — tab content fades out/in on navigation
- [ ] **Mobile tab switch:** Horizontal tab indicator slides with `motion.div layout` animation

### Task 9.2: Account Dashboard

**File:** `app/account/page.tsx`

- [ ] Quick Stats: Total orders, Pending orders, Recent order status
- [ ] Recent orders list (last 5): order #, date, items count, total, status badge → clickable
- [ ] Quick Actions: "Browse Products" + "View All Orders" + "Manage Addresses"
- [ ] Empty state if no orders: "No orders yet" illustration + "Start Shopping" CTA

**API Integration:**

- [ ] `GET /api/account/profile`
- [ ] `GET /api/account/orders?limit=5`

### Task 9.3: My Orders Page

**File:** `app/account/orders/page.tsx`

- [ ] Order list: reverse chronological
- [ ] **Order Card:** Order # (`heading-4`), date, items count, total (EGP), status badge (OrderStatusBadge)
- [ ] Filters: status dropdown (All, Confirmed, Processing, Shipped, Delivered, Cancelled)
- [ ] Pagination
- [ ] Click order → `/account/orders/[id]`
- [ ] Empty state: "No orders yet" illustration + "Start Shopping" CTA

**API Integration:**

- [ ] `GET /api/account/orders?page=1&status=all`

### Task 9.4: Order Detail Page

**File:** `app/account/orders/[id]/page.tsx`

- [ ] Breadcrumb: Account > My Orders > Order #LORD-XXXXXXXX
- [ ] **Order Timeline:** Visual stepper showing status history (Placed → Confirmed → Processing → Shipped → Delivered)
  - Current step highlighted in Teal; completed steps in Green; upcoming in Gray
  - Each step shows timestamp + note
  - **Motion:** Timeline steps use `staggerContainer` + `staggerItem`; connecting line grows with `motion.div animate={{ height: "100%" }}` (sequential, 300ms per segment); step circles use `motion.div animate={{ scale: [0, 1.2, 1] }}` (spring, staggered)
- [ ] **Items List:** Product image, name, brand, model, quantity, unit price, line total
- [ ] **Price Breakdown:** Subtotal, Shipping, Discount, Total
- [ ] **Shipping Address:** Full address display
- [ ] **Payment Info:** Payment method (card/wallet), card brand + last 4, Paymob transaction ID, paid at date
- [ ] **Tracking Info:** If shipped — tracking number + carrier name; link to external tracking if available
- [ ] **Cancel Button:** "Cancel Order" Danger button visible only if status = `confirmed` or `pending_payment`; confirmation modal required
- [ ] **Estimated Delivery:** "3–5 business days" (if not yet delivered)

**API Integration:**

- [ ] `GET /api/account/orders/:id`
- [ ] `POST /api/account/orders/:id/cancel`

### Task 9.5: My Addresses Page

**File:** `app/account/addresses/page.tsx`

- [ ] Grid of saved addresses (2-column desktop, 1-column mobile)
- [ ] **Address Card:** Label (Home/Office/Other), recipient name, phone, full address, default star badge
- [ ] "+ Add New Address" button → opens modal form
- [ ] **Edit / Delete:** Edit icon + Delete icon on each card; delete requires confirmation modal
- [ ] **Set as Default:** Star icon toggle; only one default at a time
- [ ] **Max 10 addresses:** Show message when limit reached
- [ ] Empty state: "No saved addresses" + "Add Address" CTA; **Lottie** empty state illustration

**Motion Animations (Addresses Page):**

- [ ] **Address cards:** Use `@formkit/auto-animate` on the grid container — cards animate automatically when added, removed, or reordered
- [ ] **New card appearance:** `motion.div initial={{ opacity: 0, scale: 0.9 }}` → `animate={{ opacity: 1, scale: 1 }}` (spring)
- [ ] **Delete card:** `AnimatePresence` → `exit={{ opacity: 0, scale: 0.9, height: 0 }}` (300ms)
- [ ] **Default star toggle:** Star icon `motion.svg animate={{ scale: [1, 1.3, 1], fill: "gold" }}` on toggle (spring, 300ms)

**API Integration:**

- [ ] `GET /api/account/addresses`
- [ ] `POST /api/account/addresses`
- [ ] `PATCH /api/account/addresses/:id`
- [ ] `DELETE /api/account/addresses/:id`
- [ ] `PATCH /api/account/addresses/:id/default`

### Task 9.6: My Profile Page

**File:** `app/account/profile/page.tsx`

- [ ] **Profile Info Section:** Editable fields — full name, national ID (14-digit Egyptian National ID), email (read-only after verification), phone
- [ ] "Save Changes" Primary button; success toast: "Profile updated successfully"
- [ ] **Change Password Section:** Current password + new password + confirm new password; password strength bar
- [ ] "Update Password" button; success toast; form resets on success
- [ ] Form validation: Zod schemas

**API Integration:**

- [ ] `GET /api/account/profile`
- [ ] `PATCH /api/account/profile` — `{ name, nationalId, phone }`
- [ ] `PATCH /api/account/change-password` — `{ currentPassword, newPassword }`

---

## **PHASE 10: SERVICE REQUEST & INQUIRY FORMS** (Day 36–37)

### Task 10.1: Service Request Form (on Services page)

- [ ] "Request This Service" button on each service card → opens form modal or scroll-to form
- [ ] Pre-filled: service type from clicked card
- [ ] **Conditional fields per service type:**
  - **Installation:** Unit brand/model (dropdown or text), property type (residential/commercial), floor number, **installation location address (required — full address where AC will be installed)**, preferred date/time
  - **Maintenance:** Unit brand, model, age, last service date, issue description, preferred date/time
  - **Repair:** Unit brand, model, age, fault description, urgency (standard/emergency), preferred date/time
  - **Delivery:** Delivery address, preferred delivery window
- [ ] Common fields: name, email, phone, message
- [ ] Submit → success toast + form reset

**API Integration:**

- [ ] `POST /api/service-requests` — `{ serviceTypeId, name, email, phone, ..., source: "services-page:{slug}" }`

### Task 10.2: Product Inquiry Form (on Product Detail page)

- [ ] "Contact Us" link or "Inquire About This Product" button on product detail page
- [ ] Opens modal or scroll-to section
- [ ] Pre-filled: product name, model number, brand
- [ ] Customer fields: name, email, phone, preferred contact time, message
- [ ] Submit → success toast

**API Integration:**

- [ ] `POST /api/inquiries` — `{ type: "product", productId, name, email, phone, ..., source: "product-detail:{slug}" }`

---

## **PHASE 11: BILINGUAL SUPPORT (AR/EN)** (Day 38–39)

### Task 11.1: Language Context & Toggle

**File:** `context/LanguageContext.tsx`

- [ ] Create language context: `currentLanguage`, `setLanguage()`, `t()` translation function
- [ ] Persist language preference in cookie/localStorage
- [ ] On language change: swap `<html dir="rtl">` / `<html dir="ltr">` attribute
- [ ] Font swap: Arabic → Cairo, English → Inter

### Task 11.2: RTL Layout Support

- [ ] Test all layouts in RTL mode (mirror horizontally)
- [ ] Use CSS logical properties: `margin-inline-start`, `padding-inline-end`, etc.
- [ ] Directional icons (arrows, chevrons) flip in RTL
- [ ] Numbers remain LTR (prices, phone numbers, model numbers)
- [ ] Image carousels scroll direction reverses
- [ ] Tailwind `rtl:` variant for direction-specific styles

### Task 11.3: Translation Files

- [ ] Create translation JSON files for EN and AR
- [ ] All static text (page titles, button labels, form labels, error messages)
- [ ] Dynamic content (from CMS) is already bilingual per BRD

---

## **PHASE 12: RESPONSIVE DESIGN, SEO & POLISH** (Day 40–42)

### Task 12.1: Responsive Testing

- [ ] Test all pages on: 320px, 375px, 414px (mobile), 768px (tablet), 1024px (laptop), 1280px, 1440px (desktop)
- [ ] Verify responsive behaviors per UI/UX spec §11:
  - Navbar → hamburger menu on mobile
  - Product grid → 3 col → 2 col → 1 col
  - Cart page → sidebar → bottom sticky bar
  - Checkout → 2 col → 1 col; sticky CTA
  - Account dashboard → sidebar → top tabs
  - Footer → 4 col → 2x2 → 1 col stacked
  - Filter sidebar → bottom sheet on mobile
  - Tables → horizontal scroll or card view
- [ ] Touch targets: minimum 44×44px; 8px spacing between interactive elements
- [ ] Test swipe gestures on image galleries

### Task 12.2: Cross-Browser Testing

- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)

### Task 12.3: SEO Implementation

- [ ] Dynamic `<title>` and `<meta description>` on all pages (from CMS or product data)
- [ ] Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url` on all public pages
- [ ] JSON-LD schemas:
  - `Product` schema on product detail pages (with `offers`, `price`, `availability`, `priceCurrency: "EGP"`)
  - `LocalBusiness` on home and contact pages
  - `FAQPage` on FAQ page
  - `BreadcrumbList` on all pages
- [ ] Auto-generated XML sitemap at `/sitemap.xml`
- [ ] `robots.txt`: allow public pages, disallow CMS panel routes
- [ ] Canonical URLs on all pages
- [ ] Hreflang tags for AR/EN
- [ ] All product images have descriptive alt text
- [ ] Slug-based URLs: `/products/carrier-42qhf024`

### Task 12.4: Performance Optimization

- [ ] Image optimization: WebP format, responsive `srcset`, lazy loading (`loading="lazy"`)
- [ ] Use Next.js `<Image>` component for all images
- [ ] Code splitting: automatic per route (Next.js); dynamic imports for heavy components (lightbox, carousel)
- [ ] Font loading: `font-display: swap` for Inter and Cairo; preload critical font weights
- [ ] Tree-shake unused Lucide icons
- [ ] Target Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Use ISR (Incremental Static Regeneration) for product listing and detail pages

### Task 12.5: Accessibility (WCAG 2.1 AA)

- [ ] All text meets minimum contrast ratio: 4.5:1 (normal text), 3:1 (large text)
- [ ] All images have meaningful `alt` text
- [ ] All form inputs have `<label>` elements
- [ ] Keyboard navigation works on all interactive elements
- [ ] Focus indicators visible: `2px solid #0DBACA` outline
- [ ] Skip navigation link ("Skip to main content")
- [ ] ARIA landmarks on major sections (`<nav>`, `<main>`, `<aside>`, `<footer>`)
- [ ] Screen reader announcements for dynamic updates (toast, form errors, cart updates)
- [ ] `prefers-reduced-motion`: disable non-essential animations

### Task 12.6: Animation & Motion Polish

- [ ] **Verify all Motion animations:** Ensure every component uses the correct animation preset from `lib/animations.ts`
- [ ] **Performance audit:** Check animation FPS (target 60fps); disable `will-change` on off-screen elements; use `layout` prop sparingly (only where needed for layout shifts)
- [ ] **Reduced motion:** Verify `prefers-reduced-motion` is respected globally — all non-essential animations disabled; only opacity transitions remain
- [ ] **Animation consistency:** All durations follow spec: micro-interactions (150–300ms), reveals (400–600ms), page transitions (300ms), modals (200–300ms)
- [ ] **Lottie assets:** Ensure all Lottie JSON files are optimized (< 50KB each); loading spinner, success checkmark, empty states (cart, orders, addresses)
- [ ] **Auto-animate lists:** Verify `@formkit/auto-animate` is applied to: cart items, filter tags, address cards, order list
- [ ] **CountUp numbers:** Verify `react-countup` with `enableScrollSpy` works on: home stats, about stats, account stats
- [ ] **Scroll reveals:** Verify `ScrollReveal` components trigger correctly on all sections; no janky layout shifts
- [ ] **Loading skeletons:** Shimmer animation using CSS `@keyframes` or `motion.div` with gradient `backgroundPosition` animation

### Task 12.7: Final Polish

- [ ] Consistent spacing using design tokens (8px, 16px, 24px, 32px, 48px, 64px)
- [ ] All animations match UI/UX spec §14 (durations, easing curves)
- [ ] Loading skeletons for async data
- [ ] Error states styled (red borders, error messages)
- [ ] Empty states designed for all lists (products, cart, orders, addresses)
- [ ] 404 page with Lord branding + "Go Home" CTA
- [ ] Console errors cleaned up
- [ ] Floating WhatsApp button on all pages

---

## **PHASE 13: TESTING & DEPLOYMENT** (Day 43–45)

### Task 13.1: End-to-End Testing

- [ ] Test complete user flows:
  1. Browse products → filter → view detail → add to cart → checkout → pay → confirm
  2. Register → verify email → login → browse → add to cart (merge) → checkout → pay
  3. Login → view orders → view order detail → cancel order
  4. Manage addresses (add, edit, delete, set default)
  5. Change password flow
  6. Forgot password → OTP → reset
  7. Guest checkout flow (without account)
  8. Submit service request (each type)
  9. Submit contact inquiry
  10. Apply coupon → checkout with discount
- [ ] Test with Paymob test/sandbox mode
- [ ] Test error scenarios: payment failure, network errors, invalid forms, out-of-stock

### Task 13.2: Build for Production

- [ ] Set environment variables: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_PAYMOB_IFRAME_ID`
- [ ] Run `npm run build`
- [ ] Test production build locally: `npm run start`
- [ ] Check bundle size; ensure no console errors

### Task 13.3: Deployment

- [ ] Deploy to Vercel (recommended for Next.js) or VPS
- [ ] Configure custom domain (e.g., `www.lord-ac.com`)
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure environment variables in deployment platform
- [ ] Test live site end-to-end
- [ ] Verify SEO (Google Search Console, sitemap, robots.txt)

### Task 13.4: Documentation

- [ ] Create README with setup instructions
- [ ] Document environment variables needed
- [ ] Document build and deployment process
- [ ] Document folder structure and component naming conventions

---

## **TECHNICAL STACK SUMMARY**

### Core Technologies

| Technology                  | Purpose                                                                   |
| --------------------------- | ------------------------------------------------------------------------- |
| Next.js 14+                 | Framework (App Router, SSR, ISR, API routes)                              |
| React 18+                   | UI library                                                                |
| TypeScript                  | Type safety                                                               |
| Tailwind CSS                | Styling (utility-first)                                                   |
| Radix UI                    | Accessible headless UI components                                         |
| Zod                         | Schema validation (forms)                                                 |
| React Hook Form             | Form state management                                                     |
| Lucide React                | Icon library (per Tech Specs)                                             |
| Swiper                      | Carousel/slider (testimonials, product images)                            |
| react-toastify              | Toast notifications                                                       |
| js-cookie                   | Cookie management (language, session)                                     |
| motion                      | Animation library (formerly Framer Motion) — `import from "motion/react"` |
| react-intersection-observer | Viewport detection for scroll-triggered animations                        |
| react-countup               | Animated number counting (stats sections)                                 |
| @formkit/auto-animate       | Zero-config list/layout animations (cart, filters, addresses)             |
| lottie-react                | Lottie JSON animations (loading, success checkmark, empty states)         |

### Recommended `package.json` Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-accordion": "^1.1.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-toast": "^1.0.0",
    "@radix-ui/react-checkbox": "^1.0.0",
    "@radix-ui/react-select": "^1.2.0",
    "@radix-ui/react-slider": "^1.1.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "lucide-react": "^0.300.0",
    "swiper": "^11.0.0",
    "react-toastify": "^9.1.3",
    "js-cookie": "^3.0.0",
    "motion": "^12.0.0",
    "react-intersection-observer": "^10.0.0",
    "react-countup": "^6.5.0",
    "@formkit/auto-animate": "^0.9.0",
    "lottie-react": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/js-cookie": "^3.0.0",
    "tailwindcss": "^3.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

### Design Tokens (from UI/UX Document)

| Token             | Value                                      |
| ----------------- | ------------------------------------------ |
| **Lord Navy**     | `#172041` — headers, nav, footers, primary |
| **Lord Teal**     | `#0DBACA` — CTAs, links, badges, icons     |
| **Lord Silver**   | `#BEBEBE` — borders, dividers, muted text  |
| **Lord Frost**    | `#4DB8D4` — gradients, hover states        |
| **Off-White**     | `#F8FAFB` — page background, alt sections  |
| **Dark Charcoal** | `#1A1A2E` — body text                      |
| **Font (EN)**     | Inter (Google Fonts)                       |
| **Font (AR)**     | Cairo (Google Fonts)                       |
| **Max Width**     | 1280px                                     |
| **Border Radius** | Cards: 12px, Buttons: 8px, Inputs: 8px     |
| **Input Height**  | 44px                                       |
| **Navbar Height** | 72px desktop, 64px mobile                  |
| **Anim: Micro**   | 150–300ms (hover, tap, toggle)             |
| **Anim: Reveal**  | 400–600ms (scroll-in, fade-up)             |
| **Anim: Page**    | 300ms enter, 150ms exit                    |
| **Anim: Modal**   | 200–300ms (scale-in, fade)                 |
| **Anim: Spring**  | damping: 20–25, stiffness: 200–300         |
| **Anim: Stagger** | 0.05–0.15s between children                |

---

## **IMPORTANT NOTES**

### Best Practices

1. **Component Reusability** — Create reusable components for buttons, cards, inputs, badges
2. **TypeScript Everywhere** — Strict mode; type all props, API responses, and state
3. **Error Handling** — Always handle API errors gracefully; show user-friendly toast messages
4. **Loading States** — Show skeleton loaders or spinners while data loads
5. **Form Validation** — Validate client-side with Zod before API call; mirror server validation rules
6. **Responsive First** — Design for mobile, then enhance for desktop
7. **Cart State** — Guest cart in localStorage; authenticated cart server-side; merge on login
8. **SEO** — Every page needs proper meta tags, OG tags, and schema markup
9. **Accessibility** — WCAG 2.1 AA compliance; keyboard navigation; screen reader support
10. **Performance** — Lazy load images, code split heavy components, use ISR for product pages

### Common Pitfalls to Avoid

- ❌ Don't store customer tokens insecurely — use httpOnly cookies or secure localStorage
- ❌ Don't expose Paymob API keys client-side — payment initiation must go through backend
- ❌ Don't skip cart merge on login — guest cart items will be lost
- ❌ Don't hardcode API URLs — use environment variables
- ❌ Don't ignore RTL layout — test Arabic/RTL on every component
- ❌ Don't skip stock validation — always check stock before checkout
- ❌ Don't forget empty states for lists (products, cart, orders, addresses)
- ❌ Don't use `react-icons` — use `lucide-react` per Tech Specs
- ❌ Don't skip the honeypot field on public forms (anti-spam)
- ❌ Don't forget `prefers-reduced-motion` for animation accessibility — check `useReducedMotion()` hook
- ❌ Don't use `framer-motion` import — use `motion/react` (Framer Motion is now Motion)
- ❌ Don't over-animate — respect 60fps; avoid animating `width`/`height` directly (use `transform` instead)
- ❌ Don't forget `AnimatePresence` for exit animations (modals, dropdowns, removed items)
- ❌ Don't animate layout-triggering properties on scroll (causes jank) — use `transform` and `opacity` only for scroll animations

---

**Build it step by step. Test each phase before moving on. Good luck!** 🛒✨
