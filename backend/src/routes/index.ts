import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { cmsAuth } from "../middleware/cms-auth.middleware.js";
import { customerAuth } from "../middleware/customer-auth.middleware.js";
import { authLimiter, webhookLimiter } from "../middleware/rate-limit.middleware.js";
import { ApiError } from "../utils/api-error.js";
import { created, paginated, success } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { hmacSha512, safeCompare } from "../utils/hmac.js";
import { isValidNationalId, maskNationalId } from "../utils/national-id.js";
import { generateOrderNumber } from "../utils/order-number.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";
import { slugify } from "../utils/slug.js";
import {
  signCmsAccessToken,
  signCmsRefreshToken,
  signCustomerAccessToken,
  signCustomerRefreshToken,
} from "../utils/token.js";
import { paymobConfig } from "../config/paymob.js";

const router = Router();
const db = prisma as any;

const idParam = z.object({ id: z.string().uuid() });
const listQuery = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
});

function parseId(req: { params: unknown }) {
  return idParam.parse(req.params).id;
}

function parseListQuery(req: { query: unknown }) {
  return listQuery.parse(req.query);
}

function boolQuery(value: unknown) {
  if (value === undefined) return undefined;
  return value === "true" || value === true;
}

function decimalNumber(value: unknown) {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const autoSlugConfig: Record<string, { field: string; source: string }> = {
  brands: { field: "slug", source: "name" },
  productCategories: { field: "slug", source: "name" },
  products: { field: "slug", source: "name" },
  serviceTypes: { field: "slug", source: "name" },
  services: { field: "slug", source: "name" },
  promotions: { field: "slug", source: "title" },
  contentPages: { field: "pageKey", source: "title" },
};

async function getUniqueSlug(model: string, field: string, source: string) {
  const base = slugify(source) || "item";
  let candidate = base;
  let suffix = 2;

  while (await db[model].findUnique({ where: { [field]: candidate } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function prepareCmsCreateData(model: string, body: Record<string, unknown>) {
  const data = { ...body };
  const config = autoSlugConfig[model];
  const hasSlug = config && typeof data[config.field] === "string" && String(data[config.field]).trim();
  const source = config && typeof data[config.source] === "string" ? String(data[config.source]) : "";

  if (config && !hasSlug && source.trim()) {
    data[config.field] = await getUniqueSlug(model, config.field, source);
  }

  return data;
}

function publicList(model: string, defaultWhere: Record<string, unknown> = {}) {
  return asyncHandler(async (req, res) => {
    const { page, limit, skip, take } = getPagination(req.query);
    const where = { ...defaultWhere };
    const [items, total] = await Promise.all([
      db[model].findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
      db[model].count({ where }),
    ]);
    return paginated(res, items, getPaginationMeta(page, limit, total), "Fetched successfully");
  });
}

function cmsCrud(
  model: string,
  options: {
    searchFields?: string[];
    softDelete?: boolean;
    orderBy?: Record<string, "asc" | "desc">;
    include?: Record<string, boolean>;
    serialize?: (item: any) => any;
  } = {},
) {
  const crud = Router();
  crud.use(cmsAuth);

  crud.get(
    "/",
    asyncHandler(async (req, res) => {
      const query = parseListQuery(req);
      const { page, limit, skip, take } = getPagination(query);
      const search = query.search?.trim();
      const where = search && options.searchFields?.length
        ? {
            OR: options.searchFields.map((field) => ({
              [field]: { contains: search, mode: "insensitive" },
            })),
          }
        : {};
      const [items, total] = await Promise.all([
        db[model].findMany({
          where,
          skip,
          take,
          orderBy: options.orderBy ?? { createdAt: "desc" },
          ...(options.include ? { include: options.include } : {}),
        }),
        db[model].count({ where }),
      ]);
      return paginated(
        res,
        options.serialize ? items.map(options.serialize) : items,
        getPaginationMeta(page, limit, total),
        "Fetched successfully",
      );
    }),
  );

  crud.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const item = await db[model].findUnique({
        where: { id: parseId(req) },
        ...(options.include ? { include: options.include } : {}),
      });
      if (!item) throw ApiError.notFound();
      return success(res, options.serialize ? options.serialize(item) : item);
    }),
  );

  crud.post(
    "/",
    asyncHandler(async (req, res) => {
      const item = await db[model].create({
        data: await prepareCmsCreateData(model, req.body),
      });
      return created(res, item);
    }),
  );

  crud.put(
    "/:id",
    asyncHandler(async (req, res) => {
      const item = await db[model].update({ where: { id: parseId(req) }, data: req.body });
      return success(res, item, "Updated successfully");
    }),
  );

  crud.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const item = await db[model].update({ where: { id: parseId(req) }, data: req.body });
      return success(res, item, "Updated successfully");
    }),
  );

  crud.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const id = parseId(req);
      const item = options.softDelete
        ? await db[model].update({ where: { id }, data: { isActive: false } })
        : await db[model].delete({ where: { id } });
      return success(res, item, "Deleted successfully");
    }),
  );

  return crud;
}

