# Backend — Files & Folders Structure

> **Project:** Lord — Authorized Carrier & Midea AC Dealer E-Commerce Platform  
> **Last Updated:** 2025-01-20  
> **Stack:** Node.js 20+, Express 4, TypeScript, Prisma ORM, PostgreSQL 15+

---

```
lord-backend/
│
├── .env                               # Environment variables (DO NOT COMMIT)
├── .env.example                       # Example environment variables template
├── .gitignore                         # Git ignore rules
├── .eslintrc.json                     # ESLint configuration
├── .prettierrc                        # Prettier configuration
├── tsconfig.json                      # TypeScript compiler options
├── jest.config.ts                     # Jest test configuration
├── nodemon.json                       # Nodemon dev server config
├── package.json                       # Dependencies & scripts
├── README.md                          # Project setup & API documentation
│
├── prisma/
│   ├── schema.prisma                  # Prisma schema — all 29 tables
│   ├── seed.ts                        # Database seeder (brands, categories, service types, admin user, default settings)
│   └── migrations/                    # Auto-generated Prisma migration files
│
├── src/
│   ├── index.ts                       # Entry point — Express app bootstrap & server start
│   ├── app.ts                         # Express app configuration (middleware stack, route mounting, error handler)
│   │
│   ├── config/
│   │   ├── index.ts                   # Central config loader (env vars, defaults, validation)
│   │   ├── database.ts                # Prisma client singleton & connection
│   │   ├── cors.ts                    # CORS allowed origins & options
│   │   ├── paymob.ts                  # Paymob API key, integration IDs, HMAC secret, iframe ID
│   │   ├── email.ts                   # SMTP / mail transport configuration
│   │   ├── s3.ts                      # AWS S3 bucket, region, credentials
│   │   └── jwt.ts                     # JWT secrets (customer + CMS), expiry durations
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts         # JWT verification — extracts & validates token, attaches user to req
│   │   ├── customer-auth.middleware.ts # Customer-specific JWT auth (customer signing key)
│   │   ├── cms-auth.middleware.ts     # CMS-specific JWT auth (CMS signing key)
│   │   ├── role.middleware.ts         # RBAC guard — checks user role (cms_admin, cms_staff)
│   │   ├── validation.middleware.ts   # Zod schema validation for req.body / req.query / req.params
│   │   ├── upload.middleware.ts       # Multer config for file uploads (images, documents)
│   │   ├── rate-limit.middleware.ts   # Rate limiting (express-rate-limit) — per-route configs
│   │   ├── error.middleware.ts        # Global error handler — formats error responses
│   │   └── request-logger.middleware.ts # Request logging (morgan / custom)
│   │
│   ├── routes/
│   │   ├── index.ts                   # Root router — mounts all route groups
│   │   │
│   │   ├── public/                    # Public API routes (no auth required)
│   │   │   ├── products.routes.ts     # GET /api/products, /api/products/:slug, /api/products/:slug/related
│   │   │   ├── brands.routes.ts       # GET /api/brands
│   │   │   ├── categories.routes.ts   # GET /api/product-categories
│   │   │   ├── services.routes.ts     # GET /api/services, /api/services/:slug, /api/service-types
│   │   │   ├── content.routes.ts      # GET /api/content/:pageKey (home, about, contact)
│   │   │   ├── testimonials.routes.ts # GET /api/testimonials
│   │   │   ├── faqs.routes.ts         # GET /api/faqs
│   │   │   ├── promotions.routes.ts   # GET /api/promotions
│   │   │   ├── settings.routes.ts     # GET /api/settings/contact, /api/settings/site, /api/settings/shipping
│   │   │   ├── inquiries.routes.ts    # POST /api/inquiries
│   │   │   └── service-requests.routes.ts  # POST /api/service-requests
│   │   │
│   │   ├── auth/                      # Customer authentication routes
│   │   │   └── auth.routes.ts         # POST /api/auth/register, /login, /verify-email, /resend-verification, /forgot-password, /reset-password, /refresh-token, /logout
│   │   │
│   │   ├── customer/                  # Authenticated customer routes
│   │   │   ├── account.routes.ts      # GET|PUT /api/account/profile, change-password
│   │   │   ├── addresses.routes.ts    # CRUD /api/account/addresses
│   │   │   └── orders.routes.ts       # GET /api/account/orders, /api/account/orders/:id
│   │   │
│   │   ├── cart/                      # Shopping cart routes (session or auth)
│   │   │   └── cart.routes.ts         # GET|POST|PUT|DELETE /api/cart, /api/cart/items, /api/cart/coupon, /api/cart/merge
│   │   │
│   │   ├── checkout/                  # Checkout & payment routes
│   │   │   ├── orders.routes.ts       # POST /api/orders (place order)
│   │   │   ├── payments.routes.ts     # POST /api/orders/:id/pay (initiate Paymob payment)
│   │   │   └── coupons.routes.ts      # POST /api/coupons/validate
│   │   │
│   │   ├── webhooks/                  # External service webhooks
│   │   │   └── paymob.routes.ts       # POST /api/webhooks/paymob (Paymob callback — HMAC verified)
│   │   │
│   │   └── cms/                       # CMS Panel routes (CMS auth required)
│   │       ├── cms-auth.routes.ts     # POST /api/cms/auth/login, /logout, /refresh, /forgot-password, /reset-password, /verify-otp
│   │       ├── dashboard.routes.ts    # GET /api/cms/dashboard (stats, charts, recent activity)
│   │       ├── products.routes.ts     # CRUD /api/cms/products, bulk actions, image upload
│   │       ├── brands.routes.ts       # CRUD /api/cms/brands, logo/certificate upload
│   │       ├── categories.routes.ts   # CRUD /api/cms/product-categories
│   │       ├── services.routes.ts     # CRUD /api/cms/services
│   │       ├── service-types.routes.ts # CRUD /api/cms/service-types
│   │       ├── inquiries.routes.ts    # GET|PUT /api/cms/inquiries, notes, export
│   │       ├── service-requests.routes.ts # GET|PUT /api/cms/service-requests, notes, export
│   │       ├── orders.routes.ts       # GET|PUT /api/cms/orders, status, refund, notes, export, stats
│   │       ├── customers.routes.ts    # GET|PUT /api/cms/customers
│   │       ├── coupons.routes.ts      # CRUD /api/cms/coupons
│   │       ├── content.routes.ts      # CRUD /api/cms/content (ContentPages)
│   │       ├── testimonials.routes.ts # CRUD /api/cms/testimonials
│   │       ├── promotions.routes.ts   # CRUD /api/cms/promotions
│   │       ├── faqs.routes.ts         # CRUD /api/cms/faqs
│   │       ├── settings.routes.ts     # GET|PUT /api/cms/settings (all settings tabs)
│   │       └── cms-users.routes.ts    # CRUD /api/cms/users (admin only — manage CMS staff)
│   │
│   ├── controllers/
│   │   ├── public/
│   │   │   ├── products.controller.ts      # Product listing, detail, related products, count
│   │   │   ├── brands.controller.ts        # Brand listing (active brands)
│   │   │   ├── categories.controller.ts    # Category listing (active categories)
│   │   │   ├── services.controller.ts      # Service listing, detail, service types
│   │   │   ├── content.controller.ts       # Content pages (home, about, contact)
│   │   │   ├── testimonials.controller.ts  # Approved & featured testimonials
│   │   │   ├── faqs.controller.ts          # Active FAQs grouped by category
│   │   │   ├── promotions.controller.ts    # Active promotions (within date range)
│   │   │   ├── settings.controller.ts      # Public site settings (contact, site info, shipping)
│   │   │   ├── inquiries.controller.ts     # Submit product inquiry
│   │   │   └── service-requests.controller.ts # Submit service request
│   │   │
│   │   ├── auth/
│   │   │   └── auth.controller.ts          # Customer register, login, verify email, forgot/reset password, refresh, logout
│   │   │
│   │   ├── customer/
│   │   │   ├── account.controller.ts       # Customer profile get/update, change password
│   │   │   ├── addresses.controller.ts     # CRUD customer addresses (max 10)
│   │   │   └── orders.controller.ts        # Customer order history, order detail
│   │   │
│   │   ├── cart/
│   │   │   └── cart.controller.ts          # Cart CRUD, add/update/remove items, apply/remove coupon, merge on login
│   │   │
│   │   ├── checkout/
│   │   │   ├── orders.controller.ts        # Place order (guest + authenticated), stock validation
│   │   │   ├── payments.controller.ts      # Initiate Paymob payment, get payment key
│   │   │   └── coupons.controller.ts       # Validate coupon code
│   │   │
│   │   ├── webhooks/
│   │   │   └── paymob.controller.ts        # Handle Paymob callback — HMAC verification, update payment & order status
│   │   │
│   │   └── cms/
│   │       ├── cms-auth.controller.ts      # CMS login, logout, refresh, forgot/reset password, verify OTP
│   │       ├── dashboard.controller.ts     # Dashboard stats (orders, revenue, customers, products, inquiries)
│   │       ├── products.controller.ts      # CRUD products, image management, bulk activate/deactivate
│   │       ├── brands.controller.ts        # CRUD brands, logo & certificate upload
│   │       ├── categories.controller.ts    # CRUD product categories
│   │       ├── services.controller.ts      # CRUD services
│   │       ├── service-types.controller.ts # CRUD service types
│   │       ├── inquiries.controller.ts     # List, view, update status, add notes, export CSV
│   │       ├── service-requests.controller.ts # List, view, update status, add notes, export CSV
│   │       ├── orders.controller.ts        # List, view, update status, process refund, add notes, export, stats
│   │       ├── customers.controller.ts     # List, view, update status (activate/deactivate)
│   │       ├── coupons.controller.ts       # CRUD coupons
│   │       ├── content.controller.ts       # CRUD content pages (home, about, contact page content)
│   │       ├── testimonials.controller.ts  # CRUD testimonials, approve/reject, feature/unfeature
│   │       ├── promotions.controller.ts    # CRUD promotions
│   │       ├── faqs.controller.ts          # CRUD FAQs, reorder
│   │       ├── settings.controller.ts      # Get/update all settings tabs (general, contact, email, SEO, Paymob, shipping, social)
│   │       └── cms-users.controller.ts     # CRUD CMS users (admin only)
│   │
│   ├── services/
│   │   ├── product.service.ts         # Product business logic — listing, filtering, search, stock checks
│   │   ├── brand.service.ts           # Brand CRUD operations
│   │   ├── category.service.ts        # Category CRUD operations
│   │   ├── service.service.ts         # Service & ServiceType business logic
│   │   ├── inquiry.service.ts         # Inquiry & ServiceRequest business logic, status transitions
│   │   ├── cart.service.ts            # Cart operations — add, update, remove, merge, coupon application
│   │   ├── order.service.ts           # Order creation, status updates, stock deduction (optimistic locking), order number generation (LORD-YYYYMMNN)
│   │   ├── payment.service.ts         # Payment record management, status updates
│   │   ├── paymob.service.ts          # Paymob API integration — auth token, order registration, payment key, refund, HMAC verification
│   │   ├── customer.service.ts        # Customer CRUD, profile management
│   │   ├── customer-auth.service.ts   # Customer auth logic — register, login, email verification, password reset, token management
│   │   ├── cms-auth.service.ts        # CMS auth logic — login, OTP, password reset, token management
│   │   ├── coupon.service.ts          # Coupon validation, usage tracking
│   │   ├── content.service.ts         # ContentPages & SiteSettings CRUD
│   │   ├── testimonial.service.ts     # Testimonial CRUD, approval workflow
│   │   ├── promotion.service.ts       # Promotion CRUD, date-range filtering
│   │   ├── faq.service.ts             # FAQ CRUD, category grouping, reorder
│   │   ├── dashboard.service.ts       # Dashboard aggregations — revenue, order counts, top products, recent activity
│   │   ├── email.service.ts           # Email queue processing — enqueue, send via Nodemailer, retry logic
│   │   ├── s3.service.ts              # AWS S3 file upload, delete, signed URL generation
│   │   └── export.service.ts          # CSV/Excel export for orders, inquiries, service requests
│   │
│   ├── validators/
│   │   ├── product.validator.ts       # Zod schemas for product create/update, query params
│   │   ├── brand.validator.ts         # Zod schemas for brand create/update
│   │   ├── category.validator.ts      # Zod schemas for category create/update
│   │   ├── service.validator.ts       # Zod schemas for service & service type create/update
│   │   ├── inquiry.validator.ts       # Zod schemas for inquiry submission
│   │   ├── service-request.validator.ts # Zod schemas for service request submission
│   │   ├── cart.validator.ts          # Zod schemas for cart item add/update, coupon apply
│   │   ├── order.validator.ts         # Zod schemas for order placement (guest + authenticated)
│   │   ├── customer-auth.validator.ts # Zod schemas for register (incl. nationalId 14 digits), login, verify, reset
│   │   ├── customer.validator.ts      # Zod schemas for profile update, address CRUD
│   │   ├── cms-auth.validator.ts      # Zod schemas for CMS login, OTP, password reset
│   │   ├── coupon.validator.ts        # Zod schemas for coupon create/update, validate
│   │   ├── content.validator.ts       # Zod schemas for content page create/update
│   │   ├── testimonial.validator.ts   # Zod schemas for testimonial create/update
│   │   ├── promotion.validator.ts     # Zod schemas for promotion create/update
│   │   ├── faq.validator.ts           # Zod schemas for FAQ create/update
│   │   ├── settings.validator.ts      # Zod schemas for each settings tab
│   │   └── common.validator.ts        # Shared schemas — pagination, UUID, slug, phone, email
│   │
│   ├── utils/
│   │   ├── api-error.ts               # Custom ApiError class with status code & error code
│   │   ├── api-response.ts            # Standardized JSON response wrapper { success, data, message, pagination }
│   │   ├── async-handler.ts           # Express async route handler wrapper (catches errors)
│   │   ├── pagination.ts             # Pagination helper — parse page/limit, build meta
│   │   ├── slug.ts                    # Slug generation & uniqueness check
│   │   ├── token.ts                   # JWT sign/verify helpers (separate customer & CMS functions)
│   │   ├── hash.ts                    # bcrypt hash & compare helpers (salt rounds 10)
│   │   ├── otp.ts                     # OTP generation (6-digit numeric) & expiry calculation
│   │   ├── order-number.ts            # Order number generator: LORD-YYYYMMNN format
│   │   ├── national-id.ts            # National ID validation (14-digit Egyptian national ID)
│   │   ├── hmac.ts                    # HMAC-SHA512 computation for Paymob webhook verification
│   │   ├── file-upload.ts            # File type validation, size limits, filename sanitization
│   │   ├── date.ts                    # Date formatting & timezone helpers
│   │   └── logger.ts                  # Winston / Pino logger configuration
│   │
│   ├── types/
│   │   ├── express.d.ts               # Express Request augmentation (user, file, pagination)
│   │   ├── enums.ts                   # Shared enums — OrderStatus, PaymentStatus, InquiryStatus, UserRole, etc.
│   │   ├── paymob.types.ts            # Paymob API request/response type definitions
│   │   ├── email.types.ts             # Email template types & payload interfaces
│   │   └── common.types.ts            # Shared interfaces — PaginationMeta, ApiResponse, FilterParams
│   │
│   ├── templates/
│   │   └── email/
│   │       ├── base.template.ts       # Base HTML email layout (Lord branding, header, footer)
│   │       ├── order-confirmation.template.ts   # Order placed successfully
│   │       ├── payment-receipt.template.ts      # Payment successful with Paymob details
│   │       ├── order-shipped.template.ts        # Order shipped with tracking info
│   │       ├── order-delivered.template.ts      # Order delivered confirmation
│   │       ├── refund-notification.template.ts  # Refund processed notification
│   │       ├── inquiry-acknowledgement.template.ts   # Inquiry/service request received
│   │       ├── inquiry-status-update.template.ts     # Inquiry status changed
│   │       ├── welcome.template.ts              # Customer registration welcome
│   │       ├── email-verification.template.ts   # Email verification link/code
│   │       ├── password-reset.template.ts       # Password reset link
│   │       └── staff-notification.template.ts   # New order/inquiry alert for Lord staff
│   │
│   └── jobs/
│       ├── email-queue.job.ts         # Cron: Process email queue — send pending emails (every 1 minute)
│       ├── order-expiry.job.ts        # Cron: Auto-cancel unpaid orders after 30 minutes
│       ├── cart-cleanup.job.ts        # Cron: Delete abandoned carts older than 30 days
│       └── token-cleanup.job.ts       # Cron: Remove expired tokens from TokenBlacklist
│
├── tests/
│   ├── setup.ts                       # Jest global setup — test DB, Prisma client
│   ├── helpers/
│   │   ├── auth.helper.ts             # Generate test JWT tokens (customer + CMS)
│   │   ├── factory.ts                 # Test data factories (products, orders, customers, etc.)
│   │   └── db.helper.ts              # Test DB reset & seed helpers
│   ├── unit/
│   │   ├── services/
│   │   │   ├── order.service.test.ts
│   │   │   ├── paymob.service.test.ts
│   │   │   ├── cart.service.test.ts
│   │   │   ├── coupon.service.test.ts
│   │   │   └── email.service.test.ts
│   │   ├── utils/
│   │   │   ├── hmac.test.ts
│   │   │   ├── order-number.test.ts
│   │   │   ├── national-id.test.ts
│   │   │   └── slug.test.ts
│   │   └── validators/
│   │       ├── order.validator.test.ts
│   │       └── customer-auth.validator.test.ts
│   └── integration/
│       ├── auth.test.ts               # Customer auth flow (register → verify → login → refresh → logout)
│       ├── products.test.ts           # Product listing, filtering, detail
│       ├── cart.test.ts               # Cart operations, merge, coupon
│       ├── checkout.test.ts           # Order placement, Paymob integration
│       ├── orders.test.ts             # Order lifecycle, status transitions
│       ├── inquiries.test.ts          # Inquiry & service request submission
│       ├── cms-auth.test.ts           # CMS auth flow
│       ├── cms-products.test.ts       # CMS product management
│       ├── cms-orders.test.ts         # CMS order management
│       └── webhooks.test.ts           # Paymob webhook handling
│
└── docs/
    ├── api.md                         # Full API endpoint reference
    └── paymob-integration.md          # Paymob Accept integration guide
```

