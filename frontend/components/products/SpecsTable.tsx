"use client";

import React from "react";
import { motion } from "motion/react";
import { fadeInUp } from "@/lib/animations";
import { ProductSpecification } from "@/types/product";
import { useLanguage } from "@/context/LanguageContext";

interface SpecsTableProps {
  specifications: ProductSpecification[];
}

export default function SpecsTable({ specifications }: SpecsTableProps) {
  const { t } = useLanguage();

  if (!specifications || specifications.length === 0) return null;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h2 className="mb-4 text-xl font-bold text-lord-navy">
        {t("products.specifications")}
      </h2>
      <div className="overflow-hidden rounded-card border border-[#E8EAED]">
        <table className="w-full">
          <tbody>
            {specifications.map((spec, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-off-white" : "bg-white"}
              >
                <td className="px-4 py-3 text-sm font-medium text-lord-navy w-1/3">
                  {spec.key}
                </td>
                <td className="px-4 py-3 text-sm text-dark-charcoal">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