router.get("/health", (_req, res) => {
  res.json({ success: true, data: { service: "lord-backend", status: "ok" } });
});

router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const { page, limit, skip, take } = getPagination(req.query);
    const brand = typeof req.query.brand === "string" ? req.query.brand.split(",").filter(Boolean) : undefined;
    const type = typeof req.query.type === "string" ? req.query.type.split(",").filter(Boolean) : undefined;
    const hp = typeof req.query.hp === "string" ? req.query.hp.split(",").map(Number).filter(Number.isFinite) : undefined;
    const where: any = { isActive: boolQuery(req.query.active) ?? true };

    if (brand?.length) where.brand = { slug: { in: brand } };
    if (type?.length) where.OR = type.map((item) => ({ type: { equals: item, mode: "insensitive" } }));
    if (req.query.featured !== undefined) where.isFeatured = boolQuery(req.query.featured);
    if (req.query.capacityMin || req.query.capacityMax) {
      where.capacity = {
        gte: decimalNumber(req.query.capacityMin),
        lte: decimalNumber(req.query.capacityMax),
      };
    }
    if (hp?.length) where.horsepower = { in: hp };
    if (req.query.hpMin || req.query.hpMax) {
      where.horsepower = {
        ...(where.horsepower ?? {}),
        gte: decimalNumber(req.query.hpMin),
        lte: decimalNumber(req.query.hpMax),
      };
    }
    if (req.query.priceMin || req.query.priceMax) {
      where.price = {
        gte: decimalNumber(req.query.priceMin),
        lte: decimalNumber(req.query.priceMax),
      };
    }
    if (typeof req.query.search === "string" && req.query.search.trim()) {
      where.OR = [
        { name: { contains: req.query.search, mode: "insensitive" } },
        { modelNumber: { contains: req.query.search, mode: "insensitive" } },
        { description: { contains: req.query.search, mode: "insensitive" } },
      ];
    }

    const sort = String(req.query.sort ?? "newest");
    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
          ? { price: "desc" as const }
          : sort === "name_asc"
            ? { name: "asc" as const }
            : { createdAt: "desc" as const };

    const [items, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          brand: true,
          category: true,
          images: { orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }], take: 1 },
        },
      }),
      prisma.products.count({ where }),
    ]);

    return paginated(res, items, getPaginationMeta(page, limit, total), "Products fetched successfully");
  }),
);

router.get("/products/count", asyncHandler(async (req, res) => success(res, { count: await prisma.products.count({ where: { isActive: true } }) })));
router.get("/products/:slug", asyncHandler(async (req, res) => {
  const slug = String(req.params.slug);
  const product = await prisma.products.findUnique({
    where: { slug },
    include: { brand: true, category: true, images: { orderBy: { displayOrder: "asc" } } },
  });
  if (!product) throw ApiError.notFound("Product not found");
  return success(res, product);
}));
router.get("/products/:slug/related", asyncHandler(async (req, res) => {
  const product = await prisma.products.findUnique({ where: { slug: String(req.params.slug) } });
  if (!product) throw ApiError.notFound("Product not found");
  const related = await prisma.products.findMany({
    where: {
      id: { not: product.id },
      isActive: true,
      OR: [{ brandId: product.brandId }, { categoryId: product.categoryId }],
    },
    take: Number(req.query.limit ?? 4),
    include: { brand: true, category: true, images: { take: 1 } },
  });
  return success(res, related);
}));

router.get("/brands", publicList("brands", { isActive: true }));
router.get("/product-categories", publicList("productCategories", { isActive: true }));
function serializeService(service: any) {
  const content =
    service.content && typeof service.content === "object" ? service.content : {};

  return {
    ...service,
    _id: service.id,
    serviceType: service.serviceType,
    inclusions: Array.isArray(content.bullets) ? content.bullets : [],
    inclusionsAr: Array.isArray(content.bulletsAr) ? content.bulletsAr : [],
  };
}

