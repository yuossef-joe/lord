import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const OrdersPage = lazy(() => import("@/pages/orders/OrdersPage"));
const OrderDetailPage = lazy(() => import("@/pages/orders/OrderDetailPage"));
const CustomersPage = lazy(() => import("@/pages/customers/CustomersPage"));
const CustomerDetailPage = lazy(
  () => import("@/pages/customers/CustomerDetailPage"),
);
const ProductsPage = lazy(() => import("@/pages/products/ProductsPage"));
const ProductCreatePage = lazy(
  () => import("@/pages/products/ProductCreatePage"),
);
const ProductEditPage = lazy(() => import("@/pages/products/ProductEditPage"));
const BrandsPage = lazy(() => import("@/pages/brands/BrandsPage"));
const ServicesPage = lazy(() => import("@/pages/services/ServicesPage"));
const ServiceCreatePage = lazy(
  () => import("@/pages/services/ServiceCreatePage"),
);
const ServiceEditPage = lazy(() => import("@/pages/services/ServiceEditPage"));
const InquiriesPage = lazy(() => import("@/pages/inquiries/InquiriesPage"));
const CouponsPage = lazy(() => import("@/pages/coupons/CouponsPage"));
const CouponCreatePage = lazy(() => import("@/pages/coupons/CouponCreatePage"));
const CouponEditPage = lazy(() => import("@/pages/coupons/CouponEditPage"));
const ContentPage = lazy(() => import("@/pages/content/ContentPage"));
const TestimonialsPage = lazy(
  () => import("@/pages/testimonials/TestimonialsPage"),
);
const FaqsPage = lazy(() => import("@/pages/faqs/FaqsPage"));
const FaqCreatePage = lazy(() => import("@/pages/faqs/FaqCreatePage"));
const FaqEditPage = lazy(() => import("@/pages/faqs/FaqEditPage"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner size={48} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

const protectedRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <SuspenseWrapper>
        <DashboardPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "orders",
    element: (
      <SuspenseWrapper>
        <OrdersPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "orders/:id",
    element: (
      <SuspenseWrapper>
        <OrderDetailPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "customers",
    element: (
      <SuspenseWrapper>
        <CustomersPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "customers/:id",
    element: (
      <SuspenseWrapper>
        <CustomerDetailPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "products",
    element: (
      <SuspenseWrapper>
        <ProductsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "products/create",
    element: (
      <SuspenseWrapper>
        <ProductCreatePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "products/:id/edit",
    element: (
      <SuspenseWrapper>
        <ProductEditPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "brands",
    element: (
      <SuspenseWrapper>
        <BrandsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "services",
    element: (
      <SuspenseWrapper>
        <ServicesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "services/create",
    element: (
      <SuspenseWrapper>
        <ServiceCreatePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "services/:id/edit",
    element: (
      <SuspenseWrapper>
        <ServiceEditPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "inquiries",
    element: (
      <SuspenseWrapper>
        <InquiriesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "coupons",
    element: (
      <SuspenseWrapper>
        <CouponsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "coupons/create",
    element: (
      <SuspenseWrapper>
        <CouponCreatePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "coupons/:id/edit",
    element: (
      <SuspenseWrapper>
        <CouponEditPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "content",
    element: (
      <SuspenseWrapper>
        <ContentPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "testimonials",
    element: (
      <SuspenseWrapper>
        <TestimonialsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "faqs",
    element: (
      <SuspenseWrapper>
        <FaqsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "faqs/create",
    element: (
      <SuspenseWrapper>
        <FaqCreatePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "faqs/:id/edit",
    element: (
      <SuspenseWrapper>
        <FaqEditPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: "settings",
    element: (
      <SuspenseWrapper>
        <SettingsPage />
      </SuspenseWrapper>
    ),
  },
];

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: protectedRoutes,
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
