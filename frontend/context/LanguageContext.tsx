"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";

type Language = "en" | "ar";

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// English translations
const en: Translations = {
  // Nav
  "nav.home": "Home",
  "nav.products": "Products",
  "nav.services": "Services",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.faq": "FAQ",
  "nav.requestService": "Request Service",
  "nav.login": "Login",
  "nav.register": "Register",
  "nav.myOrders": "My Orders",
  "nav.myAddresses": "My Addresses",
  "nav.profile": "Profile",
  "nav.logout": "Logout",

  // Home
  "home.hero.headline": "Authorized Carrier & Midea Dealer",
  "home.hero.tagline": "Air Conditioning — Since 1986",
  "home.hero.shopNow": "Shop Now",
  "home.hero.ourServices": "Our Services",
  "home.featured.title": "Featured Products",
  "home.featured.viewAll": "View All Products",
  "home.services.title": "Our Services",
  "home.services.learnMore": "Learn More",
  "home.why.title": "Why Choose Lord",
  "home.testimonials.title": "What Our Customers Say",
  "home.cta.headline": "Need help choosing? Request a free consultation",
  "home.cta.button": "Contact Us",

  // Products
  "products.title": "Our Products",
  "products.showing": "Showing {count} of {total} products",
  "products.filter": "Filter",
  "products.clearFilters": "Clear All Filters",
  "products.sort": "Sort By",
  "products.sortPriceLow": "Price: Low to High",
  "products.sortPriceHigh": "Price: High to Low",
  "products.sortName": "Name: A–Z",
  "products.sortNewest": "Newest First",
  "products.addToCart": "Add to Cart",
  "products.outOfStock": "Out of Stock",
  "products.quickView": "Quick View",
  "products.viewDetails": "View Full Details",
  "products.inStock": "In Stock",
  "products.buyNow": "Buy Now",
  "products.added": "Added!",
  "products.relatedTitle": "You May Also Like",

  // Cart
  "cart.title": "Shopping Cart",
  "cart.empty": "Your cart is empty",
  "cart.browseProducts": "Browse Products",
  "cart.subtotal": "Subtotal",
  "cart.shipping": "Shipping",
  "cart.discount": "Discount",
  "cart.total": "Total",
  "cart.free": "Free",
  "cart.couponPlaceholder": "Enter coupon code",
  "cart.applyCoupon": "Apply",
  "cart.removeCoupon": "Remove",
  "cart.proceedCheckout": "Proceed to Checkout",
  "cart.continueShopping": "Continue Shopping",
  "cart.remove": "Remove from cart?",
  "cart.viewCart": "View Cart",
  "cart.checkout": "Checkout",

  // Checkout
  "checkout.title": "Checkout",
  "checkout.shipping": "Shipping",
  "checkout.review": "Review",
  "checkout.payment": "Payment",
  "checkout.confirmation": "Confirmation",
  "checkout.guestCheckout": "Checkout as Guest",
  "checkout.continueReview": "Continue to Review",
  "checkout.backToCart": "Back to Cart",
  "checkout.proceedPayment": "Proceed to Payment",

  // Auth
  "auth.login": "Login",
  "auth.register": "Create Account",
  "auth.forgotPassword": "Forgot Password?",
  "auth.noAccount": "Don't have an account?",
  "auth.hasAccount": "Already have an account?",
  "auth.verifyEmail": "Verify Your Email",
  "auth.resendCode": "Resend Code",

  // Account
  "account.welcome": "Welcome back",
  "account.orders": "My Orders",
  "account.addresses": "My Addresses",
  "account.profile": "My Profile",
  "account.changePassword": "Change Password",
  "account.noOrders": "No orders yet",
  "account.startShopping": "Start Shopping",

  // General
  "general.loading": "Loading...",
  "general.error": "Something went wrong",
  "general.retry": "Retry",
  "general.save": "Save Changes",
  "general.cancel": "Cancel",
  "general.delete": "Delete",
  "general.edit": "Edit",
  "general.close": "Close",
  "general.back": "Back",
  "general.next": "Next",
  "general.submit": "Submit",
  "general.search": "Search",
  "general.noResults": "No results found",
  "general.currency": "EGP",

  // Footer
  "footer.quickLinks": "Quick Links",
  "footer.services": "Services",
  "footer.contactInfo": "Contact Info",
  "footer.copyright": "© 2026 Lord Air Conditioning",
  "footer.allRights": "All rights reserved.",

  // Services page
  "services.title": "Our Services",
  "services.tagline": "Complete after-sales support for your air conditioning",
  "services.requestService": "Request This Service",
  "services.urgentCta": "Need urgent service? Call us now",

  // Contact page
  "contact.title": "Contact Us",
  "contact.sendMessage": "Send Message",
  "contact.thankYou": "Thank you! We'll contact you within 1 hour.",
  "contact.getDirections": "Get Directions",

  // FAQ page
  "faq.title": "Frequently Asked Questions",
  "faq.cantFind": "Can't find your answer?",

  // Order
  "order.confirmed": "Confirmed",
  "order.processing": "Processing",
  "order.shipped": "Shipped",
  "order.delivered": "Delivered",
  "order.cancelled": "Cancelled",
  "order.refunded": "Refunded",
  "order.pendingPayment": "Pending Payment",
  "order.cancelOrder": "Cancel Order",
  "order.trackOrder": "Track My Order",

  // Order Confirmation
  "orderConfirmation.title": "Order placed successfully!",
  "orderConfirmation.emailSent": "Confirmation email sent to",
  "orderConfirmation.estimatedDelivery":
    "Estimated delivery: 3–5 business days",
  "orderConfirmation.continueShopping": "Continue Shopping",
};