router.get(
  "/services",
  asyncHandler(async (req, res) => {
    const services = await prisma.services.findMany({
      where: { isActive: true },
      include: { serviceType: true },
      orderBy: { sortOrder: "asc" },
    });
    return success(res, services.map(serializeService), "Services fetched successfully");
  }),
);
router.get("/service-types", publicList("serviceTypes", { isActive: true }));
router.get("/testimonials", publicList("testimonials", { isApproved: true }));
router.get("/faqs", asyncHandler(async (req, res) => {
  const where: any = { isActive: true };
  if (typeof req.query.category === "string") where.category = req.query.category;
  const items = await prisma.faqs.findMany({ where, orderBy: [{ category: "asc" }, { displayOrder: "asc" }] });
  return success(res, items);
}));
router.get("/promotions", publicList("promotions", { isActive: true }));
router.get("/content/:pageKey", asyncHandler(async (req, res) => {
  const page = await prisma.contentPages.findUnique({ where: { pageKey: String(req.params.pageKey) } });
  if (!page || !page.isActive) throw ApiError.notFound("Content page not found");
  return success(res, page);
}));
router.get("/settings/:group", asyncHandler(async (req, res) => {
  const group = String(req.params.group);
  if (!["contact", "site"].includes(group)) throw ApiError.notFound();
  const settings = await prisma.siteSettings.findMany({ where: { group } });
  return success(res, Object.fromEntries(settings.map((setting) => [setting.key, setting.value])));
}));
router.get("/shipping/options", asyncHandler(async (req, res) => {
  const governorate = String(req.query.governorate ?? "");
  const city = String(req.query.city ?? "");
  const subtotal = Number(req.query.subtotal ?? 0);
  const zones = await prisma.shippingZones.findMany({ where: { isActive: true } });
  const zone = zones.find((item) => item.governorates.includes(governorate) || item.cities.includes(city)) ?? zones[0];
  const methods = await prisma.shippingMethods.findMany({ where: { isActive: true }, orderBy: { isRecommended: "desc" } });
  const baseFee = Number(zone?.fee ?? 0);
  const freeThreshold = zone?.freeShippingThreshold ? Number(zone.freeShippingThreshold) : undefined;
  const isFree = freeThreshold !== undefined && subtotal >= freeThreshold;
  return success(res, {
    zone,
    options: methods.map((method) => ({
      id: method.id,
      name: method.name,
      code: method.code,
      description: method.description,
      fee: isFree ? 0 : baseFee + Number(method.feeModifier),
      estimatedDelivery: method.estimatedLabel ?? (zone ? `${zone.estimatedDaysMin ?? 3}-${zone.estimatedDaysMax ?? 5} days` : "3-5 days"),
      isRecommended: method.isRecommended,
      freeShippingEligible: isFree,
    })),
  });
}));

router.post("/inquiries", asyncHandler(async (req, res) => created(res, await prisma.inquiries.create({ data: req.body }))));
router.post("/service-requests", asyncHandler(async (req, res) => created(res, await prisma.serviceRequests.create({ data: req.body }))));

router.post("/auth/register", authLimiter, asyncHandler(async (req, res) => {
  const body = z.object({
    name: z.string().min(2),
    nationalId: z.string().refine(isValidNationalId, "National ID must be exactly 14 digits"),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(8),
  }).parse(req.body);
  const customer = await prisma.customers.create({
    data: { ...body, passwordHash: await hashPassword(body.password), password: undefined },
  } as any);
  return created(res, { id: customer.id, email: customer.email, nationalId: maskNationalId(customer.nationalId) });
}));

router.post("/auth/login", authLimiter, asyncHandler(async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
  const customer = await prisma.customers.findUnique({ where: { email: body.email } });
  if (!customer || !(await comparePassword(body.password, customer.passwordHash))) throw ApiError.unauthorized("Invalid email or password");
  const payload = { customerId: customer.id, role: "customer" };
  return success(res, {
    accessToken: signCustomerAccessToken(payload),
    refreshToken: signCustomerRefreshToken(payload),
    customer: { id: customer.id, name: customer.name, email: customer.email },
  });
}));

