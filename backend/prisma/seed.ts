import {
  CartStatus,
  InquiryStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import { hashPassword } from "../src/utils/hash.js";
import { slugify } from "../src/utils/slug.js";

const prisma = new PrismaClient();

const productImage =
  "https://placehold.co/900x900/172041/0DBACA?text=Lord+AC";

type SeedProduct = {
  brandSlug: string;
  categorySlug: string;
  name: string;
  nameAr: string;
  modelNumber: string;
  type: string;
  capacity: number;
  horsepower: string;
  price: string;
  originalPrice?: string;
  stockQuantity: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
};

async function upsertSiteSetting(key: string, group: string, value: Prisma.InputJsonValue) {
  return prisma.siteSettings.upsert({
    where: { key },
    update: { group, value },
    create: { key, group, value },
  });
}

async function clearSeedData() {
  await prisma.emailQueue.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.refunds.deleteMany();
  await prisma.payments.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItems.deleteMany();
  await prisma.orders.deleteMany();
  await prisma.cartItems.deleteMany();
  await prisma.carts.deleteMany();
  await prisma.customerAddresses.deleteMany();
  await prisma.customers.deleteMany();
  await prisma.productImages.deleteMany();
  await prisma.products.deleteMany();
  await prisma.services.deleteMany();
  await prisma.serviceTypes.deleteMany();
  await prisma.inquiryNotes.deleteMany();
  await prisma.inquiries.deleteMany();
  await prisma.serviceRequestNotes.deleteMany();
  await prisma.serviceRequests.deleteMany();
  await prisma.testimonials.deleteMany();
  await prisma.promotions.deleteMany();
  await prisma.faqs.deleteMany();
  await prisma.contentPages.deleteMany();
  await prisma.shippingMethods.deleteMany();
  await prisma.shippingZones.deleteMany();
  await prisma.coupons.deleteMany();
  await prisma.brands.deleteMany();
  await prisma.productCategories.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.cmsUsers.deleteMany();
}

async function seedBrands() {
  const brands = [
    {
      name: "Carrier",
      nameAr: "كاريير",
      slug: "carrier",
      logoUrl: "https://placehold.co/240x100/172041/ffffff?text=Carrier",
      description: "Premium residential and commercial cooling systems.",
      descriptionAr: "أنظمة تبريد مميزة للمنازل والمشروعات التجارية.",
    },
    {
      name: "Midea",
      nameAr: "ميديا",
      slug: "midea",
      logoUrl: "https://placehold.co/240x100/0DBACA/ffffff?text=Midea",
      description: "Efficient AC units with strong value for homes and offices.",
      descriptionAr: "وحدات تكييف موفرة بقيمة ممتازة للمنازل والمكاتب.",
    },
    {
      name: "Sharp",
      nameAr: "شارب",
      slug: "sharp",
      logoUrl: "https://placehold.co/240x100/1A1A2E/ffffff?text=Sharp",
      description: "Reliable cooling products for Egyptian weather.",
      descriptionAr: "منتجات تبريد موثوقة تناسب الطقس المصري.",
    },
    {
      name: "Tornado",
      nameAr: "تورنيدو",
      slug: "tornado",
      logoUrl: "https://placehold.co/240x100/4DB8D4/172041?text=Tornado",
      description: "Affordable air conditioning for everyday use.",
      descriptionAr: "تكييف اقتصادي للاستخدام اليومي.",
    },
  ];

  for (const brand of brands) {
    await prisma.brands.upsert({
      where: { slug: brand.slug },
      update: { ...brand, isActive: true },
      create: { ...brand, isActive: true },
    });
  }
}

async function seedCategories() {
  const categories = [
    {
      name: "Split Unit",
      nameAr: "تكييف سبليت",
      slug: "split",
      icon: "Wind",
      description: "Wall-mounted split air conditioners.",
      descriptionAr: "تكييفات سبليت مثبتة على الحائط.",
      sortOrder: 1,
    },
    {
      name: "Cassette",
      nameAr: "كاسيت",
      slug: "cassette",
      icon: "Square",
      description: "Ceiling cassette units for offices and shops.",
      descriptionAr: "وحدات كاسيت سقفية للمكاتب والمتاجر.",
      sortOrder: 2,
    },
    {
      name: "Duct",
      nameAr: "دكت",
      slug: "duct",
      icon: "Layers",
      description: "Concealed ducted cooling systems.",
      descriptionAr: "أنظمة تبريد دكت مخفية.",
      sortOrder: 3,
    },
    {
      name: "Central",
      nameAr: "مركزي",
      slug: "central",
      icon: "Building",
      description: "Central cooling systems for large spaces.",
      descriptionAr: "أنظمة تبريد مركزية للمساحات الكبيرة.",
      sortOrder: 4,
    },
    {
      name: "Portable",
      nameAr: "متنقل",
      slug: "portable",
      icon: "Package",
      description: "Portable air conditioners for flexible cooling.",
      descriptionAr: "تكييفات متنقلة لتبريد مرن.",
      sortOrder: 5,
    },
  ];

  for (const category of categories) {
    await prisma.productCategories.upsert({
      where: { slug: category.slug },
      update: { ...category, isActive: true },
      create: { ...category, isActive: true },
    });
  }
}

async function seedProducts() {
  const brands = await prisma.brands.findMany();
  const categories = await prisma.productCategories.findMany();
  const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

  const products: SeedProduct[] = [
    {
      brandSlug: "carrier",
      categorySlug: "split",
      name: "Carrier Optimax Pro 24K",
      nameAr: "كاريير أوبتيماكس برو 24 ألف",
      modelNumber: "42QHF024",
      type: "Split",
      capacity: 24000,
      horsepower: "3.00",
      price: "55200",
      originalPrice: "58900",
      stockQuantity: 14,
      isFeatured: true,
      isBestseller: true,
    },
    {
      brandSlug: "carrier",
      categorySlug: "cassette",
      name: "Carrier Ceiling Cassette 36K",
      nameAr: "كاريير كاسيت سقفي 36 ألف",
      modelNumber: "40MBCQ36",
      type: "Cassette",
      capacity: 36000,
      horsepower: "4.50",
      price: "81200",
      stockQuantity: 5,
      isFeatured: true,
    },
    {
      brandSlug: "midea",
      categorySlug: "split",
      name: "Midea Mission Inverter 18K",
      nameAr: "ميديا ميشن انفرتر 18 ألف",
      modelNumber: "MSAGBU-18HRFN",
      type: "Split",
      capacity: 18000,
      horsepower: "2.25",
      price: "26900",
      originalPrice: "28750",
      stockQuantity: 18,
      isFeatured: true,
      isNewArrival: true,
    },
    {
      brandSlug: "midea",
      categorySlug: "duct",
      name: "Midea Ducted Inverter 48K",
      nameAr: "ميديا دكت انفرتر 48 ألف",
      modelNumber: "MTI-48HR",
      type: "Duct",
      capacity: 48000,
      horsepower: "5.00",
      price: "94400",
      stockQuantity: 3,
    },
    {
      brandSlug: "sharp",
      categorySlug: "split",
      name: "Sharp Plasmacluster Cool 12K",
      nameAr: "شارب بلازما كلاستر 12 ألف",
      modelNumber: "AY-XP12YHE",
      type: "Split",
      capacity: 12000,
      horsepower: "1.50",
      price: "21400",
      stockQuantity: 21,
      isBestseller: true,
    },
    {
      brandSlug: "sharp",
      categorySlug: "central",
      name: "Sharp Central Cooling 60K",
      nameAr: "شارب تبريد مركزي 60 ألف",
      modelNumber: "SCC-60HR",
      type: "Central",
      capacity: 60000,
      horsepower: "7.50",
      price: "128500",
      stockQuantity: 2,
    },
    {
      brandSlug: "tornado",
      categorySlug: "split",
      name: "Tornado Digital 12K",
      nameAr: "تورنيدو ديجيتال 12 ألف",
      modelNumber: "TH-C12YEE",
      type: "Split",
      capacity: 12000,
      horsepower: "1.50",
      price: "18750",
      stockQuantity: 0,
      isNewArrival: true,
    },
    {
      brandSlug: "tornado",
      categorySlug: "portable",
      name: "Tornado Portable 10K",
      nameAr: "تورنيدو متنقل 10 آلاف",
      modelNumber: "TPH-C10",
      type: "Portable",
      capacity: 10000,
      horsepower: "1.25",
      price: "15900",
      stockQuantity: 8,
    },
  ];

  for (const product of products) {
    const brand = brandBySlug.get(product.brandSlug);
    const category = categoryBySlug.get(product.categorySlug);
    if (!brand || !category) {
      throw new Error(`Missing brand/category for ${product.name}`);
    }

    const slug = slugify(product.name);
    const record = await prisma.products.upsert({
      where: { slug },
      update: {
        brandId: brand.id,
        categoryId: category.id,
        name: product.name,
        nameAr: product.nameAr,
        modelNumber: product.modelNumber,
        type: product.type,
        capacity: product.capacity,
        capacityUnit: "BTU",
        horsepower: product.horsepower,
        eerSeer: "EER 11.5",
        voltage: "220-240V",
        refrigerant: "R410A",
        dimensions: { indoor: "1080 x 336 x 226 mm", outdoor: "845 x 702 x 363 mm" },
        weight: { indoor: "14 kg", outdoor: "46 kg" },
        color: "White",
        description: `${product.name} with efficient cooling, quiet operation, and Lord AC installation support.`,
        descriptionAr: `${product.nameAr} بتبريد فعال وتشغيل هادئ ودعم تركيب من لورد للتكييف.`,
        features: [
          "Fast cooling",
          "Low noise operation",
          "Energy saving mode",
          "Auto restart",
        ],
        featuresAr: [
          "تبريد سريع",
          "تشغيل منخفض الضوضاء",
          "وضع توفير الطاقة",
          "إعادة تشغيل تلقائية",
        ],
        specs: {
          capacity: `${product.capacity.toLocaleString()} BTU`,
          horsepower: `${product.horsepower} HP`,
          warranty: "5 years compressor warranty",
          warrantyAr: "ضمان الضاغط لمدة 5 سنوات",
        },
        price: product.price,
        originalPrice: product.originalPrice ?? null,
        priceVisible: true,
        stockQuantity: product.stockQuantity,
        isFeatured: product.isFeatured ?? false,
        isNewArrival: product.isNewArrival ?? false,
        isBestseller: product.isBestseller ?? false,
        isActive: true,
        seo: {
          title: product.name,
          titleAr: product.nameAr,
          description: `Buy ${product.name} from Lord AC in Egypt.`,
          descriptionAr: `اشتر ${product.nameAr} من لورد للتكييف في مصر.`,
        },
      },
      create: {
        brandId: brand.id,
        categoryId: category.id,
        name: product.name,
        nameAr: product.nameAr,
        slug,
        modelNumber: product.modelNumber,
        type: product.type,
        capacity: product.capacity,
        capacityUnit: "BTU",
        horsepower: product.horsepower,
        eerSeer: "EER 11.5",
        voltage: "220-240V",
        refrigerant: "R410A",
        dimensions: { indoor: "1080 x 336 x 226 mm", outdoor: "845 x 702 x 363 mm" },
        weight: { indoor: "14 kg", outdoor: "46 kg" },
        color: "White",
        description: `${product.name} with efficient cooling, quiet operation, and Lord AC installation support.`,
        descriptionAr: `${product.nameAr} بتبريد فعال وتشغيل هادئ ودعم تركيب من لورد للتكييف.`,
        features: [
          "Fast cooling",
          "Low noise operation",
          "Energy saving mode",
          "Auto restart",
        ],
        featuresAr: [
          "تبريد سريع",
          "تشغيل منخفض الضوضاء",
          "وضع توفير الطاقة",
          "إعادة تشغيل تلقائية",
        ],
        specs: {
          capacity: `${product.capacity.toLocaleString()} BTU`,
          horsepower: `${product.horsepower} HP`,
          warranty: "5 years compressor warranty",
          warrantyAr: "ضمان الضاغط لمدة 5 سنوات",
        },
        price: product.price,
        originalPrice: product.originalPrice,
        priceVisible: true,
        stockQuantity: product.stockQuantity,
        isFeatured: product.isFeatured ?? false,
        isNewArrival: product.isNewArrival ?? false,
        isBestseller: product.isBestseller ?? false,
        isActive: true,
        seo: {
          title: product.name,
          titleAr: product.nameAr,
          description: `Buy ${product.name} from Lord AC in Egypt.`,
          descriptionAr: `اشتر ${product.nameAr} من لورد للتكييف في مصر.`,
        },
      },
    });

    await prisma.productImages.deleteMany({ where: { productId: record.id } });
    await prisma.productImages.createMany({
      data: [
        {
          productId: record.id,
          url: `${productImage}+${encodeURIComponent(product.modelNumber)}`,
          altText: product.name,
          isPrimary: true,
          displayOrder: 1,
        },
        {
          productId: record.id,
          url: `https://placehold.co/900x900/F8FAFB/172041?text=${encodeURIComponent(product.type)}`,
          altText: `${product.name} side view`,
          isPrimary: false,
          displayOrder: 2,
        },
      ],
    });
  }
}

async function seedCustomers() {
  const passwordHash = await hashPassword("Password123");
  const customers = [
    {
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      phone: "+201001234567",
      nationalId: "29901011234567",
      isEmailVerified: true,
      lastLoginAt: new Date("2026-04-25T09:30:00Z"),
      addresses: [
        {
          label: "Home",
          recipientName: "Ahmed Hassan",
          phone: "+201001234567",
          addressLine1: "12 Tahrir Street",
          addressLine2: "Apartment 8",
          city: "Dokki",
          governorate: "Giza",
          postalCode: "12611",
          isDefault: true,
        },
      ],
    },
    {
      name: "Sara Mohamed",
      email: "sara@example.com",
      phone: "+201112345678",
      nationalId: "30105121234567",
      isEmailVerified: true,
      lastLoginAt: new Date("2026-05-01T15:20:00Z"),
      addresses: [
        {
          label: "Office",
          recipientName: "Sara Mohamed",
          phone: "+201112345678",
          addressLine1: "88 Road 9",
          city: "Maadi",
          governorate: "Cairo",
          postalCode: "11728",
          isDefault: true,
        },
      ],
    },
    {
      name: "Omar Ali",
      email: "omar@example.com",
      phone: "+201223456789",
      nationalId: "29708201234567",
      isEmailVerified: false,
      lastLoginAt: null,
      addresses: [
        {
          label: "Home",
          recipientName: "Omar Ali",
          phone: "+201223456789",
          addressLine1: "45 Syria Street",
          city: "Mohandessin",
          governorate: "Giza",
          isDefault: true,
        },
      ],
    },
  ];

  for (const customer of customers) {
    const record = await prisma.customers.upsert({
      where: { email: customer.email },
      update: {
        name: customer.name,
        phone: customer.phone,
        nationalId: customer.nationalId,
        passwordHash,
        isEmailVerified: customer.isEmailVerified,
        isActive: true,
        lastLoginAt: customer.lastLoginAt,
      },
      create: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        nationalId: customer.nationalId,
        passwordHash,
        isEmailVerified: customer.isEmailVerified,
        isActive: true,
        lastLoginAt: customer.lastLoginAt,
      },
    });

    await prisma.customerAddresses.deleteMany({ where: { customerId: record.id } });
    await prisma.customerAddresses.createMany({
      data: customer.addresses.map((address) => ({ ...address, customerId: record.id })),
    });
  }
}

