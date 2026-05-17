import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import type { Product } from "@/types";
import { deleteProduct, fetchProducts } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";
import { localizedSearchText, localizedValue } from "@/lib/localization";

const columnHelper = createColumnHelper<Product>();

type FilterTab = "all" | "active" | "inactive";

const FILTER_TABS: { labelKey: string; value: FilterTab }[] = [
  { labelKey: "common.all", value: "all" },
  { labelKey: "common.active", value: "active" },
  { labelKey: "common.inactive", value: "inactive" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProductsPage() {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void fetchProducts("").then((response) => setProducts(response.data));
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("common.product"),
        cell: (info) => {
          const product = info.row.original;
          const image = product.images?.[0];
          const productName = localizedValue(
            language,
            product.name,
            product.nameAr,
          );
          const categoryName = localizedValue(
            language,
            product.category?.name,
            product.category?.nameAr,
          );
          return (
            <div className="flex items-center gap-3">
              {image ? (
                <img
                  src={image.url}
                  alt={image.altText ?? productName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-200" />
              )}
              <div>
                <Link
                  to={`/products/${product.id}/edit`}
                  className="font-medium text-gray-900 hover:text-teal transition"
                >
                  {productName}
                </Link>
                <div className="text-xs text-gray-500">{categoryName}</div>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("brand", {
        header: t("common.brand"),
        cell: (info) =>
          localizedValue(
            language,
            info.getValue()?.name,
            info.getValue()?.nameAr,
          ) || "—",
      }),
      columnHelper.accessor("price", {
        header: t("common.price"),
        cell: (info) => {
          const product = info.row.original;
          if (product.originalPrice) {
            return (
              <div>
                <span className="font-semibold">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs text-gray-400 line-through ml-2">
                  {formatCurrency(product.originalPrice)}
                </span>
              </div>
            );
          }
          return (
            <span className="font-semibold">
              {formatCurrency(product.price)}
            </span>
          );
        },
      }),
      columnHelper.accessor("stockQuantity", {
        header: t("common.stock"),
        cell: (info) => {
          const stock = info.getValue();
          let color = "text-green-600";
          if (stock < 10) color = "text-red-600";
          else if (stock < 50) color = "text-amber-600";
          return <span className={`font-medium ${color}`}>{stock}</span>;
        },
      }),
      columnHelper.accessor("isActive", {
        header: t("common.status"),
        cell: (info) => (
          <Badge variant={info.getValue() ? "success" : "default"}>
            {info.getValue() ? t("common.active") : t("common.inactive")}
          </Badge>
        ),
      }),
      columnHelper.accessor("isFeatured", {
        header: t("common.featured"),
        cell: (info) =>
          info.getValue() ? (
            <Star size={18} className="fill-amber-400 text-amber-400" />
          ) : (
            <Star size={18} className="text-gray-300" />
          ),
      }),
      columnHelper.accessor("createdAt", {
        header: t("common.date"),
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <div className="flex items-center gap-1">
            <Link
              to={`/products/${info.row.original.id}/edit`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
            >
              <Pencil size={16} />
            </Link>
            <button
              type="button"
              onClick={() => {
                void deleteProduct(info.row.original.id).then(() =>
                  setProducts((current) =>
                    current.filter((item) => item.id !== info.row.original.id),
                  ),
                );
              }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      }),
    ],
    [language, t],
  );

  const filteredProducts = useMemo(() => {
    let result: Product[] = products;

    if (activeFilter === "active") {
      result = result.filter((p) => p.isActive);
    } else if (activeFilter === "inactive") {
      result = result.filter((p) => !p.isActive);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((p) =>
        localizedSearchText(
          p.name,
          p.nameAr,
          p.description,
          p.descriptionAr,
          p.brand.name,
          p.brand.nameAr,
          p.category.name,
          p.category.nameAr,
        ).includes(term),
      );
    }

    return result;
  }, [activeFilter, products, searchTerm]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: t("common.dashboard"), href: "/" },
            { label: t("common.products") },
          ]}
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">
          {t("common.products")}
        </h1>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t("common.searchProducts")}
          />
          <Link to="/products/create">
            <Button leftIcon={<Plus size={18} />}>
              {t("common.addProduct")}
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === tab.value
                ? "bg-teal text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <DataTable
          columns={columns}
          data={filteredProducts}
          emptyMessage={t("common.noProducts")}
        />
      </motion.div>
    </motion.div>
  );
}
