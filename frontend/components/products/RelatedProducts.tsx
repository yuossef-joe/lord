"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
  brandId?: string;
}

export default function RelatedProducts({
  currentProductId,
  categoryId,
  brandId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams();
        params.set("limit", "4");
        if (categoryId) params.set("category", categoryId);
        else if (brandId) params.set("brand", brandId);

        const data = (await fetchProducts(params.toString())) as {
          data: Product[];
        };
        setProducts(
          (data.data || [])
            .filter((p) => p._id !== currentProductId)
            .slice(0, 4),
        );
      } catch {
        setProducts([]);
      }
    };
    load();
  }, [currentProductId, categoryId, brandId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-xl font-bold text-lord-navy">
        {t("products.relatedProducts")}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {products.map((product) => (
          <motion.div key={product._id} variants={staggerItem}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
