# UI/UX Design Requirements

## Lord — Website & Content Management System

| Field                | Detail                                                          |
| -------------------- | --------------------------------------------------------------- |
| **Document Version** | 1.0                                                             |
| **Date**             | April 6, 2026                                                   |
| **Project Name**     | Lord E-Commerce Website & CMS                                   |
| **Project Type**     | Full-Stack E-Commerce Web Application (Air Conditioning Retail) |
| **Status**           | In Development                                                  |

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Logo Usage Guidelines](#4-logo-usage-guidelines)
5. [Iconography & Imagery](#5-iconography--imagery)
6. [Layout & Grid System](#6-layout--grid-system)
7. [Component Design System](#7-component-design-system)
8. [Page-Level UX Requirements](#8-page-level-ux-requirements)
9. [E-Commerce UX](#9-e-commerce-ux)
10. [Customer Account UX](#10-customer-account-ux)
11. [Responsive Design](#11-responsive-design)
12. [Accessibility](#12-accessibility)
13. [Localization & RTL Support](#13-localization--rtl-support)
14. [Motion & Animation](#14-motion--animation)
15. [CMS Panel Design](#15-cms-panel-design)
16. [Brand Partners Display Guidelines](#16-brand-partners-display-guidelines)

---

## 1. Brand Identity

### 1.1 Brand Overview

| Attribute             | Value                                                                      |
| --------------------- | -------------------------------------------------------------------------- |
| **Brand Name**        | Lord                                                                       |
| **Tagline**           | Air Conditioning — Since 1986                                              |
| **Industry**          | HVAC / Air Conditioning Retail & After-Sales Services                      |
| **Brand Positioning** | Authorized dealer for Carrier and Midea air conditioners                   |
| **Brand Personality** | Trustworthy, Professional, Established, Reliable, Expert                   |
| **Heritage**          | Operating since 1986 — nearly 40 years of industry experience              |
| **Target Audience**   | Residential and commercial customers seeking AC units and after-sales care |

### 1.2 Brand Attributes

| Attribute           | Description                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------- |
| **Trust**           | Authorized dealer status with Carrier & Midea conveys credibility and manufacturer backing    |
| **Expertise**       | Decades of experience (since 1986) in air conditioning sales, installation, and service       |
| **Reliability**     | Full after-sales support (repair, maintenance, installation, delivery) builds long-term trust |
| **Professionalism** | Clean, corporate visual identity reflects a serious and dependable business                   |

### 1.3 Brand Voice & Tone

| Context              | Tone                                                                        |
| -------------------- | --------------------------------------------------------------------------- |
| **Website Copy**     | Professional, confident, clear, reassuring — speaks with authority          |
| **Service Pages**    | Helpful, solution-oriented, straightforward — focuses on customer outcomes  |
| **Product Listings** | Technical yet accessible — specs presented clearly for informed decisions   |
| **CTAs**             | Action-driven, warm, inviting — "Add to Cart", "Buy Now", "Get Expert Help" |
| **FAQs**             | Friendly, patient, educational — anticipates and resolves customer concerns |

---

## 2. Color System

### 2.1 Primary Brand Colors

Extracted from the official Lord brand identity:

| Color Name      | Hex Code  | RGB                  | Usage                                                              |
| --------------- | --------- | -------------------- | ------------------------------------------------------------------ |
| **Lord Navy**   | `#172041` | `rgb(23, 32, 65)`    | Primary brand color — headers, nav, footers, primary buttons, text |
| **Lord Teal**   | `#0DBACA` | `rgb(13, 186, 202)`  | Accent color — CTAs, links, highlights, badges, icons              |
| **Lord Silver** | `#BEBEBE` | `rgb(190, 190, 190)` | Supporting neutral — borders, dividers, muted text, card strokes   |
| **Lord Frost**  | `#4DB8D4` | `rgb(77, 184, 212)`  | Secondary accent — gradients, hover states, decorative elements    |

### 2.2 Extended Palette

| Color Name           | Hex Code  | Usage                                                   |
| -------------------- | --------- | ------------------------------------------------------- |
| **White**            | `#FFFFFF` | Backgrounds, card surfaces, text on dark backgrounds    |
| **Off-White / Snow** | `#F8FAFB` | Page background, alternating section backgrounds        |
| **Light Gray**       | `#F1F3F5` | Card backgrounds, input field backgrounds, table rows   |
| **Medium Gray**      | `#6C757D` | Secondary text, placeholder text, muted labels          |
| **Dark Charcoal**    | `#1A1A2E` | Body text on light backgrounds                          |
| **Success Green**    | `#28A745` | Success states, active indicators, confirmed status     |
| **Warning Amber**    | `#FFC107` | Warning states, pending/in-progress status              |
| **Error Red**        | `#DC3545` | Error states, validation errors, declined/closed status |
| **Info Blue**        | `#17A2B8` | Informational alerts, tips, neutral status              |

### 2.3 Color Usage Rules

| Rule                                                                                         | Example                                             |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Lord Navy** is the dominant brand color — use for primary navigation, headers, and footers | Navbar background: `#172041`                        |
| **Lord Teal** is the action color — use for all interactive elements                         | Primary CTA button: `#0DBACA`                       |
| **Lord Frost** is the secondary accent — use for gradients paired with Teal                  | Gradient: `#0DBACA` → `#4DB8D4`                     |
| Navy-to-Teal contrast must meet WCAG AA for text (4.5:1 minimum)                             | White text on Navy ✅; Navy text on White ✅        |
| Never place Teal text on Navy background without verifying contrast                          | Use White text on Navy instead                      |
| Use the Silver palette sparingly — primarily for borders, dividers, and subtle separators    | Card border: `1px solid #BEBEBE`                    |
| Alternate section backgrounds between White and Off-White for visual rhythm                  | Hero: White → Features: Off-White → Products: White |

### 2.4 Dark Mode (Future Consideration)

| Element               | Light Mode | Dark Mode (Phase 2)   |
| --------------------- | ---------- | --------------------- |
| Page Background       | `#FFFFFF`  | `#0D1117`             |
| Card Surface          | `#F8FAFB`  | `#161B22`             |
| Primary Text          | `#1A1A2E`  | `#E6EDF3`             |
| Borders               | `#BEBEBE`  | `#30363D`             |
| Primary Accent (Teal) | `#0DBACA`  | `#0DBACA` (unchanged) |
| Navy Brand            | `#172041`  | `#172041` (unchanged) |

---

## 3. Typography

### 3.1 Font Families

| Language                   | Font Family    | Fallback Stack                                        | Source       |
| -------------------------- | -------------- | ----------------------------------------------------- | ------------ |
| **English**                | Inter          | `'Inter', 'Helvetica Neue', Arial, sans-serif`        | Google Fonts |
| **Arabic**                 | Cairo          | `'Cairo', 'Noto Sans Arabic', 'Segoe UI', sans-serif` | Google Fonts |
| **Monospace** (code/specs) | JetBrains Mono | `'JetBrains Mono', 'Fira Code', monospace`            | Google Fonts |

### 3.2 Type Scale

| Token        | Size (Desktop)  | Size (Mobile)    | Weight           | Line Height | Usage                           |
| ------------ | --------------- | ---------------- | ---------------- | ----------- | ------------------------------- |
| `display-xl` | 56px / 3.5rem   | 36px / 2.25rem   | 800 (Extra Bold) | 1.1         | Hero headline                   |
| `display-lg` | 44px / 2.75rem  | 30px / 1.875rem  | 700 (Bold)       | 1.15        | Section titles                  |
| `heading-1`  | 36px / 2.25rem  | 26px / 1.625rem  | 700 (Bold)       | 1.2         | Page titles                     |
| `heading-2`  | 28px / 1.75rem  | 22px / 1.375rem  | 600 (Semi)       | 1.25        | Sub-section titles              |
| `heading-3`  | 22px / 1.375rem | 18px / 1.125rem  | 600 (Semi)       | 1.3         | Card titles, widget headers     |
| `heading-4`  | 18px / 1.125rem | 16px / 1rem      | 600 (Semi)       | 1.35        | Sub-headings, label titles      |
| `body-lg`    | 18px / 1.125rem | 16px / 1rem      | 400 (Regular)    | 1.6         | Lead paragraphs, featured text  |
| `body`       | 16px / 1rem     | 15px / 0.9375rem | 400 (Regular)    | 1.6         | Default body text               |
| `body-sm`    | 14px / 0.875rem | 13px / 0.8125rem | 400 (Regular)    | 1.5         | Captions, meta text, table data |
| `caption`    | 12px / 0.75rem  | 12px / 0.75rem   | 500 (Medium)     | 1.4         | Badges, labels, footnotes       |

### 3.3 Font Weight Usage

| Weight     | Value | Usage                                      |
| ---------- | ----- | ------------------------------------------ |
| Regular    | 400   | Body text, descriptions, paragraphs        |
| Medium     | 500   | Labels, navigation items, captions, badges |
| Semi-Bold  | 600   | Sub-headings, card titles, button text     |
| Bold       | 700   | Page titles, section headings              |
| Extra Bold | 800   | Hero headline only                         |

### 3.4 Text Color Hierarchy

| Level     | Color         | Hex       | Usage                                       |
| --------- | ------------- | --------- | ------------------------------------------- |
| Primary   | Dark Charcoal | `#1A1A2E` | Headings, body text, primary content        |
| Secondary | Medium Gray   | `#6C757D` | Descriptions, meta text, placeholders       |
| Accent    | Lord Teal     | `#0DBACA` | Links, highlighted text, interactive labels |
| Inverse   | White         | `#FFFFFF` | Text on Navy/dark backgrounds               |
| Muted     | Lord Silver   | `#BEBEBE` | Disabled text, watermarks                   |

---

## 4. Logo Usage Guidelines

### 4.1 Logo Versions

| Version                 | Description                                                                       | Usage                                           |
| ----------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Full Logo (Primary)** | Lord wordmark with AC fan icon in "O", snowflake, wind swooshes, and "Since 1986" | Website header, About page, printed materials   |
| **Logo + Brand Logos**  | Full logo with Midea and Carrier partner logos below                              | Hero section, footer, official landing pages    |
| **Wordmark Only**       | "LORD" text without decorative elements                                           | Favicon (scaled), compact spaces, mobile header |
| **Icon Mark**           | AC fan icon from the "O" letter, standalone                                       | Favicon, app icon, loading spinner, watermark   |

### 4.2 Clear Space & Minimum Size

| Rule                                                                                      |
| ----------------------------------------------------------------------------------------- |
| Maintain a minimum clear space equal to the height of the "L" character around all sides  |
| Minimum width for full logo: **120px** (digital) / **30mm** (print)                       |
| Minimum width for icon mark: **32px** (digital) / **10mm** (print)                        |
| Do not place the logo on busy or low-contrast backgrounds without an overlay or container |

### 4.3 Logo Placement

| Location         | Logo Version        | Background            | Max Height |
| ---------------- | ------------------- | --------------------- | ---------- |
| **Navbar**       | Full Logo (Primary) | White or Navy         | 48px       |
| **Footer**       | Full Logo + Brands  | Navy (`#172041`)      | 64px       |
| **Hero Section** | Full Logo + Brands  | White / Light overlay | 80px       |
| **Email Header** | Full Logo           | White                 | 56px       |
| **Favicon**      | Icon Mark           | Transparent           | 32×32px    |
| **OG / Social**  | Full Logo + Brands  | White                 | Per spec   |

### 4.4 Logo Don'ts

| ❌ Don't                                                         |
| ---------------------------------------------------------------- |
| Do not stretch, skew, or distort the logo in any direction       |
| Do not change the logo colors outside the approved palette       |
| Do not add drop shadows, outlines, or effects to the logo        |
| Do not rotate the logo                                           |
| Do not place the logo on a background that reduces readability   |
| Do not crop any part of the logo (snowflake, swooshes, fan icon) |
| Do not rearrange the logo elements                               |

---

## 5. Iconography & Imagery

### 5.1 Icon Style

| Attribute         | Specification                                                             |
| ----------------- | ------------------------------------------------------------------------- |
| **Style**         | Outlined / Line icons — consistent 1.5px–2px stroke weight                |
| **Corner Radius** | Rounded corners (2px radius) for a friendly, modern feel                  |
| **Size System**   | 16px (inline), 20px (buttons), 24px (cards), 32px (features), 48px (hero) |
| **Color**         | Lord Navy (`#172041`) on light backgrounds; White on dark backgrounds     |
| **Accent Icons**  | Lord Teal (`#0DBACA`) for service icons and interactive state icons       |
| **Library**       | Lucide React (primary), Heroicons (fallback) — avoid mixing libraries     |

### 5.2 Service Icons

| Service                  | Icon Concept                              |
| ------------------------ | ----------------------------------------- |
| **Installation**         | Wrench + AC unit / mounting bracket       |
| **Periodic Maintenance** | Calendar with checkmark / filter cleaning |
| **Emergency Repair**     | Alert triangle + wrench / lightning bolt  |
| **Spare Parts**          | Gear / cog / component box                |
| **Delivery**             | Truck / package with AC unit              |

### 5.2.1 E-Commerce Icons

| Context                 | Icon Concept                                     |
| ----------------------- | ------------------------------------------------ |
| **Shopping Cart**       | ShoppingCart — cart icon; shown in navbar + CTAs |
| **Add to Cart**         | ShoppingCart + Plus — add item action            |
| **Checkout**            | CreditCard — payment step indicator              |
| **Order / Package**     | Package — order confirmation, order history      |
| **Shipping / Delivery** | Truck — shipping status, delivery tracking       |
| **Customer Account**    | User / UserCircle — account menu, profile        |
| **Wishlist**            | Heart — future wishlist feature (Phase 2+)       |
| **Order Tracking**      | MapPin / Route — order tracking timeline         |
| **Refund**              | RotateCcw — refund/return status                 |
| **Coupon**              | Ticket / Tag — promo code input                  |
| **Wallet**              | Wallet — mobile wallet payment option            |
| **Installments**        | CalendarClock — installment payment option       |

### 5.3 Photography & Imagery Guidelines

| Attribute             | Guideline                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **Product Images**    | Clean white-background product shots; consistent lighting and angle across catalog       |
| **Lifestyle Images**  | Show AC units in real residential/commercial settings — modern, well-lit interiors       |
| **Service Images**    | Professional technicians in branded uniforms performing installation/maintenance         |
| **Image Quality**     | Minimum 1200×800px for hero/banner; 800×800px for product catalog; optimized WebP format |
| **Image Ratio**       | Product thumbnails: 1:1 (square); Hero banners: 16:9 or 21:9; Service cards: 4:3         |
| **Overlay Treatment** | Use Navy (`#172041`) at 60–70% opacity for text-over-image hero sections                 |
| **Placeholder**       | Use a light gray (`#F1F3F5`) placeholder with the Lord icon mark while images load       |

### 5.4 Brand Partner Logos

| Brand         | Display Rules                                                                                |
| ------------- | -------------------------------------------------------------------------------------------- |
| **Carrier**   | Use the official Carrier oval logo (navy background, white text). Do not alter or recolor.   |
| **Midea**     | Use the official Midea logo (teal circle, Midea wordmark). Do not alter or recolor.          |
| **General**   | Always display both logos at equal size side by side. Maintain official proportions.         |
| **Placement** | Footer, About page brand partnership section, product detail pages, hero section (optional). |
| **Min Size**  | Minimum 80px width per logo on desktop; 60px on mobile.                                      |

---

## 6. Layout & Grid System

### 6.1 Grid

| Property                 | Value                                                                          |
| ------------------------ | ------------------------------------------------------------------------------ |
| **Grid Type**            | 12-column responsive grid                                                      |
| **Max Content Width**    | 1280px (container max-width)                                                   |
| **Gutter Width**         | 24px (desktop), 16px (tablet), 16px (mobile)                                   |
| **Horizontal Padding**   | 32px (desktop), 24px (tablet), 16px (mobile)                                   |
| **Column Spans (Cards)** | 3-col (4 per row desktop), 6-col (2 per row tablet), 12-col (1 per row mobile) |

### 6.2 Spacing Scale

Based on a 4px base unit:

| Token | Value | Usage                                   |
| ----- | ----- | --------------------------------------- |
| `xs`  | 4px   | Tight padding, icon gaps                |
| `sm`  | 8px   | Input padding, badge padding            |
| `md`  | 16px  | Card padding, button padding, list gaps |
| `lg`  | 24px  | Section inner padding, card gaps        |
| `xl`  | 32px  | Inter-section spacing                   |
| `2xl` | 48px  | Major section separators                |
| `3xl` | 64px  | Page section vertical padding (desktop) |
| `4xl` | 96px  | Hero section vertical padding           |

### 6.3 Section Layout Patterns

| Section Type                | Background          | Padding (vertical) | Max Width  |
| --------------------------- | ------------------- | ------------------ | ---------- |
| **Hero**                    | White / Gradient    | 96px (desktop)     | Full-width |
| **Feature / Service Cards** | Off-White `#F8FAFB` | 64px               | 1280px     |
| **Product Grid**            | White               | 64px               | 1280px     |
| **Testimonials**            | Navy `#172041`      | 64px               | 1280px     |
| **Contact / CTA Band**      | Teal gradient       | 48px               | Full-width |
| **Footer**                  | Navy `#172041`      | 48px               | 1280px     |

---

## 7. Component Design System

### 7.1 Buttons

| Variant       | Background       | Text Color | Border        | Hover State                       | Usage                                           |
| ------------- | ---------------- | ---------- | ------------- | --------------------------------- | ----------------------------------------------- |
| **Primary**   | `#0DBACA` (Teal) | `#FFFFFF`  | None          | Darken to `#0AA3B2`; subtle lift  | Main CTAs: "Add to Cart", "Buy Now", "Submit"   |
| **Secondary** | Transparent      | `#172041`  | 2px `#172041` | Fill `#172041`, text → White      | Secondary actions: "Learn More", "View Details" |
| **Ghost**     | Transparent      | `#0DBACA`  | None          | Underline; background `#0DBACA10` | Tertiary links: "View All", "Read More"         |
| **Danger**    | `#DC3545`        | `#FFFFFF`  | None          | Darken to `#C82333`               | Destructive actions: "Delete", "Cancel"         |
| **Disabled**  | `#F1F3F5`        | `#BEBEBE`  | None          | No change; `cursor: not-allowed`  | Inactive state for any button                   |

**Button Sizes:**

| Size       | Height | Padding (horizontal) | Font Size | Border Radius |
| ---------- | ------ | -------------------- | --------- | ------------- |
| **Small**  | 32px   | 12px                 | 13px      | 6px           |
| **Medium** | 40px   | 20px                 | 15px      | 8px           |
| **Large**  | 48px   | 28px                 | 16px      | 10px          |

### 7.2 Cards

| Attribute            | Value                                                        |
| -------------------- | ------------------------------------------------------------ |
| **Background**       | White (`#FFFFFF`)                                            |
| **Border**           | `1px solid #E8EAED` (subtle gray)                            |
| **Border Radius**    | 12px                                                         |
| **Shadow (default)** | `0 1px 3px rgba(23, 32, 65, 0.06)`                           |
| **Shadow (hover)**   | `0 8px 24px rgba(23, 32, 65, 0.12)` — with smooth transition |
| **Padding**          | 24px                                                         |
| **Image Radius**     | 12px top corners (if card has a top image)                   |

**Card Types:**

| Card Type            | Structure                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Product Card**     | Image (1:1) → Brand badge → Product name → Capacity + Type → Price → **"Add to Cart" button** + Quick View link |
| **Service Card**     | Icon (48px, Teal) → Service name → Description (2 lines max) → "Request Service" link                           |
| **Testimonial Card** | Star rating → Quote text → Customer name + location                                                             |
| **Stat Card**        | Large number (display-lg, Teal) → Label (body-sm, Medium Gray)                                                  |
| **Cart Item Card**   | Product thumbnail (64px) → Name + brand → Quantity selector (−/+) → Unit price → Line total → Remove (X) button |
| **Order Card**       | Order # + Date → Items count → Total amount → Status badge → "View Details" link                                |
| **Address Card**     | Label (Home/Office) → Recipient name → Full address → Phone → Default badge (star) → Edit / Delete actions      |
| **Payment Card**     | Payment method icon (Card/Wallet) → Last 4 digits or wallet name → Amount → Status badge → Date                 |

### 7.3 Navigation Bar

| Attribute              | Value                                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Height**             | 72px (desktop), 64px (mobile)                                                                                                     |
| **Background**         | White with `backdrop-filter: blur(12px)` on scroll                                                                                |
| **Shadow (on scroll)** | `0 2px 8px rgba(23, 32, 65, 0.08)`                                                                                                |
| **Position**           | Fixed top (`position: sticky`)                                                                                                    |
| **Logo**               | Left-aligned, max-height 48px                                                                                                     |
| **Nav Links**          | Center-aligned (desktop); font 15px Medium, color `#172041`                                                                       |
| **Nav Link Hover**     | Color → `#0DBACA`; underline bar (2px Teal, bottom)                                                                               |
| **Active Link**        | Color `#0DBACA`; underline bar visible                                                                                            |
| **CTA Button**         | Right-aligned; Primary button style ("Request Service")                                                                           |
| **Cart Icon**          | Right side; ShoppingCart icon with item count badge (Teal circle, white text, 18px); click opens mini-cart dropdown               |
| **Account Menu**       | Right side; UserCircle icon — logged out: "Login / Register" link; logged in: dropdown (My Orders, My Addresses, Profile, Logout) |
| **Language Toggle**    | Right side, before cart icon; flag or "AR / EN" text toggle                                                                       |
| **Mobile Menu**        | Hamburger icon → full-screen overlay slide from right                                                                             |

**Navigation Items:**

| #    | Label (EN)      | Label (AR) | Link                       |
| ---- | --------------- | ---------- | -------------------------- |
| 1    | Home            | الرئيسية   | `/`                        |
| 2    | Products        | المنتجات   | `/products`                |
| 3    | Services        | الخدمات    | `/services`                |
| 4    | About           | من نحن     | `/about`                   |
| 5    | Contact         | تواصل معنا | `/contact`                 |
| Icon | Cart (badge)    | السلة      | `/cart`                    |
| Icon | Account         | حسابي      | `/account` (or dropdown)   |
| CTA  | Request Service | طلب خدمة   | `/contact#service-request` |

### 7.4 Footer

| Attribute       | Value                                                                               |
| --------------- | ----------------------------------------------------------------------------------- |
| **Background**  | Navy (`#172041`)                                                                    |
| **Text Color**  | White (`#FFFFFF`) primary; Silver (`#BEBEBE`) secondary                             |
| **Link Hover**  | Teal (`#0DBACA`)                                                                    |
| **Layout**      | 4 columns (desktop): Logo + tagline, Quick Links, Services, Contact Info            |
| **Bottom Bar**  | Copyright text + social media icons; separated by `1px solid rgba(255,255,255,0.1)` |
| **Brand Logos** | Carrier and Midea logos displayed in the logo column, below Lord logo               |

### 7.5 Forms & Inputs

| Attribute             | Value                                                            |
| --------------------- | ---------------------------------------------------------------- |
| **Input Height**      | 44px                                                             |
| **Border**            | `1px solid #BEBEBE`                                              |
| **Border Radius**     | 8px                                                              |
| **Focus Border**      | `2px solid #0DBACA`                                              |
| **Focus Ring**        | `0 0 0 3px rgba(13, 186, 202, 0.15)`                             |
| **Background**        | White (`#FFFFFF`)                                                |
| **Placeholder Color** | `#BEBEBE`                                                        |
| **Label**             | 14px, Semi-Bold, `#1A1A2E`, 6px margin-bottom                    |
| **Error State**       | Border: `#DC3545`; error message: 13px `#DC3545`, 4px margin-top |
| **Success State**     | Border: `#28A745`; checkmark icon inline                         |
| **Disabled**          | Background: `#F1F3F5`; text `#BEBEBE`; `cursor: not-allowed`     |
| **Textarea**          | Min-height 120px; resize vertical only                           |
| **Select/Dropdown**   | Custom chevron icon (Teal); same height and border as inputs     |

### 7.6 Badges & Tags

| Variant                 | Background        | Text Color | Usage                          |
| ----------------------- | ----------------- | ---------- | ------------------------------ |
| **Carrier**             | `#172041` (Navy)  | `#FFFFFF`  | Brand tag on product cards     |
| **Midea**               | `#0DBACA` (Teal)  | `#FFFFFF`  | Brand tag on product cards     |
| **Featured**            | `#FFC107` (Amber) | `#1A1A2E`  | Featured product badge         |
| **New Arrival**         | `#28A745` (Green) | `#FFFFFF`  | New arrival badge              |
| **Bestseller**          | `#DC3545` (Red)   | `#FFFFFF`  | Bestseller badge               |
| **Status: New**         | `#17A2B8` (Info)  | `#FFFFFF`  | Inquiry status in CMS          |
| **Status: In Progress** | `#FFC107` (Amber) | `#1A1A2E`  | Inquiry status in CMS          |
| **Status: Resolved**    | `#28A745` (Green) | `#FFFFFF`  | Inquiry status in CMS          |
| **Status: Closed**      | `#6C757D` (Gray)  | `#FFFFFF`  | Inquiry status in CMS          |
| **Out of Stock**        | `#DC3545` (Red)   | `#FFFFFF`  | Product card overlay badge     |
| **In Stock**            | `#28A745` (Green) | `#FFFFFF`  | Product detail stock indicator |
| **Order: Confirmed**    | `#17A2B8` (Info)  | `#FFFFFF`  | Order status in CMS & account  |
| **Order: Processing**   | `#FFC107` (Amber) | `#1A1A2E`  | Order status in CMS & account  |
| **Order: Shipped**      | `#0DBACA` (Teal)  | `#FFFFFF`  | Order status in CMS & account  |
| **Order: Delivered**    | `#28A745` (Green) | `#FFFFFF`  | Order status in CMS & account  |
| **Order: Cancelled**    | `#DC3545` (Red)   | `#FFFFFF`  | Order status in CMS & account  |
| **Order: Refunded**     | `#6C757D` (Gray)  | `#FFFFFF`  | Order status in CMS & account  |
| **Payment: Paid**       | `#28A745` (Green) | `#FFFFFF`  | Payment status badge           |
| **Payment: Pending**    | `#FFC107` (Amber) | `#1A1A2E`  | Payment status badge           |
| **Payment: Failed**     | `#DC3545` (Red)   | `#FFFFFF`  | Payment status badge           |
| **Coupon Applied**      | `#28A745` (Green) | `#FFFFFF`  | Checkout coupon confirmation   |

### 7.7 Modals & Dialogs

| Attribute        | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| **Overlay**      | `rgba(23, 32, 65, 0.5)` with `backdrop-filter: blur(4px)` |
| **Surface**      | White, border-radius 16px, padding 32px                   |
| **Max Width**    | 480px (small), 640px (medium), 800px (large)              |
| **Shadow**       | `0 20px 60px rgba(23, 32, 65, 0.2)`                       |
| **Close Button** | Top-right, 32px icon button, hover background `#F1F3F5`   |
| **Animation**    | Fade-in overlay + scale-up modal (200ms ease-out)         |

### 7.8 Tables (CMS)

| Attribute          | Value                                                   |
| ------------------ | ------------------------------------------------------- |
| **Header Row**     | Background `#F8FAFB`; text 13px Semi-Bold `#172041`     |
| **Body Row**       | Background White; alternate rows `#FAFBFC`; height 52px |
| **Row Hover**      | Background `#F0FAFA` (very light teal tint)             |
| **Border**         | `1px solid #E8EAED` between rows                        |
| **Text**           | 14px Regular `#1A1A2E`                                  |
| **Action Buttons** | Icon buttons (edit, delete, view) — 32px, Ghost style   |

### 7.9 Toast Notifications

| Variant     | Border-Left Color | Icon           | Background |
| ----------- | ----------------- | -------------- | ---------- |
| **Success** | `#28A745`         | Checkmark      | `#F0FFF4`  |
| **Error**   | `#DC3545`         | X circle       | `#FFF5F5`  |
| **Warning** | `#FFC107`         | Alert triangle | `#FFFBEB`  |
| **Info**    | `#17A2B8`         | Info circle    | `#F0F9FF`  |

---

## 8. Page-Level UX Requirements

### 8.1 Home Page

| Section               | UX Requirement                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero**              | Full-width hero with Lord logo, headline, tagline ("Since 1986"), dual CTA buttons (**"Shop Now"** + "Our Services"); animated snowflake/wind motif optional |
| **Authorized Badges** | Prominently display Carrier + Midea logos with "Authorized Dealer" text immediately below hero                                                               |
| **Featured Products** | Horizontal scrollable or 4-column grid of top products; each card with **"Add to Cart"** button + price; links to product detail                             |
| **Services Overview** | 4–5 icon cards (Installation, Maintenance, Repair, Delivery, Spare Parts) linking to Services page                                                           |
| **Why Choose Lord**   | Stats section: "Since 1986", "XX+ Units Installed", "Authorized Dealer", "Full After-Sales Support"                                                          |
| **Testimonials**      | Carousel with customer quotes, star ratings, and names; auto-rotate every 5 seconds with pause on hover                                                      |
| **CTA Band**          | Full-width Teal gradient band: "Need help choosing? Request a free consultation" → CTA button                                                                |
| **Contact Strip**     | Address, phone, WhatsApp, email, working hours, Google Maps thumbnail → links to Contact page                                                                |

### 8.2 Products Page

| Element                | UX Requirement                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Page Header**        | "Our Products" title with breadcrumb (Home > Products)                                                        |
| **Filter Sidebar/Bar** | Sticky filters: Brand (Carrier/Midea checkboxes), Type (multi-select), Capacity (range slider), Price (range) |
| **Product Grid**       | 3–4 columns desktop; 2 columns tablet; 1 column mobile; lazy-load on scroll                                   |
| **Sort Options**       | Price (low/high), Name (A–Z), Newest first                                                                    |
| **Empty State**        | Friendly illustration + "No products match your filters" + reset button                                       |
| **Product Count**      | "Showing X of Y products" above grid                                                                          |

### 8.3 Product Detail Page

| Element               | UX Requirement                                                                                                          |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Image Gallery**     | Main image with thumbnail strip below; click to zoom (lightbox); swipe on mobile                                        |
| **Brand Badge**       | Carrier or Midea badge top-right of image area                                                                          |
| **Specs Table**       | Two-column key-value table: Capacity, EER/SEER, Voltage, Refrigerant, Dimensions, Weight, Color                         |
| **Features List**     | Checkmark icon list of key features                                                                                     |
| **Price Display**     | Large, bold price in EGP; strike-through original price if on sale; "Out of Stock" badge if unavailable                 |
| **Stock Indicator**   | Green "In Stock" / Red "Out of Stock" badge with stock availability text                                                |
| **Quantity Selector** | Number input with (−/+) buttons; min 1, max based on stock; default 1                                                   |
| **CTA Section**       | **"Add to Cart"** primary button (Teal) + **"Buy Now"** secondary button (direct to checkout) + "Contact Us" ghost link |
| **Related Products**  | "You May Also Like" — 4 related product cards with "Add to Cart" buttons below                                          |
| **Breadcrumb**        | Home > Products > [Brand] > [Product Name]                                                                              |

### 8.4 Services Page

| Element                  | UX Requirement                                                                                                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page Header**          | "Our Services" title with tagline: "Complete after-sales support for your air conditioning"                                                                                             |
| **Service Cards**        | 5 cards (Installation, Maintenance, Repair, Delivery, Spare Parts); each expandable or linking to detail section                                                                        |
| **Service Detail**       | On click/scroll: full description, scope, what's included list, applicable unit types, CTA                                                                                              |
| **CTA**                  | Each service has a "Request This Service" button pre-filling the service type in the inquiry form                                                                                       |
| **Installation Address** | For Installation service requests: installation location address is a **required** field; clearly labeled with helper text "Enter the full address where the AC unit will be installed" |

### 8.5 About Page

| Element               | UX Requirement                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| **Company Story**     | Narrative section with milestone timeline (1986 → present); optional horizontal scroll timeline       |
| **Mission / Vision**  | Side-by-side cards or icon+text layout                                                                |
| **Brand Partnership** | Carrier and Midea logos, authorized dealer certificates (viewable images), brief partner descriptions |
| **Stats Section**     | Large numbers: years in business, units installed, customers served, service visits                   |

### 8.6 Contact Page

| Element                 | UX Requirement                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Contact Form**        | Left column: form (name, email, phone, inquiry type dropdown, message, submit). Right column: contact details |
| **Inquiry Type**        | Dropdown: Purchase Inquiry, Order Support, Installation, Maintenance, Repair, Delivery, General               |
| **Map**                 | Embedded Google Maps with Lord pin; full-width below contact section                                          |
| **WhatsApp Button**     | Floating WhatsApp button (green circle, bottom-right) on all pages — links to WhatsApp chat                   |
| **Submission Feedback** | Success state: Green checkmark + "Thank you! We'll contact you within 1 hour." message                        |

---

## 9. E-Commerce UX

### 9.1 Mini Cart (Dropdown)

| Element         | UX Requirement                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------- |
| **Trigger**     | Click/hover on cart icon in navbar; shows dropdown panel (360px width)                             |
| **Item List**   | Scrollable list of cart items (max 4 visible, scroll for more): thumbnail (48px), name, qty, price |
| **Footer**      | Subtotal amount (bold) + "View Cart" secondary button + "Checkout" primary button                  |
| **Empty State** | Cart icon illustration + "Your cart is empty" + "Browse Products" CTA link                         |
| **Close**       | Click outside, press Escape, or click X button                                                     |
| **Animation**   | Slide-down + fade-in (200ms ease-out)                                                              |

### 9.2 Cart Page (`/cart`)

| Element               | UX Requirement                                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page Header**       | "Shopping Cart" title with item count; breadcrumb (Home > Cart)                                                                                                  |
| **Cart Items List**   | Product image (80px), name, brand, model, unit price, quantity selector (−/+), line total, remove (X) button                                                     |
| **Quantity Selector** | Inline −/+ buttons with number input; min 1, max = stock; updates totals in real-time (debounced API call)                                                       |
| **Remove Item**       | Trash icon with confirmation tooltip ("Remove from cart?") on click                                                                                              |
| **Price Summary**     | Right sidebar (desktop) / bottom sticky bar (mobile): Subtotal, Shipping (flat rate or "Free" if above threshold), Discount (if coupon applied), **Grand Total** |
| **Coupon Input**      | Text input + "Apply" button; success: green badge with discount amount; error: red text "Invalid code"                                                           |
| **Continue Shopping** | Ghost button linking to `/products`                                                                                                                              |
| **Checkout CTA**      | Large primary button: "Proceed to Checkout" (full-width on mobile); disabled if cart is empty                                                                    |
| **Empty State**       | Illustration + "Your cart is empty" heading + "Browse Products" primary CTA                                                                                      |
| **Stock Warning**     | If item exceeds available stock, show warning badge + auto-adjust quantity                                                                                       |

### 9.3 Checkout Page (`/checkout`)

| Element              | UX Requirement                                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Layout**           | Two columns: Left (steps form, 60%) + Right (order summary sidebar, 40%); single column on mobile                                                                  |
| **Progress Stepper** | Horizontal step indicator: **1. Shipping** → **2. Review** → **3. Payment** → **4. Confirmation**; completed steps in Teal, current step bold, upcoming steps gray |
| **Guest Checkout**   | Option for guest users: "Checkout as Guest" (email + phone required) or "Login / Register" links                                                                   |

#### Step 1: Shipping Address

| Element              | UX Requirement                                                                                                                          |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Saved Addresses**  | Logged-in users see saved addresses as selectable cards; pre-select default address                                                     |
| **New Address Form** | Recipient name, phone, address line 1, address line 2 (optional), city, governorate (dropdown), postal code                             |
| **National ID**      | Required field for guest checkout: 14-digit Egyptian National ID input with format validation (displayed above address form for guests) |
| **Save Address**     | Checkbox: "Save this address for future orders" (logged-in users only)                                                                  |
| **CTA**              | "Continue to Review" primary button; "Back to Cart" ghost link                                                                          |

#### Step 2: Order Review

| Element              | UX Requirement                                                                       |
| -------------------- | ------------------------------------------------------------------------------------ |
| **Items Summary**    | List of all cart items with thumbnail, name, qty, unit price, line total (read-only) |
| **Shipping Address** | Display selected address with "Edit" link (returns to Step 1)                        |
| **Price Breakdown**  | Subtotal + Shipping + Discount (if any) = **Total (EGP)**; clearly formatted         |
| **CTA**              | "Proceed to Payment" primary button; "Back" ghost link                               |

#### Step 3: Payment (Paymob)

| Element             | UX Requirement                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Payment Methods** | Radio selection: **Credit/Debit Card** (Visa/Mastercard icons), **Mobile Wallet** (Vodafone Cash, etc.), **Installments** (if available) |
| **Card Payment**    | Redirect to Paymob hosted payment page OR embed Paymob iframe; branded with Lord logo and total amount                                   |
| **Wallet Payment**  | Redirect to Paymob wallet page; user enters wallet number + OTP                                                                          |
| **Installments**    | Show available installment plans (if configured); select plan then redirect to Paymob                                                    |
| **Loading State**   | "Processing payment..." overlay with Lord fan spinner + "Please do not close this page" text                                             |
| **Error State**     | Red alert: "Payment failed. Please try again or use a different payment method." + "Retry" button                                        |
| **Security Trust**  | Display lock icon + "Secured by Paymob" badge + Visa/Mastercard logos near payment area                                                  |

#### Step 4: Order Confirmation

| Element                | UX Requirement                                                          |
| ---------------------- | ----------------------------------------------------------------------- |
| **Success State**      | Green checkmark animation + "Order placed successfully!" heading        |
| **Order Number**       | Large, prominent order number (e.g., "#LORD-20260001") with copy button |
| **Order Summary**      | Items, quantities, total, payment method used, shipping address         |
| **Payment Receipt**    | Paymob transaction ID, amount paid, payment method, date/time           |
| **Estimated Delivery** | "Estimated delivery: 3–5 business days" (configurable from CMS)         |
| **Actions**            | "Track My Order" primary button + "Continue Shopping" secondary button  |
| **Email Note**         | "A confirmation email has been sent to [email]"                         |

### 9.4 Product Card — E-Commerce Enhancements

| Enhancement              | UX Behavior                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **Add to Cart Button**   | Replaces "Inquire Now"; on click: button shows spinner → green checkmark + "Added!" for 2 sec |
| **Cart Badge Update**    | Navbar cart badge count animates (scale bounce) when item is added                            |
| **Out of Stock Overlay** | Gray overlay on product image with "Out of Stock" badge; "Add to Cart" button disabled        |
| **Sale Badge**           | Red/Teal diagonal ribbon on product image: "−20%" or "Sale"                                   |
| **Quick View**           | Eye icon on hover → opens modal with image, specs, price, quantity selector, "Add to Cart"    |

---

## 10. Customer Account UX

### 10.1 Login Page (`/login`)

| Element          | UX Requirement                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| **Layout**       | Centered card (max 440px) on subtle Off-White background; Lord logo above                      |
| **Form Fields**  | Email + Password inputs; "Show password" toggle (eye icon)                                     |
| **CTA**          | "Login" primary button (full-width)                                                            |
| **Links**        | "Forgot Password?" link below password field; "Don't have an account? Register" link at bottom |
| **Error State**  | Red alert: "Invalid email or password" (generic for security)                                  |
| **Social Proof** | Optional: "Trusted by XX+ customers since 1986" text below form                                |

### 10.2 Register Page (`/register`)

| Element                | UX Requirement                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Layout**             | Same centered card style as Login page                                                                                 |
| **Form Fields**        | Full name, national ID (14-digit Egyptian National ID), email, phone, password, confirm password; real-time validation |
| **Password Rules**     | Minimum 8 chars, 1 uppercase, 1 number; strength indicator bar (red/amber/green)                                       |
| **CTA**                | "Create Account" primary button                                                                                        |
| **Links**              | "Already have an account? Login" link at bottom                                                                        |
| **Email Verification** | After submission: redirect to OTP verification page; 6-digit code sent to email                                        |

### 10.3 Email Verification Page

| Element       | UX Requirement                                                                            |
| ------------- | ----------------------------------------------------------------------------------------- |
| **Layout**    | Centered card with email icon illustration                                                |
| **OTP Input** | 6 separate digit inputs; auto-focus next on input; paste support for full code            |
| **Timer**     | "Resend code in 60s" countdown; "Resend Code" link enabled after timer expires            |
| **CTA**       | "Verify Email" primary button                                                             |
| **Success**   | Green checkmark + "Email verified!" → auto-redirect to login or previous page after 2 sec |

### 10.4 Forgot Password Flow

| Step | UX Requirement                                                                             |
| ---- | ------------------------------------------------------------------------------------------ |
| 1    | Enter email → "Send Reset Code" CTA; success: "Check your email for the verification code" |
| 2    | 6-digit OTP input (same UX as email verification)                                          |
| 3    | New password + confirm password fields; password strength indicator; "Reset Password" CTA  |
| 4    | Success: "Password reset successfully!" → redirect to Login page                           |

### 10.5 Customer Dashboard (`/account`)

| Element          | UX Requirement                                                             |
| ---------------- | -------------------------------------------------------------------------- |
| **Layout**       | Left sidebar navigation (desktop) or top tabs (mobile) + main content area |
| **Welcome Bar**  | "Welcome back, [First Name]" + last login date                             |
| **Quick Stats**  | Total orders, Pending orders, Recent order status                          |
| **Sidebar/Tabs** | My Orders, My Addresses, My Profile, Change Password, Logout               |

### 10.6 My Orders Page (`/account/orders`)

| Element               | UX Requirement                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| **Order List**        | Reverse chronological; each order card: order #, date, items count, total, status badge            |
| **Filters**           | Filter by status (All, Confirmed, Processing, Shipped, Delivered, Cancelled)                       |
| **Order Detail Page** | Click order → full detail: items list, quantities, prices, shipping address, payment info          |
| **Order Timeline**    | Visual stepper: Placed → Confirmed → Processing → Shipped → Delivered; current step highlighted    |
| **Tracking Info**     | If shipped: tracking number + carrier name; link to external tracking (if available)               |
| **Cancel Button**     | "Cancel Order" danger button visible only on Confirmed/Pending status; confirmation modal required |
| **Empty State**       | "No orders yet" illustration + "Start Shopping" CTA                                                |

### 10.7 My Addresses Page (`/account/addresses`)

| Element            | UX Requirement                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------- |
| **Address Cards**  | Grid of saved addresses; each card: label, recipient, phone, full address, default star badge |
| **Add Address**    | "+ Add New Address" button → opens form modal or inline form                                  |
| **Edit / Delete**  | Edit icon + Delete icon on each card; delete requires confirmation modal                      |
| **Set as Default** | Star icon toggle; default address pre-selected at checkout                                    |
| **Max Addresses**  | Limit to 10 saved addresses; show message when limit reached                                  |

### 10.8 My Profile Page (`/account/profile`)

| Element             | UX Requirement                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Profile Info**    | Editable: full name, national ID (14-digit Egyptian National ID), email (read-only after verification), phone |
| **Change Password** | Separate section: current password + new password + confirm; password strength bar                            |
| **Save Changes**    | Primary button; success toast: "Profile updated successfully"                                                 |

---

## 11. Responsive Design

### 11.1 Breakpoints

| Breakpoint    | Width  | Target Devices                    |
| ------------- | ------ | --------------------------------- |
| **Mobile S**  | 320px  | Small phones (iPhone SE)          |
| **Mobile M**  | 375px  | Standard phones (iPhone 14)       |
| **Mobile L**  | 425px  | Large phones (iPhone Pro Max)     |
| **Tablet**    | 768px  | iPad, tablets                     |
| **Laptop**    | 1024px | Small laptops, iPad Pro landscape |
| **Desktop**   | 1280px | Standard desktop monitors         |
| **Desktop L** | 1440px | Large desktop monitors            |

### 11.2 Responsive Behavior

| Component             | Desktop (≥1024px)            | Tablet (768–1023px)        | Mobile (<768px)                |
| --------------------- | ---------------------------- | -------------------------- | ------------------------------ |
| **Navbar**            | Full horizontal nav + CTA    | Hamburger menu             | Hamburger menu                 |
| **Cart Icon**         | Icon + badge in navbar       | Icon + badge in navbar     | Icon + badge in navbar         |
| **Hero**              | Side-by-side text + image    | Stacked text above image   | Stacked, compact               |
| **Product Grid**      | 3–4 columns                  | 2 columns                  | 1 column (card list)           |
| **Service Cards**     | 3 columns or horizontal      | 2 columns                  | 1 column stacked               |
| **Footer**            | 4 columns                    | 2×2 grid                   | Single column stacked          |
| **Filter Sidebar**    | Sticky left sidebar          | Collapsible top filter bar | Bottom sheet / modal filter    |
| **Product Detail**    | 2 columns (image + info)     | 2 columns (narrower)       | Stacked single column          |
| **Cart Page**         | Items list + summary sidebar | Items list + summary below | Stacked; sticky bottom total   |
| **Checkout**          | 2 columns (form + summary)   | 2 columns (narrower)       | Single column; sticky CTA      |
| **Account Dashboard** | Sidebar + content area       | Top tabs + content         | Top tabs + full-width content  |
| **Tables (CMS)**      | Full table                   | Horizontal scroll          | Card view or horizontal scroll |

### 11.3 Touch Targets

| Rule                                                              |
| ----------------------------------------------------------------- |
| Minimum touch target size: **44×44px** (WCAG 2.1 AAA recommended) |
| Minimum spacing between interactive elements: **8px**             |
| Swipeable image galleries on touch devices                        |
| Tap-to-call on phone numbers (`tel:` link)                        |
| Tap-to-WhatsApp on WhatsApp numbers (`https://wa.me/` link)       |

---

## 12. Accessibility

### 12.1 WCAG 2.1 AA Compliance

| Requirement                                                                              |
| ---------------------------------------------------------------------------------------- |
| All text meets minimum contrast ratio: **4.5:1** (normal text), **3:1** (large text)     |
| All images have meaningful `alt` text; decorative images use `alt=""`                    |
| All form inputs have associated `<label>` elements                                       |
| Keyboard navigation support on all interactive elements (Tab, Enter, Escape, Arrow keys) |
| Focus indicators visible on all focusable elements (2px Teal outline)                    |
| Skip navigation link ("Skip to main content") as first focusable element                 |
| ARIA landmarks on all major page sections (`<nav>`, `<main>`, `<aside>`, `<footer>`)     |
| Screen reader announcements for dynamic content updates (toast, form errors)             |
| No content relies solely on color to convey information                                  |
| Page title updates on route change for SPA navigation                                    |

### 12.2 Focus Styles

| State             | Style                                             |
| ----------------- | ------------------------------------------------- |
| **Focus Visible** | `outline: 2px solid #0DBACA; outline-offset: 2px` |
| **Focus Within**  | Same as Focus Visible for container elements      |
| **Focus (mouse)** | Outline hidden (`:focus:not(:focus-visible)`)     |

---

## 13. Localization & RTL Support

### 13.1 Language Configuration

| Attribute            | Value                                         |
| -------------------- | --------------------------------------------- |
| **Default Language** | Arabic (AR) — primary market                  |
| **Supported**        | Arabic (AR), English (EN)                     |
| **Toggle Location**  | Navbar, right side — text link: "EN" / "عربي" |
| **URL Strategy**     | Subdirectory: `/ar/products`, `/en/products`  |
| **Direction**        | Arabic: `dir="rtl"`; English: `dir="ltr"`     |

### 13.2 RTL Design Rules

| Rule                                                                                           |
| ---------------------------------------------------------------------------------------------- |
| All layouts must mirror horizontally in RTL: logo to the right, nav items right-to-left        |
| Icons with directional meaning (arrows, chevrons) must flip in RTL                             |
| Text alignment follows content direction (`text-align: start` instead of `left`)               |
| Use CSS logical properties: `margin-inline-start`, `padding-inline-end`, `border-inline-start` |
| Numbers remain LTR even in RTL context (phone numbers, prices, model numbers)                  |
| Image carousels scroll direction reverses in RTL                                               |
| Form labels appear to the right of inputs in RTL                                               |
| Tailwind CSS: use `rtl:` variant for direction-specific styles                                 |

### 13.3 Font Adjustments for Arabic

| Attribute              | English | Arabic                                            |
| ---------------------- | ------- | ------------------------------------------------- |
| **Font Family**        | Inter   | Cairo                                             |
| **Body Size**          | 16px    | 16px                                              |
| **Line Height**        | 1.6     | 1.8 (taller)                                      |
| **Letter Spacing**     | Normal  | Normal                                            |
| **Font Weight Offset** | None    | +100 (Arabic fonts render thinner at same weight) |

---

## 14. Motion & Animation

### 14.1 Animation Principles

| Principle                                                                         |
| --------------------------------------------------------------------------------- |
| Animations are functional — they guide attention and provide feedback             |
| Respect `prefers-reduced-motion` — disable non-essential animations when enabled  |
| Keep durations short: 150–300ms for micro-interactions, 300–500ms for transitions |
| Use ease-out curves for enter animations, ease-in for exit animations             |

### 14.2 Animation Specifications

| Element                      | Animation                                          | Duration | Easing      |
| ---------------------------- | -------------------------------------------------- | -------- | ----------- |
| **Page Transition**          | Fade in                                            | 200ms    | ease-out    |
| **Card Hover**               | Scale to 1.02 + shadow elevation                   | 200ms    | ease-out    |
| **Button Hover**             | Background color shift + subtle Y translate (-1px) | 150ms    | ease-out    |
| **Nav Link Underline**       | Width expand from center (0 → 100%)                | 200ms    | ease-out    |
| **Mobile Menu**              | Slide in from right + overlay fade                 | 300ms    | ease-out    |
| **Modal Open**               | Scale from 0.95 → 1.0 + overlay fade               | 200ms    | ease-out    |
| **Toast Enter**              | Slide in from top-right + fade                     | 300ms    | ease-out    |
| **Toast Exit**               | Fade out + slide right                             | 200ms    | ease-in     |
| **Testimonial Carousel**     | Slide with crossfade                               | 400ms    | ease-in-out |
| **Product Image Zoom**       | Scale from 1.0 → 1.5 in lightbox                   | 300ms    | ease-out    |
| **Scroll Reveal (sections)** | Fade up (translate Y 20px → 0) on intersection     | 500ms    | ease-out    |
| **Loading Spinner**          | Lord fan icon rotating 360° continuously           | 1000ms   | linear      |
| **Add to Cart**              | Button: spinner → checkmark icon + "Added!" text   | 300ms    | ease-out    |
| **Cart Badge Bounce**        | Scale 1.0 → 1.3 → 1.0 on item count change         | 400ms    | ease-out    |
| **Mini Cart Dropdown**       | Slide down + fade in from navbar                   | 200ms    | ease-out    |
| **Checkout Stepper**         | Step circles fill with Teal color sequentially     | 300ms    | ease-out    |
| **Order Confirmation**       | Green checkmark scale-up + confetti particles      | 500ms    | ease-out    |
| **Quantity Change**          | Number fade transition on ± click                  | 150ms    | ease-out    |

---

## 15. CMS Panel Design

### 15.1 CMS Layout

| Element             | Specification                                                                          |
| ------------------- | -------------------------------------------------------------------------------------- |
| **Layout**          | Fixed left sidebar (260px) + main content area                                         |
| **Sidebar BG**      | Navy (`#172041`)                                                                       |
| **Sidebar Text**    | White (active); Silver `#BEBEBE` (inactive)                                            |
| **Active Nav Item** | Left border 3px Teal + background `rgba(13, 186, 202, 0.1)`                            |
| **Main Content BG** | Off-White (`#F8FAFB`)                                                                  |
| **Top Bar**         | White, 64px height, shadow `0 1px 3px rgba(0,0,0,0.05)` — shows page title + user menu |
| **Content Cards**   | White cards with 24px padding, 12px radius, on Off-White background                    |

### 15.2 CMS Sidebar Navigation

| #   | Icon            | Label (EN)           |
| --- | --------------- | -------------------- |
| 1   | LayoutDashboard | Dashboard            |
| 2   | ShoppingBag     | Orders               |
| 3   | Users           | Customers            |
| 4   | Package         | Products             |
| 5   | Tags            | Brands & Categories  |
| 6   | Wrench          | Services             |
| 7   | MessageSquare   | Inquiries & Requests |
| 8   | Ticket          | Coupons & Promos     |
| 9   | FileText        | Content Pages        |
| 10  | Star            | Testimonials         |
| 11  | HelpCircle      | FAQs                 |
| 12  | Settings        | Settings             |

### 15.3 CMS Dashboard Widgets

| Widget                  | Content                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| **Revenue Today**       | Total revenue (EGP) today + percentage change vs. yesterday         |
| **New Orders Today**    | Count of today's orders + quick link to orders list                 |
| **Pending Orders**      | Count of orders awaiting processing; click to view filtered list    |
| **New Inquiries Today** | Count badge + list of latest 5                                      |
| **Service Requests**    | Count by status (New / In Progress / Resolved)                      |
| **Total Products**      | Count by brand (Carrier: X, Midea: Y); out of stock alert count     |
| **Recent Orders Table** | Last 10 orders: order #, customer, total, status badge, date        |
| **Revenue Chart**       | Line chart: daily revenue for last 30 days (Teal line on Navy grid) |
| **Quick Actions**       | "View Orders", "Add Product", "View Inquiries", "Manage Coupons"    |

### 15.4 CMS Order Management Page

| Element               | UX Requirement                                                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Orders List**       | Table with columns: Order #, Customer, Items, Total (EGP), Payment Status, Order Status, Date, Actions                                                               |
| **Filters**           | Status (All/Confirmed/Processing/Shipped/Delivered/Cancelled), date range picker, search by order # or customer email                                                |
| **Bulk Actions**      | Select multiple orders; bulk status update, bulk export                                                                                                              |
| **Order Detail View** | Full order detail: customer info, items list with images, payment details (Paymob transaction ID, method, amount), shipping address, status timeline, internal notes |
| **Status Update**     | Dropdown to change order status; required fields on ship (tracking number, carrier name)                                                                             |
| **Refund Button**     | "Issue Refund" danger button on order detail; modal: full/partial refund amount, reason; calls Paymob API                                                            |
| **Print/Export**      | Print order receipt button; export orders to CSV with current filters                                                                                                |

### 15.5 CMS Customer Management Page

| Element             | UX Requirement                                                                         |
| ------------------- | -------------------------------------------------------------------------------------- |
| **Customer List**   | Table: name, email, phone, orders count, total spent (EGP), registration date, status  |
| **Search**          | Search by name, email, or phone                                                        |
| **Customer Detail** | Profile info + order history list + service request history + address book (read-only) |
| **Actions**         | Enable/disable customer account; view all orders from this customer                    |

### 15.6 CMS Coupon Management Page

| Element                | UX Requirement                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **Coupon List**        | Table: code, discount type (% / fixed), value, usage count / limit, expiry date, active status    |
| **Create Coupon Form** | Code (auto-generate option), discount type, value, minimum order value, max usage, start/end date |
| **Actions**            | Enable/disable, edit, delete; view usage history (which orders used this coupon)                  |

---

## 16. Brand Partners Display Guidelines

### 16.1 Carrier Brand Guidelines

| Attribute           | Rule                                                                  |
| ------------------- | --------------------------------------------------------------------- |
| **Logo**            | Official Carrier oval logo; navy background, white "Carrier" text     |
| **Minimum Size**    | 80px width (desktop), 60px (mobile)                                   |
| **Clear Space**     | Equal to 50% of logo height on all sides                              |
| **Color Integrity** | Do not recolor; use only approved versions (full color, white, black) |
| **Placement**       | Always paired with Midea at equal visual weight                       |

### 16.2 Midea Brand Guidelines

| Attribute           | Rule                                                          |
| ------------------- | ------------------------------------------------------------- |
| **Logo**            | Official Midea logo with teal "M" circle and "Midea" wordmark |
| **Minimum Size**    | 80px width (desktop), 60px (mobile)                           |
| **Clear Space**     | Equal to 50% of logo height on all sides                      |
| **Color Integrity** | Do not recolor; use only approved versions                    |
| **Placement**       | Always paired with Carrier at equal visual weight             |

### 16.3 "Authorized Dealer" Badge Component

| Attribute         | Specification                                                    |
| ----------------- | ---------------------------------------------------------------- |
| **Layout**        | Shield or badge shape with brand logo + "Authorized Dealer" text |
| **Background**    | White with Navy border (`1px solid #172041`)                     |
| **Text**          | "Authorized Dealer" — 12px Semi-Bold, Navy                       |
| **Brand Logo**    | Carrier or Midea logo inside badge, 32px height                  |
| **Border Radius** | 8px                                                              |
| **Usage**         | Product cards, product detail pages, footer, About page          |

---

_End of Document_