async function seedShipping() {
  const zones = [
    {
      id: "zone-greater-cairo",
      name: "Greater Cairo",
      governorates: ["Cairo", "Giza", "Qalyubia"],
      cities: ["Nasr City", "Maadi", "Dokki", "New Cairo", "6th of October"],
      fee: "150",
      freeShippingThreshold: "50000",
      estimatedDaysMin: 1,
      estimatedDaysMax: 3,
    },
    {
      id: "zone-alexandria-delta",
      name: "Alexandria & Delta",
      governorates: ["Alexandria", "Dakahlia", "Gharbia", "Monufia"],
      cities: ["Alexandria", "Mansoura", "Tanta", "Shebin El Kom"],
      fee: "250",
      freeShippingThreshold: "65000",
      estimatedDaysMin: 2,
      estimatedDaysMax: 5,
    },
  ];

  for (const zone of zones) {
    await prisma.shippingZones.upsert({
      where: { id: zone.id },
      update: { ...zone, isActive: true },
      create: { ...zone, isActive: true },
    });
  }

  const methods = [
    {
      name: "Home Delivery",
      code: "home-delivery",
      description: "Delivered to the customer address with phone coordination.",
      feeModifier: "0",
      estimatedLabel: "2-5 business days",
      cutoffTime: "15:00",
      isRecommended: true,
    },
    {
      name: "Express Delivery",
      code: "express-delivery",
      description: "Priority delivery where available.",
      feeModifier: "125",
      estimatedLabel: "1-2 business days",
      cutoffTime: "12:00",
      isRecommended: false,
    },
    {
      name: "Store Pickup",
      code: "store-pickup",
      description: "Customer pickup from Lord AC branch.",
      feeModifier: "0",
      estimatedLabel: "Ready within 24 hours",
      cutoffTime: "17:00",
      isRecommended: false,
    },
  ];

  for (const method of methods) {
    await prisma.shippingMethods.upsert({
      where: { code: method.code },
      update: { ...method, isActive: true },
      create: { ...method, isActive: true },
    });
  }
}

