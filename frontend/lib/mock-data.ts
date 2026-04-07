import type { Product, Brand, ProductCategory } from "@/types/product";
import type { Order } from "@/types/order";
import type { Customer, CustomerAddress } from "@/types/customer";
import type { ContactSettings } from "@/types/common";
import type { FAQ, Testimonial } from "@/types/inquiry";

// ─── Brands ──────────────────────────────────────────────
export const MOCK_BRANDS: Brand[] = [
  {
    _id: "brand-carrier",
    name: "Carrier",
    slug: "carrier",
    logoUrl: "/images/brands/carrier.png",
    description:
      "World leader in air conditioning, heating, and refrigeration solutions.",
    isAuthorizedDealer: true,
    isActive: true,
  },
  {
    _id: "brand-midea",
    name: "Midea",
    slug: "midea",
    logoUrl: "/images/brands/midea.png",
    description: "One of the world's largest producers of consumer appliances.",
    isAuthorizedDealer: true,
    isActive: true,
  },
];

// ─── Categories ──────────────────────────────────────────
export const MOCK_CATEGORIES: ProductCategory[] = [
  {
    _id: "cat-split",
    name: "Split AC",
    slug: "split-ac",
    description: "Wall-mounted split air conditioning units",
    isActive: true,
  },
  {
    _id: "cat-window",
    name: "Window AC",
    slug: "window-ac",
    description: "Window-mounted air conditioning units",
    isActive: true,
  },
  {
    _id: "cat-central",
    name: "Central AC",
    slug: "central-ac",
    description: "Central ducted air conditioning systems",
    isActive: true,
  },
  {
    _id: "cat-portable",
    name: "Portable AC",
    slug: "portable-ac",
    description: "Portable air conditioning units",
    isActive: true,
  },
];

// ─── Products ────────────────────────────────────────────
const PLACEHOLDER_IMG =
  "/assets/logo.png";