router.get("/account/profile", customerAuth, asyncHandler(async (req, res) => {
  const customer = await prisma.customers.findUnique({ where: { id: req.customer!.id } });
  return success(res, customer && { ...customer, passwordHash: undefined });
}));
router.put("/account/profile", customerAuth, asyncHandler(async (req, res) => success(res, await prisma.customers.update({ where: { id: req.customer!.id }, data: req.body }))));
const addressRouter = Router();
addressRouter.use(customerAuth);
addressRouter.get("/", asyncHandler(async (req, res) => success(res, await prisma.customerAddresses.findMany({ where: { customerId: req.customer!.id } }))));
addressRouter.post("/", asyncHandler(async (req, res) => created(res, await prisma.customerAddresses.create({ data: { ...req.body, customerId: req.customer!.id } }))));
addressRouter.put("/:id", asyncHandler(async (req, res) => success(res, await prisma.customerAddresses.update({ where: { id: parseId(req) }, data: req.body }))));
addressRouter.delete("/:id", asyncHandler(async (req, res) => success(res, await prisma.customerAddresses.delete({ where: { id: parseId(req) } }))));
addressRouter.patch("/:id/default", asyncHandler(async (req, res) => {
  await prisma.customerAddresses.updateMany({ where: { customerId: req.customer!.id }, data: { isDefault: false } });
  return success(res, await prisma.customerAddresses.update({ where: { id: parseId(req) }, data: { isDefault: true } }));
}));
router.use("/account/addresses", addressRouter);
router.get("/account/orders", customerAuth, asyncHandler(async (req, res) => success(res, await prisma.orders.findMany({ where: { customerId: req.customer!.id }, include: { items: true } }))));
router.get("/account/orders/:id", customerAuth, asyncHandler(async (req, res) => {
  const order = await prisma.orders.findFirst({ where: { id: parseId(req), customerId: req.customer!.id }, include: { items: true, payments: true, statusHistory: true } });
  if (!order) throw ApiError.notFound();
  return success(res, order);
}));

router.post("/cms/auth/login", authLimiter, asyncHandler(async (req, res) => {
  const body = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
  const user = await prisma.cmsUsers.findUnique({ where: { email: body.email } });
  if (!user || !(await comparePassword(body.password, user.passwordHash))) throw ApiError.unauthorized("Invalid email or password");
  const payload = { cmsUserId: user.id, role: user.role };
  return success(res, {
    accessToken: signCmsAccessToken(payload),
    refreshToken: signCmsRefreshToken(payload),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}));

router.use("/cms/products", cmsCrud("products", { searchFields: ["name", "modelNumber"], softDelete: true }));
router.use("/cms/brands", cmsCrud("brands", { searchFields: ["name"], softDelete: true }));
router.use("/cms/product-categories", cmsCrud("productCategories", { searchFields: ["name"], softDelete: true }));
router.use(
  "/cms/services",
  cmsCrud("services", {
    searchFields: ["name"],
    softDelete: true,
    orderBy: { sortOrder: "asc" },
    include: { serviceType: true },
    serialize: (service) => ({
      ...service,
      type: service.serviceType,
    }),
  }),
);
router.use(
  "/cms/service-types",
  cmsCrud("serviceTypes", {
    searchFields: ["name"],
    softDelete: true,
    orderBy: { name: "asc" },
  }),
);
router.use("/cms/coupons", cmsCrud("coupons", { searchFields: ["code"], softDelete: true }));
router.use("/cms/content", cmsCrud("contentPages", { searchFields: ["title", "pageKey"], softDelete: true }));
router.use("/cms/testimonials", cmsCrud("testimonials", { searchFields: ["customerName"], softDelete: false }));
router.use("/cms/promotions", cmsCrud("promotions", { searchFields: ["title"], softDelete: true }));
router.use("/cms/faqs", cmsCrud("faqs", { searchFields: ["question", "category"], softDelete: true }));
router.use("/cms/shipping/zones", cmsCrud("shippingZones", { searchFields: ["name"], softDelete: true }));
router.use("/cms/shipping/methods", cmsCrud("shippingMethods", { searchFields: ["name", "code"], softDelete: true }));
router.use("/cms/users", cmsCrud("cmsUsers", { searchFields: ["name", "email"], softDelete: true }));

router.get("/cms/dashboard", cmsAuth, asyncHandler(async (_req, res) => {
  const [totalOrders, totalCustomers, totalProducts, recentOrders] = await Promise.all([
    prisma.orders.count(),
    prisma.customers.count(),
    prisma.products.count(),
    prisma.orders.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { items: true } }),
  ]);
  return success(res, { totalOrders, totalCustomers, totalProducts, recentOrders });
}));

