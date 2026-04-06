"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { SlidersHorizontal } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProductCard from "@/components/products/ProductCard";
import FilterSidebar from "@/components/products/FilterSidebar";
import SortDropdown from "@/components/products/SortDropdown";
import Button from "@/components/common/Button";
import { fetchProducts, fetchBrands, fetchProductCategories } from "@/lib/api";
import { Product, Brand, ProductCategory } from "@/types/product";
import { useLanguage } from "@/context/LanguageContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const currentPage = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "";
  const brand = searchParams.get("brand") || "";
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentPage > 1) params.set("page", String(currentPage));
      params.set("limit", "12");
      if (sort) params.set("sort", sort);
      if (brand) params.set("brand", brand);
      if (category) params.set("category", category);
      if (search) params.set("search", search);

      const data = (await fetchProducts(params.toString())) as {
        data: Product[];
        pagination: { total: number; totalPages: number };
      };
      setProducts(data.data || []);
      setTotalProducts(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sort, brand, category, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    Promise.all([fetchBrands(), fetchProductCategories()])
      .then(([brandsData, catsData]) => {
        const b = brandsData as { data: Brand[] };
        const c = catsData as { data: ProductCategory[] };
        setBrands(b.data || []);
        setCategories(c.data || []);
      })
      .catch(() => {});
  }, []);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset page on filter change
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.products") },
          ]}
        />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-lord-navy md:text-3xl">
              {t("products.title")}
            </h1>
            <p className="text-sm text-medium-gray mt-1">
              Showing {products.length} of {totalProducts} products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 rounded-button border border-[#E8EAED] px-4 py-2 text-sm text-lord-navy lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("products.filter")}
            </button>
            <SortDropdown
              value={sort}
              onChange={(val) => updateFilters("sort", val)}
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            <FilterSidebar
              brands={brands}
              categories={categories}
              selectedBrand={brand}
              selectedCategory={category}
              onBrandChange={(val) => updateFilters("brand", val)}
              onCategoryChange={(val) => updateFilters("category", val)}
              onClearAll={clearAllFilters}
            />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-[380px] rounded-card skeleton-shimmer"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-lg text-medium-gray mb-4">
                  {t("general.noResults")}
                </p>
                <Button variant="secondary" onClick={clearAllFilters}>
                  {t("products.clearFilters")}
                </Button>
              </div>
            ) : (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {products.map((product) => (
                    <motion.div key={product._id} variants={staggerItem}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => updateFilters("page", String(i + 1))}
                        className={`h-10 w-10 rounded-button text-sm font-medium transition-colors ${
                          currentPage === i + 1
                            ? "bg-lord-teal text-white"
                            : "bg-white text-lord-navy border border-[#E8EAED] hover:bg-off-white"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-lord-navy">
                {t("products.filter")}
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-medium-gray"
              >
                ✕
              </button>
            </div>
            <FilterSidebar
              brands={brands}
              categories={categories}
              selectedBrand={brand}
              selectedCategory={category}
              onBrandChange={(val) => {
                updateFilters("brand", val);
                setIsMobileFilterOpen(false);
              }}
              onCategoryChange={(val) => {
                updateFilters("category", val);
                setIsMobileFilterOpen(false);
              }}
              onClearAll={() => {
                clearAllFilters();
                setIsMobileFilterOpen(false);
              }}
            />
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