async function seedCoupons() {
  const now = new Date();
  const coupons = [
    {
      code: "LORD10",
      discountType: "percentage",
      discountValue: "10",
      minimumOrderAmount: "20000",
      usageLimit: 250,
      startsAt: new Date(now.getFullYear(), 0, 1),
      endsAt: new Date(now.getFullYear(), 11, 31),
    },
    {
      code: "INSTALL500",
      discountType: "fixed",
      discountValue: "500",
      minimumOrderAmount: "15000",
      usageLimit: 100,
      startsAt: new Date(now.getFullYear(), 0, 1),
      endsAt: new Date(now.getFullYear(), 11, 31),
    },
    {
      code: "WELCOME",
      discountType: "percentage",
      discountValue: "5",
      minimumOrderAmount: "10000",
      usageLimit: null,
      startsAt: null,
      endsAt: null,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupons.upsert({
      where: { code: coupon.code },
      update: { ...coupon, isActive: true },
      create: { ...coupon, isActive: true },
    });
  }
}

async function seedOrdersAndCarts() {
  const products = await prisma.products.findMany({ include: { brand: true, images: true } });
  const customers = await prisma.customers.findMany();
  const shippingMethod = await prisma.shippingMethods.findUnique({
    where: { code: "home-delivery" },
  });
  const coupons = await prisma.coupons.findMany();

  const productByModel = new Map(products.map((product) => [product.modelNumber, product]));
  const customerByEmail = new Map(customers.map((customer) => [customer.email, customer]));
  const couponByCode = new Map(coupons.map((item) => [item.code, item]));

  const activeCustomer = customerByEmail.get("ahmed@example.com");
  const cartProduct = productByModel.get("AY-XP12YHE");
  if (activeCustomer && cartProduct) {
    const cart = await prisma.carts.upsert({
      where: { id: "cart-ahmed-active" },
      update: {
        customerId: activeCustomer.id,
        sessionId: null,
        status: CartStatus.ACTIVE,
        couponCode: "WELCOME",
      },
      create: {
        id: "cart-ahmed-active",
        customerId: activeCustomer.id,
        status: CartStatus.ACTIVE,
        couponCode: "WELCOME",
      },
    });

    await prisma.cartItems.deleteMany({ where: { cartId: cart.id } });
    await prisma.cartItems.create({
      data: {
        cartId: cart.id,
        productId: cartProduct.id,
        quantity: 1,
        unitPrice: cartProduct.price,
      },
    });
  }

  const guestCart = await prisma.carts.upsert({
    where: { id: "cart-guest-session" },
    update: {
      customerId: null,
      sessionId: "seed-guest-session",
      status: CartStatus.ACTIVE,
      couponCode: null,
    },
    create: {
      id: "cart-guest-session",
      sessionId: "seed-guest-session",
      status: CartStatus.ACTIVE,
    },
  });
  await prisma.cartItems.deleteMany({ where: { cartId: guestCart.id } });

  const orders = [
    {
      orderNumber: "LORD-20260001",
      customerEmail: "ahmed@example.com",
      items: [{ modelNumber: "42QHF024", quantity: 1 }],
      shippingFee: "150",
      discountAmount: "0",
      couponCode: null,
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.DELIVERED,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      trackingNumber: "TRK-LORD-001",
      shippingCarrier: "Lord Delivery",
      notes: "Customer requested morning delivery.",
      createdAt: new Date("2026-01-15T10:00:00Z"),
    },
    {
      orderNumber: "LORD-20260002",
      customerEmail: "sara@example.com",
      items: [{ modelNumber: "MSAGBU-18HRFN", quantity: 1 }],
      shippingFee: "150",
      discountAmount: "2690",
      couponCode: "LORD10",
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.PROCESSING,
      paymentMethod: PaymentMethod.MOBILE_WALLET,
      trackingNumber: null,
      shippingCarrier: null,
      notes: null,
      createdAt: new Date("2026-03-10T12:30:00Z"),
    },
    {
      orderNumber: "LORD-20260003",
      customerEmail: "omar@example.com",
      items: [{ modelNumber: "TH-C12YEE", quantity: 1 }],
      shippingFee: "250",
      discountAmount: "0",
      couponCode: null,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING_PAYMENT,
      paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
      trackingNumber: null,
      shippingCarrier: null,
      notes: "Out-of-stock item kept for admin workflow demo.",
      createdAt: new Date("2026-04-20T09:15:00Z"),
    },
    {
      orderNumber: "LORD-20260004",
      customerEmail: null,
      guestName: "Mona Fathy",
      guestEmail: "mona.guest@example.com",
      guestPhone: "+201098765432",
      guestNationalId: "30202021234567",
      items: [{ modelNumber: "TPH-C10", quantity: 2 }],
      shippingFee: "250",
      discountAmount: "500",
      couponCode: "INSTALL500",
      paymentStatus: PaymentStatus.REFUNDED,
      orderStatus: OrderStatus.REFUNDED,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      trackingNumber: "TRK-LORD-004",
      shippingCarrier: "Express Courier",
      notes: "Refunded after customer cancellation.",
      createdAt: new Date("2026-02-18T17:45:00Z"),
    },
  ];

  for (const orderSeed of orders) {
    const customer = orderSeed.customerEmail
      ? customerByEmail.get(orderSeed.customerEmail)
      : null;
    const orderProducts = orderSeed.items.map((item) => {
      const product = productByModel.get(item.modelNumber);
      if (!product) {
        throw new Error(`Missing order product ${item.modelNumber}`);
      }
      return { product, quantity: item.quantity };
    });

    const subtotal = orderProducts.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    const total =
      subtotal + Number(orderSeed.shippingFee) - Number(orderSeed.discountAmount);
    const shippingAddress = {
      recipientName: customer?.name ?? orderSeed.guestName,
      phone: customer?.phone ?? orderSeed.guestPhone,
      addressLine1: customer ? "12 Tahrir Street" : "22 Corniche Road",
      city: customer ? "Dokki" : "Alexandria",
      governorate: customer ? "Giza" : "Alexandria",
    };

    const order = await prisma.orders.upsert({
      where: { orderNumber: orderSeed.orderNumber },
      update: {
        customerId: customer?.id ?? null,
        guestName: orderSeed.guestName,
        guestEmail: orderSeed.guestEmail,
        guestPhone: orderSeed.guestPhone,
        guestNationalId: orderSeed.guestNationalId,
        customerSnapshot: customer
          ? { name: customer.name, email: customer.email, phone: customer.phone }
          : Prisma.JsonNull,
        shippingAddress,
        shippingMethodId: shippingMethod?.id,
        trackingNumber: orderSeed.trackingNumber,
        shippingCarrier: orderSeed.shippingCarrier,
        subtotal: subtotal.toFixed(2),
        shippingFee: orderSeed.shippingFee,
        discountAmount: orderSeed.discountAmount,
        total: total.toFixed(2),
        couponCode: orderSeed.couponCode,
        notes: orderSeed.notes,
        paymentStatus: orderSeed.paymentStatus,
        orderStatus: orderSeed.orderStatus,
        createdAt: orderSeed.createdAt,
      },
      create: {
        orderNumber: orderSeed.orderNumber,
        customerId: customer?.id,
        guestName: orderSeed.guestName,
        guestEmail: orderSeed.guestEmail,
        guestPhone: orderSeed.guestPhone,
        guestNationalId: orderSeed.guestNationalId,
        customerSnapshot: customer
          ? { name: customer.name, email: customer.email, phone: customer.phone }
          : undefined,
        shippingAddress,
        shippingMethodId: shippingMethod?.id,
        trackingNumber: orderSeed.trackingNumber,
        shippingCarrier: orderSeed.shippingCarrier,
        subtotal: subtotal.toFixed(2),
        shippingFee: orderSeed.shippingFee,
        discountAmount: orderSeed.discountAmount,
        total: total.toFixed(2),
        couponCode: orderSeed.couponCode,
        notes: orderSeed.notes,
        paymentStatus: orderSeed.paymentStatus,
        orderStatus: orderSeed.orderStatus,
        createdAt: orderSeed.createdAt,
      },
    });

    await prisma.orderItems.deleteMany({ where: { orderId: order.id } });
    await prisma.orderStatusHistory.deleteMany({ where: { orderId: order.id } });
    await prisma.refunds.deleteMany({ where: { orderId: order.id } });
    await prisma.payments.deleteMany({ where: { orderId: order.id } });

    for (const item of orderProducts) {
      await prisma.orderItems.create({
        data: {
          orderId: order.id,
          productId: item.product.id,
          productName: item.product.name,
          brandName: item.product.brand.name,
          modelNumber: item.product.modelNumber,
          imageUrl: item.product.images[0]?.url,
          quantity: item.quantity,
          unitPrice: item.product.price,
          lineTotal: (Number(item.product.price) * item.quantity).toFixed(2),
        },
      });
    }

    await prisma.orderStatusHistory.createMany({
      data: [
        {
          orderId: order.id,
          oldStatus: null,
          newStatus: OrderStatus.PENDING_PAYMENT,
          note: "Order created",
          changedBy: "Seed",
          createdAt: orderSeed.createdAt,
        },
        ...(orderSeed.orderStatus !== OrderStatus.PENDING_PAYMENT
          ? [
              {
                orderId: order.id,
                oldStatus: OrderStatus.PENDING_PAYMENT,
                newStatus: orderSeed.orderStatus,
                note: `Moved to ${orderSeed.orderStatus.toLowerCase()}`,
                changedBy: "Lord Admin",
                createdAt: new Date(orderSeed.createdAt.getTime() + 86400000),
              },
            ]
          : []),
      ],
    });

    const payment = await prisma.payments.create({
      data: {
        orderId: order.id,
        paymobOrderId: `PMB-${orderSeed.orderNumber}`,
        paymobTransactionId:
          orderSeed.paymentStatus === PaymentStatus.PENDING
            ? null
            : `TXN-${orderSeed.orderNumber}`,
        amount: total.toFixed(2),
        amountPiasters: Math.round(total * 100),
        currency: "EGP",
        paymentMethod: orderSeed.paymentMethod,
        cardBrand:
          orderSeed.paymentMethod === PaymentMethod.CREDIT_CARD ? "Visa" : null,
        cardLastFour:
          orderSeed.paymentMethod === PaymentMethod.CREDIT_CARD ? "4242" : null,
        walletNumber:
          orderSeed.paymentMethod === PaymentMethod.MOBILE_WALLET
            ? "+201112345678"
            : null,
        status: orderSeed.paymentStatus,
        gatewayResponse: {
          seeded: true,
          orderNumber: orderSeed.orderNumber,
        },
        paidAt:
          orderSeed.paymentStatus === PaymentStatus.PAID ||
          orderSeed.paymentStatus === PaymentStatus.REFUNDED
            ? new Date(orderSeed.createdAt.getTime() + 1800000)
            : null,
      },
    });

    if (orderSeed.orderStatus === OrderStatus.REFUNDED) {
      await prisma.refunds.create({
        data: {
          orderId: order.id,
          paymentId: payment.id,
          paymobRefundId: `RFD-${orderSeed.orderNumber}`,
          amount: total.toFixed(2),
          reason: "Customer cancellation",
          initiatedBy: "Lord Admin",
        },
      });
    }

    const appliedCoupon = orderSeed.couponCode
      ? couponByCode.get(orderSeed.couponCode)
      : null;
    if (appliedCoupon) {
      await prisma.couponUsage.deleteMany({ where: { orderId: order.id } });
      await prisma.couponUsage.create({
        data: {
          couponId: appliedCoupon.id,
          customerId: customer?.id,
          orderId: order.id,
          usedAt: orderSeed.createdAt,
        },
      });
    }
  }

  const usageCounts = await prisma.couponUsage.groupBy({
    by: ["couponId"],
    _count: { couponId: true },
  });
  for (const usage of usageCounts) {
    await prisma.coupons.update({
      where: { id: usage.couponId },
      data: { usageCount: usage._count.couponId },
    });
  }
}

async function seedServices() {
  const serviceTypes = [
    {
      name: "Installation",
      nameAr: "التركيب",
      slug: "installation",
      description: "Professional AC installation by trained technicians.",
      descriptionAr: "تركيب تكييف احترافي بواسطة فنيين مدربين.",
    },
    {
      name: "Maintenance",
      nameAr: "الصيانة",
      slug: "maintenance",
      description: "Preventive maintenance and seasonal cleaning.",
      descriptionAr: "صيانة وقائية وتنظيف موسمي للحفاظ على كفاءة التكييف.",
    },
    {
      name: "Repair",
      nameAr: "الإصلاح",
      slug: "repair",
      description: "Diagnostics and repairs for cooling issues.",
      descriptionAr: "تشخيص وإصلاح مشكلات التبريد والتسريب والكهرباء.",
    },
    {
      name: "Delivery",
      nameAr: "التوصيل",
      slug: "delivery",
      description: "Safe delivery for AC units and accessories.",
      descriptionAr: "توصيل آمن لوحدات التكييف وملحقاتها.",
    },
    {
      name: "Spare Parts",
      nameAr: "قطع الغيار",
      slug: "spare-parts",
      description: "Original spare parts for supported AC systems.",
      descriptionAr: "قطع غيار أصلية لأنظمة التكييف المدعومة.",
    },
  ];

  for (const serviceType of serviceTypes) {
    await prisma.serviceTypes.upsert({
      where: { slug: serviceType.slug },
      update: { ...serviceType, isActive: true },
      create: { ...serviceType, isActive: true },
    });
  }

  const types = await prisma.serviceTypes.findMany();
  const typeBySlug = new Map(types.map((type) => [type.slug, type]));
  const services = [
    {
      typeSlug: "installation",
      name: "Split AC Installation",
      nameAr: "تركيب تكييف سبليت",
      slug: "split-ac-installation",
      sortOrder: 1,
      description: "Mounting, copper piping, drainage, vacuum, and startup testing.",
      descriptionAr: "تركيب الوحدة وتمديد مواسير النحاس والصرف والتفريغ واختبار التشغيل.",
      bullets: ["Indoor and outdoor unit mounting", "Copper piping and insulation", "Vacuum test and startup check"],
      bulletsAr: ["تركيب الوحدتين الداخلية والخارجية", "تمديد مواسير النحاس والعزل", "اختبار التفريغ وفحص التشغيل"],
      estimatedTime: "2-4 hours",
      estimatedTimeAr: "من ساعتين إلى 4 ساعات",
    },
    {
      typeSlug: "maintenance",
      name: "Seasonal AC Maintenance",
      nameAr: "صيانة تكييف موسمية",
      slug: "seasonal-ac-maintenance",
      sortOrder: 2,
      description: "Filter cleaning, coil check, gas pressure check, and performance test.",
      descriptionAr: "تنظيف الفلاتر وفحص الملفات وضغط الغاز واختبار الأداء.",
      bullets: ["Filter and coil cleaning", "Gas pressure inspection", "Cooling performance report"],
      bulletsAr: ["تنظيف الفلاتر والملفات", "فحص ضغط الغاز", "تقرير أداء التبريد"],
      estimatedTime: "1-2 hours",
      estimatedTimeAr: "من ساعة إلى ساعتين",
    },
    {
      typeSlug: "repair",
      name: "Emergency AC Repair",
      nameAr: "إصلاح تكييف طارئ",
      slug: "emergency-ac-repair",
      sortOrder: 3,
      description: "Fast diagnosis for no-cooling, water leakage, electrical, and noise issues.",
      descriptionAr: "تشخيص سريع لمشكلات ضعف التبريد وتسريب المياه والكهرباء والضوضاء.",
      bullets: ["Fault diagnosis", "Electrical and leakage checks", "Repair recommendation"],
      bulletsAr: ["تشخيص الأعطال", "فحص الكهرباء والتسريب", "توصية بالإصلاح"],
      estimatedTime: "1-3 hours",
      estimatedTimeAr: "من ساعة إلى 3 ساعات",
    },
    {
      typeSlug: "delivery",
      name: "AC Delivery",
      nameAr: "توصيل التكييف",
      slug: "ac-delivery",
      sortOrder: 4,
      description: "Scheduled delivery for AC units with careful handling.",
      descriptionAr: "توصيل مجدول لوحدات التكييف مع عناية أثناء النقل.",
      bullets: ["Scheduled delivery windows", "Careful product handling", "Delivery confirmation"],
      bulletsAr: ["مواعيد توصيل مجدولة", "مناولة آمنة للمنتجات", "تأكيد التسليم"],
      estimatedTime: "Same day or scheduled",
      estimatedTimeAr: "في نفس اليوم أو حسب الموعد",
    },
    {
      typeSlug: "spare-parts",
      name: "Original Spare Parts",
      nameAr: "قطع غيار أصلية",
      slug: "original-spare-parts",
      sortOrder: 5,
      description: "Original replacement parts for supported Carrier and Midea systems.",
      descriptionAr: "قطع غيار أصلية لأنظمة كاريير وميديا المدعومة.",
      bullets: ["Original supported parts", "Compatibility verification", "Installation guidance"],
      bulletsAr: ["قطع أصلية مدعومة", "التحقق من التوافق", "إرشادات التركيب"],
      estimatedTime: "Based on part availability",
      estimatedTimeAr: "حسب توفر القطعة",
    },
  ];

  for (const service of services) {
    const serviceType = typeBySlug.get(service.typeSlug);
    await prisma.services.upsert({
      where: { slug: service.slug },
      update: {
        serviceTypeId: serviceType?.id,
        name: service.name,
        nameAr: service.nameAr,
        description: service.description,
        descriptionAr: service.descriptionAr,
        content: {
          bullets: service.bullets,
          bulletsAr: service.bulletsAr,
          estimatedTime: service.estimatedTime,
          estimatedTimeAr: service.estimatedTimeAr,
        },
        sortOrder: service.sortOrder,
        isActive: true,
      },
      create: {
        serviceTypeId: serviceType?.id,
        name: service.name,
        nameAr: service.nameAr,
        slug: service.slug,
        description: service.description,
        descriptionAr: service.descriptionAr,
        content: {
          bullets: service.bullets,
          bulletsAr: service.bulletsAr,
          estimatedTime: service.estimatedTime,
          estimatedTimeAr: service.estimatedTimeAr,
        },
        sortOrder: service.sortOrder,
        isActive: true,
      },
    });
  }
}

async function seedInquiries() {
  const inquiries = [
    {
      id: "inq-product-quote",
      name: "Youssef Adel",
      email: "youssef@example.com",
      phone: "+201066677788",
      inquiryType: "Product Quote",
      message: "I need a quote for three split units for an apartment in New Cairo.",
      source: "contact-page",
      status: InquiryStatus.NEW,
      notes: ["Assign to sales team for quote follow-up."],
    },
    {
      id: "inq-commercial",
      name: "Nour Office",
      email: "admin@nouroffice.example",
      phone: "+201055544433",
      inquiryType: "Commercial Project",
      message: "We are preparing a fit-out for a 220 sqm office and need duct AC options.",
      source: "website",
      status: InquiryStatus.IN_PROGRESS,
      notes: ["Requested floor plan by email.", "Commercial team contacted customer."],
    },
  ];

  for (const inquiry of inquiries) {
    await prisma.inquiries.upsert({
      where: { id: inquiry.id },
      update: {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        inquiryType: inquiry.inquiryType,
        message: inquiry.message,
        source: inquiry.source,
        status: inquiry.status,
      },
      create: {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        inquiryType: inquiry.inquiryType,
        message: inquiry.message,
        source: inquiry.source,
        status: inquiry.status,
      },
    });
    await prisma.inquiryNotes.deleteMany({ where: { inquiryId: inquiry.id } });
    await prisma.inquiryNotes.createMany({
      data: inquiry.notes.map((content) => ({
        inquiryId: inquiry.id,
        content,
        createdBy: "Lord Admin",
      })),
    });
  }

  const serviceRequests = [
    {
      id: "srvreq-installation",
      name: "Heba Mostafa",
      email: "heba@example.com",
      phone: "+201077788899",
      serviceType: "Installation",
      message: "Install one 3 HP split unit in Sheikh Zayed.",
      status: InquiryStatus.NEW,
      notes: ["Call to confirm wall location and copper length."],
    },
    {
      id: "srvreq-maintenance",
      name: "Karim Samir",
      email: "karim@example.com",
      phone: "+201011122233",
      serviceType: "Maintenance",
      message: "Annual maintenance for two bedroom split units.",
      status: InquiryStatus.RESOLVED,
      notes: ["Technician visit scheduled.", "Service completed successfully."],
    },
  ];

  for (const request of serviceRequests) {
    await prisma.serviceRequests.upsert({
      where: { id: request.id },
      update: {
        name: request.name,
        email: request.email,
        phone: request.phone,
        serviceType: request.serviceType,
        message: request.message,
        status: request.status,
      },
      create: {
        id: request.id,
        name: request.name,
        email: request.email,
        phone: request.phone,
        serviceType: request.serviceType,
        message: request.message,
        status: request.status,
      },
    });
    await prisma.serviceRequestNotes.deleteMany({
      where: { serviceRequestId: request.id },
    });
    await prisma.serviceRequestNotes.createMany({
      data: request.notes.map((content) => ({
        serviceRequestId: request.id,
        content,
        createdBy: "Lord Admin",
      })),
    });
  }
}

async function seedContent() {
  const pages = [
    {
      pageKey: "home",
      title: "Home Page",
      titleAr: "الصفحة الرئيسية",
      content: {
        title: "Home Page",
        titleAr: "الصفحة الرئيسية",
        heroHeadline: "Authorized Carrier & Midea Dealer",
        heroHeadlineAr: "وكيل معتمد لكاريير وميديا",
        heroTagline: "Air Conditioning — Since 1986",
        heroTaglineAr: "تكييف الهواء — منذ ١٩٨٦",
        featuredTitle: "Featured Products",
        featuredTitleAr: "منتجات مميزة",
        servicesTitle: "Our Services",
        servicesTitleAr: "خدماتنا",
        whyTitle: "Why Choose Lord",
        whyTitleAr: "لماذا تختار لورد",
        testimonialsTitle: "What Our Customers Say",
        testimonialsTitleAr: "ماذا يقول عملاؤنا",
        ctaHeadline: "Need help choosing? Request a free consultation",
        ctaHeadlineAr: "تحتاج مساعدة في الاختيار؟ اطلب استشارة مجانية",
        isPublished: true,
      },
      seo: {
        metaTitle: "Lord AC — Authorized Carrier & Midea Dealer",
        metaTitleAr: "لورد للتكييف — وكيل معتمد لكاريير وميديا",
        metaDescription:
          "Lord Air Conditioning — Authorized Carrier & Midea dealer in Egypt since 1986.",
        metaDescriptionAr:
          "لورد لتكييف الهواء — وكيل معتمد لكاريير وميديا في مصر منذ ١٩٨٦.",
      },
    },
    {
      pageKey: "about",
      title: "About Lord AC",
      titleAr: "عن لورد للتكييف",
      content: {
        title: "About Lord AC",
        titleAr: "عن لورد للتكييف",
        hero: "Cooling Egypt since 1986",
        heroAr: "نبرد مصر منذ 1986",
        body: "Lord AC supplies, installs, and services residential and commercial air conditioning systems.",
        bodyAr: "لورد للتكييف توفر وتثبت وتصون أنظمة التكييف السكنية والتجارية.",
        story:
          "Lord AC is Egypt's trusted authorized dealer for Carrier and Midea air conditioning systems, serving homes and businesses with quality products, professional installation, and dependable after-sales support.",
        storyAr:
          "لورد للتكييف هي الوكيل المعتمد الموثوق في مصر لأنظمة كاريير وميديا، وتخدم المنازل والشركات بمنتجات عالية الجودة وتركيب احترافي ودعم موثوق بعد البيع.",
        mission:
          "To provide reliable air conditioning solutions through authorized products, expert installation, and responsive customer care.",
        missionAr:
          "تقديم حلول تكييف موثوقة من خلال منتجات معتمدة وتركيب احترافي وخدمة عملاء سريعة الاستجابة.",
        vision:
          "To be Egypt's leading air conditioning partner for comfort, efficiency, and long-term trust.",
        visionAr:
          "أن نكون الشريك الرائد في مصر لحلول التكييف التي تجمع بين الراحة والكفاءة والثقة طويلة الأمد.",
      },
      seo: {
        title: "About Lord AC",
        titleAr: "عن لورد للتكييف",
        description: "Learn about Lord AC services and AC products in Egypt.",
        descriptionAr: "تعرف على خدمات ومنتجات لورد للتكييف في مصر.",
      },
    },
    {
      pageKey: "privacy-policy",
      title: "Privacy Policy",
      titleAr: "سياسة الخصوصية",
      content: {
        title: "Privacy Policy",
        titleAr: "سياسة الخصوصية",
        body: "We use customer information to process orders, provide services, and improve support.",
        bodyAr: "نستخدم بيانات العملاء لمعالجة الطلبات وتقديم الخدمات وتحسين الدعم.",
      },
      seo: {
        title: "Privacy Policy",
        titleAr: "سياسة الخصوصية",
        description: "How Lord AC handles customer and order information.",
        descriptionAr: "كيف تتعامل لورد للتكييف مع بيانات العملاء والطلبات.",
      },
    },
    {
      pageKey: "terms",
      title: "Terms and Conditions",
      titleAr: "الشروط والأحكام",
      content: {
        title: "Terms and Conditions",
        titleAr: "الشروط والأحكام",
        body: "Orders, installation visits, warranties, and returns follow Lord AC published policies.",
        bodyAr: "تخضع الطلبات وزيارات التركيب والضمانات والإرجاع لسياسات لورد للتكييف المنشورة.",
      },
      seo: {
        title: "Terms and Conditions",
        titleAr: "الشروط والأحكام",
        description: "Lord AC order, installation, warranty, and return terms.",
        descriptionAr: "شروط الطلبات والتركيب والضمان والإرجاع لدى لورد للتكييف.",
      },
    },
  ];

  for (const page of pages) {
    await prisma.contentPages.upsert({
      where: { pageKey: page.pageKey },
      update: { ...page, isActive: true },
      create: { ...page, isActive: true },
    });
  }

  const faqs = [
    {
      id: "faq-installation-time",
      question: "How long does AC installation take?",
      questionAr: "كم يستغرق تركيب التكييف؟",
      answer: "Most split AC installations are completed in 2 to 4 hours after site inspection.",
      answerAr: "يتم تركيب أغلب تكييفات السبليت خلال ساعتين إلى أربع ساعات بعد معاينة الموقع.",
      category: "Installation",
      displayOrder: 1,
    },
    {
      id: "faq-warranty",
      question: "Do products include warranty?",
      questionAr: "هل المنتجات تشمل ضمان؟",
      answer: "Warranty depends on the brand and model. Compressor warranty is usually up to 5 years.",
      answerAr: "يعتمد الضمان على العلامة والموديل، وغالبا يصل ضمان الضاغط إلى 5 سنوات.",
      category: "Products",
      displayOrder: 2,
    },
    {
      id: "faq-payment",
      question: "Which payment methods are available?",
      questionAr: "ما طرق الدفع المتاحة؟",
      answer: "Customers can pay by card, mobile wallet, installment where available, or cash on delivery.",
      answerAr: "يمكن الدفع بالبطاقة أو المحفظة الإلكترونية أو التقسيط عند توفره أو الدفع عند الاستلام.",
      category: "Orders",
      displayOrder: 3,
    },
    {
      id: "faq-maintenance",
      question: "How often should I service my AC?",
      questionAr: "كم مرة يجب صيانة التكييف؟",
      answer: "For best performance, schedule preventive maintenance at least twice a year.",
      answerAr: "لأفضل أداء، يفضل جدولة الصيانة الوقائية مرتين على الأقل سنويا.",
      category: "Maintenance",
      displayOrder: 4,
    },
  ];

  for (const faq of faqs) {
    await prisma.faqs.upsert({
      where: { id: faq.id },
      update: { ...faq, isActive: true },
      create: { ...faq, isActive: true },
    });
  }

  const testimonials = [
    {
      id: "testimonial-ahmed",
      customerName: "Ahmed Hassan",
      location: "Giza",
      locationAr: "الجيزة",
      rating: 5,
      quote: "The team helped me choose the right capacity and installed everything neatly.",
      quoteAr: "ساعدني الفريق في اختيار القدرة المناسبة وتم التركيب بشكل منظم.",
      isApproved: true,
      isFeatured: true,
    },
    {
      id: "testimonial-sara",
      customerName: "Sara Mohamed",
      location: "Maadi",
      locationAr: "المعادي",
      rating: 5,
      quote: "Fast delivery, clear pricing, and professional maintenance follow-up.",
      quoteAr: "توصيل سريع وأسعار واضحة ومتابعة صيانة احترافية.",
      isApproved: true,
      isFeatured: true,
    },
    {
      id: "testimonial-omar",
      customerName: "Omar Ali",
      location: "Mohandessin",
      locationAr: "المهندسين",
      rating: 4,
      quote: "Support was helpful and explained the available options clearly.",
      quoteAr: "الدعم كان متعاونا وشرح الخيارات المتاحة بوضوح.",
      isApproved: true,
      isFeatured: false,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonials.upsert({
      where: { id: testimonial.id },
      update: testimonial,
      create: testimonial,
    });
  }

  const promotions = [
    {
      title: "Summer Cooling Deals",
      slug: "summer-cooling-deals",
      description: "Save on selected split units and installation packages.",
      imageUrl: "https://placehold.co/1200x500/0DBACA/172041?text=Summer+Deals",
      startsAt: new Date("2026-05-01T00:00:00Z"),
      endsAt: new Date("2026-08-31T23:59:59Z"),
    },
    {
      title: "Free Inspection Week",
      slug: "free-inspection-week",
      description: "Book a free consultation for homes and small offices.",
      imageUrl: "https://placehold.co/1200x500/172041/ffffff?text=Free+Inspection",
      startsAt: new Date("2026-04-01T00:00:00Z"),
      endsAt: new Date("2026-06-30T23:59:59Z"),
    },
  ];

  for (const promotion of promotions) {
    await prisma.promotions.upsert({
      where: { slug: promotion.slug },
      update: { ...promotion, isActive: true },
      create: { ...promotion, isActive: true },
    });
  }
}

async function seedSettingsAndUsers() {
  const adminPassword = await hashPassword("Admin12345");
  const staffPassword = await hashPassword("Staff12345");

  await prisma.cmsUsers.upsert({
    where: { email: "admin@lord.local" },
    update: {
      name: "Lord Admin",
      passwordHash: adminPassword,
      role: UserRole.CMS_ADMIN,
      isActive: true,
    },
    create: {
      name: "Lord Admin",
      email: "admin@lord.local",
      passwordHash: adminPassword,
      role: UserRole.CMS_ADMIN,
      isActive: true,
    },
  });

  await prisma.cmsUsers.upsert({
    where: { email: "staff@lord.local" },
    update: {
      name: "Lord Staff",
      passwordHash: staffPassword,
      role: UserRole.CMS_STAFF,
      isActive: true,
    },
    create: {
      name: "Lord Staff",
      email: "staff@lord.local",
      passwordHash: staffPassword,
      role: UserRole.CMS_STAFF,
      isActive: true,
    },
  });

  await upsertSiteSetting("site_name", "general", "Lord AC");
  await upsertSiteSetting("site_name_ar", "general", "لورد للتكييف");
  await upsertSiteSetting("site_tagline", "general", "Cooling Egypt since 1986");
  await upsertSiteSetting("site_tagline_ar", "general", "نبرّد مصر منذ 1986");
  await upsertSiteSetting("contact_phone", "contact", "+201000000000");
  await upsertSiteSetting("contact_email", "contact", "info@lordac.com");
  await upsertSiteSetting("contact_address", "contact", {
    line1: "Lord AC Showroom",
    city: "Cairo",
    country: "Egypt",
  });
  await upsertSiteSetting("contact_address_ar", "contact", {
    line1: "معرض لورد للتكييف",
    city: "القاهرة",
    country: "مصر",
  });
  await upsertSiteSetting("social_links", "contact", {
    facebook: "https://facebook.com/lordac",
    instagram: "https://instagram.com/lordac",
    whatsapp: "https://wa.me/201000000000",
  });
  await upsertSiteSetting("home_featured_product_limit", "catalog", 8);
  await upsertSiteSetting("currency", "commerce", "EGP");
  await upsertSiteSetting("paymob_enabled", "payments", true);

  await prisma.emailQueue.upsert({
    where: { id: "email-welcome-ahmed" },
    update: {
      to: "ahmed@example.com",
      subject: "Welcome to Lord AC",
      html: "<p>Welcome to Lord AC.</p>",
      status: "sent",
      attempts: 1,
      sentAt: new Date("2026-01-01T09:00:00Z"),
    },
    create: {
      id: "email-welcome-ahmed",
      to: "ahmed@example.com",
      subject: "Welcome to Lord AC",
      html: "<p>Welcome to Lord AC.</p>",
      status: "sent",
      attempts: 1,
      sentAt: new Date("2026-01-01T09:00:00Z"),
    },
  });
}

async function main() {
  await clearSeedData();
  await seedSettingsAndUsers();
  await seedBrands();
  await seedCategories();
  await seedProducts();
  await seedCustomers();
  await seedShipping();
  await seedCoupons();
  await seedOrdersAndCarts();
  await seedServices();
  await seedInquiries();
  await seedContent();

  console.log("Seed complete");
  console.log("CMS admin: admin@lord.local / Admin12345");
  console.log("CMS staff: staff@lord.local / Staff12345");
  console.log("Customer password for seeded accounts: Password123");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
