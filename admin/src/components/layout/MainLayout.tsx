import { Outlet, Navigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useLanguage, type TranslationKey } from "@/context/LanguageContext";

const pageTitleMap: Record<string, TranslationKey> = {
  "/": "nav.dashboard",
  "/orders": "nav.orders",
  "/customers": "nav.customers",
  "/products": "nav.products",
  "/brands": "nav.brands",
  "/services": "nav.services",
  "/inquiries": "nav.inquiries",
  "/shipping": "nav.shipping",
  "/coupons": "nav.coupons",
  "/content": "nav.content",
  "/testimonials": "nav.testimonials",
  "/faqs": "nav.faqs",
  "/settings": "nav.settings",
};

function getPageTitleKey(pathname: string): TranslationKey {
  // Exact match first
  if (pageTitleMap[pathname]) {
    return pageTitleMap[pathname];
  }

  // Detail pages
  if (pathname.startsWith("/orders/")) return "page.orderDetails";
  if (pathname.startsWith("/customers/")) return "page.customerDetails";
  if (pathname.startsWith("/products/")) return "page.productDetails";
  if (pathname.startsWith("/brands/")) return "page.brandDetails";
  if (pathname.startsWith("/services/")) return "page.serviceDetails";
  if (pathname.startsWith("/inquiries/")) return "page.inquiryDetails";
  if (pathname.startsWith("/coupons/")) return "page.couponDetails";
  if (pathname.startsWith("/content/")) return "page.contentDetails";
  if (pathname.startsWith("/testimonials/")) return "page.testimonialDetails";
  if (pathname.startsWith("/faqs/")) return "page.faqDetails";
  if (pathname.startsWith("/settings/")) return "nav.settings";

  return "nav.dashboard";
}

export default function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const pageTitle = t(getPageTitleKey(location.pathname));

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header pageTitle={pageTitle} />

        <main className="flex-1 overflow-auto bg-offwhite p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