export const MOCK_PRODUCTS: Product[] = [
  {
    _id: "prod-1",
    name: "Carrier Optimax Pro 1.5 HP Cool/Heat Inverter",
    slug: "carrier-optimax-pro-1-5hp",
    brand: MOCK_BRANDS[0],
    category: MOCK_CATEGORIES[0],
    modelNumber: "53KHCT-12",
    description:
      "The Carrier Optimax Pro 1.5 HP delivers superior cooling and heating with inverter technology for maximum energy efficiency. Features include auto-restart, turbo mode, and sleep mode for comfort throughout the day.",
    shortDescription:
      "Carrier 1.5 HP Inverter split AC with cool/heat, energy-saving technology.",
    images: [
      {
        url: PLACEHOLDER_IMG,
        alt: "Carrier Optimax Pro 1.5 HP",
        isPrimary: true,
        sortOrder: 0,
      },
      {
        url: PLACEHOLDER_IMG,
        alt: "Carrier Optimax Pro side view",
        isPrimary: false,
        sortOrder: 1,
      },
    ],
    price: 28999,
    salePrice: 25999,
    stockQuantity: 15,
    capacity: "1.5 HP",
    type: "split",
    specifications: [
      { key: "Cooling Capacity", value: "12,000 BTU" },
      { key: "Power Supply", value: "220-240V / 50Hz" },
      { key: "Compressor", value: "Inverter" },
      { key: "Refrigerant", value: "R-410A" },
      { key: "Noise Level (Indoor)", value: "26 dB" },
      { key: "EER", value: "12.5" },
      { key: "Dimensions (Indoor)", value: "870 x 292 x 201 mm" },
      { key: "Weight (Indoor)", value: "9.5 kg" },
    ],
    features: [
      "Inverter Technology — up to 60% energy savings",
      "Auto Restart after power failure",
      "Turbo Mode for rapid cooling",
      "4-way air swing",
      "Follow Me smart temperature sensing",
      "Anti-bacterial filter",
      "Self-cleaning function",
      "Sleep mode for nighttime comfort",
    ],
    warranty: "5 years compressor, 2 years parts",
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    _id: "prod-2",
    name: "Midea Xtreme Save 2.25 HP Cool Inverter",
    slug: "midea-xtreme-save-2-25hp",
    brand: MOCK_BRANDS[1],
    category: MOCK_CATEGORIES[0],
    modelNumber: "MSAG-18CRDN8",
    description:
      "The Midea Xtreme Save 2.25 HP provides powerful cooling with an advanced inverter compressor for whisper-quiet operation and outstanding energy efficiency. 3D airflow ensures even temperature distribution.",
    shortDescription:
      "Midea 2.25 HP Inverter split AC with 3D airflow and smart features.",
    images: [
      {
        url: PLACEHOLDER_IMG,
        alt: "Midea Xtreme Save 2.25 HP",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    price: 32500,
    salePrice: undefined,
    stockQuantity: 8,
    capacity: "2.25 HP",
    type: "split",
    specifications: [
      { key: "Cooling Capacity", value: "18,000 BTU" },
      { key: "Power Supply", value: "220-240V / 50Hz" },
      { key: "Compressor", value: "Inverter" },
      { key: "Refrigerant", value: "R-32" },
      { key: "Noise Level (Indoor)", value: "24 dB" },
      { key: "EER", value: "13.2" },
    ],
    features: [
      "3D Airflow — uniform cooling",
      "iECO Mode — energy saving",
      "Turbo cooling/heating",
      "Built-in WiFi for smart control",
      "Follow Me function",
      "Self-diagnosis system",
    ],
    warranty: "10 years compressor, 5 years parts",
    isFeatured: true,
    isNewArrival: true,
    isBestseller: false,
    isActive: true,
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-06-10T10:00:00Z",
  },
  {
    _id: "prod-3",
    name: "Carrier 42KHGA024 Concealed Ducted Unit",
    slug: "carrier-concealed-ducted-24k",
    brand: MOCK_BRANDS[0],
    category: MOCK_CATEGORIES[2],
    modelNumber: "42KHGA024",
    description:
      "Professional-grade concealed ducted AC unit by Carrier, ideal for large commercial and residential spaces. Delivers powerful, uniform airflow through ductwork with ultra-quiet operation.",
    shortDescription:
      "Carrier 3 HP concealed ducted central AC for commercial spaces.",
    images: [
      {
        url: PLACEHOLDER_IMG,
        alt: "Carrier Ducted Unit",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    price: 55000,
    salePrice: 49999,
    stockQuantity: 3,
    capacity: "3 HP",
    type: "central",
    specifications: [
      { key: "Cooling Capacity", value: "24,000 BTU" },
      { key: "Type", value: "Concealed Ducted" },
      { key: "Refrigerant", value: "R-410A" },
      { key: "Static Pressure", value: "High" },
    ],
    features: [
      "Concealed installation — clean aesthetics",
      "High static pressure for long duct runs",
      "Washable filter",
      "Auto restart",
    ],
    warranty: "5 years compressor, 2 years parts",
    isFeatured: true,
    isNewArrival: false,
    isBestseller: false,
    isActive: true,
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
  {
    _id: "prod-4",
    name: "Midea Breezeless 1.5 HP Cool Only",
    slug: "midea-breezeless-1-5hp",
    brand: MOCK_BRANDS[1],
    category: MOCK_CATEGORIES[0],
    modelNumber: "MSFAAU-12HRFN8",
    description:
      "Midea Breezeless technology diffuses air through 1,558 micro-holes for draft-free comfort. Inverter compressor, ultra-quiet 18 dB operation, and elegant design.",
    shortDescription:
      "Midea 1.5 HP Breezeless AC — draft-free cooling with whisper-quiet operation.",
    images: [
      {
        url: PLACEHOLDER_IMG,
        alt: "Midea Breezeless 1.5 HP",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    price: 27500,
    salePrice: 24999,
    stockQuantity: 20,
    capacity: "1.5 HP",
    type: "split",
    specifications: [
      { key: "Cooling Capacity", value: "12,000 BTU" },
      { key: "Compressor", value: "Inverter" },
      { key: "Noise Level (Indoor)", value: "18 dB" },
      { key: "Refrigerant", value: "R-32" },
    ],
    features: [
      "Breezeless Technology — 1,558 micro-holes",
      "18 dB ultra-quiet operation",
      "Inverter compressor",
      "Smart WiFi control",
      "Anti-bacterial filter",
    ],
    warranty: "10 years compressor, 5 years parts",
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
    isActive: true,
    createdAt: "2024-04-10T10:00:00Z",
    updatedAt: "2024-06-15T10:00:00Z",
  },
  {
    _id: "prod-5",
    name: "Carrier 1 HP Cool Only Split",
    slug: "carrier-1hp-cool-only",
    brand: MOCK_BRANDS[0],
    category: MOCK_CATEGORIES[0],
    modelNumber: "53KHCT-09",
    description:
      "Compact and affordable Carrier 1 HP split AC perfect for bedrooms and small rooms. Reliable cooling with Carrier quality.",
    shortDescription: "Carrier 1 HP cool-only split AC for small rooms.",
    images: [
      {
        url: PLACEHOLDER_IMG,
        alt: "Carrier 1 HP Split",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    price: 18999,
    stockQuantity: 25,
    capacity: "1 HP",
    type: "split",
    specifications: [
      { key: "Cooling Capacity", value: "9,000 BTU" },
      { key: "Power Supply", value: "220-240V / 50Hz" },
      { key: "Refrigerant", value: "R-410A" },
    ],
    features: [
      "Auto restart",
      "Sleep mode",
      "Anti-bacterial filter",
      "3-speed fan",
    ],
    warranty: "5 years compressor, 2 years parts",
    isFeatured: false,
    isNewArrival: false,
    isBestseller: true,
    isActive: true,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-05-01T10:00:00Z",
  },
  {
    _id: "prod-6",
    name: "Midea Portable AC 1.5 HP",
    slug: "midea-portable-1-5hp",
    brand: MOCK_BRANDS[1],
    category: MOCK_CATEGORIES[3],
    modelNumber: "MPPD-12HRN1",
    description:
      "No installation needed — the Midea Portable 1.5 HP cools any room in minutes. Features dual-hose design for efficient cooling and easy mobility with caster wheels.",
    shortDescription:
      "Midea 1.5 HP portable AC — no installation, instant cooling anywhere.",
    images: [
      {
        url: PLACEHOLDER_IMG,
        alt: "Midea Portable AC",
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    price: 15999,
    salePrice: 13999,
    stockQuantity: 12,
    capacity: "1.5 HP",
    type: "portable",
    specifications: [
      { key: "Cooling Capacity", value: "12,000 BTU" },
      { key: "Type", value: "Portable" },
      { key: "Noise Level", value: "52 dB" },
    ],
    features: [
      "No installation required",
      "Caster wheels for easy mobility",
      "24-hour timer",
      "Remote control",
      "Dehumidifier mode",
    ],
    warranty: "2 years comprehensive",
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    isActive: true,
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z",
  },
];

// ─── Services ────────────────────────────────────────────
export interface MockService {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  isActive: boolean;
}

export const MOCK_SERVICES: MockService[] = [
  {
    _id: "svc-installation",
    name: "AC Installation",
    slug: "ac-installation",
    description:
      "Professional AC installation by certified technicians. We handle wall-mounted splits, ducted systems, multi-split configurations, and VRF systems. Every installation includes proper copper piping, drainage, electrical connections, and a full commissioning test.",
    shortDescription:
      "Expert installation for all AC types with warranty-backed quality.",
    icon: "Wrench",
    features: [
      "Certified Carrier & Midea technicians",
      "Full copper piping & drainage setup",
      "Electrical safety check",
      "Commissioning & performance test",
      "90-day installation warranty",
      "Same-day service available",
    ],
    isActive: true,
  },
  {
    _id: "svc-maintenance",
    name: "Preventive Maintenance",
    slug: "preventive-maintenance",
    description:
      "Keep your AC running at peak efficiency with our comprehensive maintenance plans. Our service includes filter cleaning/replacement, coil washing, refrigerant level check, electrical inspection, and thermostat calibration.",
    shortDescription:
      "Regular maintenance to extend AC life and reduce energy bills.",
    icon: "Settings",
    features: [
      "Deep coil cleaning (indoor & outdoor)",
      "Refrigerant pressure check",
      "Filter cleaning or replacement",
      "Electrical connection inspection",
      "Thermostat calibration",
      "Performance report",
    ],
    isActive: true,
  },
  {
    _id: "svc-repair",
    name: "AC Repair",
    slug: "ac-repair",
    description:
      "Fast, reliable AC repair services. Our technicians diagnose and fix compressor issues, refrigerant leaks, electrical faults, noise problems, and more. We use genuine Carrier and Midea spare parts.",
    shortDescription: "Quick diagnosis and repair using genuine parts.",
    icon: "Zap",
    features: [
      "Same-day emergency repair",
      "Genuine Carrier & Midea spare parts",
      "Transparent pricing — no hidden fees",
      "90-day repair warranty",
      "Refrigerant leak detection & repair",
      "Compressor replacement",
    ],
    isActive: true,
  },
  {
    _id: "svc-spare-parts",
    name: "Genuine Spare Parts",
    slug: "spare-parts",
    description:
      "Original replacement parts for Carrier and Midea systems. Filters, capacitors, PCBs, compressors, fan motors, and more — all backed by manufacturer warranty.",
    shortDescription:
      "Original Carrier & Midea parts with manufacturer warranty.",
    icon: "Box",
    features: [
      "100% genuine parts",
      "Manufacturer warranty",
      "Fast delivery across Egypt",
      "Expert advice on compatibility",
    ],
    isActive: true,
  },
];

// ─── Testimonials ────────────────────────────────────────
export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    _id: "test-1",
    customerName: "Ahmed Hassan",
    location: "Cairo",
    rating: 5,
    quote:
      "Lord installed our Carrier system in under 3 hours. The team was professional, clean, and the AC works perfectly. Highly recommended!",
    isApproved: true,
    isFeatured: true,
  },
  {
    _id: "test-2",
    customerName: "Fatma El-Sayed",
    location: "Alexandria",
    rating: 5,
    quote:
      "We bought 4 Midea units for our office and Lord handled everything — delivery, installation, and setup. Great prices and excellent after-sales support.",
    isApproved: true,
    isFeatured: true,
  },
  {
    _id: "test-3",
    customerName: "Mohamed Khaled",
    location: "Giza",
    rating: 4,
    quote:
      "The maintenance team was on time and very thorough. My AC is running much better now. The annual maintenance plan is great value.",
    isApproved: true,
    isFeatured: true,
  },
  {
    _id: "test-4",
    customerName: "Nour Abdallah",
    location: "Mansoura",
    rating: 5,
    quote:
      "Emergency repair on a Friday evening — they came within 2 hours! Fixed the issue quickly. Lord is the only AC service I trust.",
    isApproved: true,
    isFeatured: true,
  },
];

// ─── FAQs ────────────────────────────────────────────────
export const MOCK_FAQS: FAQ[] = [
  {
    _id: "faq-1",
    question: "What brands does Lord carry?",
    answer:
      "Lord is an authorized dealer for both Carrier and Midea in Egypt. We stock their full range of residential and commercial AC systems, along with genuine spare parts.",
    category: "general",
    sortOrder: 1,
    isActive: true,
  },
  {
    _id: "faq-2",
    question: "Do you offer installation with purchase?",
    answer:
      "Yes! All AC units purchased from Lord come with professional installation by our certified technicians. Installation is typically scheduled within 24-48 hours of delivery.",
    category: "installation",
    sortOrder: 2,
    isActive: true,
  },
  {
    _id: "faq-3",
    question: "What areas do you deliver to?",
    answer:
      "We deliver nationwide across Egypt. Greater Cairo orders are typically delivered within 1-2 business days. Other governorates within 3-5 business days.",
    category: "delivery",
    sortOrder: 3,
    isActive: true,
  },
  {
    _id: "faq-4",
    question: "What payment methods are accepted?",
    answer:
      "We accept online payments via Visa, MasterCard, and meza digital cards through our secure Paymob payment gateway. Cash on delivery is not available — all orders must be paid online.",
    category: "payment",
    sortOrder: 4,
    isActive: true,
  },
  {
    _id: "faq-5",
    question: "What warranty do your products come with?",
    answer:
      "Warranty varies by brand and product: Carrier units come with a 5-year compressor and 2-year parts warranty. Midea units offer up to 10-year compressor and 5-year parts warranty. Installation workmanship is warranted for 90 days.",
    category: "warranty",
    sortOrder: 5,
    isActive: true,
  },
  {
    _id: "faq-6",
    question: "How do I request a service or repair?",
    answer:
      "You can submit a service request through our website's Service Request form, call us directly, or WhatsApp us. Emergency repairs are available with same-day response.",
    category: "services",
    sortOrder: 6,
    isActive: true,
  },
  {
    _id: "faq-7",
    question: "Can I track my order?",
    answer:
      "Yes! Once your order is placed and payment is confirmed, you'll receive an order number. Use it on our Track Order page to see real-time status updates.",
    category: "orders",
    sortOrder: 7,
    isActive: true,
  },
  {
    _id: "faq-8",
    question: "What is your return/refund policy?",
    answer:
      "Products can be returned within 14 days of delivery if unused and in original packaging. Refunds are processed within 7-10 business days to the original payment method. Installed units are subject to restocking fees.",
    category: "returns",
    sortOrder: 8,
    isActive: true,
  },
];

// ─── Contact Settings ────────────────────────────────────
export const MOCK_CONTACT_SETTINGS: ContactSettings = {
  phone: "+20 2 1234 5678",
  whatsapp: "+201000000000",
  email: "info@lord-ac.com",
  address: "123 Industrial Zone, 6th of October City, Giza, Egypt",
  workingHours: "Saturday - Thursday: 9:00 AM - 6:00 PM",
  googleMapsUrl: "https://maps.google.com/?q=Lord+AC+Egypt",
  googleMapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.789!2d31.234!3d30.044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLord+AC!5e0!3m2!1sen!2seg!4v1234567890",
  facebookUrl: "https://facebook.com/lordac",
  instagramUrl: "https://instagram.com/lordac",
};

// ─── About Content ───────────────────────────────────────
export const MOCK_ABOUT_CONTENT = {
  hero: {
    title: "About Lord Air Conditioning",
    subtitle: "Authorized Carrier & Midea Dealer Since 1986",
    description:
      "For over 38 years, Lord has been Egypt's trusted partner for premium air conditioning solutions. As an authorized dealer for both Carrier and Midea, we bring world-class cooling technology to homes and businesses across the country.",
  },
  stats: [
    { label: "Years in Business", value: 38 },
    { label: "Happy Customers", value: 50000 },
    { label: "Units Installed", value: 120000 },
    { label: "Certified Technicians", value: 85 },
  ],
  story:
    "Founded in 1986, Lord Air Conditioning started as a small workshop in Cairo specializing in AC repair. Over the decades, we grew into one of Egypt's premier authorized dealers for Carrier and Midea. Today, we serve thousands of residential and commercial customers nationwide with a full range of sales, installation, maintenance, and repair services.",
  values: [
    {
      title: "Quality First",
      description:
        "We only sell genuine products from authorized brands and use original spare parts in all our services.",
    },
    {
      title: "Customer Trust",
      description:
        "Transparent pricing, honest advice, and reliable after-sales support have earned us 38 years of customer loyalty.",
    },
    {
      title: "Expert Team",
      description:
        "Our 85+ certified technicians receive ongoing training from Carrier and Midea to stay at the forefront of AC technology.",
    },
    {
      title: "Nationwide Reach",
      description:
        "We deliver and install across all Egyptian governorates, with same-day service in Greater Cairo.",
    },
  ],
};

// ─── Home Content ────────────────────────────────────────
export const MOCK_HOME_CONTENT = {
  hero: {
    title: "Egypt's Trusted AC Partner Since 1986",
    subtitle: "Authorized Carrier & Midea Dealer",
    cta: "Shop Now",
  },
  featuredProducts: MOCK_PRODUCTS.filter((p) => p.isFeatured),
  services: MOCK_SERVICES,
  testimonials: MOCK_TESTIMONIALS,
};

// ─── Site Settings ───────────────────────────────────────
export const MOCK_SITE_SETTINGS = {
  siteName: "Lord AC",
  tagline: "Authorized Carrier & Midea Dealer",
  logoUrl: "/images/logo.png",
  faviconUrl: "/favicon.ico",
  metaDescription:
    "Lord Air Conditioning — Authorized Carrier & Midea dealer in Egypt since 1986.",
  contactEmail: "info@lord-ac.com",
  contactPhone: "+20 2 1234 5678",
  whatsappNumber: "+201000000000",
  address: "123 Industrial Zone, 6th of October City, Giza, Egypt",
  workingHours: "Saturday - Thursday: 9:00 AM - 6:00 PM",
  facebookUrl: "https://facebook.com/lordac",
  instagramUrl: "https://instagram.com/lordac",
  googleMapsUrl: "https://maps.google.com/?q=Lord+AC+Egypt",
  googleMapsEmbedUrl: "",
  shippingFlatRate: 150,
  freeShippingThreshold: 10000,
  estimatedDeliveryDays: "2-5",
  currency: "EGP",
};

// ─── Shipping Settings ───────────────────────────────────
export const MOCK_SHIPPING_SETTINGS = {
  flatRate: 150,
  freeShippingThreshold: 10000,
  estimatedDeliveryDays: "2-5",
};

// ─── Mock Customer (for dev login) ──────────────────────
export const MOCK_CUSTOMER: Customer = {
  _id: "cust-1",
  name: "Ahmed Mohamed",
  email: "ahmed@example.com",
  phone: "01012345678",
  nationalId: "29901010123456",
  isEmailVerified: true,
  isActive: true,
  lastLoginAt: "2024-06-15T10:00:00Z",
  createdAt: "2024-01-01T10:00:00Z",
  updatedAt: "2024-06-15T10:00:00Z",
};

// ─── Mock Addresses ──────────────────────────────────────
export const MOCK_ADDRESSES: CustomerAddress[] = [
  {
    _id: "addr-1",
    label: "home",
    recipientName: "Ahmed Mohamed",
    phone: "01012345678",
    addressLine1: "15 Tahrir Street, Dokki",
    addressLine2: "Building 7, Floor 3, Apt 12",
    city: "Giza",
    governorate: "Giza",
    postalCode: "12311",
    isDefault: true,
  },
  {
    _id: "addr-2",
    label: "office",
    recipientName: "Ahmed Mohamed",
    phone: "01012345678",
    addressLine1: "Smart Village, Building B103",
    city: "6th of October",
    governorate: "Giza",
    isDefault: false,
  },
];

// ─── Mock Order ──────────────────────────────────────────
export const MOCK_ORDERS: Order[] = [
  {
    _id: "order-1",
    orderNumber: "ORD-2024-001",
    customer: {
      _id: "cust-1",
      name: "Ahmed Mohamed",
      email: "ahmed@example.com",
      phone: "01012345678",
      nationalId: "29901010123456",
    },
    items: [
      {
        product: {
          _id: "prod-1",
          name: "Carrier Optimax Pro 1.5 HP Cool/Heat Inverter",
          slug: "carrier-optimax-pro-1-5hp",
          images: [{ url: PLACEHOLDER_IMG, alt: "Carrier Optimax Pro" }],
          brand: { name: "Carrier" },
          modelNumber: "53KHCT-12",
        },
        quantity: 1,
        unitPrice: 25999,
        lineTotal: 25999,
      },
    ],
    shippingAddress: {
      recipientName: "Ahmed Mohamed",
      phone: "01012345678",
      addressLine1: "15 Tahrir Street, Dokki",
      addressLine2: "Building 7, Floor 3, Apt 12",
      city: "Giza",
      governorate: "Giza",
      postalCode: "12311",
    },
    subtotal: 25999,
    shipping: 0,
    discount: 0,
    total: 25999,
    status: "confirmed",
    statusHistory: [
      { status: "pending_payment", timestamp: "2024-06-10T10:00:00Z" },
      {
        status: "confirmed",
        note: "Payment received",
        timestamp: "2024-06-10T10:05:00Z",
      },
    ],
    payment: {
      method: "card",
      paymobTransactionId: "TXN-123456",
      cardBrand: "Visa",
      cardLastFour: "4242",
      paidAt: "2024-06-10T10:05:00Z",
      amount: 25999,
    },
    estimatedDelivery: "2024-06-15",
    createdAt: "2024-06-10T10:00:00Z",
    updatedAt: "2024-06-10T10:05:00Z",
  },
  {
    _id: "order-2",
    orderNumber: "ORD-2024-002",
    customer: {
      _id: "cust-1",
      name: "Ahmed Mohamed",
      email: "ahmed@example.com",
      phone: "01012345678",
      nationalId: "29901010123456",
    },
    items: [
      {
        product: {
          _id: "prod-4",
          name: "Midea Breezeless 1.5 HP Cool Only",
          slug: "midea-breezeless-1-5hp",
          images: [{ url: PLACEHOLDER_IMG, alt: "Midea Breezeless" }],
          brand: { name: "Midea" },
          modelNumber: "MSFAAU-12HRFN8",
        },
        quantity: 2,
        unitPrice: 24999,
        lineTotal: 49998,
      },
    ],
    shippingAddress: {
      recipientName: "Ahmed Mohamed",
      phone: "01012345678",
      addressLine1: "Smart Village, Building B103",
      city: "6th of October",
      governorate: "Giza",
    },
    subtotal: 49998,
    shipping: 0,
    discount: 5000,
    total: 44998,
    coupon: {
      code: "SUMMER2024",
      discountType: "fixed",
      discountValue: 5000,
    },
    status: "delivered",
    statusHistory: [
      { status: "pending_payment", timestamp: "2024-05-01T09:00:00Z" },
      { status: "confirmed", timestamp: "2024-05-01T09:10:00Z" },
      { status: "processing", timestamp: "2024-05-02T08:00:00Z" },
      { status: "shipped", timestamp: "2024-05-03T14:00:00Z" },
      { status: "delivered", timestamp: "2024-05-05T11:00:00Z" },
    ],
    payment: {
      method: "card",
      paymobTransactionId: "TXN-654321",
      cardBrand: "MasterCard",
      cardLastFour: "8888",
      paidAt: "2024-05-01T09:10:00Z",
      amount: 44998,
    },
    trackingNumber: "EG1234567890",
    trackingCarrier: "Aramex",
    createdAt: "2024-05-01T09:00:00Z",
    updatedAt: "2024-05-05T11:00:00Z",
  },
];
