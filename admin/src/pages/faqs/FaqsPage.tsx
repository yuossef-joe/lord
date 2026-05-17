import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { FAQ } from "@/types";
import { deleteFaq, fetchFaqs } from "@/lib/api";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import SearchInput from "@/components/common/SearchInput";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useLanguage } from "@/context/LanguageContext";
import { localizedSearchText } from "@/lib/localization";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  Categories                                                        */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  "All",
  "General",
  "Products",
  "Services",
  "Shipping",
  "Payment",
];

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function FaqsPage() {
  const { localize } = useLanguage();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null);

  useEffect(() => {
    void fetchFaqs().then((response) => setFaqs(response.data));
  }, []);

  /* ---------- filtered data ---------- */

  const filteredFaqs = useMemo(() => {
    let result = faqs;

    if (activeCategory !== "All") {
      result = result.filter((f) => f.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (f) =>
          localizedSearchText(
            f.question,
            f.questionAr,
            f.answer,
            f.answerAr,
          ).includes(term),
      );
    }

    return result;
  }, [faqs, searchTerm, activeCategory]);

  /* ---------- handlers ---------- */

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteFaq(deleteTarget.id);
    setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ---------- render ---------- */

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[{ label: "Dashboard", href: "/" }, { label: "FAQs" }]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">FAQs</h1>
        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search FAQs…"
          />
          <Link to="/faqs/create">
            <Button leftIcon={<Plus size={16} />}>Add FAQ</Button>
          </Link>
        </div>
      </motion.div>

      {/* Category filter */}
      <motion.div variants={itemVariants} className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-teal text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* FAQ list */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 && (
          <motion.div variants={itemVariants}>
            <Card className="text-center py-12">
              <p className="text-gray-500">No FAQs found.</p>
            </Card>
          </motion.div>
        )}

        {filteredFaqs.map((faq) => (
          <motion.div key={faq.id} variants={itemVariants}>
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-navy mb-1">
                    {localize(faq.question, faq.questionAr)}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {localize(faq.answer, faq.answerAr)}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="teal">{faq.category}</Badge>
                    <span className="text-xs text-gray-500">
                      Order: {faq.displayOrder}
                    </span>
                    <Badge variant={faq.isActive ? "success" : "default"}>
                      {faq.isActive ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/faqs/${faq.id}/edit`}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(faq)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete FAQ"
        message={`Are you sure you want to delete "${localize(deleteTarget?.question, deleteTarget?.questionAr)}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}
