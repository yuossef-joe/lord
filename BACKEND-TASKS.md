# Backend Development Tasks — Lord AC E-Commerce Platform

**Project:** Lord — Authorized Carrier & Midea AC Dealer  
**Technology Stack:** Node.js 20+ · Express 4 · TypeScript · Prisma ORM · PostgreSQL 15+  
**Payment Gateway:** Paymob Accept (Credit/Debit Card, Mobile Wallets, Installments)  
**Currency:** EGP (Egyptian Pounds) — Paymob uses piasters (×100)  
**Last Updated:** 2025-01-20

---

## Table of Contents

1. [MVP Scope & Priorities](#mvp-scope--priorities)
2. [Phase 1: Project Setup, Database & Core Infrastructure](#phase-1-project-setup-database--core-infrastructure)
3. [Phase 2: Public API — Product Catalog, Services & Content](#phase-2-public-api--product-catalog-services--content)
4. [Phase 3: Customer Authentication & Account](#phase-3-customer-authentication--account)
5. [Phase 4: Shopping Cart & Coupon System](#phase-4-shopping-cart--coupon-system)
6. [Phase 5: Checkout, Orders & Paymob Payment Integration](#phase-5-checkout-orders--paymob-payment-integration)
7. [Phase 6: Inquiry & Service Request System](#phase-6-inquiry--service-request-system)
8. [Phase 7: CMS Authentication & Dashboard](#phase-7-cms-authentication--dashboard)
9. [Phase 8: CMS Management APIs](#phase-8-cms-management-apis)
10. [Phase 9: Email Notification System](#phase-9-email-notification-system)
11. [Phase 10: Scheduled Jobs (Cron)](#phase-10-scheduled-jobs-cron)
12. [Phase 11: Security, Optimization & Deployment](#phase-11-security-optimization--deployment)
13. [Appendix A: Complete Database Schema](#appendix-a-complete-database-schema)
14. [Appendix B: API Endpoint Reference](#appendix-b-api-endpoint-reference)
15. [Appendix C: Enums & Constants](#appendix-c-enums--constants)
16. [Appendix D: Critical Reminders](#appendix-d-critical-reminders)

---

## MVP Scope & Priorities

### Core MVP Features (must ship):

1. ✅ Public website APIs (products, services, content, testimonials, FAQs, promotions, settings)
2. ✅ Customer authentication (register with National ID, verify email, login, password reset)
3. ✅ Product catalog with filtering, search, pagination
4. ✅ Shopping cart (guest session + authenticated, merge on login)
5. ✅ Checkout & Paymob payment integration (cards, wallets, installments)
6. ✅ Order management with full lifecycle
7. ✅ Inquiry & service request system
8. ✅ CMS Panel APIs (auth, dashboard, all CRUD management)
9. ✅ Email notifications (queue + templates)
10. ✅ Cron jobs (order expiry, email queue, cart cleanup, token cleanup)

### Out of Scope (per BRD — do NOT implement):

- ❌ Inventory/warehouse management system (WMS)
- ❌ ERP integration
- ❌ Mobile apps (iOS/Android)
- ❌ Live chat / chatbot
- ❌ Multi-branch management
- ❌ IoT / smart device integration
- ❌ Multi-currency (EGP only)
- ❌ Loyalty / rewards program
- ❌ Customer reviews / rating submission (testimonials are CMS-managed only)
- ❌ SMS notifications / Twilio
- ❌ Third-party shipping API integration
- ❌ Stripe, PayPal, Moyasar, TAP payment gateways (Paymob ONLY)
- ❌ PDF generation (receipts, invoices)
- ❌ WhatsApp Business API integration

---

## PHASE 1: PROJECT SETUP, DATABASE & CORE INFRASTRUCTURE

### Task 1.1: Project Initialization

- [ ] Initialize Node.js TypeScript project: `npm init -y`
- [ ] Install core dependencies:
  ```bash
  npm install express dotenv cors helmet morgan jsonwebtoken bcryptjs zod
  npm install @prisma/client express-rate-limit multer nodemailer node-cron
  npm install @aws-sdk/client-s3
  npm install -D typescript @types/node @types/express @types/bcryptjs @types/jsonwebtoken
  npm install -D @types/cors @types/morgan @types/multer @types/nodemailer @types/node-cron
  npm install -D ts-node nodemon prisma
  npm install -D jest @types/jest ts-jest supertest @types/supertest
  npm install -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
  ```
- [ ] Initialize TypeScript: `npx tsc --init`
- [ ] Configure `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "commonjs",
      "lib": ["ES2020"],
      "outDir": "./dist",
      "rootDir": "./src",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "resolveJsonModule": true,
      "declaration": true,
      "declarationMap": true,
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist", "tests"]
  }
  ```
- [ ] Set up complete folder structure per `backend-structure.md`
- [ ] Create `.env` and `.env.example` with all environment variables
- [ ] Configure `nodemon.json` (watch src/, ext ts, exec ts-node)
- [ ] Configure `jest.config.ts` with ts-jest preset
- [ ] Configure `.eslintrc.json` and `.prettierrc`
- [ ] Add npm scripts to `package.json` (dev, build, start, db:\*, lint, test)
- [ ] Create `.gitignore` (node_modules, dist, .env, prisma/migrations)

### Task 1.2: Express App Configuration

- [ ] Create `src/app.ts` — Express app setup:
  - `helmet()` — security headers
  - `cors()` — configured with `CORS_ORIGINS` env var
  - `express.json({ limit: '10mb' })` — JSON body parser
  - `express.urlencoded({ extended: true })` — URL-encoded parser
  - `morgan('dev')` — request logging (dev) / `morgan('combined')` (production)
  - Rate limiting (global: 100 requests / 15 min)
  - Mount all route groups under `/api`
  - Global error handler middleware (last)
- [ ] Create `src/index.ts` — server entry point:
  - Load environment variables
  - Import app
  - Connect to database (Prisma)
  - Start cron jobs
  - Listen on `PORT` (default 5000)
  - Graceful shutdown handler (SIGINT, SIGTERM)

### Task 1.3: Config Module

- [ ] `src/config/index.ts` — Central config object:
  - Validate required env vars on startup (throw if missing)
  - Export typed config: port, nodeEnv, apiBaseUrl, database, jwt, paymob, email, s3, cors, rateLimit
- [ ] `src/config/database.ts` — Prisma client singleton with connection logging
- [ ] `src/config/jwt.ts` — Separate customer & CMS JWT config (secrets, expiry)
- [ ] `src/config/paymob.ts` — Paymob API key, integration IDs (card, wallet, installment), HMAC secret, iframe ID
- [ ] `src/config/email.ts` — SMTP host, port, user, pass, from name, from email, staff notification email
- [ ] `src/config/s3.ts` — AWS S3 credentials, bucket, region
- [ ] `src/config/cors.ts` — Allowed origins array parsed from `CORS_ORIGINS`

### Task 1.4: Core Utilities

- [ ] `src/utils/api-error.ts` — Custom `ApiError` class:
  ```typescript
  class ApiError extends Error {
    statusCode: number;
    errorCode?: string;
    isOperational: boolean;
  }
  // Factory methods: badRequest(), unauthorized(), forbidden(), notFound(), conflict(), internal()
  ```
- [ ] `src/utils/api-response.ts` — Standardized response wrapper:
  ```typescript
  // success(res, data, message?, statusCode?)
  // paginated(res, data, pagination, message?)
  // error(res, message, statusCode, errorCode?)
  // Shape: { success: boolean, data: T, message: string, pagination?: PaginationMeta }
  ```
- [ ] `src/utils/async-handler.ts` — Wraps async route handlers to catch & forward errors
- [ ] `src/utils/pagination.ts` — Parse `page` & `limit` from query, compute `skip` & `take`, build `PaginationMeta`
- [ ] `src/utils/slug.ts` — Generate URL slug from string, check uniqueness against DB
- [ ] `src/utils/token.ts` — JWT helpers:
  - `signCustomerAccessToken(payload)` / `signCustomerRefreshToken(payload)`
  - `signCmsAccessToken(payload)` / `signCmsRefreshToken(payload)`
  - `verifyCustomerToken(token)` / `verifyCmsToken(token)`
  - **CRITICAL:** Use separate signing keys for customer and CMS tokens
- [ ] `src/utils/hash.ts` — `hashPassword(plain)` and `comparePassword(plain, hash)` using bcrypt (salt rounds: 10)
- [ ] `src/utils/otp.ts` — Generate 6-digit OTP string, calculate expiry (10 minutes from now)
- [ ] `src/utils/order-number.ts` — Generate order number in format `LORD-YYYYMMNN`:
  - YYYY = current year, MM = current month, NN = sequential number (reset monthly)
  - Query max order number for current month, increment by 1
- [ ] `src/utils/national-id.ts` — Validate Egyptian National ID:
  - Must be exactly 14 digits
  - Must be numeric string
  - Return boolean
- [ ] `src/utils/hmac.ts` — Compute HMAC-SHA512 for Paymob webhook verification
- [ ] `src/utils/file-upload.ts` — Validate file type (jpg, jpeg, png, webp), max size (5MB), sanitize filename
- [ ] `src/utils/date.ts` — Date formatting helpers, timezone conversion (Africa/Cairo)
- [ ] `src/utils/logger.ts` — Winston/Pino logger setup with levels, file transport (production), console (development)

### Task 1.5: Core Middleware

- [ ] `src/middleware/error.middleware.ts` — Global error handler:
  - Handle `ApiError` instances → return structured JSON
  - Handle Prisma errors (P2002 unique constraint, P2025 not found, etc.)
  - Handle Zod validation errors → formatted field errors
  - Handle JWT errors (expired, malformed)
  - Log errors (exclude stack in production)
  - Default 500 Internal Server Error
- [ ] `src/middleware/validation.middleware.ts` — Generic Zod validation:
  ```typescript
  validate(schema: ZodSchema, source: 'body' | 'query' | 'params')
  // Returns middleware that validates req[source] against schema
  ```
- [ ] `src/middleware/upload.middleware.ts` — Multer configuration:
  - Memory storage (buffer for S3 upload)
  - File filter: images only (jpg, jpeg, png, webp)
  - Size limit: 5MB per file
  - Fields: `single('image')`, `array('images', 10)`, `fields([...])`
- [ ] `src/middleware/rate-limit.middleware.ts` — Rate limit presets:
  - `authLimiter` — 5 requests / 15 min (login, register, forgot password)
  - `apiLimiter` — 100 requests / 15 min (general API)
  - `webhookLimiter` — 50 requests / min (Paymob webhooks)
- [ ] `src/middleware/request-logger.middleware.ts` — Morgan setup with custom tokens

### Task 1.6: Auth Middleware

- [ ] `src/middleware/customer-auth.middleware.ts`:
  - Extract Bearer token from `Authorization` header
  - Verify with customer JWT secret
  - Fetch customer from DB (check `isActive`, `emailVerified`)
  - Attach customer object to `req.customer`
  - Return 401 if invalid/expired/inactive
- [ ] `src/middleware/cms-auth.middleware.ts`:
  - Extract Bearer token from `Authorization` header
  - Verify with CMS JWT secret
  - Check token not in `TokenBlacklist`
  - Fetch CMS user from DB (check `isActive`)
  - Attach CMS user object to `req.cmsUser`
  - Return 401 if invalid/expired/blacklisted/inactive
- [ ] `src/middleware/role.middleware.ts`:
  - `requireRole(...roles: string[])` — returns middleware
  - Check `req.cmsUser.role` is in allowed roles array
  - Return 403 if not authorized

### Task 1.7: Type Definitions

- [ ] `src/types/express.d.ts` — Augment Express Request:
  ```typescript
  declare namespace Express {
    interface Request {
      customer?: { id: string; email: string; name: string };
      cmsUser?: { id: string; email: string; name: string; role: string };
      pagination?: { page: number; limit: number; skip: number };
    }
  }
  ```
- [ ] `src/types/enums.ts` — All application enums:
  ```typescript
  enum OrderStatus {
    PENDING_PAYMENT,
    CONFIRMED,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    REFUNDED,
  }
  enum PaymentStatus {
    PENDING,
    PAID,
    FAILED,
    REFUNDED,
    PARTIALLY_REFUNDED,
  }
  enum InquiryStatus {
    NEW,
    IN_PROGRESS,
    RESOLVED,
    CLOSED,
  }
  enum ServiceRequestStatus {
    NEW,
    SCHEDULED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED,
  }
  enum CartStatus {
    ACTIVE,
    CONVERTED,
    ABANDONED,
  }
  enum CmsUserRole {
    CMS_ADMIN,
    CMS_STAFF,
  }
  enum EmailStatus {
    PENDING,
    SENT,
    FAILED,
  }
  enum InquiryType {
    PRODUCT,
    GENERAL,
    PRICING,
    BULK_ORDER,
    OTHER,
  }
  enum ServiceRequestUrgency {
    NORMAL,
    URGENT,
    EMERGENCY,
  }
  enum DiscountType {
    PERCENTAGE,
    FIXED,
  }
  enum PaymentMethod {
    CREDIT_CARD,
    DEBIT_CARD,
    MOBILE_WALLET,
    INSTALLMENT,
  }
  ```
- [ ] `src/types/paymob.types.ts` — Paymob API types (auth token response, order registration, payment key, callback payload)
- [ ] `src/types/email.types.ts` — Email template types and payload interfaces
- [ ] `src/types/common.types.ts` — Shared interfaces (PaginationMeta, ApiResponse, FilterParams)

### Task 1.8: Database Schema (Prisma)

- [ ] Initialize Prisma: `npx prisma init`
- [ ] Configure `DATABASE_URL` in `.env`: `postgresql://user:password@localhost:5432/lord_db`
- [ ] Write complete `prisma/schema.prisma` with all 29 tables (see [Appendix A](#appendix-a-complete-database-schema))
- [ ] Run initial migration: `npx prisma migrate dev --name init`
- [ ] Generate Prisma client: `npx prisma generate`

### Task 1.9: Database Seeder

- [ ] Create `prisma/seed.ts` with initial data:
  - **Brands:** Carrier (slug: carrier), Midea (slug: midea) — with placeholder logo URLs
  - **Product Categories:** Split, Cassette, VRF, Central, Window, Portable — with slugs, icons
  - **Service Types:** Installation, Maintenance, Repair, Delivery, Spare Parts — with slugs, icons, display order
  - **CMS Admin User:** Default admin (email: admin@lord-ac.com, password: hashed, role: CMS_ADMIN)
  - **Default Site Settings:** Company name "Lord", contact info, Paymob test keys, shipping defaults
  - **Sample FAQs:** 3-5 FAQ entries across categories
- [ ] Configure seed command in `package.json`: `"db:seed": "ts-node prisma/seed.ts"`
- [ ] Add idempotent upsert logic (safe to run multiple times)

---

## PHASE 2: PUBLIC API — PRODUCT CATALOG, SERVICES & CONTENT

### Task 2.1: Products — Public API

**Routes:** `src/routes/public/products.routes.ts`  
**Controller:** `src/controllers/public/products.controller.ts`  
**Service:** `src/services/product.service.ts`  
**Validator:** `src/validators/product.validator.ts`

- [ ] `GET /api/products` — Product listing with filters:
  - **Query params:** `brand`, `type`, `capacityMin`, `capacityMax`, `priceMin`, `priceMax`, `search`, `sort`, `page`, `limit`, `featured`, `active`
  - **Filters:** brand slug(s), category slug(s), capacity range (BTU), price range (EGP)
  - **Search:** Full-text search on `name`, `modelNumber`, `description`
  - **Sort options:** `price_asc`, `price_desc`, `name_asc`, `newest` (default: `newest`)
  - **Pagination:** Default `page=1`, `limit=12`
  - **Default filter:** `isActive=true` (always applied for public)
  - **Response:** Array of product list items with brand, category, thumbnail, price, stock, flags
  - **Include:** Joins to `Brands`, `ProductCategories`, first `ProductImage` as thumbnail
  - Product list item response shape:
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

- [ ] `GET /api/products/count` — Total product count with same filter params (for pagination meta)

- [ ] `GET /api/products/:slug` — Single product detail:
  - Fetch by slug with eager load: Brand, ProductCategory, ProductImages (ordered by `displayOrder` ASC)
  - Include all spec fields: capacity, eerSeer, voltage, refrigerant, dimensions, weight, color, features, description
  - Return 404 if not found or `isActive=false`
  - Product detail response shape:
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
      "features": ["Inverter Technology", "Turbo Cooling", "Auto Restart"],
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

- [ ] `GET /api/products/:slug/related?limit=4` — Related products:
  - Same `brandId` OR same `categoryId`, exclude current product, limit 4
  - Return product list item shape

### Task 2.2: Brands & Categories — Public API

**Routes:** `src/routes/public/brands.routes.ts`, `src/routes/public/categories.routes.ts`  
**Controller:** `src/controllers/public/brands.controller.ts`, `src/controllers/public/categories.controller.ts`

- [ ] `GET /api/brands` — List active brands (id, name, slug, logoUrl)
- [ ] `GET /api/product-categories` — List active product categories (id, name, slug, icon)

### Task 2.3: Services — Public API

**Routes:** `src/routes/public/services.routes.ts`  
**Controller:** `src/controllers/public/services.controller.ts`  
**Service:** `src/services/service.service.ts`

- [ ] `GET /api/service-types` — List active service types (id, name, slug, icon, displayOrder)
- [ ] `GET /api/services` — List active services with optional `?type=installation` filter
  - Include service type info
  - Sorted by displayOrder
- [ ] `GET /api/services/:slug` — Single service detail (full description, pricing, scope)

### Task 2.4: Content Pages — Public API

**Routes:** `src/routes/public/content.routes.ts`  
**Controller:** `src/controllers/public/content.controller.ts`  
**Service:** `src/services/content.service.ts`

- [ ] `GET /api/content/:pageKey` — Fetch published content page by key:
  - Valid keys: `home`, `about`, `contact`
  - Return: title, contentJson (parsed), SEO fields
  - Return 404 if not published or not found
- [ ] `GET /api/content/home` — Home page content:
  - Also fetch: featured products (limit 8), active promotions (within date range), featured testimonials (limit 6)
  - Aggregate into single response for home page

### Task 2.5: Testimonials, FAQs & Promotions — Public API

**Routes:** `src/routes/public/testimonials.routes.ts`, `src/routes/public/faqs.routes.ts`, `src/routes/public/promotions.routes.ts`  
**Controllers:** `src/controllers/public/testimonials.controller.ts`, etc.

- [ ] `GET /api/testimonials` — List approved testimonials:
  - Filter: `isApproved=true`
  - Optional: `?featured=true` for featured only
  - Optional: `?limit=6` for home page
  - Include product reference if linked
- [ ] `GET /api/faqs` — List active FAQs:
  - Filter: `isActive=true`
  - Group by `category`
  - Sort by `displayOrder` ASC within each category
- [ ] `GET /api/promotions` — List active promotions:
  - Filter: `isActive=true`, `startDate <= now`, `endDate >= now` (or null end date)
  - Include product reference if linked

### Task 2.6: Public Settings — Public API

**Routes:** `src/routes/public/settings.routes.ts`  
**Controller:** `src/controllers/public/settings.controller.ts`

- [ ] `GET /api/settings/contact` — Contact info (address, phone, WhatsApp, email, working hours)
- [ ] `GET /api/settings/site` — Site-wide settings (company name, logo, favicon, colors, social links, SEO defaults)
- [ ] `GET /api/settings/shipping` — Shipping settings (flat-rate fee, free shipping threshold, delivery areas)

---

## PHASE 3: CUSTOMER AUTHENTICATION & ACCOUNT

### Task 3.1: Customer Registration

**Routes:** `src/routes/auth/auth.routes.ts`  
**Controller:** `src/controllers/auth/auth.controller.ts`  
**Service:** `src/services/customer-auth.service.ts`  
**Validator:** `src/validators/customer-auth.validator.ts`

- [ ] `POST /api/auth/register` — Register new customer:
  - **Request body:**
    ```json
    {
      "name": "string (required, min 2)",
      "email": "string (required, valid email)",
      "phone": "string (required, Egyptian phone format)",
      "nationalId": "string (required, exactly 14 digits)",
      "password": "string (required, min 8, uppercase, lowercase, number)",
      "confirmPassword": "string (must match password)"
    }
    ```
  - **Validation:**
    - National ID: exactly 14 numeric digits (use `national-id.ts` validator)
    - Email: unique check against Customers table
    - Phone: Egyptian format validation
    - Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
  - **Logic:**
    - Hash password with bcrypt (salt rounds 10)
    - Generate 6-digit OTP for email verification
    - Set OTP expiry to 10 minutes from now
    - Create customer record with `emailVerified=false`
    - Enqueue welcome email + verification email (with OTP code)
    - Return success message (do NOT return tokens yet — must verify email first)
  - **Rate limit:** 5 requests / 15 min per IP

- [ ] `POST /api/auth/verify-email` — Verify email with OTP:
  - **Request:** `{ "email": "...", "otp": "123456" }`
  - Check OTP matches and not expired
  - Set `emailVerified=true`, clear OTP fields
  - Return access token + refresh token (customer auto-logged in after verification)

- [ ] `POST /api/auth/resend-verification` — Resend verification OTP:
  - Generate new OTP, update expiry
  - Enqueue verification email
  - Rate limit: 3 requests / hour per email

### Task 3.2: Customer Login & Token Management

- [ ] `POST /api/auth/login` — Customer login:
  - **Request:** `{ "email": "...", "password": "..." }`
  - **Logic:**
    - Find customer by email
    - Check `isActive=true` (return 403 if deactivated)
    - Check `emailVerified=true` (return 403 with "verify email" message if not)
    - Check account not locked (`lockedUntil` not in future, or `failedLoginAttempts < 5`)
    - Compare password with bcrypt
    - On failure: increment `failedLoginAttempts`, lock account for 30 min after 5 failures
    - On success: reset `failedLoginAttempts`, update `lastLoginAt`
    - Record login attempt in `LoginAttempts` table
    - Return access token (1h) + refresh token (7d)
  - **Rate limit:** 5 requests / 15 min per IP

- [ ] `POST /api/auth/refresh-token` — Refresh access token:
  - **Request:** `{ "refreshToken": "..." }`
  - Verify refresh token with customer refresh secret
  - Check customer still active
  - Return new access token

- [ ] `POST /api/auth/logout` — Customer logout:
  - **Request:** `{ "refreshToken": "..." }` (optional)
  - Add refresh token to `TokenBlacklist` (if provided)
  - Client-side: discard access token

### Task 3.3: Customer Password Reset

- [ ] `POST /api/auth/forgot-password` — Request password reset:
  - **Request:** `{ "email": "..." }`
  - Find customer by email (return success even if not found — prevent email enumeration)
  - Generate 6-digit OTP, set expiry 10 minutes
  - Enqueue password reset email
  - Rate limit: 3 requests / hour per email

- [ ] `POST /api/auth/reset-password` — Reset password with OTP:
  - **Request:** `{ "email": "...", "otp": "123456", "newPassword": "...", "confirmPassword": "..." }`
  - Verify OTP matches and not expired
  - Hash new password, update customer record
  - Clear OTP fields
  - Blacklist any existing refresh tokens
  - Return success message

### Task 3.4: Customer Profile & Addresses

**Routes:** `src/routes/customer/account.routes.ts`, `src/routes/customer/addresses.routes.ts`  
**Controller:** `src/controllers/customer/account.controller.ts`, `src/controllers/customer/addresses.controller.ts`  
**Validator:** `src/validators/customer.validator.ts`  
**Middleware:** `customerAuth`

- [ ] `GET /api/account/profile` — Get current customer profile:
  - Return: name, email, phone, nationalId (masked: show last 4 digits), emailVerified, createdAt
  - Include count of addresses and orders

- [ ] `PUT /api/account/profile` — Update customer profile:
  - Updatable fields: `name`, `phone`
  - **NOT updatable:** email, nationalId (immutable after registration)

- [ ] `PUT /api/account/change-password` — Change password:
  - **Request:** `{ "currentPassword": "...", "newPassword": "...", "confirmPassword": "..." }`
  - Verify current password matches
  - Hash and save new password
  - Blacklist existing refresh tokens (force re-login)

- [ ] `GET /api/account/addresses` — List customer addresses (sorted by isDefault DESC, createdAt DESC)

- [ ] `POST /api/account/addresses` — Add new address:
  - **Request body:**
    ```json
    {
      "label": "Home",
      "recipientName": "Mohamed Ali",
      "phone": "01012345678",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4B (optional)",
      "city": "Cairo",
      "governorate": "Cairo",
      "postalCode": "11511 (optional)",
      "isDefault": true
    }
    ```
  - **Limit:** Maximum 10 addresses per customer (return 400 if exceeded)
  - If `isDefault=true`, unset default on all other addresses

- [ ] `PUT /api/account/addresses/:id` — Update address (verify ownership)
- [ ] `DELETE /api/account/addresses/:id` — Delete address (verify ownership, cannot delete if it's the only address used in pending orders)

### Task 3.5: Customer Order History

**Routes:** `src/routes/customer/orders.routes.ts`  
**Controller:** `src/controllers/customer/orders.controller.ts`

- [ ] `GET /api/account/orders` — List customer orders:
  - **Query params:** `?status=confirmed,shipped`, `?page=1&limit=10`, `?sort=newest`
  - Return: order summary (orderNumber, date, total, status, paymentStatus, itemCount)
  - Only show orders belonging to authenticated customer

- [ ] `GET /api/account/orders/:id` — Order detail:
  - Include: order items (with product snapshots), shipping address, payment info, status history
  - Verify order belongs to authenticated customer
  - Order detail response shape:
    ```json
    {
      "id": "uuid",
      "orderNumber": "LORD-20250101",
      "status": "confirmed",
      "paymentStatus": "paid",
      "items": [
        {
          "id": "uuid",
          "productName": "Carrier 42QHF024",
          "productImage": "...",
          "modelNumber": "42QHF024",
          "quantity": 1,
          "unitPrice": 4500,
          "lineTotal": 4500
        }
      ],
      "shippingAddress": {
        "recipientName": "...",
        "phone": "...",
        "addressLine1": "...",
        "city": "...",
        "governorate": "..."
      },
      "subtotal": 4500,
      "shippingFee": 150,
      "discount": 0,
      "total": 4650,
      "couponCode": null,
      "payment": {
        "method": "credit_card",
        "last4": "4242",
        "transactionId": "..."
      },
      "trackingNumber": "...",
      "statusHistory": [
        {
          "status": "pending_payment",
          "timestamp": "...",
          "note": "Order placed"
        },
        {
          "status": "confirmed",
          "timestamp": "...",
          "note": "Payment received"
        }
      ],
      "createdAt": "...",
      "updatedAt": "..."
    }
    ```

---

## PHASE 4: SHOPPING CART & COUPON SYSTEM

### Task 4.1: Shopping Cart API

**Routes:** `src/routes/cart/cart.routes.ts`  
**Controller:** `src/controllers/cart/cart.controller.ts`  
**Service:** `src/services/cart.service.ts`  
**Validator:** `src/validators/cart.validator.ts`

**Cart identification:**

- **Authenticated customer:** Cart linked via `customerId`
- **Guest visitor:** Cart linked via `sessionId` (UUID sent as `x-session-id` header or generated server-side)

- [ ] `GET /api/cart` — Get current cart:
  - Find active cart by `customerId` (if authenticated) or `sessionId` (if guest)
  - Include cart items with product details (name, image, price, stock, isActive)
  - Calculate subtotal, apply coupon discount if applied
  - **Re-validate prices:** Compare cart item `unitPrice` with current product price — flag if changed
  - **Check stock:** Flag items where `quantity > stockQuantity`
  - Cart response shape:
    ```json
    {
      "id": "uuid",
      "items": [
        {
          "id": "uuid",
          "product": {
            "id": "uuid",
            "name": "...",
            "slug": "...",
            "image": "...",
            "price": 4500,
            "stockQuantity": 15,
            "isActive": true
          },
          "quantity": 2,
          "unitPrice": 4500,
          "lineTotal": 9000,
          "priceChanged": false,
          "insufficientStock": false
        }
      ],
      "itemCount": 2,
      "subtotal": 9000,
      "coupon": {
        "code": "SUMMER20",
        "discountType": "percentage",
        "discountValue": 20,
        "discountAmount": 1800
      },
      "discount": 1800,
      "total": 7200
    }
    ```

- [ ] `POST /api/cart/items` — Add item to cart:
  - **Request:** `{ "productId": "uuid", "quantity": 1 }`
  - Validate product exists, is active, has sufficient stock
  - If product already in cart → increment quantity
  - Capture current product price as `unitPrice`
  - Create cart if none exists
  - Return updated cart

- [ ] `PUT /api/cart/items/:itemId` — Update item quantity:
  - **Request:** `{ "quantity": 3 }`
  - Validate stock availability
  - If `quantity=0` → remove item
  - Return updated cart

- [ ] `DELETE /api/cart/items/:itemId` — Remove item from cart
  - Return updated cart

- [ ] `POST /api/cart/coupon` — Apply coupon to cart:
  - **Request:** `{ "code": "SUMMER20" }`
  - Validate coupon (see coupon validation logic in Task 4.2)
  - Store `couponId` on cart
  - Return updated cart with discount applied

- [ ] `DELETE /api/cart/coupon` — Remove coupon from cart
  - Clear `couponId` on cart
  - Return updated cart

### Task 4.2: Cart Merge on Login

- [ ] `POST /api/cart/merge` — Merge guest cart into customer cart:
  - **Request:** `{ "sessionId": "uuid" }`
  - Called automatically after customer login (if `x-session-id` header present)
  - **Logic:**
    1. Find guest cart by `sessionId` with status `ACTIVE`
    2. Find or create customer cart by `customerId`
    3. For each guest cart item:
       - If product already in customer cart → use higher quantity
       - If not in customer cart → move item to customer cart
    4. Transfer coupon from guest cart if customer cart has no coupon
    5. Mark guest cart as `ABANDONED` (or delete)
    6. Return merged customer cart

### Task 4.3: Coupon Validation

**Service:** `src/services/coupon.service.ts`  
**Routes:** `src/routes/checkout/coupons.routes.ts`  
**Controller:** `src/controllers/checkout/coupons.controller.ts`

- [ ] `POST /api/coupons/validate` — Validate coupon code:
  - **Request:** `{ "code": "SUMMER20", "cartTotal": 5000 }`
  - **Validation checks:**
    1. Coupon exists and `isActive=true`
    2. Current date within `validFrom` — `validUntil` range
    3. `usageCount < maxUsage` (if maxUsage is set)
    4. Cart total meets `minimumOrderAmount` (if set)
    5. Customer hasn't already used this coupon (check `CouponUsage`)
  - **Return:**
    ```json
    {
      "valid": true,
      "code": "SUMMER20",
      "discountType": "percentage",
      "discountValue": 20,
      "discountAmount": 1000,
      "message": "Coupon applied: 20% off"
    }
    ```
  - On invalid: `{ "valid": false, "message": "reason" }`

---

## PHASE 5: CHECKOUT, ORDERS & PAYMOB PAYMENT INTEGRATION

### Task 5.1: Order Placement

**Routes:** `src/routes/checkout/orders.routes.ts`  
**Controller:** `src/controllers/checkout/orders.controller.ts`  
**Service:** `src/services/order.service.ts`  
**Validator:** `src/validators/order.validator.ts`

- [ ] `POST /api/orders` — Place order:
  - **Authenticated customer request:**
    ```json
    {
      "shippingAddressId": "uuid",
      "couponCode": "SUMMER20 (optional)",
      "notes": "optional order notes"
    }
    ```
  - **Guest checkout request:**
    ```json
    {
      "guestName": "Mohamed Ali",
      "guestEmail": "customer@email.com",
      "guestPhone": "01012345678",
      "guestNationalId": "12345678901234",
      "shippingAddress": {
        "recipientName": "Mohamed Ali",
        "phone": "01012345678",
        "addressLine1": "123 Main Street",
        "addressLine2": "Apt 4B",
        "city": "Cairo",
        "governorate": "Cairo",
        "postalCode": "11511"
      },
      "couponCode": "SUMMER20 (optional)",
      "notes": "optional order notes"
    }
    ```
  - **Order creation logic (CRITICAL — must be atomic / transactional):**
    1. Fetch cart with items (validate cart is not empty)
    2. Validate all products are active and in stock
    3. **Stock check with optimistic locking:**
       - For each cart item: `UPDATE Products SET stockQuantity = stockQuantity - :qty WHERE id = :id AND stockQuantity >= :qty`
       - If any update affects 0 rows → rollback, return 409 "Insufficient stock for [product name]"
    4. Validate coupon if provided (re-validate at order time)
    5. Calculate order totals:
       - `subtotal` = sum of (unitPrice × quantity) for all items
       - `shippingFee` = fetch from SiteSettings (flat rate); 0 if subtotal >= free shipping threshold
       - `discount` = calculated from coupon
       - `total` = subtotal + shippingFee - discount
    6. Generate order number: `LORD-YYYYMMNN` format
    7. Create Order record with `orderStatus=PENDING_PAYMENT`, `paymentStatus=PENDING`
    8. Create OrderItems with product snapshots (name, image, modelNumber at time of order)
    9. Record in OrderStatusHistory: "Order placed"
    10. If coupon used: create CouponUsage record, increment `usageCount` on Coupon
    11. Store shipping address as JSONB on order (snapshot — not a reference)
    12. Mark cart as `CONVERTED`
    13. Record coupon usage if applicable
    14. Return order summary with order ID for payment initiation

### Task 5.2: Paymob Payment Integration

**Routes:** `src/routes/checkout/payments.routes.ts`  
**Controller:** `src/controllers/checkout/payments.controller.ts`  
**Service:** `src/services/paymob.service.ts`, `src/services/payment.service.ts`

**Paymob Accept Integration Flow (8 steps):**

1. **Authenticate:** `POST https://accept.paymob.com/api/auth/tokens` → get `auth_token`
2. **Register Order:** `POST https://accept.paymob.com/api/ecommerce/orders` → get `paymob_order_id`
3. **Get Payment Key:** `POST https://accept.paymob.com/api/acceptance/payment_keys` → get `payment_key`
4. **Client pays:** Frontend opens Paymob iframe/redirect with `payment_key`
5. **Paymob processes payment**
6. **Callback received:** `POST /api/webhooks/paymob` with transaction result
7. **Verify HMAC:** Compute HMAC-SHA512 and compare
8. **Update records:** Update Payment status, Order status, send notifications

- [ ] `POST /api/orders/:id/pay` — Initiate Paymob payment:
  - **Request:** `{ "paymentMethod": "credit_card" | "mobile_wallet" | "installment" }`
  - **Logic:**
    1. Fetch order (verify ownership or guest email match)
    2. Verify order status is `PENDING_PAYMENT`
    3. Verify order is not expired (created < 30 minutes ago)
    4. **Step 1 — Get auth token from Paymob:**
       ```
       POST https://accept.paymob.com/api/auth/tokens
       Body: { "api_key": PAYMOB_API_KEY }
       Response: { "token": "auth_token" }
       ```
    5. **Step 2 — Register order with Paymob:**
       ```
       POST https://accept.paymob.com/api/ecommerce/orders
       Body: {
         "auth_token": "...",
         "delivery_needed": false,
         "amount_cents": total * 100,  // EGP to piasters
         "currency": "EGP",
         "merchant_order_id": order.orderNumber,
         "items": [{ "name": "...", "amount_cents": ..., "quantity": ... }]
       }
       Response: { "id": paymob_order_id }
       ```
    6. **Step 3 — Get payment key:**
       ```
       POST https://accept.paymob.com/api/acceptance/payment_keys
       Body: {
         "auth_token": "...",
         "order_id": paymob_order_id,
         "amount_cents": total * 100,
         "currency": "EGP",
         "expiration": 3600,
         "integration_id": INTEGRATION_ID_FOR_METHOD,
         "billing_data": {
           "first_name": "...", "last_name": "...",
           "email": "...", "phone_number": "...",
           "city": "...", "country": "EG",
           "street": "...", "building": "NA",
           "floor": "NA", "apartment": "NA",
           "state": "...", "postal_code": "...",
           "shipping_method": "NA"
         }
       }
       Response: { "token": "payment_key" }
       ```
    7. Create Payment record with status `PENDING`
    8. **Return to frontend:**
       ```json
       {
         "paymentKey": "...",
         "paymobOrderId": "...",
         "iframeId": "PAYMOB_IFRAME_ID",
         "iframeUrl": "https://accept.paymob.com/api/acceptance/iframes/IFRAME_ID?payment_token=PAYMENT_KEY",
         "redirectUrl": "for wallet payments"
       }
       ```
  - **Error handling:**
    - Paymob API errors → return 502 with message
    - Order already paid → return 409
    - Order expired → return 410

- [ ] Implement `src/services/paymob.service.ts`:
  - `getAuthToken()` — Authenticate with Paymob API
  - `registerOrder(authToken, orderData)` — Create Paymob order
  - `getPaymentKey(authToken, paymentData)` — Generate payment key
  - `processRefund(authToken, transactionId, amountCents)` — Process refund
  - `verifyHmac(data, hmacSecret)` — Verify HMAC-SHA512 webhook signature
  - Use integration ID based on payment method:
    - `credit_card` → `PAYMOB_INTEGRATION_ID_CARD`
    - `mobile_wallet` → `PAYMOB_INTEGRATION_ID_WALLET`
    - `installment` → `PAYMOB_INTEGRATION_ID_INSTALLMENT`
  - **All amounts in piasters (multiply EGP by 100)**

### Task 5.3: Paymob Webhook Handler

**Routes:** `src/routes/webhooks/paymob.routes.ts`  
**Controller:** `src/controllers/webhooks/paymob.controller.ts`

- [ ] `POST /api/webhooks/paymob` — Handle Paymob callback:
  - **⚠️ NO AUTH MIDDLEWARE** — this is called by Paymob servers
  - **Step 1:** Extract HMAC from request header or body
  - **Step 2:** Compute HMAC-SHA512 over the callback data fields (in specific order per Paymob docs)
  - **Step 3:** Compare computed HMAC with received HMAC
  - **Step 4:** If HMAC invalid → return 401, log the attempt
  - **Step 5:** Extract transaction data:
    - `obj.order.merchant_order_id` → our order number
    - `obj.id` → Paymob transaction ID
    - `obj.success` → boolean
    - `obj.amount_cents` → amount in piasters
    - `obj.source_data.type` → payment method (card, wallet)
    - `obj.source_data.pan` → masked card number (last 4)
    - `obj.source_data.sub_type` → card brand (Visa, Mastercard)
  - **Step 6 — On success (`obj.success === true`):**
    1. Update Payment record: status → `PAID`, store transaction ID, gateway response
    2. Update Order: `paymentStatus → PAID`, `orderStatus → CONFIRMED`
    3. Record in OrderStatusHistory: "Payment received via [method]"
    4. Enqueue order confirmation email to customer
    5. Enqueue payment receipt email to customer
    6. Enqueue new order alert email to staff
  - **Step 7 — On failure (`obj.success === false`):**
    1. Update Payment record: status → `FAILED`, store error details
    2. Order remains `PENDING_PAYMENT` (customer can retry)
    3. Log payment failure with details
  - **Return:** 200 OK (always — Paymob expects 200)

### Task 5.4: Order Lifecycle & Status Management

**Service:** `src/services/order.service.ts`

- [ ] Implement order status transitions:

  ```
  PENDING_PAYMENT → CONFIRMED (on successful payment)
  CONFIRMED → PROCESSING (staff starts preparing)
  PROCESSING → SHIPPED (staff ships with tracking)
  SHIPPED → DELIVERED (staff confirms delivery)

  PENDING_PAYMENT → CANCELLED (auto: after 30 min, or staff action)
  CONFIRMED → CANCELLED (staff cancels + refund)
  PROCESSING → CANCELLED (staff cancels + refund)

  CONFIRMED → REFUNDED (full refund processed)
  DELIVERED → REFUNDED (return/refund processed)
  ```

- [ ] Validate transitions (prevent invalid: e.g., DELIVERED → PROCESSING)

- [ ] On cancellation after payment:
  - Process refund via Paymob
  - Restore stock quantities
  - Create Refund record
  - Update order `paymentStatus → REFUNDED`
  - Enqueue refund notification email

- [ ] On shipping:
  - Store tracking number and carrier on order
  - Enqueue order shipped email

- [ ] On delivery:
  - Enqueue order delivered email

---

## PHASE 6: INQUIRY & SERVICE REQUEST SYSTEM

### Task 6.1: Product Inquiries

**Routes:** `src/routes/public/inquiries.routes.ts`  
**Controller:** `src/controllers/public/inquiries.controller.ts`  
**Service:** `src/services/inquiry.service.ts`  
**Validator:** `src/validators/inquiry.validator.ts`

- [ ] `POST /api/inquiries` — Submit product inquiry (no auth required):
  - **Request body:**
    ```json
    {
      "name": "string (required)",
      "email": "string (required, valid email)",
      "phone": "string (required, Egyptian format)",
      "inquiryType": "product | general | pricing | bulk_order | other",
      "productId": "uuid (optional — required if type=product)",
      "message": "string (required, max 2000 chars)",
      "source": "website | phone | whatsapp (default: website)"
    }
    ```
  - Create Inquiry record with `status=NEW`
  - Enqueue acknowledgement email to customer
  - Enqueue notification email to Lord staff
  - Rate limit: 5 inquiries / hour per IP

### Task 6.2: Service Requests

**Routes:** `src/routes/public/service-requests.routes.ts`  
**Controller:** `src/controllers/public/service-requests.controller.ts`  
**Validator:** `src/validators/service-request.validator.ts`

- [ ] `POST /api/service-requests` — Submit service request (no auth required):
  - **Request body:**
    ```json
    {
      "name": "string (required)",
      "email": "string (required, valid email)",
      "phone": "string (required)",
      "serviceTypeId": "uuid (required)",
      "unitBrand": "string (optional — e.g., 'Carrier')",
      "unitModel": "string (optional — e.g., '42QHF024')",
      "propertyType": "residential | commercial | industrial (optional)",
      "floorNumber": "number (optional)",
      "installationAddress": "string (required for installation/delivery)",
      "faultDescription": "string (optional — for repair requests)",
      "urgency": "normal | urgent | emergency (default: normal)",
      "deliveryAddress": "string (optional — for delivery requests)",
      "preferredDate": "date (optional)",
      "preferredTime": "string (optional — e.g., 'morning', 'afternoon')",
      "message": "string (optional, additional notes)"
    }
    ```
  - Create ServiceRequest record with `status=NEW`
  - Enqueue acknowledgement email to customer
  - Enqueue notification email to Lord staff
  - Rate limit: 5 requests / hour per IP

---

## PHASE 7: CMS AUTHENTICATION & DASHBOARD

### Task 7.1: CMS Authentication

**Routes:** `src/routes/cms/cms-auth.routes.ts`  
**Controller:** `src/controllers/cms/cms-auth.controller.ts`  
**Service:** `src/services/cms-auth.service.ts`  
**Validator:** `src/validators/cms-auth.validator.ts`

- [ ] `POST /api/cms/auth/login` — CMS staff login:
  - **Request:** `{ "email": "...", "password": "..." }`
  - **Logic:**
    - Find CMS user by email
    - Check `isActive=true`
    - Check account not locked
    - Compare password with bcrypt
    - On failure: increment `failedLoginAttempts`, lock after 5 failures (30 min)
    - On success: generate 6-digit OTP, send via email (2FA)
    - Record login attempt in `LoginAttempts`
    - Return: `{ "message": "OTP sent to your email", "requireOtp": true }`
  - Rate limit: 5 requests / 15 min per IP

- [ ] `POST /api/cms/auth/verify-otp` — Verify OTP to complete login:
  - **Request:** `{ "email": "...", "otp": "123456" }`
  - Verify OTP matches and not expired
  - Clear OTP fields, reset failed attempts
  - Return access token (1h) + refresh token (7d) — **signed with CMS JWT secret**

- [ ] `POST /api/cms/auth/refresh` — Refresh CMS access token:
  - Verify refresh token not in `TokenBlacklist`
  - Return new access token

- [ ] `POST /api/cms/auth/logout` — CMS logout:
  - Add both access token and refresh token to `TokenBlacklist`
  - Return success

- [ ] `POST /api/cms/auth/forgot-password` — Request CMS password reset:
  - Generate OTP, enqueue password reset email
  - Rate limit: 3 requests / hour per email

- [ ] `POST /api/cms/auth/reset-password` — Reset CMS password with OTP:
  - Verify OTP, hash new password, update record
  - Blacklist all existing tokens for this user

### Task 7.2: CMS Dashboard

**Routes:** `src/routes/cms/dashboard.routes.ts`  
**Controller:** `src/controllers/cms/dashboard.controller.ts`  
**Service:** `src/services/dashboard.service.ts`  
**Middleware:** `cmsAuth`

- [ ] `GET /api/cms/dashboard` — Dashboard statistics:
  - **Response shape:**
    ```json
    {
      "stats": {
        "totalOrders": 156,
        "totalRevenue": 702000,
        "totalCustomers": 89,
        "totalProducts": 24,
        "pendingInquiries": 12,
        "pendingServiceRequests": 5
      },
      "recentOrders": [
        {
          "id": "...",
          "orderNumber": "LORD-20250115",
          "customerName": "...",
          "total": 4500,
          "status": "confirmed",
          "createdAt": "..."
        }
      ],
      "recentInquiries": [
        {
          "id": "...",
          "name": "...",
          "type": "product",
          "status": "new",
          "createdAt": "..."
        }
      ],
      "ordersByStatus": {
        "pending_payment": 3,
        "confirmed": 8,
        "processing": 5,
        "shipped": 12,
        "delivered": 120,
        "cancelled": 6,
        "refunded": 2
      },
      "revenueByMonth": [
        { "month": "2025-01", "revenue": 85000, "orderCount": 18 }
      ],
      "topSellingProducts": [
        {
          "id": "...",
          "name": "Carrier 42QHF024",
          "totalSold": 35,
          "revenue": 157500
        }
      ]
    }
    ```
  - **Queries:** Use Prisma aggregations (`_count`, `_sum`, `groupBy`)
  - Revenue = sum of `total` for orders with `paymentStatus=PAID`
  - Recent items: last 10, sorted by `createdAt` DESC

---

## PHASE 8: CMS MANAGEMENT APIs

**All CMS routes require:** `cmsAuth` middleware  
**Admin-only routes additionally require:** `requireRole('CMS_ADMIN')`

### Task 8.1: CMS Product Management

**Routes:** `src/routes/cms/products.routes.ts`  
**Controller:** `src/controllers/cms/products.controller.ts`

- [ ] `GET /api/cms/products` — List all products (including inactive):
  - **Query params:** `?brand=`, `?category=`, `?search=`, `?active=`, `?sort=`, `?page=`, `?limit=`
  - Include brand name, category name, stock quantity, image count
  - Return total count for pagination

- [ ] `GET /api/cms/products/:id` — Product detail (by UUID, not slug)

- [ ] `POST /api/cms/products` — Create product:
  - **Multipart form data** (for image upload)
  - All product fields from schema (name, slug, brand, category, specs, pricing, stock, SEO, flags)
  - Auto-generate slug from name (ensure uniqueness)
  - Upload images to S3, create ProductImage records
  - Set `displayOrder` on images

- [ ] `PUT /api/cms/products/:id` — Update product:
  - Partial update (only provided fields)
  - Slug regeneration if name changed (check uniqueness)

- [ ] `DELETE /api/cms/products/:id` — Soft delete or deactivate product:
  - Set `isActive=false` (do NOT hard delete — may be referenced in orders)

- [ ] `POST /api/cms/products/:id/images` — Upload product images:
  - Upload to S3
  - Create ProductImage records with displayOrder
  - Max 10 images per product

- [ ] `DELETE /api/cms/products/:id/images/:imageId` — Delete product image:
  - Delete from S3
  - Delete ProductImage record

- [ ] `PUT /api/cms/products/:id/images/reorder` — Reorder product images:
  - **Request:** `{ "imageIds": ["uuid1", "uuid2", "uuid3"] }`
  - Update `displayOrder` based on array position

- [ ] `PUT /api/cms/products/bulk` — Bulk update products:
  - **Request:** `{ "ids": ["uuid1", "uuid2"], "action": "activate" | "deactivate" | "feature" | "unfeature" }`

### Task 8.2: CMS Brand Management

**Routes:** `src/routes/cms/brands.routes.ts`  
**Controller:** `src/controllers/cms/brands.controller.ts`

- [ ] `GET /api/cms/brands` — List all brands (including inactive)
- [ ] `GET /api/cms/brands/:id` — Brand detail with product count
- [ ] `POST /api/cms/brands` — Create brand (with logo + certificate upload to S3)
- [ ] `PUT /api/cms/brands/:id` — Update brand
- [ ] `DELETE /api/cms/brands/:id` — Deactivate brand (set `isActive=false`)

### Task 8.3: CMS Product Category Management

**Routes:** `src/routes/cms/categories.routes.ts`  
**Controller:** `src/controllers/cms/categories.controller.ts`

- [ ] `GET /api/cms/product-categories` — List all categories with product counts
- [ ] `POST /api/cms/product-categories` — Create category
- [ ] `PUT /api/cms/product-categories/:id` — Update category
- [ ] `DELETE /api/cms/product-categories/:id` — Deactivate category

### Task 8.4: CMS Services Management

**Routes:** `src/routes/cms/services.routes.ts`, `src/routes/cms/service-types.routes.ts`  
**Controller:** `src/controllers/cms/services.controller.ts`, `src/controllers/cms/service-types.controller.ts`

- [ ] CRUD for `ServiceTypes`: `GET|POST|PUT|DELETE /api/cms/service-types`
- [ ] CRUD for `Services`: `GET|POST|PUT|DELETE /api/cms/services`
  - Include service type info
  - Filter by service type

### Task 8.5: CMS Inquiry Management

**Routes:** `src/routes/cms/inquiries.routes.ts`, `src/routes/cms/service-requests.routes.ts`  
**Controller:** `src/controllers/cms/inquiries.controller.ts`, `src/controllers/cms/service-requests.controller.ts`

- [ ] `GET /api/cms/inquiries` — List inquiries:
  - **Filters:** `?status=new,in_progress`, `?type=product`, `?search=`, `?dateFrom=`, `?dateTo=`, `?page=`, `?limit=`
  - Include product name if linked
  - Include notes count

- [ ] `GET /api/cms/inquiries/:id` — Inquiry detail with all notes

- [ ] `PUT /api/cms/inquiries/:id` — Update inquiry status:
  - **Request:** `{ "status": "in_progress", "assignedTo": "uuid (optional)" }`
  - Valid transitions: NEW → IN_PROGRESS → RESOLVED → CLOSED
  - On status change: enqueue status update email to customer

- [ ] `POST /api/cms/inquiries/:id/notes` — Add internal note to inquiry:
  - **Request:** `{ "content": "Contacted customer, awaiting response" }`
  - Record author (CMS user ID)

- [ ] `GET /api/cms/inquiries/export` — Export inquiries as CSV:
  - Apply same filters as list endpoint
  - Generate CSV with all inquiry fields
  - Return as file download

- [ ] **Same CRUD pattern for Service Requests:**
  - `GET /api/cms/service-requests` (with filters: status, serviceType, urgency, date range)
  - `GET /api/cms/service-requests/:id`
  - `PUT /api/cms/service-requests/:id` (update status, assignedTo)
  - `POST /api/cms/service-requests/:id/notes`
  - `GET /api/cms/service-requests/export`

### Task 8.6: CMS Order Management

**Routes:** `src/routes/cms/orders.routes.ts`  
**Controller:** `src/controllers/cms/orders.controller.ts`

- [ ] `GET /api/cms/orders` — List all orders:
  - **Filters:** `?status=`, `?paymentStatus=`, `?search=` (order number, customer name/email), `?dateFrom=`, `?dateTo=`, `?page=`, `?limit=`
  - Include: customer name/email, item count, total, status badges

- [ ] `GET /api/cms/orders/:id` — Full order detail:
  - Include: items, shipping address, payment info, status history, notes, customer info

- [ ] `PUT /api/cms/orders/:id/status` — Update order status:
  - **Request:** `{ "status": "processing", "note": "Started preparing order" }`
  - Validate status transition (see Phase 5.4)
  - Add to OrderStatusHistory (changedBy = CMS user ID)
  - Trigger appropriate email notification

- [ ] `PUT /api/cms/orders/:id/shipping` — Update shipping info:
  - **Request:** `{ "trackingNumber": "...", "carrier": "...", "note": "..." }`
  - Update order status to `SHIPPED`
  - Enqueue order shipped email

- [ ] `POST /api/cms/orders/:id/refund` — Process refund:
  - **Request:** `{ "amount": 4500, "reason": "Customer requested return" }`
  - Call Paymob refund API
  - Create Refund record
  - Update payment status: `REFUNDED` (full) or `PARTIALLY_REFUNDED` (partial)
  - Update order status to `REFUNDED`
  - Restore stock quantities
  - Enqueue refund notification email

- [ ] `POST /api/cms/orders/:id/notes` — Add internal note to order:
  - **Request:** `{ "content": "Customer called about delivery" }`

- [ ] `GET /api/cms/orders/export` — Export orders as CSV (filtered)

- [ ] `GET /api/cms/orders/stats` — Order statistics:
  - Total orders, revenue by date range
  - Orders by status breakdown
  - Average order value
  - Top products by revenue

### Task 8.7: CMS Customer Management

**Routes:** `src/routes/cms/customers.routes.ts`  
**Controller:** `src/controllers/cms/customers.controller.ts`

- [ ] `GET /api/cms/customers` — List customers:
  - **Filters:** `?search=` (name, email, phone), `?active=`, `?page=`, `?limit=`
  - Include: order count, total spent

- [ ] `GET /api/cms/customers/:id` — Customer detail:
  - Profile info (including masked nationalId)
  - Addresses
  - Order history summary
  - Inquiry history

- [ ] `PUT /api/cms/customers/:id` — Update customer status:
  - **Request:** `{ "isActive": false }`
  - Activate or deactivate customer account

### Task 8.8: CMS Coupon Management

**Routes:** `src/routes/cms/coupons.routes.ts`  
**Controller:** `src/controllers/cms/coupons.controller.ts`

- [ ] `GET /api/cms/coupons` — List all coupons:
  - Include: usage count, active/expired status
  - **Filters:** `?active=`, `?search=`, `?page=`, `?limit=`

- [ ] `GET /api/cms/coupons/:id` — Coupon detail with usage history

- [ ] `POST /api/cms/coupons` — Create coupon:
  - **Request:**
    ```json
    {
      "code": "SUMMER20",
      "discountType": "percentage | fixed",
      "discountValue": 20,
      "minimumOrderAmount": 1000,
      "maxUsage": 100,
      "validFrom": "2025-06-01",
      "validUntil": "2025-08-31",
      "isActive": true
    }
    ```
  - Validate code uniqueness (case-insensitive)

- [ ] `PUT /api/cms/coupons/:id` — Update coupon
- [ ] `DELETE /api/cms/coupons/:id` — Deactivate coupon (set `isActive=false`)

### Task 8.9: CMS Content Management

**Routes:** `src/routes/cms/content.routes.ts`, `src/routes/cms/settings.routes.ts`  
**Controller:** `src/controllers/cms/content.controller.ts`, `src/controllers/cms/settings.controller.ts`

- [ ] `GET /api/cms/content` — List all content pages
- [ ] `GET /api/cms/content/:id` — Content page detail
- [ ] `POST /api/cms/content` — Create content page:
  - **Request:** `{ "pageKey": "home", "title": "Home Page", "contentJson": {...}, "seoTitle": "...", "seoDescription": "...", "isPublished": true }`
  - `pageKey` must be unique
- [ ] `PUT /api/cms/content/:id` — Update content page
- [ ] `DELETE /api/cms/content/:id` — Unpublish or delete content page

- [ ] `GET /api/cms/settings` — Get all settings (grouped by tab):
  - Tabs: General, Contact, Email, SEO, Paymob, Shipping, Social
- [ ] `PUT /api/cms/settings` — Update settings:
  - **Request:** `{ "key": "contact_phone", "value": "01012345678" }` or batch update
  - **Admin only** for Paymob settings tab
  - Validate setting keys

### Task 8.10: CMS Testimonial, Promotion & FAQ Management

**Routes:** `src/routes/cms/testimonials.routes.ts`, `src/routes/cms/promotions.routes.ts`, `src/routes/cms/faqs.routes.ts`

- [ ] **Testimonials** CRUD: `GET|POST|PUT|DELETE /api/cms/testimonials`
  - Approve/reject: `PUT /api/cms/testimonials/:id` with `{ "isApproved": true/false }`
  - Feature/unfeature: `PUT /api/cms/testimonials/:id` with `{ "isFeatured": true/false }`

- [ ] **Promotions** CRUD: `GET|POST|PUT|DELETE /api/cms/promotions`
  - Image upload to S3
  - Date range validation (startDate, endDate)
  - Link to product (optional)

- [ ] **FAQs** CRUD: `GET|POST|PUT|DELETE /api/cms/faqs`
  - Reorder: `PUT /api/cms/faqs/reorder` with `{ "ids": ["uuid1", "uuid2", ...] }`
  - Category grouping

### Task 8.11: CMS User Management (Admin Only)

**Routes:** `src/routes/cms/cms-users.routes.ts`  
**Controller:** `src/controllers/cms/cms-users.controller.ts`  
**Middleware:** `cmsAuth`, `requireRole('CMS_ADMIN')`

- [ ] `GET /api/cms/users` — List CMS users (admin only)
- [ ] `GET /api/cms/users/:id` — CMS user detail
- [ ] `POST /api/cms/users` — Create CMS user:
  - **Request:** `{ "name": "...", "email": "...", "password": "...", "role": "cms_admin | cms_staff" }`
  - Hash password, send welcome email with credentials
- [ ] `PUT /api/cms/users/:id` — Update CMS user (name, role, isActive)
- [ ] `DELETE /api/cms/users/:id` — Deactivate CMS user (set `isActive=false`)

---

## PHASE 9: EMAIL NOTIFICATION SYSTEM

### Task 9.1: Email Service

**Service:** `src/services/email.service.ts`

- [ ] Implement email queue system:
  - `enqueueEmail(recipient, subject, templateName, templateVars)` — Insert into EmailQueue table
  - `processQueue()` — Called by cron job every 1 minute:
    1. Fetch pending emails (status=PENDING, attempts < 3)
    2. For each email:
       - Render HTML template with variables
       - Send via Nodemailer
       - On success: update status → SENT, set sentAt
       - On failure: increment attempts, set error_message, schedule retry (exponential backoff)
       - After 3 failed attempts: status → FAILED

- [ ] Configure Nodemailer transport:
  ```typescript
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: { user: config.email.user, pass: config.email.pass },
  });
  ```

### Task 9.2: Email Templates

**Templates:** `src/templates/email/`

- [ ] `base.template.ts` — Base HTML layout:
  - Lord logo header
  - Content slot
  - Footer with company info, contact details, unsubscribe link
  - Responsive design (mobile-friendly)
  - Lord brand colors (Navy, Teal)

- [ ] `order-confirmation.template.ts` — Order placed:
  - Order number, date
  - Item list with names, quantities, prices
  - Subtotal, shipping fee, discount, total
  - Shipping address
  - "Track Your Order" button

- [ ] `payment-receipt.template.ts` — Payment successful:
  - Transaction ID (Paymob)
  - Payment method (card last 4, wallet)
  - Amount paid
  - Order reference

- [ ] `order-shipped.template.ts` — Order shipped:
  - Tracking number and carrier
  - Estimated delivery
  - "Track Shipment" button

- [ ] `order-delivered.template.ts` — Order delivered confirmation

- [ ] `refund-notification.template.ts` — Refund processed:
  - Refund amount
  - Reason
  - Original order reference
  - Expected refund timeline

- [ ] `inquiry-acknowledgement.template.ts` — Inquiry/service request received:
  - Confirmation that request was received
  - Reference number
  - Expected response time

- [ ] `inquiry-status-update.template.ts` — Status changed:
  - New status
  - Any notes from staff

- [ ] `welcome.template.ts` — Customer registration:
  - Welcome message
  - Verification link/code

- [ ] `email-verification.template.ts` — Email verification OTP:
  - 6-digit OTP code
  - Expiry notice (10 minutes)

- [ ] `password-reset.template.ts` — Password reset OTP:
  - 6-digit OTP code
  - Expiry notice
  - Security notice

- [ ] `staff-notification.template.ts` — Staff alert (new order / new inquiry):
  - Summary of new order or inquiry
  - Quick link to CMS panel

### Task 9.3: Email Triggers

| Event                          | Customer Email               | Staff Email       |
| ------------------------------ | ---------------------------- | ----------------- |
| Customer registers             | Welcome + Verification OTP   | —                 |
| Customer verifies email        | —                            | —                 |
| Customer forgot password       | Password Reset OTP           | —                 |
| Inquiry submitted              | Inquiry Acknowledgement      | New Inquiry Alert |
| Service request submitted      | Request Acknowledgement      | New Request Alert |
| Inquiry/request status changed | Status Update                | —                 |
| Order placed (payment pending) | —                            | —                 |
| Payment successful             | Order Confirmation + Receipt | New Order Alert   |
| Order status → shipped         | Order Shipped                | —                 |
| Order status → delivered       | Order Delivered              | —                 |
| Refund processed               | Refund Notification          | —                 |
| CMS user created               | Welcome with credentials     | —                 |
| CMS forgot password            | Password Reset OTP           | —                 |

---

## PHASE 10: SCHEDULED JOBS (CRON)

**Jobs:** `src/jobs/`

### Task 10.1: Email Queue Processor

- [ ] `email-queue.job.ts` — Run every 1 minute:
  - Call `emailService.processQueue()`
  - Process up to 10 emails per batch
  - Log success/failure counts

### Task 10.2: Order Expiry

- [ ] `order-expiry.job.ts` — Run every 5 minutes:
  - Find orders with `orderStatus=PENDING_PAYMENT` AND `createdAt < 30 minutes ago`
  - For each expired order:
    1. Update `orderStatus → CANCELLED`
    2. Update `paymentStatus → FAILED`
    3. Restore stock quantities (increment `stockQuantity` for each order item)
    4. Record in OrderStatusHistory: "Auto-cancelled: payment timeout"
    5. Log cancellation

### Task 10.3: Cart Cleanup

- [ ] `cart-cleanup.job.ts` — Run daily at 2:00 AM:
  - Delete carts with `status=ABANDONED` AND `updatedAt < 30 days ago`
  - Delete associated CartItems
  - Log cleanup count

### Task 10.4: Token Cleanup

- [ ] `token-cleanup.job.ts` — Run daily at 3:00 AM:
  - Delete entries from `TokenBlacklist` where `expiresAt < now`
  - Delete entries from `LoginAttempts` older than 30 days
  - Log cleanup count

### Task 10.5: Cron Setup

- [ ] Register all cron jobs in `src/index.ts` (after server start):

  ```typescript
  import cron from "node-cron";

  // Email queue: every minute
  cron.schedule("* * * * *", () => emailQueueJob.run());

  // Order expiry: every 5 minutes
  cron.schedule("*/5 * * * *", () => orderExpiryJob.run());

  // Cart cleanup: daily at 2 AM
  cron.schedule("0 2 * * *", () => cartCleanupJob.run());

  // Token cleanup: daily at 3 AM
  cron.schedule("0 3 * * *", () => tokenCleanupJob.run());
  ```

---

## PHASE 11: SECURITY, OPTIMIZATION & DEPLOYMENT

### Task 11.1: Security Hardening

- [ ] **Helmet** — Security HTTP headers (X-Frame-Options, CSP, HSTS, etc.)
- [ ] **CORS** — Restrict to allowed frontend origins only
- [ ] **Rate Limiting:**
  - Auth endpoints: 5 req / 15 min per IP
  - General API: 100 req / 15 min per IP
  - Webhooks: 50 req / min
  - Inquiry/service request submission: 5 req / hour per IP
- [ ] **Input Validation** — Zod schemas on ALL endpoints (body, query, params)
- [ ] **SQL Injection Prevention** — Prisma parameterized queries (built-in)
- [ ] **XSS Prevention** — Sanitize HTML content fields (DOMPurify for rich text)
- [ ] **Account Lockout** — Lock after 5 failed login attempts for 30 minutes
- [ ] **Password Policy** — Min 8 chars, uppercase, lowercase, number
- [ ] **Token Security:**
  - Separate JWT signing keys for customer and CMS
  - Token blacklist for logout/revocation
  - Short access token expiry (1h), longer refresh (7d)
- [ ] **Webhook Security** — HMAC-SHA512 verification on Paymob callbacks
- [ ] **File Upload Security:**
  - Validate file type (whitelist: jpg, jpeg, png, webp)
  - Max file size: 5MB
  - Sanitize filenames
  - Generate unique S3 keys (UUID-based)
- [ ] **Sensitive Data:**
  - Never return password hashes in API responses
  - Mask National ID (show last 4 digits only)
  - Don't expose internal error details in production

### Task 11.2: Error Handling & Logging

- [ ] Ensure all errors flow through global error handler
- [ ] Log all errors with context (request URL, method, user ID, timestamp)
- [ ] Prisma error mapping:
  - P2002 (unique constraint) → 409 Conflict
  - P2025 (record not found) → 404 Not Found
  - P2003 (foreign key constraint) → 400 Bad Request
- [ ] Request/response logging in development
- [ ] Structured logging in production (JSON format for log aggregation)

### Task 11.3: Performance Optimization

- [ ] **Database Indexes** (in Prisma schema):
  - `Products`: index on `slug`, `brandId`, `categoryId`, `isActive`, `isFeatured`
  - `Orders`: index on `orderNumber`, `customerId`, `orderStatus`, `paymentStatus`, `createdAt`
  - `Customers`: unique on `email`, index on `phone`, `nationalId`
  - `Carts`: index on `customerId`, `sessionId`, `status`
  - `Inquiries`: index on `status`, `createdAt`
  - `ServiceRequests`: index on `status`, `serviceTypeId`, `createdAt`
  - `EmailQueue`: index on `status`, `scheduledAt`
  - `TokenBlacklist`: index on `token`, `expiresAt`
  - `LoginAttempts`: index on `email`, `createdAt`
- [ ] **Response Compression** — Use `compression` middleware for JSON responses
- [ ] **Pagination** — Enforce max `limit=50` on all list endpoints
- [ ] **Select Fields** — Use Prisma `select` to return only needed fields (avoid over-fetching)
- [ ] **Connection Pooling** — Configure Prisma connection pool (min: 2, max: 10)
- [ ] **API Response Time** — Target < 500ms for 95th percentile

### Task 11.4: Testing

- [ ] **Unit Tests** (Jest):
  - `order.service.test.ts` — Order creation, number generation, status transitions, stock deduction
  - `paymob.service.test.ts` — Auth token, order registration, payment key, HMAC verification
  - `cart.service.test.ts` — Add/update/remove items, merge, coupon application
  - `coupon.service.test.ts` — Validation logic (expired, usage limit, minimum order)
  - `email.service.test.ts` — Queue processing, retry logic
  - `hmac.test.ts` — HMAC-SHA512 computation
  - `order-number.test.ts` — LORD-YYYYMMNN format generation
  - `national-id.test.ts` — 14-digit validation
  - `slug.test.ts` — Slug generation and uniqueness

- [ ] **Integration Tests** (Supertest):
  - `auth.test.ts` — Full flow: register → verify email → login → refresh → logout
  - `products.test.ts` — Listing with filters, search, pagination, detail
  - `cart.test.ts` — Guest cart, add items, merge on login, coupon apply/remove
  - `checkout.test.ts` — Order placement (guest + authenticated), stock validation
  - `orders.test.ts` — Order lifecycle, status transitions, cancellation
  - `inquiries.test.ts` — Submit inquiry, submit service request
  - `cms-auth.test.ts` — CMS login → OTP → verify → refresh → logout
  - `cms-products.test.ts` — CRUD products, image upload
  - `cms-orders.test.ts` — List, status update, refund
  - `webhooks.test.ts` — Paymob callback HMAC verification, payment processing

### Task 11.5: Deployment Preparation

- [ ] **Environment config:**
  - Validate all required env vars on startup
  - Different configs for development, staging, production
- [ ] **Database:**
  - Run migrations: `npx prisma migrate deploy`
  - Run seeder: `npm run db:seed`
- [ ] **Build:**
  - TypeScript compilation: `npm run build`
  - Output in `dist/` directory
- [ ] **Process management:**
  - PM2 config for production (cluster mode, auto-restart)
  - Health check endpoint: `GET /api/health`
- [ ] **Monitoring:**
  - Request logging to file
  - Error tracking (Sentry recommended)
  - Uptime monitoring
- [ ] **Backup:**
  - Daily PostgreSQL backups with 30-day retention
  - Encrypted backup storage

---

## APPENDIX A: COMPLETE DATABASE SCHEMA

### Authentication & Access Tables

```prisma
model CmsUsers {
  id                  String    @id @default(uuid())
  name                String
  email               String    @unique
  passwordHash        String
  role                CmsRole   @default(CMS_STAFF) // CMS_ADMIN | CMS_STAFF
  otpCode             String?
  otpExpiresAt        DateTime?
  failedLoginAttempts Int       @default(0)
  lockedUntil         DateTime?
  isActive            Boolean   @default(true)
  lastLoginAt         DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
}

model Customers {
  id                  String    @id @default(uuid())
  name                String
  nationalId          String    // 14-digit Egyptian National ID
  email               String    @unique
  phone               String
  passwordHash        String
  emailVerified       Boolean   @default(false)
  otpCode             String?
  otpExpiresAt        DateTime?
  failedLoginAttempts Int       @default(0)
  lockedUntil         DateTime?
  isActive            Boolean   @default(true)
  lastLoginAt         DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  addresses           CustomerAddresses[]
  carts               Carts[]
  orders              Orders[]
}

model CustomerAddresses {
  id              String    @id @default(uuid())
  customerId      String
  label           String    // "Home", "Work", "Office"
  recipientName   String
  phone           String
  addressLine1    String
  addressLine2    String?
  city            String
  governorate     String
  postalCode      String?
  isDefault       Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  customer        Customers @relation(fields: [customerId], references: [id])
}

model TokenBlacklist {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model LoginAttempts {
  id        String   @id @default(uuid())
  email     String
  ipAddress String
  success   Boolean
  createdAt DateTime @default(now())
}
```

### Product Catalog Tables

```prisma
model Brands {
  id             String    @id @default(uuid())
  name           String
  slug           String    @unique
  logoUrl        String?
  certificateUrl String?
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  products       Products[]
}

model ProductCategories {
  id        String    @id @default(uuid())
  name      String
  slug      String    @unique
  icon      String?
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  products  Products[]
}

model Products {
  id              String    @id @default(uuid())
  brandId         String
  categoryId      String
  name            String
  slug            String    @unique
  modelNumber     String?
  type            String    // "Split", "Cassette", "VRF", etc.
  capacity        Int?      // BTU
  capacityUnit    String?   @default("BTU")
  eerSeer         String?
  voltage         String?
  refrigerant     String?
  dimensions      Json?     // { width, height, depth, unit }
  weight          Json?     // { indoor, outdoor, unit }
  color           String?
  description     String?   @db.Text
  features        String[]  // Array of feature strings
  specs           Json?     // Additional key-value specs
  price           Decimal   @db.Decimal(10, 2)
  originalPrice   Decimal?  @db.Decimal(10, 2)
  priceVisible    Boolean   @default(true)
  stockQuantity   Int       @default(0)
  seoTitle        String?
  seoDescription  String?
  isFeatured      Boolean   @default(false)
  isNewArrival    Boolean   @default(false)
  isBestseller    Boolean   @default(false)
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  brand           Brands             @relation(fields: [brandId], references: [id])
  category        ProductCategories  @relation(fields: [categoryId], references: [id])
  images          ProductImages[]

  @@index([slug])
  @@index([brandId])
  @@index([categoryId])
  @@index([isActive, isFeatured])
}

model ProductImages {
  id           String   @id @default(uuid())
  productId    String
  url          String
  altText      String?
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())

  product      Products @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

### Service Tables

```prisma
model ServiceTypes {
  id           String    @id @default(uuid())
  name         String
  slug         String    @unique
  icon         String?
  displayOrder Int       @default(0)
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  services     Services[]
  serviceRequests ServiceRequests[]
}

model Services {
  id              String       @id @default(uuid())
  serviceTypeId   String
  name            String
  slug            String       @unique
  description     String?      @db.Text
  scope           String?      @db.Text
  pricingType     String?      // "fixed", "starting_from", "contact"
  price           Decimal?     @db.Decimal(10, 2)
  isActive        Boolean      @default(true)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  serviceType     ServiceTypes @relation(fields: [serviceTypeId], references: [id])
}
```

### Inquiry & Request Tables

```prisma
model Inquiries {
  id          String        @id @default(uuid())
  type        InquiryType   @default(GENERAL)
  name        String
  email       String
  phone       String
  inquiryType String?       // product, general, pricing, bulk_order, other
  productId   String?
  message     String        @db.Text
  source      String        @default("website") // website, phone, whatsapp
  status      InquiryStatus @default(NEW)
  assignedTo  String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  notes       InquiryNotes[]

  @@index([status])
  @@index([createdAt])
}

model ServiceRequests {
  id                  String               @id @default(uuid())
  serviceTypeId       String
  name                String
  email               String
  phone               String
  unitBrand           String?
  unitModel           String?
  propertyType        String?              // residential, commercial, industrial
  floorNumber         Int?
  installationAddress String?
  faultDescription    String?              @db.Text
  urgency             ServiceRequestUrgency @default(NORMAL)
  deliveryAddress     String?
  preferredDate       DateTime?
  preferredTime       String?
  message             String?              @db.Text
  status              ServiceRequestStatus  @default(NEW)
  assignedTo          String?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  serviceType         ServiceTypes         @relation(fields: [serviceTypeId], references: [id])
  notes               InquiryNotes[]

  @@index([status])
  @@index([serviceTypeId])
  @@index([createdAt])
}

model InquiryNotes {
  id               String           @id @default(uuid())
  inquiryId        String?
  serviceRequestId String?
  authorId         String
  content          String           @db.Text
  createdAt        DateTime         @default(now())

  inquiry          Inquiries?       @relation(fields: [inquiryId], references: [id])
  serviceRequest   ServiceRequests? @relation(fields: [serviceRequestId], references: [id])
}
```

### Shopping Cart Tables

```prisma
model Carts {
  id         String     @id @default(uuid())
  customerId String?
  sessionId  String?
  status     CartStatus @default(ACTIVE)
  couponId   String?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt

  customer   Customers? @relation(fields: [customerId], references: [id])
  coupon     Coupons?   @relation(fields: [couponId], references: [id])
  items      CartItems[]

  @@index([customerId])
  @@index([sessionId])
  @@index([status])
}

model CartItems {
  id        String   @id @default(uuid())
  cartId    String
  productId String
  quantity  Int
  unitPrice Decimal  @db.Decimal(10, 2)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  cart      Carts    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product   Products @relation(fields: [productId], references: [id])
}
```

### Order Tables

```prisma
model Orders {
  id              String        @id @default(uuid())
  orderNumber     String        @unique // LORD-YYYYMMNN
  customerId      String?
  guestEmail      String?
  guestPhone      String?
  guestName       String?
  guestNationalId String?       // 14-digit for guest checkout
  shippingAddress Json          // JSONB snapshot of delivery address
  subtotal        Decimal       @db.Decimal(10, 2)
  shippingFee     Decimal       @db.Decimal(10, 2) @default(0)
  discount        Decimal       @db.Decimal(10, 2) @default(0)
  total           Decimal       @db.Decimal(10, 2)
  couponId        String?
  couponCode      String?
  paymentStatus   PaymentStatus @default(PENDING)
  orderStatus     OrderStatus   @default(PENDING_PAYMENT)
  trackingNumber  String?
  carrier         String?
  notes           String?       @db.Text
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  customer        Customers?    @relation(fields: [customerId], references: [id])
  coupon          Coupons?      @relation(fields: [couponId], references: [id])
  items           OrderItems[]
  statusHistory   OrderStatusHistory[]
  payments        Payments[]
  refunds         Refunds[]

  @@index([orderNumber])
  @@index([customerId])
  @@index([orderStatus])
  @@index([paymentStatus])
  @@index([createdAt])
}

model OrderItems {
  id            String   @id @default(uuid())
  orderId       String
  productId     String
  productName   String   // Snapshot at time of order
  productImage  String?  // Snapshot
  modelNumber   String?  // Snapshot
  quantity      Int
  unitPrice     Decimal  @db.Decimal(10, 2)
  lineTotal     Decimal  @db.Decimal(10, 2)
  createdAt     DateTime @default(now())

  order         Orders   @relation(fields: [orderId], references: [id])
}

model OrderStatusHistory {
  id        String      @id @default(uuid())
  orderId   String
  oldStatus OrderStatus?
  newStatus OrderStatus
  changedBy String?     // CMS user ID or "system"
  note      String?
  createdAt DateTime    @default(now())

  order     Orders      @relation(fields: [orderId], references: [id])
}
```

### Payment Tables

```prisma
model Payments {
  id                    String        @id @default(uuid())
  orderId               String
  paymobOrderId         String?
  paymobTransactionId   String?
  amount                Decimal       @db.Decimal(10, 2)
  amountPiasters        Int           // amount × 100
  currency              String        @default("EGP")
  paymentMethod         PaymentMethod?
  cardBrand             String?       // Visa, Mastercard, Meeza
  cardLastFour          String?       // Last 4 digits
  walletNumber          String?       // For mobile wallet payments
  status                PaymentStatus @default(PENDING)
  gatewayResponse       Json?         // Full Paymob response
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  order                 Orders        @relation(fields: [orderId], references: [id])
}

model Refunds {
  id              String       @id @default(uuid())
  orderId         String
  paymentId       String?
  paymobRefundId  String?
  amount          Decimal      @db.Decimal(10, 2)
  reason          String?
  status          RefundStatus @default(PENDING)
  initiatedBy     String?      // CMS user ID
  processedAt     DateTime?
  createdAt       DateTime     @default(now())

  order           Orders       @relation(fields: [orderId], references: [id])
}
```

### Promotion & Coupon Tables

```prisma
model Coupons {
  id                String       @id @default(uuid())
  code              String       @unique
  discountType      DiscountType // PERCENTAGE | FIXED
  discountValue     Decimal      @db.Decimal(10, 2)
  minimumOrderAmount Decimal?    @db.Decimal(10, 2)
  maxUsage          Int?
  usageCount        Int          @default(0)
  validFrom         DateTime?
  validUntil        DateTime?
  isActive          Boolean      @default(true)
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt

  usages            CouponUsage[]
  carts             Carts[]
  orders            Orders[]
}

model CouponUsage {
  id              String   @id @default(uuid())
  couponId        String
  orderId         String
  customerId      String?
  discountApplied Decimal  @db.Decimal(10, 2)
  createdAt       DateTime @default(now())

  coupon          Coupons  @relation(fields: [couponId], references: [id])
}
```

### Content & CMS Tables

```prisma
model ContentPages {
  id             String   @id @default(uuid())
  pageKey        String   @unique // "home", "about", "contact"
  title          String
  contentJson    Json     // Flexible page content structure
  seoTitle       String?
  seoDescription String?
  isPublished    Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model SiteSettings {
  id        String   @id @default(uuid())
  key       String   @unique // "contact_phone", "shipping_fee", "paymob_api_key", etc.
  valueJson Json     // Flexible value storage
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Testimonials {
  id           String   @id @default(uuid())
  customerName String
  location     String?
  content      String   @db.Text
  rating       Int      // 1-5
  productId    String?
  isApproved   Boolean  @default(false)
  isFeatured   Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Promotions {
  id            String       @id @default(uuid())
  title         String
  imageUrl      String?
  linkUrl       String?
  discountType  DiscountType?
  discountValue Decimal?     @db.Decimal(10, 2)
  productId     String?
  startDate     DateTime?
  endDate       DateTime?
  isActive      Boolean      @default(true)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model FAQs {
  id           String   @id @default(uuid())
  question     String
  answer       String   @db.Text
  category     String   // "General", "Ordering", "Installation", "Payment", "Warranty"
  displayOrder Int      @default(0)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Communication Tables

```prisma
model EmailQueue {
  id               String      @id @default(uuid())
  recipient        String
  subject          String
  bodyHtml         String?     @db.Text
  templateName     String?
  templateVarsJson Json?
  status           EmailStatus @default(PENDING) // PENDING | SENT | FAILED
  attempts         Int         @default(0)
  maxAttempts      Int         @default(3)
  errorMessage     String?
  scheduledAt      DateTime    @default(now())
  sentAt           DateTime?
  createdAt        DateTime    @default(now())

  @@index([status, scheduledAt])
}
```

---

## APPENDIX B: API ENDPOINT REFERENCE

### Public Website APIs (No Auth)

| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| GET    | /api/products               | Product listing with filters |
| GET    | /api/products/count         | Product count with filters   |
| GET    | /api/products/:slug         | Product detail               |
| GET    | /api/products/:slug/related | Related products             |
| GET    | /api/brands                 | Active brands list           |
| GET    | /api/product-categories     | Active categories list       |
| GET    | /api/services               | Active services list         |
| GET    | /api/services/:slug         | Service detail               |
| GET    | /api/service-types          | Service types list           |
| GET    | /api/content/:pageKey       | Content page by key          |
| GET    | /api/testimonials           | Approved testimonials        |
| GET    | /api/faqs                   | Active FAQs                  |
| GET    | /api/promotions             | Active promotions            |
| GET    | /api/settings/contact       | Contact info                 |
| GET    | /api/settings/site          | Site settings                |
| GET    | /api/settings/shipping      | Shipping settings            |
| POST   | /api/inquiries              | Submit product inquiry       |
| POST   | /api/service-requests       | Submit service request       |

### Customer Auth APIs

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| POST   | /api/auth/register            | Register new customer   |
| POST   | /api/auth/login               | Customer login          |
| POST   | /api/auth/verify-email        | Verify email with OTP   |
| POST   | /api/auth/resend-verification | Resend verification OTP |
| POST   | /api/auth/forgot-password     | Request password reset  |
| POST   | /api/auth/reset-password      | Reset password with OTP |
| POST   | /api/auth/refresh-token       | Refresh access token    |
| POST   | /api/auth/logout              | Customer logout         |

### Customer Account APIs (Auth Required)

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | /api/account/profile         | Get customer profile    |
| PUT    | /api/account/profile         | Update customer profile |
| PUT    | /api/account/change-password | Change password         |
| GET    | /api/account/addresses       | List addresses          |
| POST   | /api/account/addresses       | Add address (max 10)    |
| PUT    | /api/account/addresses/:id   | Update address          |
| DELETE | /api/account/addresses/:id   | Delete address          |
| GET    | /api/account/orders          | List customer orders    |
| GET    | /api/account/orders/:id      | Order detail            |

### Cart APIs (Session or Auth)

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | /api/cart               | Get current cart          |
| POST   | /api/cart/items         | Add item to cart          |
| PUT    | /api/cart/items/:itemId | Update item quantity      |
| DELETE | /api/cart/items/:itemId | Remove item from cart     |
| POST   | /api/cart/coupon        | Apply coupon to cart      |
| DELETE | /api/cart/coupon        | Remove coupon from cart   |
| POST   | /api/cart/merge         | Merge guest cart on login |

### Checkout & Payment APIs

| Method | Endpoint              | Description                          |
| ------ | --------------------- | ------------------------------------ |
| POST   | /api/orders           | Place order (guest or authenticated) |
| POST   | /api/orders/:id/pay   | Initiate Paymob payment              |
| POST   | /api/coupons/validate | Validate coupon code                 |
| POST   | /api/webhooks/paymob  | Paymob callback (no auth)            |

### CMS Auth APIs

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| POST   | /api/cms/auth/login           | CMS login (returns OTP prompt) |
| POST   | /api/cms/auth/verify-otp      | Verify OTP to complete login   |
| POST   | /api/cms/auth/refresh         | Refresh CMS access token       |
| POST   | /api/cms/auth/logout          | CMS logout (blacklist tokens)  |
| POST   | /api/cms/auth/forgot-password | Request CMS password reset     |
| POST   | /api/cms/auth/reset-password  | Reset CMS password with OTP    |

### CMS Management APIs (CMS Auth Required)

| Method | Endpoint                             | Description                      |
| ------ | ------------------------------------ | -------------------------------- |
| GET    | /api/cms/dashboard                   | Dashboard stats & charts         |
| GET    | /api/cms/products                    | List all products                |
| GET    | /api/cms/products/:id                | Product detail                   |
| POST   | /api/cms/products                    | Create product                   |
| PUT    | /api/cms/products/:id                | Update product                   |
| DELETE | /api/cms/products/:id                | Deactivate product               |
| POST   | /api/cms/products/:id/images         | Upload product images            |
| DELETE | /api/cms/products/:id/images/:imgId  | Delete product image             |
| PUT    | /api/cms/products/:id/images/reorder | Reorder product images           |
| PUT    | /api/cms/products/bulk               | Bulk activate/deactivate         |
| GET    | /api/cms/brands                      | List brands                      |
| POST   | /api/cms/brands                      | Create brand                     |
| PUT    | /api/cms/brands/:id                  | Update brand                     |
| DELETE | /api/cms/brands/:id                  | Deactivate brand                 |
| GET    | /api/cms/product-categories          | List categories                  |
| POST   | /api/cms/product-categories          | Create category                  |
| PUT    | /api/cms/product-categories/:id      | Update category                  |
| DELETE | /api/cms/product-categories/:id      | Deactivate category              |
| GET    | /api/cms/services                    | List services                    |
| POST   | /api/cms/services                    | Create service                   |
| PUT    | /api/cms/services/:id                | Update service                   |
| DELETE | /api/cms/services/:id                | Deactivate service               |
| GET    | /api/cms/service-types               | List service types               |
| POST   | /api/cms/service-types               | Create service type              |
| PUT    | /api/cms/service-types/:id           | Update service type              |
| DELETE | /api/cms/service-types/:id           | Deactivate service type          |
| GET    | /api/cms/inquiries                   | List inquiries                   |
| GET    | /api/cms/inquiries/:id               | Inquiry detail                   |
| PUT    | /api/cms/inquiries/:id               | Update inquiry status            |
| POST   | /api/cms/inquiries/:id/notes         | Add inquiry note                 |
| GET    | /api/cms/inquiries/export            | Export inquiries CSV             |
| GET    | /api/cms/service-requests            | List service requests            |
| GET    | /api/cms/service-requests/:id        | Service request detail           |
| PUT    | /api/cms/service-requests/:id        | Update service request status    |
| POST   | /api/cms/service-requests/:id/notes  | Add service request note         |
| GET    | /api/cms/service-requests/export     | Export service requests CSV      |
| GET    | /api/cms/orders                      | List orders                      |
| GET    | /api/cms/orders/:id                  | Order detail                     |
| PUT    | /api/cms/orders/:id/status           | Update order status              |
| PUT    | /api/cms/orders/:id/shipping         | Update shipping info             |
| POST   | /api/cms/orders/:id/refund           | Process refund                   |
| POST   | /api/cms/orders/:id/notes            | Add order note                   |
| GET    | /api/cms/orders/export               | Export orders CSV                |
| GET    | /api/cms/orders/stats                | Order statistics                 |
| GET    | /api/cms/customers                   | List customers                   |
| GET    | /api/cms/customers/:id               | Customer detail                  |
| PUT    | /api/cms/customers/:id               | Update customer status           |
| GET    | /api/cms/coupons                     | List coupons                     |
| GET    | /api/cms/coupons/:id                 | Coupon detail                    |
| POST   | /api/cms/coupons                     | Create coupon                    |
| PUT    | /api/cms/coupons/:id                 | Update coupon                    |
| DELETE | /api/cms/coupons/:id                 | Deactivate coupon                |
| GET    | /api/cms/content                     | List content pages               |
| GET    | /api/cms/content/:id                 | Content page detail              |
| POST   | /api/cms/content                     | Create content page              |
| PUT    | /api/cms/content/:id                 | Update content page              |
| DELETE | /api/cms/content/:id                 | Delete/unpublish content page    |
| GET    | /api/cms/settings                    | Get all settings                 |
| PUT    | /api/cms/settings                    | Update settings                  |
| GET    | /api/cms/testimonials                | List testimonials                |
| POST   | /api/cms/testimonials                | Create testimonial               |
| PUT    | /api/cms/testimonials/:id            | Update testimonial               |
| DELETE | /api/cms/testimonials/:id            | Delete testimonial               |
| GET    | /api/cms/promotions                  | List promotions                  |
| POST   | /api/cms/promotions                  | Create promotion                 |
| PUT    | /api/cms/promotions/:id              | Update promotion                 |
| DELETE | /api/cms/promotions/:id              | Delete promotion                 |
| GET    | /api/cms/faqs                        | List FAQs                        |
| POST   | /api/cms/faqs                        | Create FAQ                       |
| PUT    | /api/cms/faqs/:id                    | Update FAQ                       |
| DELETE | /api/cms/faqs/:id                    | Delete FAQ                       |
| PUT    | /api/cms/faqs/reorder                | Reorder FAQs                     |
| GET    | /api/cms/users                       | List CMS users (admin only)      |
| GET    | /api/cms/users/:id                   | CMS user detail (admin only)     |
| POST   | /api/cms/users                       | Create CMS user (admin only)     |
| PUT    | /api/cms/users/:id                   | Update CMS user (admin only)     |
| DELETE | /api/cms/users/:id                   | Deactivate CMS user (admin only) |

---

## APPENDIX C: ENUMS & CONSTANTS

```typescript
// Order Status
enum OrderStatus {
  PENDING_PAYMENT = "pending_payment",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

// Payment Status
enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

// Refund Status
enum RefundStatus {
  PENDING = "pending",
  PROCESSED = "processed",
  FAILED = "failed",
}

// Inquiry Status
enum InquiryStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
}

// Service Request Status
enum ServiceRequestStatus {
  NEW = "new",
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

// Cart Status
enum CartStatus {
  ACTIVE = "active",
  CONVERTED = "converted",
  ABANDONED = "abandoned",
}

// CMS User Role
enum CmsRole {
  CMS_ADMIN = "cms_admin",
  CMS_STAFF = "cms_staff",
}

// Inquiry Type
enum InquiryType {
  PRODUCT = "product",
  GENERAL = "general",
  PRICING = "pricing",
  BULK_ORDER = "bulk_order",
  OTHER = "other",
}

// Service Request Urgency
enum ServiceRequestUrgency {
  NORMAL = "normal",
  URGENT = "urgent",
  EMERGENCY = "emergency",
}

// Discount Type
enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

// Payment Method
enum PaymentMethod {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  MOBILE_WALLET = "mobile_wallet",
  INSTALLMENT = "installment",
}

// Email Status
enum EmailStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
}
```

### Constants

```typescript
// Order number format
const ORDER_NUMBER_PREFIX = "LORD";
const ORDER_NUMBER_FORMAT = "LORD-YYYYMMNN"; // e.g., LORD-20250101

// Currency
const CURRENCY = "EGP";
const PIASTERS_MULTIPLIER = 100; // EGP → piasters for Paymob

// Auth
const BCRYPT_SALT_ROUNDS = 10;
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 30;
const MAX_ADDRESSES_PER_CUSTOMER = 10;

// Customer JWT
const CUSTOMER_ACCESS_TOKEN_EXPIRY = "1h";
const CUSTOMER_REFRESH_TOKEN_EXPIRY = "7d";

// CMS JWT
const CMS_ACCESS_TOKEN_EXPIRY = "1h";
const CMS_REFRESH_TOKEN_EXPIRY = "7d";

// National ID
const NATIONAL_ID_LENGTH = 14;

// File Upload
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_PRODUCT_IMAGES = 10;

// Pagination
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

// Cron Timings
const ORDER_EXPIRY_MINUTES = 30;
const ABANDONED_CART_DAYS = 30;
const EMAIL_QUEUE_INTERVAL = "* * * * *"; // Every 1 minute
const ORDER_EXPIRY_INTERVAL = "*/5 * * * *"; // Every 5 minutes
const CART_CLEANUP_INTERVAL = "0 2 * * *"; // Daily at 2 AM
const TOKEN_CLEANUP_INTERVAL = "0 3 * * *"; // Daily at 3 AM

// Paymob
const PAYMOB_BASE_URL = "https://accept.paymob.com/api";
const PAYMOB_AUTH_ENDPOINT = "/auth/tokens";
const PAYMOB_ORDER_ENDPOINT = "/ecommerce/orders";
const PAYMOB_PAYMENT_KEY_ENDPOINT = "/acceptance/payment_keys";
```

---

## APPENDIX D: CRITICAL REMINDERS

### Must-Follow Rules

1. **Paymob is the ONLY payment gateway** — No Stripe, PayPal, Moyasar, or TAP
2. **Currency is EGP** (Egyptian Pounds) — Paymob amounts are in piasters (×100)
3. **Separate JWT signing keys** for customer and CMS authentication
4. **CMS login requires 2FA** (email OTP after password verification)
5. **National ID is required** at customer registration (14-digit Egyptian ID) and guest checkout
6. **Order number format:** `LORD-YYYYMMNN` (year-month-sequential)
7. **Stock deduction uses optimistic locking** — atomic UPDATE with WHERE clause
8. **Unpaid orders auto-cancel after 30 minutes** (cron job)
9. **Abandoned carts clean up after 30 days** (cron job)
10. **Cart merge on login** — guest cart items merge into customer cart
11. **Webhook HMAC verification is mandatory** — HMAC-SHA512 on Paymob callbacks
12. **No SMS/Twilio** — Email only for notifications
13. **No file storage on local disk** — Use AWS S3 for all uploads
14. **Password hashing:** bcrypt with salt rounds 10
15. **Email queue with retry** — max 3 attempts per email
16. **Shipping address stored as JSONB** on order (snapshot, not reference)
17. **Product data snapshotted in OrderItems** — name, image, modelNumber at time of order
18. **Max 10 addresses per customer**
19. **Token blacklist** — check on every CMS authenticated request
20. **Mask National ID** in API responses (show last 4 digits only)

### Technology Stack Summary

| Component    | Technology                                       |
| ------------ | ------------------------------------------------ |
| Runtime      | Node.js 20+                                      |
| Framework    | Express 4                                        |
| Language     | TypeScript (strict mode)                         |
| ORM          | Prisma                                           |
| Database     | PostgreSQL 15+                                   |
| Auth         | JWT (jsonwebtoken) + bcrypt                      |
| Validation   | Zod                                              |
| Payment      | Paymob Accept (cards, wallets, installments)     |
| Email        | Nodemailer (SMTP / SendGrid / Mailgun / AWS SES) |
| File Storage | AWS S3 (@aws-sdk/client-s3)                      |
| File Upload  | Multer (memory storage → S3)                     |
| Cron Jobs    | node-cron                                        |
| Security     | helmet, cors, express-rate-limit                 |
| Logging      | Winston / Pino + Morgan                          |
| Testing      | Jest + Supertest + ts-jest                       |
| Dev Tools    | nodemon, ts-node, ESLint, Prettier               |

### API Response Standards

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "message": "Products fetched successfully"
}

// Paginated response
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 48,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Products fetched successfully"
}

// Error response
{
  "success": false,
  "message": "Product not found",
  "errorCode": "PRODUCT_NOT_FOUND"
}

// Validation error response
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "nationalId", "message": "National ID must be exactly 14 digits" }
  ]
}
```
