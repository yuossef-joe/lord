"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/common/ScrollReveal";
import ProductCard from "@/components/products/ProductCard";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types/product";

export default function FeaturedProducts() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts("featured=true&limit=8")
      .then((data: unknown) => {
        const res = data as { data: Product[] };
        setProducts(res.data || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section className="bg-off-white py-16 md:py-20">
      <div className="mx-auto max-w-container px-4 md:px-6">
        <ScrollReveal>
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-lord-navy md:text-4xl">
              {t("home.featured.title")}
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-lord-teal hover:underline hidden sm:block"
            >
              {t("home.featured.viewAll")} →
            </Link>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[360px] rounded-card skeleton-shimmer"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={staggerItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <Link
          href="/products"
          className="mt-8 block text-center text-sm font-medium text-lord-teal hover:underline sm:hidden"
        >
          {t("home.featured.viewAll")} →
        </Link>
      </div>
    </section>
  );
}
