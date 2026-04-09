import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { FAQ } from "@/types";
import { MOCK_FAQS } from "@/lib/mock-data";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import SearchInput from "@/components/common/SearchInput";
import ConfirmDialog from "@/components/common/ConfirmDialog";

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
/*  Extended mock data                                                */
/* ------------------------------------------------------------------ */

const EXTENDED_FAQS: FAQ[] = [
  ...MOCK_FAQS,
  {
    id: "f4",
    question: "What payment methods do you accept?",
    answer:
      "We accept Visa, Mastercard, mobile wallets (Vodafone Cash, Orange Money), and cash on delivery for orders within Cairo and Giza.",
    category: "Payment",
    displayOrder: 1,
    isActive: true,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "f5",
    question: "How long does shipping take?",
    answer:
      "Delivery within Cairo and Giza takes 2-3 business days. Other governorates may take 3-5 business days.",
    category: "Shipping",
    displayOrder: 2,
    isActive: true,
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "f6",
    question: "Do you provide maintenance contracts?",
    answer:
      "Yes, we offer annual maintenance contracts that include periodic cleaning and inspection of your AC units.",
    category: "Services",
    displayOrder: 1,
    isActive: false,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "f7",
    question: "Can I return a product?",
    answer:
      "Products can be returned within 14 days of delivery if unopened and in original packaging. Installation voids the return policy.",
    category: "General",
    displayOrder: 2,
    isActive: true,
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
  },
];

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
  const [faqs, setFaqs] = useState(EXTENDED_FAQS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null);

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
          f.question.toLowerCase().includes(term) ||
          f.answer.toLowerCase().includes(term),
      );
    }

    return result;
  }, [faqs, searchTerm, activeCategory]);

  /* ---------- handlers ---------- */

  const handleDelete = () => {
    if (!deleteTarget) return;
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
                  <h3 className="font-medium text-navy mb-1">{faq.question}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {faq.answer}
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
        message={`Are you sure you want to delete "${deleteTarget?.question ?? ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}
