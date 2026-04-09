import { Outlet, Navigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const pageTitleMap: Record<string, string> = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/customers": "Customers",
  "/products": "Products",
  "/brands": "Brands & Categories",
  "/services": "Services",
  "/inquiries": "Inquiries & Requests",
  "/coupons": "Coupons & Promos",
  "/content": "Content Pages",
  "/testimonials": "Testimonials",
  "/faqs": "FAQs",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitleMap[pathname]) {
    return pageTitleMap[pathname];
  }

  // Detail pages
  if (pathname.startsWith("/orders/")) return "Order Details";
  if (pathname.startsWith("/customers/")) return "Customer Details";
  if (pathname.startsWith("/products/")) return "Product Details";
  if (pathname.startsWith("/brands/")) return "Brand Details";
  if (pathname.startsWith("/services/")) return "Service Details";
  if (pathname.startsWith("/inquiries/")) return "Inquiry Details";
  if (pathname.startsWith("/coupons/")) return "Coupon Details";
  if (pathname.startsWith("/content/")) return "Content Details";
  if (pathname.startsWith("/testimonials/")) return "Testimonial Details";
  if (pathname.startsWith("/faqs/")) return "FAQ Details";
  if (pathname.startsWith("/settings/")) return "Settings";

  return "Dashboard";
}

export default function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

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