function startOfDay(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

router.get("/cms/dashboard/stats", cmsAuth, asyncHandler(async (_req, res) => {
  const today = startOfDay();
  const yesterday = startOfDay(new Date(today.getTime() - 24 * 60 * 60 * 1000));
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const [
    revenueToday,
    revenueYesterday,
    newOrdersToday,
    pendingOrders,
    totalProducts,
    totalCustomers,
    newInquiriesToday,
    outOfStockCount,
    products,
  ] = await Promise.all([
    prisma.orders.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", createdAt: { gte: today, lt: tomorrow } },
    }),
    prisma.orders.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", createdAt: { gte: yesterday, lt: today } },
    }),
    prisma.orders.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.orders.count({ where: { orderStatus: { in: ["PENDING_PAYMENT", "CONFIRMED", "PROCESSING"] } } }),
    prisma.products.count(),
    prisma.customers.count(),
    prisma.inquiries.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
    prisma.products.count({ where: { stockQuantity: { lte: 0 } } }),
    prisma.products.findMany({ select: { brand: { select: { name: true } } } }),
  ]);

  return success(res, {
    revenueToday: Number(revenueToday._sum.total ?? 0),
    revenueYesterday: Number(revenueYesterday._sum.total ?? 0),
    newOrdersToday,
    pendingOrders,
    totalProducts,
    totalCustomers,
    newInquiriesToday,
    outOfStockCount,
    carrierProducts: products.filter((product) => product.brand.name.toLowerCase() === "carrier").length,
    mideaProducts: products.filter((product) => product.brand.name.toLowerCase() === "midea").length,
  });
}));

router.get("/cms/dashboard/revenue", cmsAuth, asyncHandler(async (req, res) => {
  const period = String(req.query.period ?? "30d");
  const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const end = startOfDay();
  end.setDate(end.getDate() + 1);
  const start = startOfDay(new Date(end.getTime() - days * 24 * 60 * 60 * 1000));

  const orders = await prisma.orders.findMany({
    where: { paymentStatus: "PAID", createdAt: { gte: start, lt: end } },
    select: { createdAt: true, total: true },
  });

  const revenueByDate = new Map<string, number>();
  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    revenueByDate.set(date.toISOString().slice(0, 10), 0);
  }
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    revenueByDate.set(key, (revenueByDate.get(key) ?? 0) + Number(order.total));
  }

  return success(
    res,
    Array.from(revenueByDate, ([date, revenue]) => ({ date, revenue })),
  );
}));

router.get("/cms/dashboard/recent-orders", cmsAuth, asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit ?? 5) || 5, 1), 20);
  const orders = await prisma.orders.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: true, payments: true },
  });
  return success(res, orders);
}));

router.get("/cms/dashboard/latest-inquiries", cmsAuth, asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit ?? 5) || 5, 1), 20);
  const inquiries = await prisma.inquiries.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { notes: true },
  });
  return success(res, inquiries);
}));