---

## Environment Variables (.env.example)

```env
# ── Server ──
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

# ── Database ──
DATABASE_URL=postgresql://user:password@localhost:5432/lord_db

# ── JWT (Separate keys for customer & CMS) ──
JWT_CUSTOMER_SECRET=your-customer-jwt-secret
JWT_CUSTOMER_EXPIRY=1h
JWT_CUSTOMER_REFRESH_SECRET=your-customer-refresh-secret
JWT_CUSTOMER_REFRESH_EXPIRY=7d
JWT_CMS_SECRET=your-cms-jwt-secret
JWT_CMS_EXPIRY=1h
JWT_CMS_REFRESH_SECRET=your-cms-refresh-secret
JWT_CMS_REFRESH_EXPIRY=7d

# ── Paymob Accept ──
PAYMOB_API_KEY=your-paymob-api-key
PAYMOB_INTEGRATION_ID_CARD=your-card-integration-id
PAYMOB_INTEGRATION_ID_WALLET=your-wallet-integration-id
PAYMOB_INTEGRATION_ID_INSTALLMENT=your-installment-integration-id
PAYMOB_HMAC_SECRET=your-hmac-secret
PAYMOB_IFRAME_ID=your-iframe-id

# ── Email (SMTP) ──
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
SMTP_FROM_NAME=Lord AC
SMTP_FROM_EMAIL=noreply@lord-ac.com
STAFF_NOTIFICATION_EMAIL=info@lord-ac.com

# ── AWS S3 ──
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=lord-uploads
AWS_S3_REGION=me-south-1

# ── CORS ──
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# ── Rate Limiting ──
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## NPM Scripts (package.json)

```json
{
  "scripts": {
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:prod": "prisma migrate deploy",
    "db:seed": "ts-node prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "lint": "eslint src/ --ext .ts",
    "lint:fix": "eslint src/ --ext .ts --fix",
    "format": "prettier --write src/",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Key Dependencies

| Package            | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| express            | HTTP server framework                               |
| typescript         | Type safety                                         |
| @prisma/client     | Database ORM client                                 |
| prisma             | Schema management & migrations (dev dependency)     |
| jsonwebtoken       | JWT token generation & verification                 |
| bcryptjs           | Password hashing (salt rounds 10)                   |
| zod                | Request validation schemas                          |
| multer             | File upload handling (multipart/form-data)          |
| @aws-sdk/client-s3 | AWS S3 file storage                                 |
| nodemailer         | Email sending (SMTP / SendGrid / Mailgun / SES)     |
| helmet             | Security HTTP headers                               |
| cors               | Cross-Origin Resource Sharing                       |
| express-rate-limit | Rate limiting                                       |
| morgan             | HTTP request logging                                |
| winston / pino     | Application logging                                 |
| node-cron          | Scheduled jobs (email queue, order expiry, cleanup) |
| dotenv             | Environment variable loading                        |
| nodemon            | Development auto-restart (dev dependency)           |
| ts-node            | TypeScript execution (dev dependency)               |
| jest               | Test runner (dev dependency)                        |
| @types/jest        | Jest type definitions (dev dependency)              |
| supertest          | HTTP integration testing (dev dependency)           |
| @types/supertest   | Supertest type definitions (dev dependency)         |
| eslint             | Code linting (dev dependency)                       |
| prettier           | Code formatting (dev dependency)                    |