// Arabic translations
const ar: Translations = {
  "nav.home": "الرئيسية",
  "nav.products": "المنتجات",
  "nav.services": "الخدمات",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "nav.faq": "الأسئلة الشائعة",
  "nav.requestService": "طلب خدمة",
  "nav.login": "تسجيل الدخول",
  "nav.register": "إنشاء حساب",
  "nav.myOrders": "طلباتي",
  "nav.myAddresses": "عناويني",
  "nav.profile": "الملف الشخصي",
  "nav.logout": "تسجيل الخروج",

  "home.hero.headline": "وكيل معتمد لكاريير وميديا",
  "home.hero.tagline": "تكييف الهواء — منذ ١٩٨٦",
  "home.hero.shopNow": "تسوق الآن",
  "home.hero.ourServices": "خدماتنا",
  "home.featured.title": "منتجات مميزة",
  "home.featured.viewAll": "عرض جميع المنتجات",
  "home.services.title": "خدماتنا",
  "home.services.learnMore": "اعرف المزيد",
  "home.why.title": "لماذا تختار لورد",
  "home.testimonials.title": "ماذا يقول عملاؤنا",
  "home.cta.headline": "تحتاج مساعدة في الاختيار؟ اطلب استشارة مجانية",
  "home.cta.button": "اتصل بنا",

  "products.title": "منتجاتنا",
  "products.showing": "عرض {count} من {total} منتج",
  "products.filter": "تصفية",
  "products.clearFilters": "مسح جميع الفلاتر",
  "products.sort": "ترتيب حسب",
  "products.sortPriceLow": "السعر: من الأقل إلى الأعلى",
  "products.sortPriceHigh": "السعر: من الأعلى إلى الأقل",
  "products.sortName": "الاسم: أ–ي",
  "products.sortNewest": "الأحدث أولاً",
  "products.addToCart": "أضف إلى السلة",
  "products.outOfStock": "نفذ من المخزون",
  "products.quickView": "عرض سريع",
  "products.viewDetails": "عرض التفاصيل الكاملة",
  "products.inStock": "متوفر",
  "products.buyNow": "اشتري الآن",
  "products.added": "تمت الإضافة!",
  "products.relatedTitle": "قد يعجبك أيضاً",

  "cart.title": "سلة التسوق",
  "cart.empty": "سلة التسوق فارغة",
  "cart.browseProducts": "تصفح المنتجات",
  "cart.subtotal": "المجموع الفرعي",
  "cart.shipping": "الشحن",
  "cart.discount": "الخصم",
  "cart.total": "الإجمالي",
  "cart.free": "مجاني",
  "cart.couponPlaceholder": "أدخل كود الخصم",
  "cart.applyCoupon": "تطبيق",
  "cart.removeCoupon": "إزالة",
  "cart.proceedCheckout": "متابعة الشراء",
  "cart.continueShopping": "متابعة التسوق",
  "cart.remove": "إزالة من السلة؟",
  "cart.viewCart": "عرض السلة",
  "cart.checkout": "الدفع",

  "checkout.title": "إتمام الشراء",
  "checkout.shipping": "الشحن",
  "checkout.review": "المراجعة",
  "checkout.payment": "الدفع",
  "checkout.confirmation": "التأكيد",
  "checkout.guestCheckout": "الشراء كضيف",
  "checkout.continueReview": "متابعة إلى المراجعة",
  "checkout.backToCart": "العودة إلى السلة",
  "checkout.proceedPayment": "متابعة إلى الدفع",

  "auth.login": "تسجيل الدخول",
  "auth.register": "إنشاء حساب",
  "auth.forgotPassword": "نسيت كلمة المرور؟",
  "auth.noAccount": "ليس لديك حساب؟",
  "auth.hasAccount": "لديك حساب بالفعل؟",
  "auth.verifyEmail": "تأكيد البريد الإلكتروني",
  "auth.resendCode": "إعادة إرسال الكود",

  "account.welcome": "مرحباً بك",
  "account.orders": "طلباتي",
  "account.addresses": "عناويني",
  "account.profile": "ملفي الشخصي",
  "account.changePassword": "تغيير كلمة المرور",
  "account.noOrders": "لا توجد طلبات بعد",
  "account.startShopping": "ابدأ التسوق",

  "general.loading": "جاري التحميل...",
  "general.error": "حدث خطأ ما",
  "general.retry": "إعادة المحاولة",
  "general.save": "حفظ التغييرات",
  "general.cancel": "إلغاء",
  "general.delete": "حذف",
  "general.edit": "تعديل",
  "general.close": "إغلاق",
  "general.back": "رجوع",
  "general.next": "التالي",
  "general.submit": "إرسال",
  "general.search": "بحث",
  "general.noResults": "لا توجد نتائج",
  "general.currency": "ج.م",

  "footer.quickLinks": "روابط سريعة",
  "footer.services": "الخدمات",
  "footer.contactInfo": "معلومات الاتصال",
  "footer.copyright": "© ٢٠٢٦ لورد لتكييف الهواء",
  "footer.allRights": "جميع الحقوق محفوظة.",

  "services.title": "خدماتنا",
  "services.tagline": "دعم ما بعد البيع الكامل لتكييف الهواء الخاص بك",
  "services.requestService": "طلب هذه الخدمة",
  "services.urgentCta": "تحتاج خدمة عاجلة؟ اتصل بنا الآن",

  "contact.title": "اتصل بنا",
  "contact.sendMessage": "إرسال الرسالة",
  "contact.thankYou": "شكراً لك! سنتواصل معك خلال ساعة واحدة.",
  "contact.getDirections": "الحصول على الاتجاهات",

  "faq.title": "الأسئلة الشائعة",
  "faq.cantFind": "لم تجد إجابتك؟",

  "order.confirmed": "مؤكد",
  "order.processing": "قيد المعالجة",
  "order.shipped": "تم الشحن",
  "order.delivered": "تم التسليم",
  "order.cancelled": "ملغي",
  "order.refunded": "مسترد",
  "order.pendingPayment": "في انتظار الدفع",
  "order.cancelOrder": "إلغاء الطلب",
  "order.trackOrder": "تتبع طلبي",

  "orderConfirmation.title": "تم تقديم الطلب بنجاح!",
  "orderConfirmation.emailSent": "تم إرسال بريد التأكيد إلى",
  "orderConfirmation.estimatedDelivery": "موعد التسليم المتوقع: ٣-٥ أيام عمل",
  "orderConfirmation.continueShopping": "متابعة التسوق",
};

const translations: Record<Language, Translations> = { en, ar };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = Cookies.get("lord_language") as Language | undefined;
    if (saved && (saved === "en" || saved === "ar")) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    Cookies.set("lord_language", lang, { expires: 365 });
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] || key;
    },
    [language],
  );

  const dir = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