router.use("/cms/inquiries", cmsCrud("inquiries", { searchFields: ["name", "email", "phone"], softDelete: false }));
router.use("/cms/service-requests", cmsCrud("serviceRequests", { searchFields: ["name", "email", "phone"], softDelete: false }));
router.use("/cms/customers", cmsCrud("customers", { searchFields: ["name", "email", "phone", "nationalId"], softDelete: true }));
router.use("/cms/orders", cmsAuth);
router.get("/cms/orders", asyncHandler(async (req, res) => {
  const { page, limit, skip, take } = getPagination(req.query);
  const where: any = {};
  if (req.query.status && req.query.status !== "all") where.orderStatus = String(req.query.status).toUpperCase();
  const [items, total] = await Promise.all([
    prisma.orders.findMany({ where, skip, take, orderBy: { createdAt: "desc" }, include: { items: true, payments: true } }),
    prisma.orders.count({ where }),
  ]);
  return paginated(res, items, getPaginationMeta(page, limit, total));
}));
router.post("/cms/orders", asyncHandler(async (req, res) => created(res, await prisma.orders.create({ data: { ...req.body, orderNumber: await generateOrderNumber() } }))));
router.get("/cms/orders/:id", asyncHandler(async (req, res) => {
  const order = await prisma.orders.findUnique({ where: { id: parseId(req) }, include: { items: true, payments: true, refunds: true, statusHistory: true, customer: true } });
  if (!order) throw ApiError.notFound();
  return success(res, order);
}));
router.put("/cms/orders/:id", asyncHandler(async (req, res) => success(res, await prisma.orders.update({ where: { id: parseId(req) }, data: req.body }))));
router.put("/cms/orders/:id/status", asyncHandler(async (req, res) => {
  const body = z.object({
    status: z.enum(["pending_payment", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
    note: z.string().optional(),
  }).parse(req.body);
  const current = await prisma.orders.findUniqueOrThrow({ where: { id: parseId(req) } });
  const updated = await prisma.orders.update({ where: { id: current.id }, data: { orderStatus: body.status.toUpperCase() as any } });
  await prisma.orderStatusHistory.create({ data: { orderId: current.id, oldStatus: current.orderStatus, newStatus: updated.orderStatus, note: body.note, changedBy: req.cmsUser?.id } });
  return success(res, updated);
}));
router.put("/cms/orders/:id/payment-status", asyncHandler(async (req, res) => {
  const body = z.object({
    status: z.enum(["pending", "paid", "failed", "refunded"]),
  }).parse(req.body);
  const current = await prisma.orders.findUniqueOrThrow({ where: { id: parseId(req) } });
  const updated = await prisma.orders.update({
    where: { id: current.id },
    data: { paymentStatus: body.status.toUpperCase() as any },
  });
  await prisma.payments.updateMany({
    where: { orderId: current.id },
    data: { status: body.status.toUpperCase() as any },
  });
  return success(res, updated);
}));
router.put("/cms/orders/:id/shipping", asyncHandler(async (req, res) => success(res, await prisma.orders.update({ where: { id: parseId(req) }, data: { ...req.body, orderStatus: "SHIPPED" } }))));
router.post("/cms/orders/:id/notes", asyncHandler(async (req, res) => success(res, await prisma.orderStatusHistory.create({ data: { orderId: parseId(req), newStatus: "PROCESSING", note: String(req.body.content ?? ""), changedBy: req.cmsUser?.id } }))));
router.post("/cms/orders/:id/refund", asyncHandler(async (req, res) => created(res, await prisma.refunds.create({ data: { orderId: parseId(req), amount: req.body.amount, reason: req.body.reason, initiatedBy: req.cmsUser?.id } }))));
router.delete("/cms/orders/:id", asyncHandler(async (req, res) => success(res, await prisma.orders.update({ where: { id: parseId(req) }, data: { archivedAt: new Date() } }))));

router.get("/cms/settings/:group", cmsAuth, asyncHandler(async (req, res) => success(res, await prisma.siteSettings.findMany({ where: { group: String(req.params.group) } }))));
router.put("/cms/settings/:group", cmsAuth, asyncHandler(async (req, res) => {
  const group = String(req.params.group);
  const entries = Object.entries(req.body as Record<string, unknown>);
  const updates = await Promise.all(entries.map(([key, value]) =>
    prisma.siteSettings.upsert({ where: { key }, update: { value: value as any, group }, create: { key, value: value as any, group } }),
  ));
  return success(res, updates);
}));

router.post("/orders", asyncHandler(async (req, res) => created(res, await prisma.orders.create({ data: { ...req.body, orderNumber: await generateOrderNumber() } }))));
router.post("/orders/:id/pay", asyncHandler(async (req, res) => {
  const order = await prisma.orders.findUniqueOrThrow({ where: { id: parseId(req) } });
  const payment = await prisma.payments.create({
    data: {
      orderId: order.id,
      amount: order.total,
      amountPiasters: Math.round(Number(order.total) * 100),
      paymentMethod: String(req.body.paymentMethod ?? "CREDIT_CARD").toUpperCase() as any,
    },
  });
  return success(res, {
    paymentId: payment.id,
    paymobConfigured: Boolean(paymobConfig.apiKey),
    iframeId: paymobConfig.iframeId,
    iframeUrl: paymobConfig.iframeId ? `https://accept.paymob.com/api/acceptance/iframes/${paymobConfig.iframeId}` : null,
  });
}));
router.post("/coupons/validate", asyncHandler(async (req, res) => {
  const coupon = await prisma.coupons.findUnique({ where: { code: String(req.body.code ?? "").toUpperCase() } });
  if (!coupon || !coupon.isActive) throw ApiError.notFound("Coupon not found");
  return success(res, coupon);
}));
router.post("/webhooks/paymob", webhookLimiter, asyncHandler(async (req, res) => {
  if (paymobConfig.hmacSecret && req.query.hmac) {
    const expected = hmacSha512(JSON.stringify(req.body), paymobConfig.hmacSecret);
    if (!safeCompare(expected, String(req.query.hmac))) throw ApiError.forbidden("Invalid Paymob signature");
  }
  return success(res, { received: true });
}));

export default router;
