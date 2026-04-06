# Technical Specifications — Frontend & Backend Breakdown

## Lord — Website & Content Management System

| Field                | Detail                                                          |
| -------------------- | --------------------------------------------------------------- |
| **Document Version** | 1.0                                                             |
| **Date**             | April 6, 2026                                                   |
| **Project Name**     | Lord E-Commerce Website & CMS                                   |
| **Project Type**     | Full-Stack E-Commerce Web Application (Air Conditioning Retail) |
| **Status**           | In Development                                                  |

### Referenced Documents

- Business Requirements Document (BRD) — `BRD.md`
- UI/UX Design Requirements — `UI-UX-Design-Requirements.md`

### Technology Stack

| Layer                    | Technology                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **Frontend — Website**   | Next.js 14+ (App Router), React 18+, TypeScript, Tailwind CSS, Radix UI, Zod, React Hook Form |
| **Frontend — CMS Panel** | React 18+, Vite, TypeScript, Tailwind CSS, React Router DOM v6                                |
| **Backend API**          | Node.js 20+, Express 4, TypeScript, Prisma ORM                                                |
| **Database**             | PostgreSQL 15+                                                                                |
| **Authentication**       | JWT (access + refresh tokens), bcrypt (CMS staff + customers)                                 |
| **Payment Gateway**      | Paymob Accept (Credit/Debit Card, Mobile Wallets, Installments)                               |
| **Email**                | Nodemailer (SMTP / SendGrid / Mailgun / AWS SES)                                              |
| **File Storage**         | AWS S3 or compatible object storage                                                           |
| **Icons**                | Lucide React                                                                                  |
| **Testing**              | Jest, Supertest                                                                               |

### Design Tokens Reference (from UI/UX Document)

| Token                | Value                                     |
| -------------------- | ----------------------------------------- |
| **Primary Color**    | Lord Navy `#172041`                       |
| **Accent Color**     | Lord Teal `#0DBACA`                       |
| **Secondary Accent** | Lord Frost `#4DB8D4`                      |
| **Neutral**          | Lord Silver `#BEBEBE`                     |
| **Background**       | White `#FFFFFF` / Off-White `#F8FAFB`     |
| **Body Text**        | Dark Charcoal `#1A1A2E`                   |
| **Font (EN)**        | Inter                                     |
| **Font (AR)**        | Cairo                                     |
| **Border Radius**    | Cards: 12px, Buttons: 6–10px, Inputs: 8px |
| **Max Width**        | 1280px                                    |

---

## Table of Contents

