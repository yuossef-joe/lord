1# Business Requirements Document (BRD)

## Lord — Website & Content Management System

| Field                | Detail                                               |
| -------------------- | ---------------------------------------------------- |
| **Document Version** | 1.0                                                  |
| **Date**             | April 6, 2026                                        |
| **Project Name**     | Lord Website & CMS                                   |
| **Project Type**     | Full-Stack Web Application (Air Conditioning Retail) |
| **Status**           | In Development                                       |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Objectives](#2-project-objectives)
3. [Problem Statement](#3-problem-statement)
4. [Scope](#4-scope)
5. [Stakeholders](#5-stakeholders)
6. [Business Requirements](#6-business-requirements)
7. [Functional Requirements](#7-functional-requirements)
   - 7.1 [Public Website](#71-public-website)
   - 7.2 [Product Catalog](#72-product-catalog)
   - 7.3 [Shopping Cart & Checkout](#73-shopping-cart--checkout)
   - 7.4 [Payment System (Paymob)](#74-payment-system-paymob)
   - 7.5 [Customer Accounts](#75-customer-accounts)
   - 7.6 [Order Management](#76-order-management)
   - 7.7 [After-Sales Services](#77-after-sales-services)
   - 7.8 [Service Request & Inquiry System](#78-service-request--inquiry-system)
   - 7.9 [Content Management System (CMS)](#79-content-management-system-cms)
   - 7.10 [Notifications & Communications](#710-notifications--communications)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [System Architecture](#9-system-architecture)
10. [Data Model Overview](#10-data-model-overview)
11. [User Roles & Permissions](#11-user-roles--permissions)
12. [Integration Requirements](#12-integration-requirements)
13. [Security & Compliance](#13-security--compliance)
14. [Phasing & Prioritization](#14-phasing--prioritization)
15. [Assumptions & Constraints](#15-assumptions--constraints)
16. [Risks & Mitigations](#16-risks--mitigations)
17. [Glossary](#17-glossary)

---

## 1. Executive Summary

**Lord** is an authorized dealer for **Carrier** and **Midea** air conditioners. The platform consists of a full-featured **e-commerce website** with integrated **Paymob payment processing** and a back-office **Content Management System (CMS)** designed to sell products online, manage after-sales service operations — including installation, maintenance, repair, and delivery — and handle order fulfillment.

Customers visiting the Lord website can browse the full catalog of Carrier and Midea air conditioning units, **add products to a shopping cart, complete purchases online via Paymob (card, mobile wallet, or installments)**, explore available after-sales service packages, and submit service requests. Registered customers can track their orders, view purchase history, and manage their accounts. The CMS empowers the Lord team to manage products, orders, services, promotions, and customer communications without writing a single line of code.

The system aims to:

- Establish a trusted digital presence as an authorized Carrier and Midea dealer.
- **Enable online purchasing with secure payment processing via Paymob** (credit/debit cards, mobile wallets, and installment plans).
- Solve real customer pain points around finding reliable AC units, obtaining accurate pricing, and booking after-sales support.
- **Provide customers with accounts to track orders, view purchase history, and manage delivery preferences.**
- Streamline internal operations by centralizing product listings, orders, service requests, and customer communications through a unified CMS.
- Drive sales and customer conversion through a modern, bilingual (Arabic/English) e-commerce website.

---

## 2. Project Objectives

| #   | Objective                                                               | Success Metric                                                                                  |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| O1  | Establish a professional online presence as an authorized dealer        | Customers can discover Lord, verify brand authorization, and browse products online             |
| O2  | Showcase the full Carrier & Midea product catalog with accurate details | 100% of available SKUs listed with specs, pricing, and imagery                                  |
| O3  | **Enable customers to purchase AC units online via Paymob**             | Customers can add to cart, checkout, and pay securely; orders captured and confirmed in < 5 sec |
| O4  | **Provide customer accounts with order tracking and history**           | Registered customers can view order status, track delivery, and access purchase history         |
| O5  | Enable customers to submit service requests and inquiries               | Inquiry/service form submissions captured and routed to Lord team with < 1hr response SLA       |
| O6  | Provide a complete after-sales service offering online                  | Installation, maintenance, repair, and delivery services clearly described and bookable         |
| O7  | Empower staff to manage all content and orders without code changes     | CMS staff can manage products, orders, services, promotions, and settings independently         |
| O8  | Automate customer communications                                        | Order confirmations, shipping updates, inquiry acknowledgements sent automatically              |
| O9  | Improve brand credibility and customer trust                            | Authorized dealer badges, brand partnership logos, and customer testimonials displayed          |

---

## 3. Problem Statement

Lord's customers face a set of recurring pain points that the platform is explicitly designed to solve:

### 3.1 Customer Problems Solved

| #   | Problem                                                             | How Lord Solves It                                                                                                            |
| --- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| P1  | **Difficulty finding trusted, authorized AC dealers**               | Lord's website prominently displays Carrier and Midea authorized dealer credentials and official brand certifications         |
| P2  | **Lack of transparent product information and pricing**             | The product catalog provides full specifications, capacity ratings (BTU/ton), energy efficiency (EER/SEER), and clear pricing |
| P3  | **Uncertainty about which AC unit is right for their space**        | Product filtering by capacity, type (split, cassette, central, VRF), and room size guides customers to the right unit         |
| P4  | **No easy way to request installation or maintenance services**     | Online service request forms allow customers to describe their need and schedule after-sales support conveniently             |
| P5  | **Fear of post-purchase abandonment by dealers**                    | Dedicated after-sales service pages highlight repair, periodic maintenance, spare parts, and delivery services                |
| P6  | **Uncertainty about warranty and spare parts availability**         | Product pages and FAQ sections clearly address warranty terms and spare parts sourcing for Carrier and Midea units            |
| P7  | **Difficulty comparing models across the Carrier and Midea ranges** | Product catalog supports side-by-side spec visibility, filtering, and brand-based separation                                  |
| P8  | **No reliable way to contact the dealer outside business hours**    | Online inquiry and service request forms operate 24/7, with automated acknowledgements sent immediately                       |
| P9  | **Inability to purchase AC units online and track orders**          | Full e-commerce with Paymob payment (card, wallet, installments), order tracking, and customer accounts for purchase history  |
| P10 | **No way to view past purchases or request repeat services**        | Customer account portal provides order history, purchase receipts, and quick re-order or service request links                |

---

## 4. Scope

### 4.1 In Scope

| Module                          | Description                                                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Public Website**              | Home, Products, Services, About, Contact pages with full SEO support and bilingual (AR/EN) content                |
| **Product Catalog**             | Carrier and Midea AC unit listings with specs, images, pricing, filtering, and search                             |
| **Shopping Cart**               | Persistent cart with add/remove/update quantities, cart badge in navbar, cart summary page                        |
| **Checkout & Payment**          | Multi-step checkout flow (shipping → payment → confirmation) with Paymob payment gateway integration              |
| **Customer Accounts**           | Customer registration, login, profile management, address book, order history, and order tracking                 |
| **Order Management**            | Full order lifecycle (Pending → Confirmed → Processing → Shipped → Delivered / Cancelled / Refunded)              |
| **Payment Processing (Paymob)** | Online card payments, mobile wallets (Vodafone Cash, etc.), and installment plans via Paymob Accept               |
| **After-Sales Services**        | Dedicated service pages for installation, maintenance, repair, spare parts, and delivery                          |
| **Service Request System**      | Online forms for customers to request installation, maintenance, or repair; inquiry capture and routing           |
| **CMS**                         | Content management for products, orders, customers, services, promotions, testimonials, FAQs, and website content |
| **Notifications**               | Automated emails for order confirmations, shipping updates, payment receipts, inquiries, and service requests     |
| **Authentication (CMS)**        | Secure CMS staff login with role-based access control                                                             |
| **Authentication (Customer)**   | Customer registration with email verification, login, password reset, profile management                          |

### 4.2 Out of Scope

- Inventory management or warehouse management system (WMS)
- ERP / accounting system integration
- Mobile native applications (iOS/Android) — responsive web only
- Live chat or chatbot
- Multi-branch / multi-warehouse management (single-location focus for MVP)
- IoT integration with AC units (smart home features)
- Multi-currency support (EGP only for MVP)
- Loyalty / rewards program
- Product reviews by customers (testimonials are admin-managed)

---

## 5. Stakeholders

| Role                                 | Responsibility                                                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| **Lord Management**                  | Primary stakeholder; defines business goals, product range, pricing, and service offerings |
| **Lord Sales & Service Team**        | Responds to customer inquiries and service requests received through the platform          |
| **CMS Content Manager (Lord Staff)** | Manages product listings, services, promotions, and website content via the CMS            |
| **Customers**                        | End users who discover products, compare models, and submit inquiries or service requests  |
| **Carrier / Midea (Brand Partners)** | Authorized brand principals whose guidelines and branding standards must be upheld         |
| **Paymob (Payment Partner)**         | Payment gateway provider for online card, wallet, and installment transactions             |
| **Development Team**                 | Backend and frontend developers building and maintaining the platform                      |

---

## 6. Business Requirements

### BR-1: Authorized Dealer Digital Presence

Lord requires a professional, bilingual (Arabic/English) website that clearly establishes its identity as an authorized dealer for Carrier and Midea. The website must display official brand authorization credentials, dealer badges, and brand partnership information to build customer trust.

### BR-2: Product Catalog & Discovery

Customers must be able to browse the complete range of Carrier and Midea air conditioning units, filter by brand, type, capacity, and price range, and view full product specifications to make informed purchase decisions.

### BR-3: After-Sales Service Visibility

The platform must clearly communicate Lord's full range of after-sales services — installation, periodic maintenance, emergency repair, spare parts supply, and delivery — with clear descriptions, scope, and contact pathways for each service type.

### BR-4: E-Commerce & Online Purchasing

Customers must be able to browse products, add items to a shopping cart, and complete purchases online with secure payment processing via Paymob. The system must support credit/debit card payments, mobile wallets (Vodafone Cash, etc.), and installment plans.

### BR-5: Customer Account Management

Customers must be able to register accounts, manage their profiles, save delivery addresses, view order history, and track order status in real time.

### BR-6: Order Fulfillment & Management

The CMS must provide comprehensive order management capabilities — viewing orders, updating order status (Confirmed → Processing → Shipped → Delivered), processing refunds, and tracking payment status.

### BR-7: Lead Generation & Inquiry Capture

Customers must be able to submit service requests and general inquiries online at any time. All submissions must be captured, routed to the appropriate team member, and acknowledged with an automated response.

### BR-8: Content Management

Lord staff must be able to manage all website content — product listings, orders, service descriptions, promotions, testimonials, FAQs, and contact information — through a CMS without requiring code changes or developer intervention.

### BR-9: Communication Automation

The system must automatically send emails for order confirmations, payment receipts, shipping updates, delivery notifications, inquiry acknowledgements, and service request confirmations.

### BR-10: SEO & Discoverability

The platform must be optimized for search engines to ensure Lord appears in relevant local searches for Carrier AC, Midea AC, air conditioner dealers, and AC service/repair in the target region.

---

## 7. Functional Requirements

### 7.1 Public Website

#### FR-1.1: Home Page

| ID       | Requirement                                                                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1.1.1 | Display hero section with Lord branding, headline ("Authorized Carrier & Midea Dealer"), tagline, and primary CTA ("Shop Now" / "Browse Products") |
| FR-1.1.2 | Show authorized dealer badges and official Carrier and Midea brand logos with authorization credentials                                            |
| FR-1.1.3 | Display featured product highlights (latest/bestselling Carrier and Midea units) in a card/grid layout                                             |
| FR-1.1.4 | Showcase after-sales services summary (installation, maintenance, repair, delivery) as icon cards with brief descriptions                          |
| FR-1.1.5 | Display customer testimonials with star ratings in a carousel/slider                                                                               |
| FR-1.1.6 | Show contact information: address, phone, WhatsApp, email, working hours, embedded Google Maps, and social media links                             |
| FR-1.1.7 | All content must be dynamically loaded from the CMS backend                                                                                        |

#### FR-1.2: Products Page

| ID       | Requirement                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-1.2.1 | Display all AC units in a responsive grid/list layout with product image, name, brand, capacity, type, and starting price                                                                        |
| FR-1.2.2 | Filter by: Brand (Carrier / Midea), Type (Split, Cassette, Central, VRF, Window, Portable), Capacity (BTU/ton range), Price range                                                                |
| FR-1.2.3 | Search bar for product name or model number                                                                                                                                                      |
| FR-1.2.4 | Individual product detail page with: full specs (BTU/ton, EER/SEER, voltage, refrigerant, dimensions, weight), feature highlights, image gallery, pricing, and **"Add to Cart"** / "Buy Now" CTA |
| FR-1.2.5 | Brand-separated sections or tabs (Carrier / Midea) for easy brand navigation                                                                                                                     |
| FR-1.2.6 | "Authorized Dealer" badge displayed on all product pages                                                                                                                                         |

#### FR-1.3: After-Sales Services Page

| ID       | Requirement                                                                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-1.3.1 | Dedicated service cards for each service type: **Installation**, **Periodic Maintenance**, **Emergency Repair**, **Spare Parts Supply**, **Delivery** |
| FR-1.3.2 | Each service card includes: service name, icon, description, what's included, applicable unit types, and a "Request This Service" CTA                 |
| FR-1.3.3 | Installation service page details: site survey, refrigerant piping, electrical connection, unit testing, and post-install checklist                   |
| FR-1.3.4 | Maintenance service page details: filter cleaning, coil cleaning, refrigerant check, electrical inspection, and service frequency recommendations     |
| FR-1.3.5 | Repair service page details: fault diagnosis, part replacement, warranty on repairs, and emergency response                                           |
| FR-1.3.6 | Delivery service page details: delivery area coverage, estimated lead times, and installation-bundled delivery options                                |

#### FR-1.4: About Page

| ID       | Requirement                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------ |
| FR-1.4.1 | Display Lord company profile: name, founding story, mission, vision                              |
| FR-1.4.2 | Highlight authorized dealer status for Carrier and Midea with official certification information |
| FR-1.4.3 | Showcase brand partnership section with Carrier and Midea logos and dealer tier information      |
| FR-1.4.4 | Display team/company credentials, years of experience, and service coverage area                 |
| FR-1.4.5 | List key statistics: number of units installed, years in business, customer satisfaction rate    |

#### FR-1.5: Contact Page

| ID       | Requirement                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| FR-1.5.1 | Provide general contact form with: name, email, phone, inquiry type (purchase / service / general), and message   |
| FR-1.5.2 | Validate all required fields before submission                                                                    |
| FR-1.5.3 | Submit form data to backend; send automated acknowledgement email to customer and notification email to Lord team |
| FR-1.5.4 | Display address, phone, WhatsApp number, email, working hours, and embedded Google Maps                           |
| FR-1.5.5 | Display social media links (Facebook, Instagram, WhatsApp)                                                        |

---

### 7.2 Product Catalog

| ID     | Requirement                                                                                                                                                                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-2.1 | Product record must include: brand (Carrier/Midea), model number, name, type, capacity (BTU/ton), EER/SEER, voltage, refrigerant type, dimensions, weight, color, image gallery (up to 10 images), description, features list, price, active status |
| FR-2.2 | Support product categories/types: Split Unit, Multi-Split, Cassette, Duct, Central, VRF/VRV, Window, Portable                                                                                                                                       |
| FR-2.3 | Products linked to a brand (Carrier or Midea) with brand-level metadata (logo, authorized dealer certificate reference)                                                                                                                             |
| FR-2.4 | "Featured" flag for homepage highlights and promotional placements                                                                                                                                                                                  |
| FR-2.5 | "New Arrival" and "Bestseller" badges configurable per product                                                                                                                                                                                      |
| FR-2.6 | SEO fields per product: slug, meta title, meta description                                                                                                                                                                                          |

---

### 7.3 Shopping Cart & Checkout

| ID     | Requirement                                                                                                                                           |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-3.1 | **Shopping Cart:** Customers can add products to a persistent cart, update quantities, remove items, and view a cart summary with subtotal            |
| FR-3.2 | Cart persists across sessions for logged-in users (server-side); uses localStorage for guests (merged on login)                                       |
| FR-3.3 | Cart badge on navbar shows item count; mini-cart dropdown on hover/click with quick view of items                                                     |
| FR-3.4 | Cart page displays: product image, name, brand, quantity selector, unit price, line total, subtotal, estimated shipping, and grand total              |
| FR-3.5 | **Checkout Flow:** Multi-step checkout: Step 1 (Shipping Address) → Step 2 (Order Review) → Step 3 (Payment via Paymob) → Step 4 (Order Confirmation) |
| FR-3.6 | Guest checkout supported (customer provides name, national ID, email, phone, shipping address without creating an account)                            |
| FR-3.7 | Logged-in customers can select from saved addresses or add a new shipping address during checkout                                                     |
| FR-3.8 | Promo/coupon code field at checkout; validated against active promotions                                                                              |
| FR-3.9 | Order review step shows full summary: items, quantities, prices, shipping cost, discount (if any), and total before payment                           |

---

### 7.4 Payment System (Paymob)

| ID     | Requirement                                                                                                                                                                |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-4.1 | Integrate **Paymob Accept** as the primary payment gateway for all online transactions                                                                                     |
| FR-4.2 | Support payment methods: **Credit/Debit Card** (Visa, Mastercard), **Mobile Wallets** (Vodafone Cash, Etisalat Cash, Orange Money), **Installments** (via Paymob partners) |
| FR-4.3 | Redirect to Paymob hosted payment page or embed Paymob iframe for card input; return to Lord confirmation page on completion                                               |
| FR-4.4 | Handle Paymob **webhook callbacks** for payment success, failure, pending, and refund events                                                                               |
| FR-4.5 | Store transaction records: Paymob transaction ID, amount (EGP), payment method, status, gateway response                                                                   |
| FR-4.6 | On successful payment: create order with status "Confirmed", send order confirmation email with payment receipt                                                            |
| FR-4.7 | On failed payment: show error message, allow retry, preserve cart contents                                                                                                 |
| FR-4.8 | Support **refunds** initiated from CMS (full or partial refund via Paymob API)                                                                                             |
| FR-4.9 | All amounts in **EGP** (Egyptian Pounds); currency displayed clearly throughout checkout                                                                                   |

---

### 7.5 Customer Accounts

| ID     | Requirement                                                                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-5.1 | **Customer Registration:** Name, national ID (14-digit Egyptian National ID), email, phone, password, confirm password; email verification via 6-digit OTP |
| FR-5.2 | **Customer Login:** Email + password authentication; JWT-based session (access + refresh tokens)                                                           |
| FR-5.3 | **Forgot Password:** Email OTP flow → OTP verification → new password                                                                                      |
| FR-5.4 | **Profile Management:** View/edit name, national ID, email, phone; change password                                                                         |
| FR-5.5 | **Address Book:** Save multiple delivery addresses (label, recipient name, phone, address line 1, address line 2, city, governorate, postal code)          |
| FR-5.6 | **Order History:** List of all past orders with status, date, total, and link to order detail                                                              |
| FR-5.7 | **Order Tracking:** View real-time order status updates (Pending → Confirmed → Processing → Shipped → Delivered)                                           |
| FR-5.8 | **Service Request History:** View previously submitted service requests and their statuses                                                                 |

---

### 7.6 Order Management

| ID     | Requirement                                                                                                                                                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-6.1 | Order record includes: order number (auto-generated), customer details (name, national ID, email, phone), shipping address, order items (product, quantity, unit price), subtotal, shipping, discount, total, payment status, order status |
| FR-6.2 | **Order Lifecycle:** Pending Payment → Confirmed (paid) → Processing → Shipped → Delivered; alternative paths: Cancelled, Refunded                                                                                                         |
| FR-6.3 | CMS staff can view, filter, and manage all orders; update order status; add internal notes                                                                                                                                                 |
| FR-6.4 | **Shipping tracking:** Optional tracking number and carrier name fields; shared with customer via email and order detail page                                                                                                              |
| FR-6.5 | **Order cancellation:** Customer can cancel before "Processing" status; CMS staff can cancel at any stage                                                                                                                                  |
| FR-6.6 | **Refund processing:** CMS staff can initiate full or partial refunds via Paymob API; refund status tracked on order                                                                                                                       |
| FR-6.7 | Automated email notifications at each order status change (confirmation, shipped, delivered, cancelled, refunded)                                                                                                                          |

---

### 7.7 After-Sales Services

| ID     | Requirement                                                                                                                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-7.1 | Service record includes: name, type (Installation / Maintenance / Repair / Delivery / Spare Parts), description, scope of work, applicable unit types, estimated duration, pricing (fixed/quoted), active status            |
| FR-7.2 | **Installation Service:** Capture new installation requests specifying unit model/brand, property type (residential/commercial), floor number, **installation location address (required)**, and preferred date/time window |
| FR-7.3 | **Maintenance Service:** Capture maintenance requests with unit details (brand, model, age), last service date, and issue description                                                                                       |
| FR-7.4 | **Repair Service:** Capture repair requests with fault description, unit age, and urgency level (standard / emergency)                                                                                                      |
| FR-7.5 | **Delivery Service:** Capture delivery requests linked to a product order or inquiry, delivery address, and preferred delivery window                                                                                       |
| FR-7.6 | Service request submissions stored in the database and visible in CMS for team follow-up                                                                                                                                    |

---

### 7.8 Service Request & Inquiry System

| ID     | Requirement                                                                                                                                                                 |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-8.1 | **Product Inquiry Form:** Customer submits interest in a specific product (pre-filled with product name/model). Fields: name, email, phone, preferred contact time, message |
| FR-8.2 | **Service Request Form:** Customer selects service type, provides unit details, describes issue or requirement, and selects preferred date/time                             |
| FR-8.3 | All inquiries and service requests saved to the database with status tracking: **New → In Progress → Resolved / Closed**                                                    |
| FR-8.4 | Automated email acknowledgement sent to customer upon submission                                                                                                            |
| FR-8.5 | Real-time email notification sent to Lord staff upon new inquiry/service request                                                                                            |
| FR-8.6 | Inquiry source tracked (which product page or service page the inquiry originated from)                                                                                     |

---

### 7.9 Content Management System (CMS)

#### FR-9.1: CMS Authentication

| ID       | Requirement                                                             |
| -------- | ----------------------------------------------------------------------- |
| FR-9.1.1 | CMS login with email and password (restricted to authorized Lord staff) |
| FR-9.1.2 | JWT-based session with CMS role verification                            |
| FR-9.1.3 | Password reset flow via email OTP                                       |

#### FR-9.2: Website Content Management

| ID       | Requirement                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------------- |
| FR-9.2.1 | Manage home page hero section: headline, tagline, CTA text, background image/video                         |
| FR-9.2.2 | Manage company profile / About page: company story, mission, vision, stats, team info                      |
| FR-9.2.3 | Manage contact information: address, phone, WhatsApp, email, working hours, Google Maps link, social links |
| FR-9.2.4 | Manage authorized dealer credentials section: Carrier dealer certificate, Midea dealer certificate, logos  |
| FR-9.2.5 | Manage dynamic content pages with SEO fields (slug, meta title, meta description, publish status)          |

#### FR-9.3: Product Management

| ID       | Requirement                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------- |
| FR-9.3.1 | Full CRUD on products (create, read, update, delete / archive)                                        |
| FR-9.3.2 | Manage product brands: Carrier and Midea (name, logo, dealer authorization status, certificate image) |
| FR-9.3.3 | Manage product categories/types (Split, Cassette, VRF, etc.)                                          |
| FR-9.3.4 | Upload and manage product image gallery (up to 10 images per product, drag-and-drop reordering)       |
| FR-9.3.5 | Toggle product active/inactive, featured, new arrival, bestseller status                              |
| FR-9.3.6 | Manage product SEO fields (slug, meta title, meta description)                                        |
| FR-9.3.7 | Bulk import/export products via CSV                                                                   |
| FR-9.3.8 | **Manage stock quantity per product (in stock / out of stock indicator)**                             |

#### FR-9.4: After-Sales Service Management

| ID       | Requirement                                                                             |
| -------- | --------------------------------------------------------------------------------------- |
| FR-9.4.1 | Full CRUD on service offerings (name, type, description, scope, pricing, active status) |
| FR-9.4.2 | Manage service categories: Installation, Maintenance, Repair, Delivery, Spare Parts     |
| FR-9.4.3 | Toggle service active/inactive status                                                   |

#### FR-9.5: Order Management (CMS)

| ID       | Requirement                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------- |
| FR-9.5.1 | View all orders with filters (status, date range, customer, payment status)                    |
| FR-9.5.2 | View individual order details (customer info, items, payment info, shipping address, timeline) |
| FR-9.5.3 | Update order status: Confirmed → Processing → Shipped → Delivered                              |
| FR-9.5.4 | Add tracking number and shipping carrier when marking as Shipped                               |
| FR-9.5.5 | Cancel orders and initiate refunds via Paymob API (full or partial)                            |
| FR-9.5.6 | Add internal notes to orders                                                                   |
| FR-9.5.7 | Export orders to CSV with date range and status filters                                        |
| FR-9.5.8 | Dashboard widget: Today’s orders, revenue today, pending orders, orders by status chart        |

#### FR-9.6: Customer Management (CMS)

| ID       | Requirement                                                                       |
| -------- | --------------------------------------------------------------------------------- |
| FR-9.6.1 | View all registered customers with search and filters                             |
| FR-9.6.2 | View individual customer profile: details, order history, service request history |
| FR-9.6.3 | Disable/enable customer accounts                                                  |

#### FR-9.7: Inquiry & Service Request Management

| ID       | Requirement                                                                               |
| -------- | ----------------------------------------------------------------------------------------- |
| FR-9.7.1 | View all product inquiries and service requests with filters (type, status, date range)   |
| FR-9.7.2 | View individual inquiry/request details (customer info, product/service details, message) |
| FR-9.7.3 | Update inquiry/request status (New → In Progress → Resolved / Closed)                     |
| FR-9.7.4 | Add internal notes/comments to each inquiry or service request                            |
| FR-9.7.5 | Export inquiries and service requests to CSV                                              |

#### FR-9.8: Testimonials Management

| ID       | Requirement                                            |
| -------- | ------------------------------------------------------ |
| FR-9.8.1 | Add, edit, and delete customer testimonials            |
| FR-9.8.2 | Toggle testimonials approval status for public display |
| FR-9.8.3 | Mark testimonials as featured for homepage display     |

#### FR-9.9: Promotions & Offers Management

| ID       | Requirement                                                                                                             |
| -------- | ----------------------------------------------------------------------------------------------------------------------- |
| FR-9.9.1 | Create and manage promotional banners (title, image, link, start/end date, active status)                               |
| FR-9.9.2 | Manage special offers linked to specific products (discount type: percentage / fixed amount)                            |
| FR-9.9.3 | Schedule promotions with automatic activation/deactivation based on date range                                          |
| FR-9.9.4 | **Coupon/promo code management:** Create codes with rules (discount amount/%, usage limit, expiry, minimum order value) |

#### FR-9.10: FAQ Management

| ID        | Requirement                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| FR-9.10.1 | Full CRUD on FAQs (question, answer, category, display order, active status)                                  |
| FR-9.10.2 | FAQ categories: Products, Installation, Maintenance & Repair, Warranty, Delivery, Ordering & Payment, General |
| FR-9.10.3 | Toggle FAQ active/inactive status                                                                             |

#### FR-9.11: Settings

| ID        | Requirement                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------- |
| FR-9.11.1 | General settings: company name, logo, favicon, primary/secondary colors                           |
| FR-9.11.2 | Contact settings: address, phone, WhatsApp, email, working hours                                  |
| FR-9.11.3 | Email notification settings: recipient addresses for inquiry/order alerts                         |
| FR-9.11.4 | SEO defaults: site meta title, site meta description, OG image                                    |
| FR-9.11.5 | **Paymob settings:** API key, integration IDs (card, wallet, installment), HMAC secret, iframe ID |
| FR-9.11.6 | **Shipping settings:** flat-rate shipping fee, free shipping threshold, delivery areas            |

---

### 7.10 Notifications & Communications

| ID       | Requirement                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| FR-10.1  | **Customer acknowledgement email** sent immediately upon product inquiry or service request submission                         |
| FR-10.2  | **Staff notification email** sent to the Lord team when a new inquiry or service request is received                           |
| FR-10.3  | **Status update email** sent to customer when their inquiry/request status changes (e.g., In Progress, Resolved)               |
| FR-10.4  | **Order confirmation email** sent to customer upon successful payment (includes order number, items, total, payment reference) |
| FR-10.5  | **Payment receipt email** with Paymob transaction details (amount, payment method, transaction ID)                             |
| FR-10.6  | **Order shipped email** sent when order is marked as shipped (includes tracking number and carrier if available)               |
| FR-10.7  | **Order delivered email** confirmation sent when order is marked as delivered                                                  |
| FR-10.8  | **Refund notification email** sent to customer when a refund is processed                                                      |
| FR-10.9  | **New order alert** sent to Lord staff when a new order is placed                                                              |
| FR-10.10 | Branded HTML email templates with Lord logo and contact information                                                            |
| FR-10.11 | Email queue system with retry logic (track attempts, errors, scheduled retries)                                                |

---

## 8. Non-Functional Requirements

| ID    | Category            | Requirement                                                                                                       |
| ----- | ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| NFR-1 | **Performance**     | Page load time < 3 seconds; API response time < 500ms for 95th percentile; Paymob payment initiation < 2 seconds  |
| NFR-2 | **Scalability**     | System must handle concurrent orders and inquiry submissions without data loss or duplication                     |
| NFR-3 | **Availability**    | Target 99.5% uptime                                                                                               |
| NFR-4 | **Responsiveness**  | All interfaces must be fully responsive (mobile, tablet, desktop)                                                 |
| NFR-5 | **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions)                                                                 |
| NFR-6 | **Localization**    | Bilingual support: Arabic (RTL) and English (LTR); language toggle on public website                              |
| NFR-7 | **Accessibility**   | WCAG 2.1 AA compliance for public website                                                                         |
| NFR-8 | **SEO**             | Dynamic meta tags, Open Graph tags, schema markup (Product, LocalBusiness, FAQPage), XML sitemap for public pages |
| NFR-9 | **Backup**          | Automated daily database backups with 30-day retention and encrypted storage                                      |

---

## 9. System Architecture

### 9.1 Technology Stack

| Layer                    | Technology                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **Frontend — Website**   | Next.js (App Router), React, TypeScript, Tailwind CSS, Radix UI, Zod, React Hook Form |
| **Frontend — CMS Panel** | React, Vite, TypeScript, Tailwind CSS, React Router DOM                               |
| **Backend**              | Node.js, Express, TypeScript, Prisma ORM                                              |
| **Database**             | PostgreSQL                                                                            |
| **Authentication**       | JWT (access + refresh tokens), bcrypt password hashing (CMS staff + customers)        |
| **Payment Gateway**      | Paymob Accept (Credit/Debit Card, Mobile Wallets, Installments)                       |
| **Email**                | Nodemailer (SMTP / SendGrid / Mailgun / AWS SES)                                      |
| **File Storage**         | Cloud storage (AWS S3 or equivalent) for product images and documents                 |
| **Testing**              | Jest, Supertest                                                                       |

### 9.2 Application Architecture

```
┌───────────────────────────────────────────────────┐
│                     CLIENTS                       │
│                                                   │
│  ┌──────────────────┐      ┌──────────────────┐   │
│  │ Public Website   │      │ CMS Panel        │   │
│  │ (Next.js)        │      │ (React / Vite)   │   │
│  └────────┬─────────┘      └────────┬─────────┘   │
│           │                         │              │
└───────────┼─────────────────────────┼──────────────┘
            │                         │
            └────────────┬────────────┘
                         │  REST API (JSON)
                         ▼
              ┌──────────────────────┐
              │   Express.js API     │
              │   (Node.js + TS)     │
              │                      │
              │  ┌────────────────┐  │
              │  │  Middleware     │  │
              │  │  - Auth (JWT)   │  │
              │  │  - RBAC         │  │
              │  │  - Rate Limit   │  │
              │  │  - Helmet       │  │
              │  │  - CORS         │  │
              │  └────────────────┘  │
              │                      │
              │  ┌────────────────┐  │
              │  │  Controllers    │  │
              │  │  Services       │  │
              │  │  Utils          │  │
              │  └────────────────┘  │
              └──────────┬───────────┘
                    │         │
          Prisma ORM│         │ Paymob API
                    ▼         ▼
     ┌──────────────────┐  ┌──────────────────┐
     │  PostgreSQL DB   │  │  Paymob Accept   │
     └──────────────────┘  │  Payment Gateway │
                           └──────────────────┘
```

### 9.3 Deployment Architecture

| Component      | Deployment                                                 |
| -------------- | ---------------------------------------------------------- |
| Public Website | Next.js deployed to Vercel / VPS                           |
| CMS Panel      | Static build (Vite) deployed to CDN / VPS                  |
| Backend API    | Node.js process on VPS / Cloud instance                    |
| Database       | Managed PostgreSQL (e.g., Supabase, AWS RDS, DigitalOcean) |
| File Storage   | AWS S3 or compatible object storage for product images     |

---

## 10. Data Model Overview

The system uses a relational database organized into the following domains:

### 10.1 Authentication & Access Tables

| Table                 | Purpose                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **CmsUsers**          | CMS staff authentication records (email, password hash, role, OTP codes)                                                 |
| **Customers**         | Registered customer accounts (name, email, phone, password hash, email verified flag, active status)                     |
| **CustomerAddresses** | Customer saved delivery addresses (label, recipient, phone, address lines, city, governorate, postal code, default flag) |
| **TokenBlacklist**    | Revoked JWT tokens for logout and session invalidation                                                                   |

### 10.2 Product Catalog Tables

| Table                 | Purpose                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Brands**            | Carrier and Midea brand records (name, logo URL, authorized dealer certificate, active status)                   |
| **ProductCategories** | AC unit types (Split, Cassette, VRF, Central, Window, Portable, etc.)                                            |
| **Products**          | Full product records (brand, category, model, specs, pricing, **stock quantity**, images, SEO, featured, active) |
| **ProductImages**     | Product image gallery (URL, display order, alt text, linked to product)                                          |

### 10.3 Service Tables

| Table            | Purpose                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **ServiceTypes** | After-sales service categories (Installation, Maintenance, Repair, Delivery, Spare Parts) |
| **Services**     | Service offerings (name, type, description, scope, pricing type, price, active status)    |

### 10.4 Inquiry & Request Tables

| Table               | Purpose                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| **Inquiries**       | Customer product inquiries (name, email, phone, product reference, message, status, source)             |
| **ServiceRequests** | Customer after-sales service requests (name, email, phone, service type, unit details, urgency, status) |
| **InquiryNotes**    | Internal staff notes linked to inquiries or service requests                                            |

### 10.5 Shopping Cart Tables

| Table         | Purpose                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Carts**     | Shopping cart instances linked to a customer (or guest session ID), with cart status (active, converted, abandoned) |
| **CartItems** | Individual cart items (product reference, quantity, unit price at time of addition)                                 |

### 10.6 Order Tables

| Table                  | Purpose                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Orders**             | Order records (order number, customer, shipping address, subtotal, shipping fee, discount, total, status, payment status, notes) |
| **OrderItems**         | Order line items (product reference, product name snapshot, quantity, unit price, line total)                                    |
| **OrderStatusHistory** | Audit trail of order status changes (old status, new status, changed by, timestamp, note)                                        |

### 10.7 Payment Tables

| Table        | Purpose                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Payments** | Payment transaction records (order reference, Paymob transaction ID, amount, currency, payment method, status, gateway response) |
| **Refunds**  | Refund records (order reference, Paymob refund ID, amount, reason, status, initiated by, processed at)                           |

### 10.8 Promotion Tables

| Table           | Purpose                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| **Coupons**     | Promo/coupon codes (code, discount type, discount value, minimum order, usage limit, expiry, active) |
| **CouponUsage** | Tracks coupon redemptions (coupon reference, order reference, customer reference, used at)           |

### 10.9 Content & CMS Tables

| Table            | Purpose                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **ContentPages** | CMS-managed pages (page key, title, JSON content, SEO fields, publish status)                |
| **Testimonials** | Customer reviews (name, content, rating, product reference, approval status, featured flag)  |
| **Promotions**   | Promotional banners and offers (title, image, link, discount, start/end date, active status) |
| **FAQs**         | Frequently asked questions (question, answer, category, order, active status)                |
| **SiteSettings** | Key-value store for site-wide settings (company info, SEO defaults, contact details)         |

### 10.10 Communication Tables

| Table          | Purpose                                                                             |
| -------------- | ----------------------------------------------------------------------------------- |
| **EmailQueue** | Email queue with retry logic (recipient, subject, body, template, status, attempts) |

---

## 11. User Roles & Permissions

| Permission                                 | VISITOR | CUSTOMER | CMS ADMIN | CMS STAFF |
| ------------------------------------------ | :-----: | :------: | :-------: | :-------: |
| Browse public website & product catalog    |   ✅    |    ✅    |    ✅     |    ✅     |
| Add products to cart                       |   ✅    |    ✅    |    ✅     |    ✅     |
| Submit product inquiry                     |   ✅    |    ✅    |    ✅     |    ✅     |
| Submit service request                     |   ✅    |    ✅    |    ✅     |    ✅     |
| Checkout & pay via Paymob                  |  ✅ \*  |    ✅    |    ❌     |    ❌     |
| Register / login as customer               |   ✅    |    ✅    |    ❌     |    ❌     |
| View own order history & tracking          |   ❌    |    ✅    |    ❌     |    ❌     |
| Manage own addresses & profile             |   ❌    |    ✅    |    ❌     |    ❌     |
| Access CMS panel                           |   ❌    |    ❌    |    ✅     |    ✅     |
| Manage products & brands                   |   ❌    |    ❌    |    ✅     |    ✅     |
| Manage after-sales services                |   ❌    |    ❌    |    ✅     |    ✅     |
| View & manage inquiries / service requests |   ❌    |    ❌    |    ✅     |    ✅     |
| View & manage orders / refunds             |   ❌    |    ❌    |    ✅     |    ✅     |
| Manage customers                           |   ❌    |    ❌    |    ✅     |    ✅     |
| Manage website content & pages             |   ❌    |    ❌    |    ✅     |    ✅     |
| Manage promotions, coupons & offers        |   ❌    |    ❌    |    ✅     |    ✅     |
| Manage testimonials & FAQs                 |   ❌    |    ❌    |    ✅     |    ✅     |
| Configure site settings (incl. Paymob)     |   ❌    |    ❌    |    ✅     |    ❌     |
| Manage CMS user accounts                   |   ❌    |    ❌    |    ✅     |    ❌     |

> \* Guest checkout allows visitors to place orders by providing email, phone, and shipping address without creating an account.

---

## 12. Integration Requirements

| Integration               | Purpose                                                                                                              | Priority |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------- |
| **Paymob Accept**         | Payment gateway — credit/debit cards, mobile wallets (Vodafone Cash, Etisalat Cash, Orange Money), installment plans | MVP      |
| **Nodemailer (SMTP)**     | Transactional email delivery (order confirmations, notifications)                                                    | MVP      |
| **Google Maps**           | Location embed on Contact page and About page                                                                        | MVP      |
| **AWS S3**                | Cloud storage for product images and document uploads                                                                | MVP      |
| **WhatsApp Business API** | WhatsApp contact button and optional inquiry routing                                                                 | Phase 2  |
| **Google Analytics**      | Website traffic and conversion tracking                                                                              | Phase 2  |
| **Facebook Pixel**        | Social media advertising and retargeting                                                                             | Phase 2  |

---

## 13. Security & Compliance

### 13.1 Authentication & Authorization

| ID    | Requirement                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------- |
| SEC-1 | Password hashing with bcrypt (salt rounds: 10) for both CMS users and customers                         |
| SEC-2 | JWT access tokens (1-hour expiry) with refresh tokens (7-day expiry); separate flows for CMS & customer |
| SEC-3 | Token blacklist for logout and revocation                                                               |
| SEC-4 | Role-based access control (RBAC) middleware on all protected routes (CMS roles + Customer role)         |
| SEC-5 | Rate limiting on authentication endpoints (5 attempts / 15 minutes)                                     |
| SEC-6 | Account lockout after 5 consecutive failed login attempts                                               |
| SEC-7 | Customer email verification required before first checkout                                              |

### 13.2 Payment Security (Paymob)

| ID     | Requirement                                                                                   |
| ------ | --------------------------------------------------------------------------------------------- |
| SEC-8  | All payment card data is handled by Paymob (PCI-DSS compliance delegated to Paymob)           |
| SEC-9  | No credit/debit card numbers stored in Lord database — only Paymob transaction references     |
| SEC-10 | Paymob webhook verification via HMAC-SHA512 signature validation on all callback requests     |
| SEC-11 | Payment amounts verified server-side before initiating Paymob transaction (prevent tampering) |
| SEC-12 | Idempotent order creation to prevent duplicate charges on network retries                     |

### 13.3 Data Protection

| ID     | Requirement                                                            |
| ------ | ---------------------------------------------------------------------- |
| SEC-13 | HTTPS/TLS encryption for all data in transit                           |
| SEC-14 | Database encryption at rest                                            |
| SEC-15 | Input validation and sanitization on all endpoints (express-validator) |
| SEC-16 | SQL injection prevention via Prisma parameterized queries              |
| SEC-17 | XSS prevention via input sanitization                                  |
| SEC-18 | CORS configuration restricted to known origins                         |
| SEC-19 | Helmet.js for HTTP security headers                                    |
| SEC-20 | Request body size limits                                               |
| SEC-21 | File upload type and size validation (images only, max 5MB per file)   |

### 13.4 Infrastructure Security

| ID     | Requirement                                                                                 |
| ------ | ------------------------------------------------------------------------------------------- |
| SEC-22 | Automated daily backups with encrypted storage                                              |
| SEC-23 | 30-day backup retention policy                                                              |
| SEC-24 | Security monitoring and error logging                                                       |
| SEC-25 | No sensitive credentials stored in source code (environment variables only)                 |
| SEC-26 | Paymob API keys and HMAC secrets stored in environment variables, never exposed client-side |

---

## 14. Phasing & Prioritization

### Phase 1 — MVP (Weeks 1–6)

| Priority | Feature                                                                         |
| -------- | ------------------------------------------------------------------------------- |
| P0       | CMS authentication (login, JWT, password reset)                                 |
| P0       | Product catalog: brands, categories, products (CRUD + image upload + stock qty) |
| P0       | After-sales services: service types and service offerings (CRUD)                |
| P0       | Public website: Home, Products, Services, About, Contact pages                  |
| P0       | **Shopping cart** (add to cart, update quantity, remove, persistent cart)       |
| P0       | **Customer registration & login** (email verification, JWT auth, profile)       |
| P0       | **Checkout flow** (multi-step: address → review → payment → confirmation)       |
| P0       | **Paymob Accept integration** (card payments, mobile wallets)                   |
| P0       | **Order management** (order lifecycle, CMS order dashboard, status updates)     |
| P0       | Product inquiry form + service request form (public-facing)                     |
| P0       | CMS inquiry and service request management (view, status update, notes)         |
| P0       | **Order confirmation, shipped, delivered email notifications**                  |
| P0       | Automated email notifications (customer acknowledgement + staff alert)          |
| P1       | **Customer account portal** (order history, tracking, addresses, profile)       |
| P1       | Testimonials management (CMS) + display on public website                       |
| P1       | FAQ management (CMS) + display on public website                                |

### Phase 2 — Extended Features (Weeks 7–10)

| Priority | Feature                                                                      |
| -------- | ---------------------------------------------------------------------------- |
| P1       | **Paymob installment plans** support                                         |
| P1       | **Coupon/promo code system** (CMS management + checkout redemption)          |
| P1       | Promotions & offers management (CMS) + banners on public website             |
| P1       | **Guest checkout** (order without account creation)                          |
| P1       | Bilingual content (Arabic RTL / English LTR) with language toggle            |
| P1       | Advanced product filtering and search (Elasticsearch or DB full-text search) |
| P2       | WhatsApp Business API integration for inquiry/order routing                  |
| P2       | Google Analytics and Facebook Pixel integration                              |
| P2       | CSV bulk import/export for products, orders, and inquiries                   |
| P2       | **Refund processing** via Paymob API (full/partial refunds from CMS)         |

### Phase 3 — Advanced (Weeks 11–14)

| Priority | Feature                                                                  |
| -------- | ------------------------------------------------------------------------ |
| P3       | **Revenue & sales analytics dashboard** in CMS (orders, revenue, trends) |
| P3       | SMS notifications for order status and service request updates           |
| P3       | PDF invoice/receipt generation for orders                                |
| P3       | Advanced analytics dashboard in CMS (top products, conversion rates)     |
| P3       | Multi-branch support (if Lord expands to additional locations)           |

---

## 15. Assumptions & Constraints

### Assumptions

| #   | Assumption                                                                                         |
| --- | -------------------------------------------------------------------------------------------------- |
| A1  | Lord operates as a single-location authorized dealer (single branch for MVP)                       |
| A2  | The primary customer base is in Egypt; all transactions in **EGP (Egyptian Pounds)**               |
| A3  | Product pricing is set by Lord staff in CMS and displayed as final prices on the website           |
| A4  | Product images and technical data sheets will be provided by Lord or sourced from Carrier/Midea    |
| A5  | Lord staff will manually follow up on all inquiry and service request submissions                  |
| A6  | All website content will be maintained in both Arabic and English                                  |
| A7  | File storage for product images will use cloud object storage (S3 or equivalent)                   |
| A8  | **Paymob Accept** merchant account is set up and active before MVP launch                          |
| A9  | Paymob provides API keys, integration IDs (card, wallet), and HMAC secret for webhook verification |
| A10 | Shipping is managed by Lord internally (no third-party shipping API integration in MVP)            |
| A11 | Flat-rate shipping fee or free shipping above a configurable threshold                             |

### Constraints

| #   | Constraint                                                                              |
| --- | --------------------------------------------------------------------------------------- |
| C1  | Single currency (**EGP**) — no multi-currency support                                   |
| C2  | Backend is REST API only (no GraphQL)                                                   |
| C3  | No native mobile app — responsive web only                                              |
| C4  | Brand guidelines for Carrier and Midea must be strictly followed in all design elements |
| C5  | MVP timeline — 6 weeks (extended from 4 to accommodate e-commerce features)             |
| C6  | No third-party WMS or ERP integration in MVP scope                                      |
| C7  | Payment card data handled exclusively by Paymob — no PAN storage on Lord servers        |

---

## 16. Risks & Mitigations

| #   | Risk                                                 | Impact | Likelihood | Mitigation                                                                                          |
| --- | ---------------------------------------------------- | ------ | ---------- | --------------------------------------------------------------------------------------------------- |
| R1  | Carrier/Midea brand guideline violations in design   | High   | Medium     | Review official brand guidelines early; include brand sign-off checkpoint before launch             |
| R2  | Incomplete or inaccurate product data from Lord      | High   | Medium     | Establish a product data template and populate it before development starts; use placeholder data   |
| R3  | Low purchase conversion rate                         | Medium | Medium     | Clear CTAs, streamlined checkout, trust signals (authorized dealer badges), WhatsApp support        |
| R4  | Email delivery failures for notifications            | Medium | Medium     | Queue system with retry logic; monitor delivery rates; fallback SMTP provider                       |
| R5  | **Paymob gateway downtime or API changes**           | High   | Low        | Implement graceful error handling; display maintenance message; monitor Paymob status page          |
| R6  | **Payment fraud or chargebacks**                     | High   | Low        | Rely on Paymob's built-in fraud detection; verify amounts server-side; log all transactions         |
| R7  | **Failed payment with order created**                | Medium | Medium     | Idempotent order creation; auto-cancel unpaid orders after 30 minutes; webhook reconciliation       |
| R8  | **Refund disputes from customers**                   | Medium | Medium     | Clear refund policy on website; CMS refund workflow with audit trail; Paymob partial refund support |
| R9  | SEO underperformance in competitive AC dealer market | Medium | Medium     | Implement schema markup, local SEO optimization, and Google My Business integration                 |
| R10 | Product image quality/availability delays            | Medium | High       | Use brand placeholder images initially; define image delivery SLA with Lord team                    |
| R11 | **Stock overselling (concurrent orders)**            | Medium | Medium     | Optimistic locking on stock quantity update; validate stock before order confirmation               |

---

## 17. Glossary

| Term                  | Definition                                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Authorized Dealer** | A company officially certified by Carrier and/or Midea to sell and service their products in a given territory             |
| **BTU**               | British Thermal Unit — the unit of measurement for air conditioner cooling capacity                                        |
| **Carrier**           | American multinational HVAC manufacturer; one of Lord's two authorized brands                                              |
| **Cart**              | A virtual shopping cart where customers collect products before proceeding to checkout                                     |
| **Checkout**          | The multi-step process of placing an order: shipping address → order review → payment → confirmation                       |
| **CMS**               | Content Management System — enables staff to update website content without code changes                                   |
| **CMS Panel**         | The internal staff-facing web application for managing products, services, orders, and content                             |
| **Coupon**            | A promotional code that provides a discount (percentage or fixed amount) when applied at checkout                          |
| **EER / SEER**        | Energy Efficiency Ratio / Seasonal EER — measures AC energy efficiency                                                     |
| **EGP**               | Egyptian Pound — the sole transaction currency on the platform                                                             |
| **Guest Checkout**    | Allows visitors to place orders without creating a customer account (Phase 2)                                              |
| **HMAC**              | Hash-based Message Authentication Code — used to verify Paymob webhook authenticity                                        |
| **Inquiry**           | A customer's expression of interest in a product or request for more information, submitted via the website                |
| **JWT**               | JSON Web Token — stateless authentication mechanism used for API access (CMS staff and customer sessions)                  |
| **Midea**             | Chinese multinational appliance manufacturer; one of Lord's two authorized brands                                          |
| **Order**             | A confirmed purchase record containing items, quantities, prices, shipping address, payment status, and fulfillment status |
| **Paymob Accept**     | Egyptian payment gateway supporting card payments, mobile wallets (Vodafone Cash, etc.), and installment plans             |
| **Payment Key**       | A Paymob-generated token used to initiate a payment session (iframe or redirect)                                           |
| **PCI-DSS**           | Payment Card Industry Data Security Standard — compliance handled by Paymob as the payment processor                       |
| **RBAC**              | Role-Based Access Control — permission system based on user roles (CMS Admin, CMS Staff, Customer, Visitor)                |
| **Refund**            | A full or partial return of payment to the customer, initiated via CMS and processed through Paymob                        |
| **Service Request**   | A customer's request for an after-sales service (installation, maintenance, repair, or delivery)                           |
| **SKU**               | Stock Keeping Unit — a unique identifier for each distinct product in the catalog                                          |
| **Split Unit**        | The most common residential AC type consisting of an indoor and outdoor unit                                               |
| **VRF / VRV**         | Variable Refrigerant Flow / Volume — a multi-zone commercial AC system type                                                |
| **Webhook**           | A server-to-server HTTP callback from Paymob to notify Lord's backend of payment events (success, failure, refund)         |

---

_End of Document_