1. [Public Website](#1-public-website)
   - 1.1 [Home Page](#11-home-page)
   - 1.2 [Products Page](#12-products-page)
   - 1.3 [Product Detail Page](#13-product-detail-page)
   - 1.4 [After-Sales Services Page](#14-after-sales-services-page)
   - 1.5 [About Page](#15-about-page)
   - 1.6 [Contact Page](#16-contact-page)
   - 1.7 [FAQ Page](#17-faq-page)
   - 1.8 [Shared / Global Components](#18-shared--global-components)
2. [Product Catalog System](#2-product-catalog-system)
3. [After-Sales Services System](#3-after-sales-services-system)
4. [Inquiry & Service Request System](#4-inquiry--service-request-system)
5. [Shopping Cart System](#5-shopping-cart-system)
6. [Customer Authentication System](#6-customer-authentication-system)
7. [Checkout & Payment System (Paymob)](#7-checkout--payment-system-paymob)
8. [Order Management System](#8-order-management-system)
9. [CMS Panel](#9-cms-panel)
10. [Notifications & Communications](#10-notifications--communications)
11. [Out of Scope Features](#11-out-of-scope-features)
12. [Security & Data Protection](#12-security--data-protection)
13. [SEO & Performance](#13-seo--performance)

---

## **1. PUBLIC WEBSITE**

### **1.1 Home Page**

#### Frontend

- **Navbar** _(sticky, shared across all pages)_
  - Lord full logo (primary), max-height 48px, left-aligned
  - Navigation links: Home, Products, Services, About, Contact — center-aligned
  - Active link: Lord Teal `#0DBACA` with 2px underline bar
  - Language toggle (AR / EN) — right side
  - CTA button: "Request Service" — Primary button style (Teal)
  - **Cart icon** (ShoppingCart from Lucide) — right side, before CTA
    - Item count badge: Teal circle, White text, 18px, positioned top-right of icon
    - Click → mini-cart dropdown (360px, shows up to 4 items, subtotal, "View Cart" + "Checkout" buttons)
    - Cart state: localStorage for guests; server-side for logged-in customers (merged on login)
  - **Account menu** (UserCircle from Lucide) — right side
    - Logged out: shows "Login / Register" link
    - Logged in: shows dropdown with customer name, "My Orders", "My Addresses", "Profile", "Logout"
  - Mobile: hamburger icon → full-screen slide-in overlay from right (includes cart + account links)
  - Height: 72px desktop, 64px mobile
  - Background: White; on scroll: `backdrop-filter: blur(12px)` + subtle shadow
- **Hero Section**
  - Full-width hero with Lord branding
  - Headline: "Authorized Carrier & Midea Dealer" (`display-xl`, 56px desktop / 36px mobile, Extra Bold 800)
  - Tagline: "Air Conditioning — Since 1986" (`body-lg`, 18px)
  - Authorized dealer badges: Carrier oval logo + Midea logo (equal size, side by side, min 80px each)
  - Dual CTA buttons:
    - "Shop Now" → Primary button (Teal `#0DBACA`, White text) → links to `/products`
    - "Our Services" → Secondary button (Transparent, Navy border) → links to `/services`
  - Background: White or subtle gradient (Teal → Frost `#0DBACA` → `#4DB8D4`)
  - Vertical padding: 96px desktop, 48px mobile
- **Featured Products Section**
  - Section title: "Featured Products" (`display-lg`, 44px Bold)
  - 4-column product card grid (desktop), 2-column (tablet), 1-column (mobile)
  - **Product Card:** Image (1:1 ratio) → Brand badge (Carrier: Navy / Midea: Teal) → Product name (`heading-3`) → Capacity + Type (`body-sm`) → Price (`heading-4`, Teal) → **"Add to Cart" Primary button** (Teal) + Quick View eye icon on hover
  - Card styling: White bg, `1px solid #E8EAED`, 12px radius, hover shadow elevation
  - Background: Off-White `#F8FAFB`, padding 64px vertical
- **Services Overview Section**
  - Section title: "Our Services" (`display-lg`)
  - 5 icon cards in horizontal row (desktop), wrap to 2+3 or stack on mobile
  - **Service Card:** Icon (48px, Teal) → Service name (`heading-3`) → Description 2 lines max (`body-sm`) → "Learn More" Ghost link
  - Services: Installation, Periodic Maintenance, Emergency Repair, Spare Parts, Delivery
  - Background: White, padding 64px vertical
- **Why Choose Lord Section**
  - 4 stat cards in a row
  - **Stat Card:** Large number (`display-lg`, Teal) → Label (`body-sm`, Medium Gray `#6C757D`)
  - Stats: "Since 1986", "XX+ Units Installed", "Authorized Dealer", "Full After-Sales Support"
  - Background: Off-White `#F8FAFB`
- **Testimonials Section**
  - Auto-rotating carousel (5s interval, pause on hover)
  - **Testimonial Card:** Star rating (Amber `#FFC107`) → Quote text (`body-lg`, italic) → Customer name + location (`body-sm`)
  - Background: Navy `#172041`, text: White, padding 64px vertical
- **CTA Band**
  - Full-width Teal gradient (`#0DBACA` → `#4DB8D4`)
  - Headline: "Need help choosing? Request a free consultation" (White, `heading-2`)
  - CTA button: "Contact Us" — Secondary style (White border on Teal bg)
  - Padding: 48px vertical
- **Contact Strip**
  - Address, phone (clickable `tel:` link), WhatsApp (clickable `wa.me/` link), email, working hours
  - Embedded Google Maps thumbnail → links to Contact page
- **Footer** _(shared across all pages)_
  - Background: Navy `#172041`
  - 4-column layout (desktop): Logo + tagline + Carrier/Midea logos | Quick Links | Services | Contact Info
  - Link hover color: Teal `#0DBACA`
  - Bottom bar: Copyright + social media icons (Facebook, Instagram, WhatsApp)
  - Separator: `1px solid rgba(255,255,255,0.1)`
  - Mobile: single-column stacked, collapsible sections

#### Backend

- **API Endpoints**
  - `GET /api/content/home` — Fetch home page CMS content (hero text, tagline, CTA labels, stats)
  - `GET /api/products?featured=true&limit=8` — Fetch featured products for homepage grid
  - `GET /api/services?active=true` — Fetch active after-sales services for overview section
  - `GET /api/testimonials?approved=true&featured=true` — Fetch approved/featured testimonials
  - `GET /api/settings/contact` — Fetch contact info (address, phone, WhatsApp, email, hours, maps, socials)
  - `GET /api/brands` — Fetch brand data (Carrier/Midea logos, authorized dealer badge info)
- **Database Reads**
  - `ContentPages` (page_key = "home") → hero content, stats JSON
  - `Products` (featured = true, active = true) → product cards
  - `Services` (active = true) → service overview cards
  - `Testimonials` (approved = true) → carousel items
  - `SiteSettings` → contact info, social links
  - `Brands` → logo URLs, dealer certificate references

---

### **1.2 Products Page**

#### Frontend

- **Page Header**
  - Breadcrumb: Home > Products (`body-sm`, Medium Gray)
  - Title: "Our Products" (`heading-1`, 36px Bold)
  - Product count: "Showing X of Y products" (`body-sm`)
- **Filter System**
  - Desktop: sticky left sidebar (240px width)
  - Tablet: collapsible horizontal filter bar
  - Mobile: bottom sheet / modal triggered by "Filter" button
  - **Filter Controls:**
    - Brand: checkboxes (Carrier, Midea) with brand logos
    - Type: multi-select (Split, Multi-Split, Cassette, Duct, Central, VRF/VRV, Window, Portable)
    - Capacity: range slider (BTU/ton)
    - Price: range slider
    - "Clear All Filters" button (Ghost style)
  - Active filter tags displayed as removable badges above grid
- **Sort Options**
  - Dropdown: Price (Low → High), Price (High → Low), Name (A–Z), Newest First
- **Product Grid**
  - 3-column desktop, 2-column tablet, 1-column mobile
  - Lazy-load on scroll (intersection observer)
  - **Product Card** (per UI/UX spec):
    - Image container (1:1 ratio, 12px top corners, light gray placeholder `#F1F3F5` with Lord icon while loading)
    - Brand badge: top-left overlay (Carrier = Navy `#172041`, Midea = Teal `#0DBACA`, 12px caption, White text)
    - Optional badges: "New Arrival" (Green `#28A745`), "Bestseller" (Red `#DC3545`), "Featured" (Amber `#FFC107`)
    - Product name (`heading-3`, 22px Semi-Bold)
    - Capacity + Type (`body-sm`, Medium Gray)
    - Price (`heading-4`, Teal `#0DBACA`); or "Out of Stock" badge if unavailable
    - **"Add to Cart" → Primary button (Teal)**; disabled with "Out of Stock" if `stockQuantity = 0`
    - Quick View eye icon on hover → opens modal with image, specs, price, qty selector, "Add to Cart"
    - Card: White bg, `1px solid #E8EAED`, 12px radius, 24px padding, hover shadow transition
  - Pagination or infinite scroll
- **Empty State**
  - Illustration (light gray) + "No products match your filters" (`heading-3`) + "Clear Filters" button
- **Brand Tabs** (optional)
  - Tab bar: "All" | "Carrier" | "Midea" — top of grid, above sort

#### Backend

- **API Endpoints**
  - `GET /api/products` — Fetch product list with query params:
    - `?brand=carrier,midea` — filter by brand
    - `?type=split,cassette` — filter by product type
    - `?capacityMin=12000&capacityMax=36000` — BTU range
    - `?priceMin=0&priceMax=10000` — price range
    - `?search=keyword` — search by name or model number
    - `?sort=price_asc|price_desc|name_asc|newest` — sort order
    - `?page=1&limit=12` — pagination
    - `?featured=true` — featured only
    - `?active=true` — active only (default)
  - `GET /api/products/count` — Total product count with same filter params
  - `GET /api/brands` — Fetch brands list
  - `GET /api/product-categories` — Fetch product types/categories
- **Database Queries**
  - `Products` with joins to `Brands`, `ProductCategories`, `ProductImages`
  - Full-text search on `name`, `model_number`, `description`
  - Aggregation for filter count indicators
- **Response Shape** (product list item):
  ```json
  {
    "id": "uuid",
    "brand": {
      "id": "uuid",
      "name": "Carrier",
      "slug": "carrier",
      "logoUrl": "..."
    },
    "category": { "id": "uuid", "name": "Split Unit", "slug": "split" },
    "name": "Carrier 42QHF024",
    "slug": "carrier-42qhf024",
    "modelNumber": "42QHF024",
    "capacity": 24000,
    "capacityUnit": "BTU",
    "type": "Split",
    "price": 4500,
    "originalPrice": null,
    "currency": "EGP",
    "stockQuantity": 15,
    "thumbnailUrl": "...",
    "isFeatured": true,
    "isNewArrival": false,
    "isBestseller": true,
    "isActive": true
  }
  ```

---

### **1.3 Product Detail Page**

#### Frontend

- **Breadcrumb**
  - Home > Products > [Brand] > [Product Name] (`body-sm`, Medium Gray)
- **Image Gallery** (left column, 50% width desktop)
  - Main image (large, 16:9 or 4:3 ratio)
  - Thumbnail strip below (horizontal scroll, 5 visible)
  - Click thumbnail → update main image
  - Click main image → lightbox with zoom (scale 1.0 → 1.5, 300ms ease-out)
  - Swipe on mobile touch devices
  - Brand badge: top-right of main image (Carrier/Midea)
  - Image placeholder: Light Gray `#F1F3F5` with Lord icon mark while loading
- **Product Info** (right column, 50% width desktop)
  - Brand logo (small, 40px height) + "Authorized Dealer" badge (shield shape, Navy border, 8px radius)
  - Product name (`heading-1`, 36px Bold)
  - Model number (`body-sm`, Medium Gray)
  - Capacity + Type (`body-lg`)
  - Price: large bold (`display-lg`, Teal `#0DBACA`); strike-through original price if on sale
  - **Stock indicator:** Green "In Stock" or Red "Out of Stock" badge
  - **Quantity selector:** ✕ / + buttons with number input; min 1, max = `stockQuantity`; default 1
  - **Feature Highlights:** checkmark icon list (Teal checkmarks, `body` text)
  - **CTA Section:**
    - **"Add to Cart"** → Primary button (Large, 48px height, Teal); on click: spinner → green checkmark + "Added!"
    - **"Buy Now"** → Secondary button (Navy border) → adds to cart + redirects to `/checkout`
    - "Contact Us" → Ghost link with phone icon
- **Specifications Table**
  - Two-column key-value table
  - Header row: Off-White `#F8FAFB`, 13px Semi-Bold Navy
  - Alternate rows: White / `#FAFBFC`
  - **Spec Fields:** Brand, Model Number, Type, Capacity (BTU/ton), EER/SEER, Voltage, Refrigerant Type, Dimensions (W × H × D), Weight, Color, Warranty
- **Product Description**
  - Rich text content from CMS (`body`, 16px)
  - Subsection headings (`heading-3`)
- **Related Products**
  - "You May Also Like" (`heading-2`)
  - 4 product cards (same brand or same type), horizontal scroll on mobile
- **Mobile Layout**
  - Stacked: Image gallery → Product info → Specs → Description → Related

#### Backend

- **API Endpoints**
  - `GET /api/products/:slug` — Fetch single product by slug with full details
  - `GET /api/products/:slug/related?limit=4` — Fetch related products (same brand or category)
- **Response Shape** (product detail):
  ```json
  {
    "id": "uuid",
    "brand": {
      "id": "uuid",
      "name": "Carrier",
      "slug": "carrier",
      "logoUrl": "...",
      "certificateUrl": "..."
    },
    "category": { "id": "uuid", "name": "Split Unit", "slug": "split" },
    "name": "Carrier 42QHF024",
    "slug": "carrier-42qhf024",
    "modelNumber": "42QHF024",
    "type": "Split",
    "capacity": 24000,
    "capacityUnit": "BTU",
    "eerSeer": "12.5 EER",
    "voltage": "220-240V / 50Hz",
    "refrigerant": "R-410A",
    "dimensions": { "width": 998, "height": 345, "depth": 225, "unit": "mm" },
    "weight": { "indoor": 12, "outdoor": 35, "unit": "kg" },
    "color": "White",
    "description": "<rich text>",
    "features": [
      "Inverter Technology",
      "Turbo Cooling",
      "Auto Restart",
      "Anti-Corrosion Coating"
    ],
    "price": 4500,
    "originalPrice": 5500,
    "currency": "EGP",
    "priceVisible": true,
    "stockQuantity": 15,
    "images": [{ "id": "uuid", "url": "...", "altText": "...", "order": 1 }],
    "isFeatured": true,
    "isNewArrival": false,
    "isBestseller": true,
    "seo": { "metaTitle": "...", "metaDescription": "..." },
    "createdAt": "...",
    "updatedAt": "..."
  }
  ```
- **Database Queries**
  - `Products` with eager load: `Brand`, `ProductCategory`, `ProductImages` (ordered by `order` ASC)
  - Related products query: same `brandId` OR same `categoryId`, exclude current product, limit 4

---

### **1.4 After-Sales Services Page**

#### Frontend

- **Page Header**
  - Breadcrumb: Home > Services
  - Title: "Our Services" (`heading-1`)
  - Tagline: "Complete after-sales support for your air conditioning" (`body-lg`, Medium Gray)
- **Service Cards Grid**
  - 3-column desktop, 2-column tablet, 1-column mobile
  - 5 cards: Installation, Periodic Maintenance, Emergency Repair, Spare Parts Supply, Delivery
  - **Service Card:**
    - Icon (48px, Lord Teal `#0DBACA`)
    - Service name (`heading-3`, 22px Semi-Bold)
    - Description (2-3 lines, `body`, 16px)
    - "What's included" expandable list (chevron toggle)
    - Applicable unit types badges (Split, Central, VRF, etc.)
    - "Request This Service" → Primary button (Teal) — pre-fills service type in inquiry form
    - Card: White bg, 12px radius, 24px padding, hover shadow
- **Service Detail Sections** (on click or scroll-to)
  - **Installation:** Site survey, refrigerant piping, electrical connection, unit testing, post-install checklist
  - **Maintenance:** Filter cleaning, coil cleaning, refrigerant check, electrical inspection, frequency recommendations
  - **Repair:** Fault diagnosis, part replacement, warranty on repairs, emergency response SLA
  - **Delivery:** Delivery area coverage, estimated lead times, installation-bundled delivery options
  - **Spare Parts:** OEM parts sourcing, compatibility, warranty on parts
- **CTA Band** (bottom of page)
  - "Need urgent service? Call us now" + phone number + WhatsApp button
  - Background: Navy `#172041`, text White

#### Backend

- **API Endpoints**
  - `GET /api/services?active=true` — Fetch all active after-sales service offerings
  - `GET /api/services/:slug` — Fetch single service detail by slug
  - `GET /api/service-types` — Fetch service type categories
- **Database Queries**
  - `Services` with `ServiceTypes` join
  - Filter by `active = true`
- **Response Shape:**
  ```json
  {
    "id": "uuid",
    "name": "Installation Service",
    "slug": "installation",
    "type": { "id": "uuid", "name": "Installation", "icon": "wrench" },
    "description": "...",
    "scopeOfWork": [
      "Site survey",
      "Refrigerant piping",
      "Electrical connection",
      "Unit testing"
    ],
    "applicableUnitTypes": ["Split", "Cassette", "Central", "VRF"],
    "estimatedDuration": "2-4 hours",
    "pricingType": "quoted",
    "price": null,
    "isActive": true
  }
  ```

---

### **1.5 About Page**

#### Frontend

- **Page Header**
  - Breadcrumb: Home > About
  - Title: "About Lord" (`heading-1`)
- **Company Story Section**
  - Narrative text from CMS (`body-lg`, 18px)
  - Optional milestone timeline (1986 → present) — horizontal scroll on desktop, vertical on mobile
  - Background: White
- **Mission / Vision Cards**
  - Side-by-side cards (desktop), stacked (mobile)
  - Icon + heading (`heading-3`) + text (`body`)
- **Authorized Dealer Section**
  - Carrier logo + "Authorized Dealer" text + certificate image (clickable lightbox)
  - Midea logo + "Authorized Dealer" text + certificate image (clickable lightbox)
  - Both displayed side by side at equal visual weight (min 80px width per logo)
- **Stats Section**
  - 4 stat cards: Years in business, Units installed, Customers served, Service visits
  - Stat Card: Large number (Teal `#0DBACA`, `display-lg`) → Label (`body-sm`, Medium Gray)
  - Background: Off-White `#F8FAFB`
- **Team / Credentials Section**
  - Years of experience, service coverage area, certifications

#### Backend

- **API Endpoints**
  - `GET /api/content/about` — Fetch About page CMS content (story, mission, vision, stats, milestones)
  - `GET /api/brands` — Fetch brand logos and dealer certificates
- **Database Queries**
  - `ContentPages` (page_key = "about") → JSON content
  - `Brands` → logo URLs, certificate image URLs

---

### **1.6 Contact Page**

#### Frontend

- **Layout:** Two-column desktop (form left, info right), stacked on mobile
- **Contact Form** (left column)
  - Fields:
    - Name (`text`, required) — label 14px Semi-Bold, input 44px height, 8px radius, focus border Teal
    - Email (`email`, required) — same styling
    - Phone (`tel`, required) — same styling
    - Inquiry Type (`select`, required) — dropdown: Purchase Inquiry, Order Support, Installation, Maintenance, Repair, Delivery, General
    - Message (`textarea`, required) — min-height 120px, resize vertical
  - Submit button: "Send Message" → Primary button (Large, Teal)
  - Client-side validation (Zod + React Hook Form)
  - Error state: Red border `#DC3545`, 13px error text below field
  - **Success state:** Green checkmark icon + "Thank you! We'll contact you within 1 hour." toast notification (Success Green)
  - **Loading state:** Button disabled with spinner
- **Contact Information** (right column)
  - Address with icon
  - Phone number (clickable `tel:` link)
  - WhatsApp number (clickable `wa.me/` link)
  - Email address (clickable `mailto:` link)
  - Working hours by day
  - Social media icons: Facebook, Instagram, WhatsApp
- **Google Maps**
  - Full-width embedded map below contact section
  - Lord location pin
  - "Get Directions" link
- **Floating WhatsApp Button** _(global, all pages)_
  - Fixed position: bottom-right, 60px circle, Green `#25D366`
  - WhatsApp icon (white)
  - Links to `https://wa.me/{number}`
  - Hover: slight scale-up (1.05)

#### Backend

- **API Endpoints**
  - `POST /api/inquiries` — Submit contact/inquiry form
    - Request body: `{ name, email, phone, inquiryType, message, source: "contact-page" }`
    - Validation: all fields required, valid email, phone format
    - On success: create Inquiry record → trigger customer acknowledgement email → trigger staff notification email
    - Response: `201 Created` with inquiry ID and confirmation message
  - `GET /api/settings/contact` — Fetch contact details
- **Database Write**
  - `Inquiries` → new record with status "new", source "contact-page"
- **Email Triggers**
  - Customer acknowledgement email (branded HTML template with Lord logo)
  - Staff notification email to configured recipient addresses

---

### **1.7 FAQ Page**

#### Frontend

- **Page Header**
  - Breadcrumb: Home > FAQ
  - Title: "Frequently Asked Questions" (`heading-1`)
- **Category Tabs**
  - Tab bar: Products | Installation | Maintenance & Repair | Warranty | Delivery | General
  - Active tab: Teal underline
- **FAQ Accordion**
  - Question (`heading-4`, 18px Semi-Bold) — clickable to expand/collapse
  - Answer (`body`, 16px) — hidden by default, slide-down animation (200ms ease-out)
  - Chevron icon rotates on toggle
  - Border-bottom separator between items
- **CTA at Bottom**
  - "Can't find your answer?" + "Contact Us" button → links to Contact page

#### Backend

- **API Endpoints**
  - `GET /api/faqs?active=true` — Fetch all active FAQs
  - `GET /api/faqs?category=installation&active=true` — Filter by category
- **Database Queries**
  - `FAQs` where `active = true`, ordered by `category` then `displayOrder`

---

### **1.8 Shared / Global Components**

#### Frontend

- **Navbar** — see §1.1 (shared across all pages)
- **Footer** — see §1.1 (shared across all pages)
- **Floating WhatsApp Button** — see §1.6 (all pages)
- **Breadcrumb Component** — `body-sm`, Medium Gray, ">" separator, last item Navy
- **Loading Spinner** — Lord fan icon (from logo "O") rotating 360° continuously, 1000ms linear
- **Toast Notifications** — slide in from top-right, 4 variants (Success/Error/Warning/Info per UI/UX spec)
- **Image Placeholder** — Light Gray `#F1F3F5` with Lord icon mark, shimmer animation
- **Language Toggle** — "AR" / "EN" text button in navbar, persisted in cookie/localStorage, triggers full page re-render with `dir` attribute swap
- **SEO Head Component** — Dynamic `<title>`, `<meta description>`, Open Graph tags, JSON-LD schema markup per page
- **Mini Cart Dropdown** — Triggered from navbar cart icon; shows up to 4 items, subtotal, "View Cart" + "Checkout" buttons; empty state with shopping illustration
- **Cart Badge** — Teal circle with White item count on cart icon; animates (scale bounce) on add
- **Quantity Selector** — Reusable −/+ component with number input; min/max props; debounced onChange
- **Price Display Component** — Handles sale price (strike-through original), currency formatting (EGP), "Out of Stock" state
- **Order Status Badge** — Color-coded badge per status: Confirmed (Info), Processing (Amber), Shipped (Teal), Delivered (Green), Cancelled (Red), Refunded (Gray)
- **Auth Guard** — Route wrapper component; redirects to `/login` if not authenticated; returns to original URL after login
- **Customer Auth Context** — React context providing `customer`, `isAuthenticated`, `login()`, `logout()`, `refreshToken()`

#### Backend

- **API Endpoints (shared)**
  - `GET /api/settings/site` — Fetch site-wide settings (company name, logo URL, favicon, SEO defaults, OG image)
  - `GET /api/settings/contact` — Fetch contact info (address, phone, WhatsApp, email, hours, maps link, social links)
  - `GET /api/brands` — Fetch brand data (Carrier/Midea logos, dealer credentials)
  - `GET /api/cart` — Fetch current cart (authenticated: server cart; guest: returns empty, handled client-side)
  - `GET /api/settings/shipping` — Fetch shipping settings (flat rate, free shipping threshold)

---

## **2. PRODUCT CATALOG SYSTEM**

### Database Schema

```
Brands
├── id              UUID (PK)
├── name            VARCHAR(100) NOT NULL         -- "Carrier" or "Midea"
├── slug            VARCHAR(100) UNIQUE NOT NULL
├── logoUrl         TEXT
├── certificateUrl  TEXT                           -- Authorized dealer certificate image
├── isActive        BOOLEAN DEFAULT true
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

ProductCategories
├── id              UUID (PK)
├── name            VARCHAR(100) NOT NULL         -- "Split Unit", "Cassette", etc.
├── slug            VARCHAR(100) UNIQUE NOT NULL
├── icon            VARCHAR(50)                    -- Lucide icon name
├── isActive        BOOLEAN DEFAULT true
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

Products
├── id              UUID (PK)
├── brandId         UUID (FK → Brands.id) NOT NULL
├── categoryId      UUID (FK → ProductCategories.id) NOT NULL
├── name            VARCHAR(255) NOT NULL
├── slug            VARCHAR(255) UNIQUE NOT NULL
├── modelNumber     VARCHAR(100) NOT NULL
├── type            VARCHAR(50) NOT NULL
├── capacity        INTEGER                        -- BTU
├── capacityUnit    VARCHAR(10) DEFAULT 'BTU'
├── eerSeer         VARCHAR(50)                    -- e.g. "12.5 EER"
├── voltage         VARCHAR(50)                    -- e.g. "220-240V / 50Hz"
├── refrigerant     VARCHAR(50)                    -- e.g. "R-410A"
├── dimensionsJson  JSONB                          -- { width, height, depth, unit }
├── weightJson      JSONB                          -- { indoor, outdoor, unit }
├── color           VARCHAR(50)
├── description     TEXT                           -- Rich text / HTML
├── featuresJson    JSONB                          -- ["Inverter Technology", ...]
├── price           DECIMAL(10,2)
├── originalPrice   DECIMAL(10,2)                  -- Original price (before sale/discount)
├── currency        VARCHAR(10) DEFAULT 'EGP'
├── priceVisible    BOOLEAN DEFAULT true
├── stockQuantity   INTEGER DEFAULT 0              -- Available stock; 0 = out of stock
├── isFeatured      BOOLEAN DEFAULT false
├── isNewArrival    BOOLEAN DEFAULT false
├── isBestseller    BOOLEAN DEFAULT false
├── isActive        BOOLEAN DEFAULT true
├── metaTitle       VARCHAR(255)
├── metaDescription TEXT
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

ProductImages
├── id              UUID (PK)
├── productId       UUID (FK → Products.id) NOT NULL
├── url             TEXT NOT NULL
├── altText         VARCHAR(255)
├── displayOrder    INTEGER DEFAULT 0
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP
```

### API Endpoints Summary

| Method | Endpoint                                | Auth      | Description                               |
| ------ | --------------------------------------- | --------- | ----------------------------------------- |
| GET    | `/api/products`                         | Public    | List products with filtering & pagination |
| GET    | `/api/products/:slug`                   | Public    | Get single product full details           |
| GET    | `/api/products/:slug/related`           | Public    | Get related products                      |
| GET    | `/api/brands`                           | Public    | List all brands                           |
| GET    | `/api/product-categories`               | Public    | List product categories/types             |
| POST   | `/api/cms/products`                     | CMS Staff | Create new product                        |
| PATCH  | `/api/cms/products/:id`                 | CMS Staff | Update product                            |
| DELETE | `/api/cms/products/:id`                 | CMS Staff | Delete/archive product                    |
| POST   | `/api/cms/products/:id/images`          | CMS Staff | Upload product images                     |
| PATCH  | `/api/cms/products/:id/images/reorder`  | CMS Staff | Reorder product images                    |
| DELETE | `/api/cms/products/:id/images/:imageId` | CMS Staff | Delete product image                      |
| POST   | `/api/cms/products/import`              | CMS Admin | Bulk import products via CSV              |
| GET    | `/api/cms/products/export`              | CMS Staff | Export products to CSV                    |
| POST   | `/api/cms/brands`                       | CMS Admin | Create brand                              |
| PATCH  | `/api/cms/brands/:id`                   | CMS Admin | Update brand                              |
| POST   | `/api/cms/product-categories`           | CMS Admin | Create product category                   |
| PATCH  | `/api/cms/product-categories/:id`       | CMS Admin | Update product category                   |
| DELETE | `/api/cms/product-categories/:id`       | CMS Admin | Delete product category                   |

---

## **3. AFTER-SALES SERVICES SYSTEM**

### Database Schema

```
ServiceTypes
├── id              UUID (PK)
├── name            VARCHAR(100) NOT NULL         -- "Installation", "Maintenance", etc.
├── slug            VARCHAR(100) UNIQUE NOT NULL
├── icon            VARCHAR(50)                    -- Lucide icon name
├── displayOrder    INTEGER DEFAULT 0
├── isActive        BOOLEAN DEFAULT true
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

Services
├── id              UUID (PK)
├── serviceTypeId   UUID (FK → ServiceTypes.id) NOT NULL
├── name            VARCHAR(255) NOT NULL
├── slug            VARCHAR(255) UNIQUE NOT NULL
├── description     TEXT
├── scopeOfWorkJson JSONB                          -- ["Site survey", "Piping", ...]
├── applicableUnitsJson JSONB                      -- ["Split", "Cassette", ...]
├── estimatedDuration VARCHAR(50)                  -- e.g. "2-4 hours"
├── pricingType     VARCHAR(20) DEFAULT 'quoted'   -- "fixed" or "quoted"
├── price           DECIMAL(10,2)                  -- null if quoted
├── currency        VARCHAR(10) DEFAULT 'EGP'
├── isActive        BOOLEAN DEFAULT true
├── metaTitle       VARCHAR(255)
├── metaDescription TEXT
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP
```

### API Endpoints Summary

| Method | Endpoint                     | Auth      | Description                   |
| ------ | ---------------------------- | --------- | ----------------------------- |
| GET    | `/api/services`              | Public    | List active service offerings |
| GET    | `/api/services/:slug`        | Public    | Get single service detail     |
| GET    | `/api/service-types`         | Public    | List service type categories  |
| POST   | `/api/cms/services`          | CMS Staff | Create service offering       |
| PATCH  | `/api/cms/services/:id`      | CMS Staff | Update service offering       |
| DELETE | `/api/cms/services/:id`      | CMS Staff | Delete/archive service        |
| POST   | `/api/cms/service-types`     | CMS Admin | Create service type           |
| PATCH  | `/api/cms/service-types/:id` | CMS Admin | Update service type           |
| DELETE | `/api/cms/service-types/:id` | CMS Admin | Delete service type           |

---

## **4. INQUIRY & SERVICE REQUEST SYSTEM**

### Database Schema

```
Inquiries
├── id              UUID (PK)
├── type            VARCHAR(20) NOT NULL           -- "product" or "general" or "contact"
├── name            VARCHAR(255) NOT NULL
├── email           VARCHAR(255) NOT NULL
├── phone           VARCHAR(50) NOT NULL
├── inquiryType     VARCHAR(50)                    -- "purchase", "service", "general"
├── productId       UUID (FK → Products.id)        -- null if not product-specific
├── message         TEXT
├── preferredContactTime VARCHAR(50)
├── source          VARCHAR(100)                   -- "contact-page", "product-detail:carrier-42qhf024"
├── status          VARCHAR(20) DEFAULT 'new'      -- "new", "in_progress", "resolved", "closed"
├── assignedTo      UUID (FK → CmsUsers.id)        -- optional staff assignment
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

ServiceRequests
├── id              UUID (PK)
├── serviceTypeId   UUID (FK → ServiceTypes.id) NOT NULL
├── name            VARCHAR(255) NOT NULL
├── email           VARCHAR(255) NOT NULL
├── phone           VARCHAR(50) NOT NULL
├── unitBrand       VARCHAR(100)                   -- "Carrier" or "Midea" or other
├── unitModel       VARCHAR(100)
├── unitAge         VARCHAR(50)                    -- e.g. "2 years"
├── propertyType    VARCHAR(50)                    -- "residential" or "commercial"
├── floorNumber     INTEGER
├── installationAddress TEXT                       -- required for Installation service type
├── faultDescription TEXT
├── urgency         VARCHAR(20) DEFAULT 'standard' -- "standard" or "emergency"
├── lastServiceDate DATE
├── deliveryAddress TEXT
├── preferredDate   DATE
├── preferredTime   VARCHAR(50)                    -- e.g. "Morning (9-12)"
├── message         TEXT
├── source          VARCHAR(100)                   -- "services-page:installation"
├── status          VARCHAR(20) DEFAULT 'new'      -- "new", "in_progress", "resolved", "closed"
├── assignedTo      UUID (FK → CmsUsers.id)
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

InquiryNotes
├── id              UUID (PK)
├── inquiryId       UUID (FK → Inquiries.id)       -- one of these two must be set
├── serviceRequestId UUID (FK → ServiceRequests.id)
├── authorId        UUID (FK → CmsUsers.id) NOT NULL
├── content         TEXT NOT NULL
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP
```

### Public Form Flows

#### Product Inquiry Form (triggered from product detail page)

- Pre-filled: product name, model number, brand
- Customer fields: name, email, phone, preferred contact time, message
- On submit → `POST /api/inquiries` with `type: "product"`, `productId`, `source: "product-detail:{slug}"`

#### Service Request Form (triggered from services page or contact page)

- Service type selection (Installation / Maintenance / Repair / Delivery / Spare Parts)
- **Conditional fields per service type:**
  - **Installation:** unit brand/model (dropdown or text), property type (residential/commercial), floor number, **installation location address (required)**, preferred date/time
  - **Maintenance:** unit brand, model, age, last service date, issue description, preferred date/time
  - **Repair:** unit brand, model, age, fault description, urgency (standard/emergency), preferred date/time
  - **Delivery:** delivery address, preferred delivery window, linked product inquiry (optional)
- Common fields: name, email, phone, message
- On submit → `POST /api/service-requests` with `source: "services-page:{type-slug}"`

#### General Contact Inquiry (from contact page)

- Fields: name, email, phone, inquiry type dropdown, message
- On submit → `POST /api/inquiries` with `type: "contact"`, `source: "contact-page"`

### API Endpoints Summary

| Method | Endpoint                               | Auth      | Description                              |
| ------ | -------------------------------------- | --------- | ---------------------------------------- |
| POST   | `/api/inquiries`                       | Public    | Submit product or general inquiry        |
| POST   | `/api/service-requests`                | Public    | Submit after-sales service request       |
| GET    | `/api/cms/inquiries`                   | CMS Staff | List all inquiries (filtered, paginated) |
| GET    | `/api/cms/inquiries/:id`               | CMS Staff | Get inquiry detail                       |
| PATCH  | `/api/cms/inquiries/:id/status`        | CMS Staff | Update inquiry status                    |
| POST   | `/api/cms/inquiries/:id/notes`         | CMS Staff | Add internal note to inquiry             |
| GET    | `/api/cms/service-requests`            | CMS Staff | List all service requests                |
| GET    | `/api/cms/service-requests/:id`        | CMS Staff | Get service request detail               |
| PATCH  | `/api/cms/service-requests/:id/status` | CMS Staff | Update service request status            |
| POST   | `/api/cms/service-requests/:id/notes`  | CMS Staff | Add internal note to service request     |
| GET    | `/api/cms/inquiries/export`            | CMS Staff | Export inquiries to CSV                  |
| GET    | `/api/cms/service-requests/export`     | CMS Staff | Export service requests to CSV           |

### Status Flow

```
NEW → IN_PROGRESS → RESOLVED
                  → CLOSED

Status badge colors (from UI/UX spec):
  New:         Info Blue   #17A2B8
  In Progress: Warning Amber #FFC107 (dark text #1A1A2E)
  Resolved:    Success Green #28A745
  Closed:      Medium Gray   #6C757D
```

### Email Triggers

| Event                         | Recipient  | Template                                             |
| ----------------------------- | ---------- | ---------------------------------------------------- |
| New inquiry submitted         | Customer   | "Thank you for your inquiry — Lord Air Conditioning" |
| New inquiry submitted         | Lord Staff | "New Inquiry: {type} — {customer name}"              |
| New service request submitted | Customer   | "Service request received — Lord Air Conditioning"   |
| New service request submitted | Lord Staff | "New Service Request: {service type} — {customer}"   |
| Status changed to In Progress | Customer   | "Your request is being processed — Lord"             |
| Status changed to Resolved    | Customer   | "Your request has been resolved — Lord"              |

---

## **5. SHOPPING CART SYSTEM**

### Frontend Pages

#### Cart Page (`/cart`)

- **Page Header:** "Shopping Cart" (`heading-1`) with item count + breadcrumb (Home > Cart)
- **Cart Items List:**
  - Product image (80px), name, brand, model, unit price
  - Quantity selector (−/+ buttons with number input; min 1, max = stockQuantity)
  - Line total (quantity × unit price)
  - Remove item button (trash icon with confirmation tooltip)
  - Updates debounced (500ms) → calls `PATCH /api/cart/items/:itemId`
- **Price Summary Sidebar** (desktop) / **Bottom Sticky Bar** (mobile):
  - Subtotal (sum of all line totals)
  - Shipping (flat rate from `SiteSettings` or "Free" if subtotal ≥ threshold)
  - Discount (if coupon applied — shows code + discount amount)
  - **Grand Total** (bold, large, Teal)
- **Coupon Input:** Text input + "Apply" button; success: green badge; error: red text "Invalid code"
- **CTAs:** "Proceed to Checkout" Primary button (full-width mobile, disabled if empty) + "Continue Shopping" Ghost link
- **Empty State:** Illustration + "Your cart is empty" + "Browse Products" Primary CTA
- **Stock Warning:** If product stock dropped below cart quantity, show amber warning + auto-adjust

### Database Schema

```
Carts
├── id              UUID (PK)
├── customerId      UUID (FK → Customers.id)       -- null for guest carts
├── sessionId       VARCHAR(255)                    -- for guest cart identification
├── status          VARCHAR(20) DEFAULT 'active'    -- "active", "converted", "abandoned"
├── couponId        UUID (FK → Coupons.id)          -- applied coupon, if any
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

CartItems
├── id              UUID (PK)
├── cartId          UUID (FK → Carts.id) NOT NULL
├── productId       UUID (FK → Products.id) NOT NULL
├── quantity         INTEGER NOT NULL DEFAULT 1
├── unitPrice       DECIMAL(10,2) NOT NULL          -- price snapshot at time of addition
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP
```

### Cart API Endpoints

| Method | Endpoint                  | Auth     | Description                                  |
| ------ | ------------------------- | -------- | -------------------------------------------- |
| GET    | `/api/cart`               | Optional | Get current cart (by customer or session)    |
| POST   | `/api/cart/items`         | Optional | Add item to cart (productId, quantity)       |
| PATCH  | `/api/cart/items/:itemId` | Optional | Update item quantity                         |
| DELETE | `/api/cart/items/:itemId` | Optional | Remove item from cart                        |
| DELETE | `/api/cart`               | Optional | Clear entire cart                            |
| POST   | `/api/cart/coupon`        | Optional | Apply coupon code                            |
| DELETE | `/api/cart/coupon`        | Optional | Remove applied coupon                        |
| POST   | `/api/cart/merge`         | Customer | Merge guest cart into customer cart on login |

### Cart Logic

- **Guest cart:** stored in localStorage (`lord_cart` key); synced to server-side `Carts` table via `sessionId` (UUID cookie)
- **Authenticated cart:** stored server-side linked to `customerId`
- **Cart merge on login:** guest cart items merged into customer's existing cart; duplicates: sum quantities (capped at stock)
- **Stock validation:** Before checkout, validate all items against current `Products.stockQuantity`; warn/remove unavailable items
- **Cart expiry:** Abandoned carts older than 30 days auto-purged via cron job
- **Price snapshot:** `CartItems.unitPrice` captures price at time of addition; re-validated at checkout

### Response Shape (Cart):

```json
{
  "id": "uuid",
  "items": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Carrier 42QHF024",
        "brand": "Carrier",
        "modelNumber": "42QHF024",
        "thumbnailUrl": "...",
        "price": 4500,
        "stockQuantity": 15,
        "isActive": true
      },
      "quantity": 2,
      "unitPrice": 4500,
      "lineTotal": 9000
    }
  ],
  "subtotal": 9000,
  "shipping": 150,
  "discount": 0,
  "coupon": null,
  "total": 9150,
  "itemCount": 2
}
```

---

## **6. CUSTOMER AUTHENTICATION SYSTEM**

### Frontend Pages

#### Login Page (`/login`)

- Centered card (max 440px) on Off-White background; Lord logo above
- Email + Password inputs; "Show password" eye toggle
- "Login" Primary button (full-width, Teal)
- "Forgot Password?" link below password field
- "Don't have an account? Register" link at bottom
- Error: generic red alert "Invalid email or password"
- On success: redirect to previous page or `/account`

#### Register Page (`/register`)

- Same centered card style as Login
- Fields: Full name, Email, Phone, Password, Confirm Password
- Real-time validation (Zod); password strength indicator bar (red/amber/green)
- "Create Account" Primary button
- "Already have an account? Login" link
- On success: redirect to email verification page

#### Email Verification Page (`/verify-email`)

- Centered card with email icon illustration
- 6 separate digit inputs (auto-focus next, paste support)
- "Resend code in 60s" countdown timer; "Resend Code" link after timer
- "Verify Email" Primary button
- Success: green checkmark → auto-redirect to login after 2 sec

#### Forgot Password Flow (`/forgot-password`)

- Step 1: Email input → "Send Reset Code" CTA
- Step 2: 6-digit OTP input
- Step 3: New password + confirm password; strength indicator
- Step 4: Success message → redirect to login

### Database Schema

```
Customers
├── id              UUID (PK)
├── name            VARCHAR(255) NOT NULL
├── nationalId      VARCHAR(14) NOT NULL            -- Egyptian National ID (14 digits)
├── email           VARCHAR(255) UNIQUE NOT NULL
├── phone           VARCHAR(50)
├── passwordHash    TEXT NOT NULL
├── isEmailVerified BOOLEAN DEFAULT false
├── emailOtpCode    VARCHAR(10)
├── emailOtpExpiresAt TIMESTAMP
├── resetOtpCode    VARCHAR(10)
├── resetOtpExpiresAt TIMESTAMP
├── failedAttempts  INTEGER DEFAULT 0
├── lockedUntil     TIMESTAMP
├── isActive        BOOLEAN DEFAULT true
├── lastLoginAt     TIMESTAMP
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

CustomerAddresses
├── id              UUID (PK)
├── customerId      UUID (FK → Customers.id) NOT NULL
├── label           VARCHAR(50)                    -- "Home", "Office", "Other"
├── recipientName   VARCHAR(255) NOT NULL
├── phone           VARCHAR(50) NOT NULL
├── addressLine1    TEXT NOT NULL
├── addressLine2    TEXT
├── city            VARCHAR(100) NOT NULL
├── governorate     VARCHAR(100) NOT NULL
├── postalCode      VARCHAR(20)
├── isDefault       BOOLEAN DEFAULT false
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP
```

### Customer Auth API Endpoints

| Method | Endpoint                             | Auth     | Description                              |
| ------ | ------------------------------------ | -------- | ---------------------------------------- |
| POST   | `/api/auth/register`                 | Public   | Register new customer account            |
| POST   | `/api/auth/verify-email`             | Public   | Verify email with 6-digit OTP            |
| POST   | `/api/auth/resend-otp`               | Public   | Resend email verification OTP            |
| POST   | `/api/auth/login`                    | Public   | Customer login, return JWT tokens        |
| POST   | `/api/auth/logout`                   | Customer | Blacklist current tokens                 |
| POST   | `/api/auth/refresh`                  | Public   | Refresh access token                     |
| POST   | `/api/auth/forgot-password`          | Public   | Send password reset OTP                  |
| POST   | `/api/auth/reset-password`           | Public   | Verify OTP + set new password            |
| GET    | `/api/account/profile`               | Customer | Get customer profile                     |
| PATCH  | `/api/account/profile`               | Customer | Update profile (name, nationalId, phone) |
| PATCH  | `/api/account/change-password`       | Customer | Change password (current + new)          |
| GET    | `/api/account/addresses`             | Customer | List saved addresses                     |
| POST   | `/api/account/addresses`             | Customer | Add new address                          |
| PATCH  | `/api/account/addresses/:id`         | Customer | Update address                           |
| DELETE | `/api/account/addresses/:id`         | Customer | Delete address                           |
| PATCH  | `/api/account/addresses/:id/default` | Customer | Set address as default                   |

### Auth Logic

- **Registration:** Validate fields (including nationalId — must be exactly 14 digits) → hash password (bcrypt, 10 rounds) → create `Customers` record → send 6-digit OTP email
- **Email verification:** Required before first checkout; verified flag stored as `isEmailVerified`
- **Login:** Validate credentials → check `isEmailVerified` → check `lockedUntil` → issue JWT (1h access + 7d refresh)
- **JWT:** Separate signing key from CMS auth; customer tokens include `role: "customer"` and `customerId`
- **Address limit:** Max 10 addresses per customer; only one `isDefault = true` at a time

### Response Shape (Customer Profile):

```json
{
  "id": "uuid",
  "name": "Ahmed Mohamed",
  "nationalId": "12345678901234",
  "email": "ahmed@example.com",
  "phone": "+201234567890",
  "isEmailVerified": true,
  "addressCount": 3,
  "orderCount": 7,
  "createdAt": "..."
}
```

---

## **7. CHECKOUT & PAYMENT SYSTEM (PAYMOB)**

### Frontend Pages

#### Checkout Page (`/checkout`)

- **Layout:** Two columns — Left: step forms (60%) + Right: order summary sidebar (40%); single column on mobile
- **Progress Stepper:** 1. Shipping → 2. Review → 3. Payment → 4. Confirmation (Teal filled = completed, bold = current, gray = upcoming)
- **Guest Checkout:** Option for unregistered users — requires name, national ID (14 digits), email, phone, shipping address

#### Step 1: Shipping Address

- Logged-in users: display saved address cards (selectable); pre-select default
- New address form: recipient name, phone, address line 1, line 2, city, governorate (dropdown), postal code
- Guest checkout: also requires national ID field (14-digit Egyptian National ID, validated)
- "Save this address" checkbox (logged-in only)
- "Continue to Review" Primary CTA

#### Step 2: Order Review

- Read-only items list (thumbnail, name, qty, unit price, line total)
- Shipping address display with "Edit" link
- Price breakdown: Subtotal + Shipping + Discount = **Total (EGP)**
- "Proceed to Payment" Primary CTA

#### Step 3: Payment (Paymob)

- Payment method radio selection:
  - **Credit/Debit Card** — Visa/Mastercard icons
  - **Mobile Wallet** — Vodafone Cash, Etisalat Cash, Orange Money icons
  - **Installments** — Calendar icon + available plan info (if configured)
- On selection → redirects to Paymob hosted payment page or embeds Paymob iframe
- Loading overlay: "Processing payment..." + Lord fan spinner + "Do not close this page"
- Error state: red alert with retry button
- Trust signals: lock icon + "Secured by Paymob" + card brand logos

#### Order Confirmation Page (`/order-confirmation/:orderId`)

- Green checkmark animation + "Order placed successfully!"
- Order number (e.g., `#LORD-20260001`) with copy button
- Items summary, total, payment method, shipping address
- Paymob transaction ID and payment receipt details
- Estimated delivery: "3–5 business days" (configurable)
- CTAs: "Track My Order" Primary + "Continue Shopping" Secondary
- Email note: "Confirmation email sent to [email]"

### Paymob Integration Flow

```
1. Customer clicks "Proceed to Payment"
2. Backend creates Paymob order (POST https://accept.paymob.com/api/auth/tokens → POST /api/ecommerce/orders)
3. Backend requests Payment Key (POST https://accept.paymob.com/api/acceptance/payment_keys)
   - Includes: amount (piasters), currency (EGP), integration_id, order_id, billing_data
4. Frontend receives payment key → renders Paymob iframe or redirects to Paymob hosted page
5. Customer completes payment on Paymob
6. Paymob sends webhook callback (POST /api/webhooks/paymob) with HMAC-SHA512 signature
7. Backend verifies HMAC → updates Payment record → updates Order status
8. Customer redirected back to Order Confirmation page
```

### Database Schema

```
Payments
├── id              UUID (PK)
├── orderId         UUID (FK → Orders.id) NOT NULL
├── paymobOrderId   VARCHAR(100)                   -- Paymob's order ID
├── paymobTransactionId VARCHAR(100)               -- Paymob's transaction ID
├── amount          DECIMAL(10,2) NOT NULL          -- Amount in EGP
├── amountPiasters  INTEGER NOT NULL                -- Amount in piasters (for Paymob API)
├── currency        VARCHAR(10) DEFAULT 'EGP'
├── paymentMethod   VARCHAR(50)                    -- "card", "wallet", "installment"
├── cardBrand       VARCHAR(20)                    -- "visa", "mastercard" (if card)
├── cardLastFour    VARCHAR(4)                     -- Last 4 digits (if card)
├── walletNumber    VARCHAR(20)                    -- Wallet phone number (if wallet)
├── status          VARCHAR(20) DEFAULT 'pending'   -- "pending", "success", "failed", "refunded"
├── gatewayResponse JSONB                          -- Full Paymob response JSON
├── paidAt          TIMESTAMP
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

Refunds
├── id              UUID (PK)
├── orderId         UUID (FK → Orders.id) NOT NULL
├── paymentId       UUID (FK → Payments.id) NOT NULL
├── paymobRefundId  VARCHAR(100)                   -- Paymob's refund transaction ID
├── amount          DECIMAL(10,2) NOT NULL          -- Refund amount in EGP
├── reason          TEXT
├── status          VARCHAR(20) DEFAULT 'pending'   -- "pending", "processed", "failed"
├── initiatedBy     UUID (FK → CmsUsers.id)         -- CMS staff who initiated
├── processedAt     TIMESTAMP
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

Coupons
├── id              UUID (PK)
├── code            VARCHAR(50) UNIQUE NOT NULL
├── discountType    VARCHAR(20) NOT NULL            -- "percentage" or "fixed"
├── discountValue   DECIMAL(10,2) NOT NULL          -- e.g. 10 (%) or 50 (EGP)
├── minimumOrder    DECIMAL(10,2) DEFAULT 0         -- Minimum order value to apply
├── maxUsage        INTEGER                         -- null = unlimited
├── usageCount      INTEGER DEFAULT 0
├── startDate       DATE NOT NULL
├── endDate         DATE NOT NULL
├── isActive        BOOLEAN DEFAULT true
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

CouponUsage
├── id              UUID (PK)
├── couponId        UUID (FK → Coupons.id) NOT NULL
├── orderId         UUID (FK → Orders.id) NOT NULL
├── customerId      UUID (FK → Customers.id)        -- null for guest orders
├── discountApplied DECIMAL(10,2) NOT NULL
├── createdAt       TIMESTAMP
```

### Checkout & Payment API Endpoints

| Method | Endpoint                       | Auth      | Description                                   |
| ------ | ------------------------------ | --------- | --------------------------------------------- |
| POST   | `/api/orders`                  | Optional  | Create order from cart (initiates checkout)   |
| POST   | `/api/orders/:id/pay`          | Optional  | Initiate Paymob payment (returns payment key) |
| POST   | `/api/webhooks/paymob`         | Public \* | Paymob webhook callback (HMAC verified)       |
| GET    | `/api/orders/:id/confirmation` | Optional  | Get order confirmation details                |
| POST   | `/api/coupons/validate`        | Public    | Validate coupon code                          |

> \* Paymob webhook endpoint is public but protected by HMAC-SHA512 signature verification

### Payment Security

- **HMAC Verification:** Validate Paymob webhook signature using HMAC-SHA512 with secret key
- **Amount Verification:** Server-side recalculation of order total before Paymob API call (prevent client-side tampering)
- **Idempotency:** Order creation uses idempotency key to prevent duplicate charges on network retries
- **No PAN Storage:** Card data never touches Lord servers; handled entirely by Paymob (PCI-DSS compliance delegated)
- **Environment Variables:** `PAYMOB_API_KEY`, `PAYMOB_HMAC_SECRET`, `PAYMOB_CARD_INTEGRATION_ID`, `PAYMOB_WALLET_INTEGRATION_ID`, `PAYMOB_IFRAME_ID`

---

## **8. ORDER MANAGEMENT SYSTEM**

### Database Schema

```
Orders
├── id              UUID (PK)
├── orderNumber     VARCHAR(50) UNIQUE NOT NULL     -- e.g. "LORD-20260001"
├── customerId      UUID (FK → Customers.id)        -- null for guest orders
├── guestEmail      VARCHAR(255)                    -- for guest checkout
├── guestPhone      VARCHAR(50)                     -- for guest checkout
├── guestName       VARCHAR(255)                    -- for guest checkout
├── guestNationalId VARCHAR(14)                     -- for guest checkout (14-digit Egyptian National ID)
├── shippingAddress  JSONB NOT NULL                  -- { recipientName, phone, addressLine1, addressLine2, city, governorate, postalCode }
├── subtotal        DECIMAL(10,2) NOT NULL
├── shippingFee     DECIMAL(10,2) DEFAULT 0
├── discountAmount  DECIMAL(10,2) DEFAULT 0
├── total           DECIMAL(10,2) NOT NULL
├── couponId        UUID (FK → Coupons.id)
├── paymentStatus   VARCHAR(20) DEFAULT 'pending'   -- "pending", "paid", "failed", "refunded", "partially_refunded"
├── orderStatus     VARCHAR(20) DEFAULT 'pending_payment' -- "pending_payment", "confirmed", "processing", "shipped", "delivered", "cancelled"
├── trackingNumber  VARCHAR(100)
├── shippingCarrier VARCHAR(100)
├── internalNotes   TEXT
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

OrderItems
├── id              UUID (PK)
├── orderId         UUID (FK → Orders.id) NOT NULL
├── productId       UUID (FK → Products.id) NOT NULL
├── productName     VARCHAR(255) NOT NULL           -- Snapshot at order time
├── productModel    VARCHAR(100)                    -- Snapshot at order time
├── brandName       VARCHAR(100)                    -- Snapshot at order time
├── thumbnailUrl    TEXT                            -- Snapshot at order time
├── quantity        INTEGER NOT NULL
├── unitPrice       DECIMAL(10,2) NOT NULL          -- Price at order time
├── lineTotal       DECIMAL(10,2) NOT NULL
├── createdAt       TIMESTAMP
└── updatedAt       TIMESTAMP

OrderStatusHistory
├── id              UUID (PK)
├── orderId         UUID (FK → Orders.id) NOT NULL
├── oldStatus       VARCHAR(20)
├── newStatus       VARCHAR(20) NOT NULL
├── changedBy       VARCHAR(50)                    -- "system", "customer", CMS user ID
├── note            TEXT
├── createdAt       TIMESTAMP
```

### Customer-Facing Endpoints

| Method | Endpoint                         | Auth     | Description                              |
| ------ | -------------------------------- | -------- | ---------------------------------------- |
| GET    | `/api/account/orders`            | Customer | List customer's orders (paginated)       |
| GET    | `/api/account/orders/:id`        | Customer | Get order detail (own orders only)       |
| POST   | `/api/account/orders/:id/cancel` | Customer | Cancel order (only if confirmed/pending) |
| GET    | `/api/orders/track/:orderNumber` | Public   | Track order by order number + email      |

### CMS Order Management Endpoints

| Method | Endpoint                     | Auth      | Description                               |
| ------ | ---------------------------- | --------- | ----------------------------------------- |
| GET    | `/api/cms/orders`            | CMS Staff | List all orders (filtered, paginated)     |
| GET    | `/api/cms/orders/:id`        | CMS Staff | Get order detail                          |
| PATCH  | `/api/cms/orders/:id/status` | CMS Staff | Update order status                       |
| POST   | `/api/cms/orders/:id/refund` | CMS Admin | Initiate refund via Paymob API            |
| POST   | `/api/cms/orders/:id/notes`  | CMS Staff | Add internal note                         |
| GET    | `/api/cms/orders/export`     | CMS Staff | Export orders to CSV                      |
| GET    | `/api/cms/orders/stats`      | CMS Staff | Dashboard stats (today's orders, revenue) |

### Order Lifecycle

```
                                 ┌─── CANCELLED
                                 │    (by customer or CMS)
                                 │
PENDING_PAYMENT ──→ CONFIRMED ──→ PROCESSING ──→ SHIPPED ──→ DELIVERED
  (awaiting Paymob)   (paid)        (preparing)    (dispatched)  (completed)
                                                               │
                                                               └─── REFUNDED
                                                                    (via Paymob)

Status badge colors:
  Pending Payment: Warning Amber #FFC107
  Confirmed:       Info Blue #17A2B8
  Processing:      Warning Amber #FFC107
  Shipped:         Lord Teal #0DBACA
  Delivered:       Success Green #28A745
  Cancelled:       Error Red #DC3545
  Refunded:        Medium Gray #6C757D
```

### Order Logic

- **Order number format:** `LORD-YYYYMMNN` where NN is daily sequence (e.g., LORD-20260401)
- **Stock deduction:** On order confirmation (payment success), decrement `Products.stockQuantity` for each item; use optimistic locking to prevent overselling
- **Order cancellation:** Customer can cancel if status is `confirmed` (before processing); CMS staff can cancel at any stage
- **Auto-cancel:** Unpaid orders (`pending_payment`) auto-cancelled after 30 minutes via cron job
- **Refund:** CMS staff initiates via Paymob API; partial refunds supported; `Payment.status` → "refunded" or "partially_refunded"
- **Email notifications:** Sent at each status change (confirmation, shipped with tracking, delivered, cancelled, refunded)

### Response Shape (Order Detail):

```json
{
  "id": "uuid",
  "orderNumber": "LORD-20260401",
  "customer": {
    "name": "Ahmed",
    "nationalId": "12345678901234",
    "email": "...",
    "phone": "..."
  },
  "items": [
    {
      "productName": "Carrier 42QHF024",
      "brandName": "Carrier",
      "quantity": 2,
      "unitPrice": 4500,
      "lineTotal": 9000,
      "thumbnailUrl": "..."
    }
  ],
  "shippingAddress": {
    "recipientName": "Ahmed Mohamed",
    "phone": "+201234567890",
    "addressLine1": "123 El-Tahrir St",
    "city": "Cairo",
    "governorate": "Cairo"
  },
  "subtotal": 9000,
  "shippingFee": 150,
  "discountAmount": 0,
  "total": 9150,
  "paymentStatus": "paid",
  "orderStatus": "shipped",
  "trackingNumber": "EG123456789",
  "shippingCarrier": "Aramex",
  "payment": {
    "method": "card",
    "cardBrand": "visa",
    "cardLastFour": "4242",
    "amount": 9150,
    "paidAt": "..."
  },
  "statusHistory": [
    { "status": "pending_payment", "timestamp": "..." },
    { "status": "confirmed", "timestamp": "..." },
    { "status": "processing", "timestamp": "..." },
    { "status": "shipped", "timestamp": "...", "note": "Aramex EG123456789" }
  ],
  "createdAt": "..."
}
```

---

## **9. CMS PANEL**

### **9.1 CMS Authentication**

#### Frontend

- **Login Page**
  - Lord logo (centered, 80px height)
  - Email input (44px height, 8px radius, Teal focus border)
  - Password input (same styling, with show/hide toggle)
  - "Sign In" → Primary button (Large, full-width, Teal)
  - Error display: Red toast notification
  - "Forgot Password?" link → triggers OTP flow
- **Forgot Password Flow**
  - Step 1: Enter email → sends OTP
  - Step 2: Enter 6-digit OTP code
  - Step 3: New password + confirm password
  - Success → redirect to login

#### Backend

- **API Endpoints**
  - `POST /api/cms/auth/login` — Authenticate CMS staff, return JWT tokens
    - Request: `{ email, password }`
    - Response: `{ accessToken, refreshToken, user: { id, name, email, role } }`
  - `POST /api/cms/auth/logout` — Blacklist current tokens
  - `POST /api/cms/auth/refresh` — Refresh access token using refresh token
  - `POST /api/cms/auth/forgot-password` — Send OTP to email
  - `POST /api/cms/auth/reset-password` — Verify OTP and set new password
- **Database Schema**

  ```
  CmsUsers
  ├── id              UUID (PK)
  ├── name            VARCHAR(255) NOT NULL
  ├── email           VARCHAR(255) UNIQUE NOT NULL
  ├── passwordHash    TEXT NOT NULL
  ├── role            VARCHAR(20) NOT NULL          -- "cms_admin" or "cms_staff"
  ├── otpCode         VARCHAR(10)
  ├── otpExpiresAt    TIMESTAMP
  ├── failedAttempts  INTEGER DEFAULT 0
  ├── lockedUntil     TIMESTAMP
  ├── isActive        BOOLEAN DEFAULT true
  ├── lastLoginAt     TIMESTAMP
  ├── createdAt       TIMESTAMP
  └── updatedAt       TIMESTAMP

  TokenBlacklist
  ├── id              UUID (PK)
  ├── token           TEXT NOT NULL
  ├── expiresAt       TIMESTAMP NOT NULL
  └── createdAt       TIMESTAMP
  ```

---

### **9.2 CMS Layout & Navigation**

#### Frontend

- **Layout:** Fixed left sidebar (260px) + scrollable main content area
- **Sidebar:**
  - Background: Navy `#172041`
  - Lord logo at top (White version, 40px height, 24px padding)
  - Navigation items (per UI/UX spec §15.2):
    1. 📊 Dashboard
    2. 🛍️ Orders
    3. 👥 Customers
    4. 📦 Products
    5. 🏷️ Brands & Categories
    6. 🔧 Services
    7. 💬 Inquiries & Requests
    8. 🎫 Coupons & Promos
    9. 📄 Content Pages
    10. ⭐ Testimonials
    11. ❓ FAQs
    12. ⚙️ Settings
  - Nav text: White (active), Silver `#BEBEBE` (inactive)
  - Active item: left border 3px Teal + background `rgba(13, 186, 202, 0.1)`
  - Mobile: sidebar collapses to icon-only (48px) or off-canvas with overlay
- **Top Bar:**
  - Height: 64px, White background, subtle bottom shadow
  - Left: Page title (`heading-2`)
  - Right: User avatar + name + role badge + dropdown (Profile, Logout)
- **Main Content:**
  - Background: Off-White `#F8FAFB`
  - Content cards: White, 24px padding, 12px radius, on Off-White background

---

### **9.3 CMS Dashboard**

#### Frontend

- **Summary Cards** (4 across, top row)
  - **Revenue Today:** Total EGP + percentage change vs. yesterday; left border Teal
  - **New Orders Today:** Count + quick link to orders list; left border Teal
  - **Pending Orders:** Count of orders needing processing; left border Amber
  - Total Products: count split by brand (Carrier: X, Midea: Y); out of stock alert count
  - Card style: White, 12px radius, left border 3px (Teal for positive, Amber for pending)
- **Recent Orders Table** (10 most recent)
  - Columns: Order #, Customer, Items Count, Total (EGP), Payment Status badge, Order Status badge, Date, Action (→ view)
  - Row hover: light teal tint `#F0FAFA`
- **Revenue Chart** (last 30 days)
  - Line chart: daily revenue (Teal line on Navy grid)
  - Below chart: period total revenue, average order value
- **Latest Inquiries Table** (5 most recent)
  - Columns: Date, Customer Name, Type, Status badge, Action (→ view)
- **Quick Actions**
  - "View Orders" → Primary button
  - "Add Product" → Secondary button
  - "View Inquiries" → Ghost button
  - "Manage Coupons" → Ghost button

#### Backend

- **API Endpoint**
  - `GET /api/cms/dashboard` — Returns aggregated dashboard data
  - Response:
    ```json
    {
      "revenueToday": 45000,
      "revenueTodayChange": 12.5,
      "ordersToday": 8,
      "pendingOrders": 3,
      "totalProducts": { "carrier": 45, "midea": 32, "total": 77, "outOfStock": 4 },
      "inquiriesToday": 5,
      "recentOrders": [...],
      "revenueChart": [{ "date": "2026-04-01", "revenue": 32000 }, ...],
      "latestInquiries": [...]
    }
    ```

---

### **9.4 CMS Product Management**

#### Frontend

- **Products List**
  - Data table (per UI/UX spec §7.8):
    - Header: Off-White `#F8FAFB`, 13px Semi-Bold
    - Columns: Image (thumbnail), Name, Brand, Type, Capacity, Price, Status (badge), Featured (toggle), Actions
    - Row height: 52px, alternate row `#FAFBFC`
    - Row hover: `#F0FAFA`
  - Filters: brand dropdown, type dropdown, status (active/inactive), search
  - Pagination: 20 per page
  - "Add Product" button (Primary, top-right)
  - Bulk actions: Export CSV, Import CSV
- **Add/Edit Product Form**
  - Tabs: General | Specifications | Images | SEO
  - **General Tab:**
    - Brand (select: Carrier/Midea), Category (select), Name, Model Number, Description (rich text editor)
    - Price, **Original Price (for sale display)**, Currency, Price Visible toggle
    - **Stock Quantity (number input)**
    - Flags: Featured, New Arrival, Bestseller, Active (toggles)
  - **Specifications Tab:**
    - Capacity (number + unit select), EER/SEER, Voltage, Refrigerant
    - Dimensions (W × H × D, unit), Weight (indoor + outdoor, unit), Color
    - Features (dynamic list: add/remove feature items)
  - **Images Tab:**
    - Drag-and-drop upload area (max 10 images, max 5MB each, images only)
    - Image preview grid with drag-to-reorder
    - Delete button per image (with confirmation modal)
    - Alt text input per image
  - **SEO Tab:**
    - Slug (auto-generated from name, editable)
    - Meta Title, Meta Description
    - Preview: Google search result preview
  - Save button: "Save Product" (Primary), "Save & Add Another" (Secondary)

#### Backend

- See §2 API Endpoints Summary for all product CRUD endpoints
- **Image Upload:**
  - `POST /api/cms/products/:id/images` — multipart/form-data
  - Validate: file type (JPEG, PNG, WebP), max size 5MB, max 10 images per product
  - Upload to S3 → store URL in `ProductImages` table
  - Generate optimized versions (thumbnail 400px, medium 800px, large 1200px)

---

### **9.5 CMS Services Management**

#### Frontend

- **Services List**
  - Data table: Name, Type, Pricing Type (Fixed/Quoted), Price, Active (toggle), Actions (Edit, Delete)
  - Filter by service type
  - "Add Service" button
- **Add/Edit Service Form**
  - Service Type (select: Installation, Maintenance, Repair, Delivery, Spare Parts)
  - Name, Description (rich text)
  - Scope of work (dynamic list: add/remove items)
  - Applicable unit types (multi-select checkboxes)
  - Estimated duration (text)
  - Pricing type (radio: Fixed / Quoted), Price (if fixed)
  - Active toggle
  - Save button

#### Backend

- See §3 API Endpoints Summary

---

### **9.6 CMS Inquiries & Service Requests**

#### Frontend

- **Tab Layout:** "Product Inquiries" | "Service Requests" | "Contact Messages"
- **List View** (each tab):
  - Data table: Date, Customer Name, Email, Phone, Type/Service, Status (badge), Urgency (service requests only), Actions
  - Filters: status dropdown, date range picker, type/service dropdown, search
  - Bulk export to CSV
  - Pagination: 20 per page
- **Detail View** (modal or dedicated page):
  - Customer information card
  - Inquiry/request details card (product reference, service type, unit details, etc.)
  - Status update dropdown (New → In Progress → Resolved / Closed) + save button
  - **Internal Notes Section:**
    - List of existing notes (author name, date, content)
    - "Add Note" textarea + submit button
    - Notes are internal-only (not visible to customer)

#### Backend

- See §4 API Endpoints Summary

---

### **9.7 CMS Content Management**

#### Frontend

- **Content Pages List**
  - Table: Page Key, Title, Status (Published/Draft badge), Last Updated, Actions (Edit)
  - Pages: home, about, services (overview text), privacy-policy, terms
- **Content Page Editor**
  - Page title input
  - JSON content editor or structured form (depends on page)
  - SEO fields: Meta Title, Meta Description
  - Publish toggle
  - Save button
- **Company Profile Editor** (About page content)
  - Company story (rich text)
  - Mission and vision (text areas)
  - Milestones (dynamic list: year + event)
  - Stats (key-value pairs: label + number)
- **Contact Information Editor**
  - Address, Phone, WhatsApp, Email, Google Maps link
  - Working hours (per day: day name, open time, close time, is open toggle)
  - Social media links (Facebook URL, Instagram URL, WhatsApp URL)

#### Backend

- **API Endpoints**
  - `GET /api/cms/content` — List all content pages
  - `GET /api/cms/content/:pageKey` — Get content page by key
  - `PATCH /api/cms/content/:pageKey` — Update content page
  - `GET /api/cms/settings/contact` — Get contact settings
  - `PATCH /api/cms/settings/contact` — Update contact settings
  - `GET /api/cms/settings/company` — Get company profile
  - `PATCH /api/cms/settings/company` — Update company profile
- **Database Schema**

  ```
  ContentPages
  ├── id              UUID (PK)
  ├── pageKey         VARCHAR(50) UNIQUE NOT NULL   -- "home", "about", etc.
  ├── title           VARCHAR(255) NOT NULL
  ├── contentJson     JSONB NOT NULL                -- Structured page content
  ├── metaTitle       VARCHAR(255)
  ├── metaDescription TEXT
  ├── isPublished     BOOLEAN DEFAULT false
  ├── createdAt       TIMESTAMP
  └── updatedAt       TIMESTAMP

  SiteSettings
  ├── id              UUID (PK)
  ├── key             VARCHAR(100) UNIQUE NOT NULL  -- "contact", "company", "seo", "branding"
  ├── valueJson       JSONB NOT NULL
  ├── createdAt       TIMESTAMP
  └── updatedAt       TIMESTAMP
  ```

---

### **9.8 CMS Testimonials**

#### Frontend

- **Testimonials List**
  - Data table: Customer Name, Content (truncated), Rating (stars), Approved (toggle), Featured (toggle), Date, Actions
  - Filter: approved/pending, featured
  - "Add Testimonial" button
- **Add/Edit Testimonial Form**
  - Customer name, Location/City, Rating (1–5 star selector), Content (textarea)
  - Product reference (optional select)
  - Approved toggle, Featured toggle
  - Save button

#### Backend

- **API Endpoints**
  - `GET /api/testimonials?approved=true` — Public: fetch approved testimonials
  - `GET /api/cms/testimonials` — CMS: list all testimonials
  - `POST /api/cms/testimonials` — Create testimonial
  - `PATCH /api/cms/testimonials/:id` — Update testimonial
  - `PATCH /api/cms/testimonials/:id/approve` — Toggle approval
  - `PATCH /api/cms/testimonials/:id/feature` — Toggle featured
  - `DELETE /api/cms/testimonials/:id` — Delete testimonial
- **Database Schema**
  ```
  Testimonials
  ├── id              UUID (PK)
  ├── customerName    VARCHAR(255) NOT NULL
  ├── location        VARCHAR(255)
  ├── content         TEXT NOT NULL
  ├── rating          INTEGER NOT NULL CHECK (1-5)
  ├── productId       UUID (FK → Products.id)      -- optional product reference
  ├── isApproved      BOOLEAN DEFAULT false
  ├── isFeatured      BOOLEAN DEFAULT false
  ├── createdAt       TIMESTAMP
  └── updatedAt       TIMESTAMP
  ```

---

### **9.9 CMS Promotions & Offers**

#### Frontend

- **Promotions List**
  - Data table: Title, Image (thumbnail), Start Date, End Date, Active (badge), Actions
  - "Add Promotion" button
- **Add/Edit Promotion Form**
  - Title, Image upload (banner), Link URL
  - Start date, End date (date pickers)
  - Discount type (radio: Percentage / Fixed Amount), Discount value
  - Linked product (optional select)
  - Active toggle
  - Save button

#### Backend

- **API Endpoints**
  - `GET /api/promotions?active=true` — Public: fetch active promotions (within date range)
  - `GET /api/cms/promotions` — CMS: list all promotions
  - `POST /api/cms/promotions` — Create promotion
  - `PATCH /api/cms/promotions/:id` — Update promotion
  - `DELETE /api/cms/promotions/:id` — Delete promotion
- **Database Schema**
  ```
  Promotions
  ├── id              UUID (PK)
  ├── title           VARCHAR(255) NOT NULL
  ├── imageUrl        TEXT
  ├── linkUrl         TEXT
  ├── discountType    VARCHAR(20)                   -- "percentage" or "fixed"
  ├── discountValue   DECIMAL(10,2)
  ├── productId       UUID (FK → Products.id)       -- optional linked product
  ├── startDate       DATE NOT NULL
  ├── endDate         DATE NOT NULL
  ├── isActive        BOOLEAN DEFAULT true
  ├── createdAt       TIMESTAMP
  └── updatedAt       TIMESTAMP
  ```
- **Auto-activation logic:** Cron job or query filter checks `startDate <= NOW() AND endDate >= NOW() AND isActive = true` for public-facing promotion display.

---

### **9.10 CMS FAQ Management**

#### Frontend

- **FAQ List**
  - Data table: Question (truncated), Category (badge), Order, Active (toggle), Actions
  - Filter by category: Products, Installation, Maintenance & Repair, Warranty, Delivery, General
  - Drag-to-reorder rows within each category
  - "Add FAQ" button
- **Add/Edit FAQ Form**
  - Category (select), Question (text), Answer (rich text)
  - Display order (number)
  - Active toggle
  - Save button

#### Backend

- **API Endpoints**
  - `GET /api/faqs?active=true` — Public: fetch active FAQs
  - `GET /api/cms/faqs` — CMS: list all FAQs
  - `POST /api/cms/faqs` — Create FAQ
  - `PATCH /api/cms/faqs/:id` — Update FAQ
  - `PATCH /api/cms/faqs/reorder` — Reorder FAQs (body: `[{ id, displayOrder }]`)
  - `DELETE /api/cms/faqs/:id` — Delete FAQ
- **Database Schema**
  ```
  FAQs
  ├── id              UUID (PK)
  ├── question        TEXT NOT NULL
  ├── answer          TEXT NOT NULL
  ├── category        VARCHAR(50) NOT NULL          -- "products", "installation", etc.
  ├── displayOrder    INTEGER DEFAULT 0
  ├── isActive        BOOLEAN DEFAULT true
  ├── createdAt       TIMESTAMP
  └── updatedAt       TIMESTAMP
  ```

---

### **9.11 CMS Settings**

#### Frontend

- **Settings Tabs:** General | Contact | Email | SEO | Brands | **Paymob** | **Shipping**
- **General Tab:**
  - Company name, Logo upload, Favicon upload
  - Primary color, Secondary color (color pickers — pre-filled with `#172041` and `#0DBACA`)
- **Contact Tab:**
  - Address, Phone, WhatsApp, Email
  - Working hours editor (per day)
  - Google Maps link
  - Social media URLs
- **Email Tab:**
  - Notification recipient email addresses (comma-separated)
  - SMTP configuration (host, port, user, password — masked)
  - Test email button
- **SEO Tab:**
  - Default meta title, Default meta description
  - OG image upload
  - Google Analytics tracking ID (Phase 2)
- **Brands Tab:**
  - Carrier: name, logo upload, dealer certificate upload, active toggle
  - Midea: name, logo upload, dealer certificate upload, active toggle
- **Paymob Tab:**
  - Paymob API Key (masked input)
  - Card Integration ID, Wallet Integration ID, Installment Integration ID (optional)
  - HMAC Secret (masked input)
  - Iframe ID (for embedded payment page)
  - Test mode toggle (sandbox vs. production)
  - Connection test button: "Test Paymob Connection"
- **Shipping Tab:**
  - Flat-rate shipping fee (EGP number input)
  - Free shipping threshold (minimum order value for free shipping; 0 = no free shipping)
  - Delivery areas (text area or dynamic list)
  - Estimated delivery days (e.g., "3–5 business days")

#### Backend

- **API Endpoints**
  - `GET /api/cms/settings/:key` — Get settings by key (general, contact, email, seo, brands, paymob, shipping)
  - `PATCH /api/cms/settings/:key` — Update settings by key
  - `POST /api/cms/settings/email/test` — Send test email
  - `POST /api/cms/settings/paymob/test` — Test Paymob connection
  - `POST /api/cms/settings/upload` — Upload logo/favicon/OG image/certificate
- **Authorization:** Settings endpoints restricted to `cms_admin` role only (except viewing)

---

### **9.12 CMS Order Management**

#### Frontend

- **Orders List**
  - Data table columns: Order #, Customer Name, Items Count, Total (EGP), Payment Status (badge), Order Status (badge), Date, Actions
  - Filters: order status dropdown, payment status, date range picker, search by order # or customer email
  - Sort: newest first (default), oldest first, total (high/low)
  - Pagination: 20 per page
  - Bulk actions: bulk status update, export CSV
  - "Export Orders" button (CSV with current filters)
- **Order Detail View** (dedicated page or slide-out panel)
  - **Customer Info Card:** name, email, phone, link to customer profile (if registered)
  - **Order Items Table:** product image, name, brand, model, quantity, unit price, line total
  - **Payment Details Card:** Paymob transaction ID, payment method (card/wallet), card brand + last 4, amount, paid at timestamp
  - **Shipping Address Card:** full address with copy button
  - **Order Timeline:** visual stepper showing status history with timestamps and actor
  - **Status Update:** dropdown to change status; on "Shipped": required tracking number + carrier name fields
  - **Internal Notes:** list of notes + "Add Note" textarea
  - **Refund Button:** "Issue Refund" (danger style); opens modal with full/partial amount input + reason textarea; calls Paymob refund API
  - **Print Receipt:** generates printable order receipt view

#### Backend

- See §8 CMS Order Management Endpoints

---

### **9.13 CMS Customer Management**

#### Frontend

- **Customer List**
  - Data table columns: Name, Email, Phone, Orders Count, Total Spent (EGP), Registration Date, Status (Active/Disabled), Actions
  - Search: by name, email, phone
  - Filter: status (active/disabled)
  - Pagination: 20 per page
- **Customer Detail View**
  - Profile info card: name, email, phone, registered date, email verified status
  - **Order History Tab:** list of customer's orders (same table format as orders list)
  - **Service Requests Tab:** list of customer's service requests
  - **Addresses Tab:** read-only view of customer's saved addresses
  - **Actions:** Enable/Disable account toggle

#### Backend

- **API Endpoints**
  - `GET /api/cms/customers` — List all customers (paginated, searchable)
  - `GET /api/cms/customers/:id` — Get customer detail with order count and total spent
  - `PATCH /api/cms/customers/:id/status` — Enable/disable customer account
  - `GET /api/cms/customers/:id/orders` — Get customer's order history

---

### **9.14 CMS Coupon Management**

#### Frontend

- **Coupon List**
  - Data table: Code, Discount Type (badge: %/Fixed), Value, Min Order, Usage (used/limit), Start Date, End Date, Active (toggle), Actions
  - "Add Coupon" button
- **Add/Edit Coupon Form**
  - Code (text input + auto-generate button), Discount type (radio: Percentage / Fixed Amount), Discount value
  - Minimum order value, Maximum usage limit (blank = unlimited)
  - Start date, End date (date pickers)
  - Active toggle
  - Save button
- **Coupon Usage View**
  - Table of orders that used this coupon: Order #, Customer, Discount Applied, Date

#### Backend

- **API Endpoints**
  - `GET /api/cms/coupons` — List all coupons
  - `POST /api/cms/coupons` — Create coupon
  - `PATCH /api/cms/coupons/:id` — Update coupon
  - `DELETE /api/cms/coupons/:id` — Delete coupon
  - `GET /api/cms/coupons/:id/usage` — View coupon usage history

---

## **10. NOTIFICATIONS & COMMUNICATIONS**

### Frontend

- **Email Templates** (branded HTML emails, received by customers)
  - Lord logo header (max-height 56px, on White background)
  - Clean, mobile-responsive layout
  - Lord Navy `#172041` header bar
  - Body text: Dark Charcoal `#1A1A2E`, Inter/Cairo font
  - CTA buttons: Teal `#0DBACA` (if applicable)
  - Footer: address, phone, email, social links, unsubscribe (if applicable)

### Backend

- **Email Service**
  - Nodemailer with configurable SMTP (SendGrid / Mailgun / AWS SES)
  - HTML template engine (Handlebars or EJS)
  - Template variables: `{{customerName}}`, `{{inquiryType}}`, `{{productName}}`, `{{serviceType}}`, `{{companyName}}`, `{{contactPhone}}`, `{{orderNumber}}`, `{{orderTotal}}`, `{{paymentMethod}}`, `{{trackingNumber}}`, `{{shippingCarrier}}`
- **Email Types & Triggers**

  | Email Type                      | Trigger                               | Recipient  |
  | ------------------------------- | ------------------------------------- | ---------- |
  | Inquiry Acknowledgement         | New product/general inquiry submitted | Customer   |
  | Service Request Acknowledgement | New service request submitted         | Customer   |
  | Staff Inquiry Notification      | New inquiry submitted                 | Lord Staff |
  | Staff Service Request Alert     | New service request submitted         | Lord Staff |
  | Status Update — In Progress     | Inquiry/request status → In Progress  | Customer   |
  | Status Update — Resolved        | Inquiry/request status → Resolved     | Customer   |
  | **Order Confirmation**          | Payment successful                    | Customer   |
  | **Payment Receipt**             | Payment successful                    | Customer   |
  | **New Order Alert**             | New order placed                      | Lord Staff |
  | **Order Shipped**               | Order status → Shipped                | Customer   |
  | **Order Delivered**             | Order status → Delivered              | Customer   |
  | **Order Cancelled**             | Order status → Cancelled              | Customer   |
  | **Refund Processed**            | Refund completed                      | Customer   |
  | **Customer Welcome**            | Customer registration completed       | Customer   |
  | **Email Verification OTP**      | Customer registration / resend        | Customer   |
  | **Customer Password Reset OTP** | Customer requests password reset      | Customer   |
  | CMS Password Reset OTP          | CMS user requests password reset      | CMS User   |
  | Test Email                      | Admin triggers test from CMS Settings | Configured |

- **Email Queue System**
  ```
  EmailQueue
  ├── id              UUID (PK)
  ├── recipient       VARCHAR(255) NOT NULL
  ├── subject         VARCHAR(255) NOT NULL
  ├── bodyHtml        TEXT NOT NULL
  ├── templateName    VARCHAR(100)
  ├── templateVarsJson JSONB
  ├── status          VARCHAR(20) DEFAULT 'pending'  -- "pending", "sent", "failed"
  ├── attempts        INTEGER DEFAULT 0
  ├── maxAttempts     INTEGER DEFAULT 3
  ├── lastError       TEXT
  ├── sentAt          TIMESTAMP
  ├── scheduledAt     TIMESTAMP                      -- for future sends
  ├── createdAt       TIMESTAMP
  └── updatedAt       TIMESTAMP
  ```
- **Queue Processing**
  - Cron job runs every 1 minute: fetch pending emails where `attempts < maxAttempts`
  - On success: status → "sent", record `sentAt`
  - On failure: increment `attempts`, record `lastError`, retry on next cycle
  - After `maxAttempts`: status → "failed" (logged for manual review)

---

## **11. OUT OF SCOPE FEATURES**

The following features are explicitly out of scope per the BRD and should **NOT** be implemented:

- **Inventory / Warehouse Management (WMS):** Advanced stock management, warehouse operations, barcode scanning, multi-warehouse routing
- **ERP / Accounting Integration:** Financial systems, invoicing, accounting software connections
- **Mobile Native Applications:** iOS/Android apps — responsive web only
- **Live Chat / Chatbot:** Real-time messaging or AI-powered chat support
- **Multi-Branch Management:** Multiple locations, warehouse routing — single-location focus for MVP
- **IoT / Smart Home Integration:** Connected AC units, remote control, smart home protocols
- **Multi-Currency Support:** All transactions in EGP only — no currency conversion
- **Loyalty / Rewards Program:** Points-based rewards, tiered memberships
- **Customer Reviews / Ratings on Products:** Product review system (testimonials are CMS-managed)
- **SMS Notifications:** SMS-based alerts (no Twilio integration in MVP)
- **Advanced Analytics Dashboard:** Conversion funnels, A/B testing (deferred to Phase 3)
- **Third-Party Shipping API:** Integration with Aramex, DHL, etc. for automated shipping — tracking is manual entry

---

## **12. SECURITY & DATA PROTECTION**

### Frontend

- **HTTPS Enforcement**
  - All pages served over HTTPS
  - HTTP → HTTPS redirect
- **Secure Forms**
  - Client-side validation via Zod schemas + React Hook Form
  - Honeypot field on public forms (anti-spam)
  - Rate limiting indicators (disable submit after X attempts)
- **CMS Session Management**
  - Auto-logout after 30 minutes of inactivity
  - Logout functionality (clears tokens)
  - Token refresh handling (transparent to user)
- **Input Sanitization**
  - Strip HTML from text inputs on client side
  - File upload: accept only image types (JPEG, PNG, WebP), max 5MB

### Backend

- **Authentication Security**
  - Password hashing: bcrypt with salt rounds 10
  - JWT access token: 1-hour expiry
  - JWT refresh token: 7-day expiry
  - Token blacklist on logout (`TokenBlacklist` table)
  - Rate limiting on login: 5 attempts per 15 minutes per IP
  - Account lockout: after 5 consecutive failures, lock for 30 minutes
- **Authorization**
  - Role-based access control (RBAC) middleware
  - Roles: `cms_admin`, `cms_staff`, `customer`, `public` (unauthenticated)
  - `cms_admin`: full CMS access including settings, user management, refunds
  - `cms_staff`: product/service/inquiry/order/content management
  - `customer`: own profile, own orders, own addresses, cart, checkout
  - `public`: read-only access to published content + form submissions + guest cart/checkout
  - Route protection: verify JWT → extract role → check permission
  - Separate JWT signing keys for CMS and customer tokens
- **Input Validation & Sanitization**
  - Server-side validation on all endpoints (Zod schemas)
  - SQL injection prevention: Prisma parameterized queries
  - XSS prevention: sanitize HTML input (DOMPurify or similar)
  - File upload validation: MIME type check, file size limit, filename sanitization
  - Request body size limit: 10MB (for image uploads), 1MB (for JSON)
- **API Security**
  - CORS: restrict to known origins (website domain, CMS domain)
  - Helmet.js: HTTP security headers (CSP, X-Frame-Options, HSTS, etc.)
  - Rate limiting: global 100 req/min per IP; form submissions 10 req/min per IP
  - No sensitive data in error responses
- **Data Protection**
  - HTTPS/TLS for all data in transit
  - Database encryption at rest (managed PostgreSQL feature)
  - Environment variables for all secrets (no credentials in code)
  - No PII in application logs
- **Payment Security (Paymob)**
  - No credit/debit card data stored on Lord servers (PCI-DSS compliance delegated to Paymob)
  - Paymob webhook HMAC-SHA512 signature verification on all callback requests
  - Server-side order amount verification before Paymob API call (prevent client-side tampering)
  - Idempotent order creation to prevent duplicate charges
  - Paymob API keys and HMAC secrets stored in environment variables, never exposed client-side
  - Rate limiting on checkout endpoints: 5 req/min per IP
- **Customer Data Protection**
  - Customer passwords hashed with bcrypt (salt rounds 10) — same as CMS users
  - Customer email verification required before checkout
  - Customer JWT tokens have separate signing key from CMS tokens
  - Customer can only access own profile, addresses, and orders (enforced server-side)
- **Backup & Recovery**
  - Automated daily database backups
  - Encrypted backup storage
  - 30-day retention policy
- **Monitoring**
  - Error logging (structured JSON logs)
  - Failed login attempt tracking
  - Email queue failure monitoring

### Database Tables for Security

```
TokenBlacklist
├── id              UUID (PK)
├── token           TEXT NOT NULL
├── expiresAt       TIMESTAMP NOT NULL
└── createdAt       TIMESTAMP

LoginAttempts
├── id              UUID (PK)
├── email           VARCHAR(255) NOT NULL
├── ipAddress       VARCHAR(45) NOT NULL
├── success         BOOLEAN NOT NULL
├── createdAt       TIMESTAMP
```

### Auth API Endpoints

| Method | Endpoint                        | Description                       |
| ------ | ------------------------------- | --------------------------------- |
| POST   | `/api/cms/auth/login`           | CMS staff login                   |
| POST   | `/api/cms/auth/logout`          | CMS logout (blacklist token)      |
| POST   | `/api/cms/auth/refresh`         | Refresh CMS access token          |
| POST   | `/api/cms/auth/forgot-password` | Send CMS password reset OTP       |
| POST   | `/api/cms/auth/reset-password`  | Verify OTP + set new CMS password |
| POST   | `/api/auth/register`            | Customer registration             |
| POST   | `/api/auth/verify-email`        | Verify customer email OTP         |
| POST   | `/api/auth/login`               | Customer login                    |
| POST   | `/api/auth/logout`              | Customer logout (blacklist token) |
| POST   | `/api/auth/refresh`             | Refresh customer access token     |
| POST   | `/api/auth/forgot-password`     | Send customer password reset OTP  |
| POST   | `/api/auth/reset-password`      | Verify OTP + set new password     |

---

## **13. SEO & PERFORMANCE**

### SEO Requirements

| Feature               | Implementation                                                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dynamic Meta Tags** | Per-page `<title>` and `<meta description>` from CMS or product data                                                                                              |
| **Open Graph Tags**   | `og:title`, `og:description`, `og:image`, `og:url` on all public pages                                                                                            |
| **JSON-LD Schema**    | `Product` schema on product pages (with `offers`, `price`, `availability`), `LocalBusiness` on home/contact, `FAQPage` on FAQ page, `BreadcrumbList` on all pages |
| **XML Sitemap**       | Auto-generated sitemap at `/sitemap.xml` including all products and pages                                                                                         |
| **Robots.txt**        | Allow crawling of public pages, disallow CMS panel routes                                                                                                         |
| **Canonical URLs**    | `<link rel="canonical">` on all pages                                                                                                                             |
| **Hreflang Tags**     | `<link rel="alternate" hreflang="ar">` and `hreflang="en">` on all pages                                                                                          |
| **Image Alt Text**    | All product images have descriptive alt text from CMS                                                                                                             |
| **Slug-based URLs**   | `/products/carrier-42qhf024` instead of `/products?id=123`                                                                                                        |
| **Breadcrumb Schema** | Structured data for breadcrumb navigation                                                                                                                         |

### Performance Requirements

| Feature                | Implementation                                                              |
| ---------------------- | --------------------------------------------------------------------------- |
| **Image Optimization** | WebP format, responsive `srcset`, lazy loading via `loading="lazy"`         |
| **Code Splitting**     | Next.js automatic code splitting per route                                  |
| **Static Generation**  | Product listing and detail pages use ISR (Incremental Static Regeneration)  |
| **API Caching**        | Cache-Control headers on public GET endpoints (5 min TTL for product lists) |
| **Font Loading**       | `font-display: swap` for Inter and Cairo; preload critical font weights     |
| **Bundle Size**        | Tree-shake unused Lucide icons; dynamic imports for heavy components        |
| **Core Web Vitals**    | Target: LCP < 2.5s, FID < 100ms, CLS < 0.1                                  |

---

**Document Status:** Technical Specification — E-Commerce Platform
**Last Updated:** April 6, 2026
**Prepared For:** Lord — Authorized Carrier & Midea Air Conditioning E-Commerce Dealer
