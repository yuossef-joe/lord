import { useState } from "react";
import { motion } from "motion/react";
import { Star, Trash2, Check, X } from "lucide-react";
import type { Testimonial } from "@/types";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import Breadcrumb from "@/components/common/Breadcrumb";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
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

const EXTENDED_TESTIMONIALS: Testimonial[] = [
  ...MOCK_TESTIMONIALS,
  {
    id: "t3",
    customerName: "Khaled Youssef",
    location: "Alexandria",
    rating: 5,
    quote:
      "Best AC dealer in Egypt. The Carrier unit they installed works perfectly even in the hottest summer days. Highly recommended!",
    status: "approved",
    isFeatured: false,
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: "2024-08-01T00:00:00Z",
  },
  {
    id: "t4",
    customerName: "Fatma Ali",
    location: "Giza",
    rating: 3,
    quote:
      "Good product but delivery took longer than expected. Customer support was helpful though.",
    status: "pending",
    isFeatured: false,
    createdAt: "2024-08-18T00:00:00Z",
    updatedAt: "2024-08-18T00:00:00Z",
  },
  {
    id: "t5",
    customerName: "Omar Reda",
    location: "Mansoura",
    rating: 5,
    quote:
      "Professional installation and great after-sales service. The maintenance team is very responsive.",
    status: "approved",
    isFeatured: true,
    createdAt: "2024-08-05T00:00:00Z",
    updatedAt: "2024-08-05T00:00:00Z",
  },
  {
    id: "t6",
    customerName: "Nadia Samir",
    location: "Cairo",
    rating: 4,
    quote:
      "Excellent pricing compared to competitors. The Midea unit is energy efficient and quiet.",
    status: "pending",
    isFeatured: false,
    createdAt: "2024-08-20T00:00:00Z",
    updatedAt: "2024-08-20T00:00:00Z",
  },
];

/* ------------------------------------------------------------------ */
/*  Star rating component                                             */
/* ------------------------------------------------------------------ */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState(EXTENDED_TESTIMONIALS);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  /* ---------- handlers ---------- */

  const handleApprove = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "approved" as const,
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
  };

  const handleReject = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "rejected" as const,
              updatedAt: new Date().toISOString(),
            }
          : t,
      ),
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ---------- render ---------- */

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[{ label: "Dashboard", href: "/" }, { label: "Testimonials" }]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">Testimonials</h1>
        <span className="text-sm text-gray-500">
          {testimonials.length} total
        </span>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <motion.div key={testimonial.id} variants={itemVariants}>
            <Card className="flex flex-col h-full">
              {/* Rating */}
              <div className="mb-3">
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Content */}
              <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Customer info */}
              <div className="mb-3">
                <p className="font-medium text-gray-900">
                  {testimonial.customerName}
                </p>
                {testimonial.location && (
                  <p className="text-xs text-gray-500">
                    {testimonial.location}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDate(testimonial.createdAt)}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <Badge
                  variant={
                    testimonial.status === "approved"
                      ? "success"
                      : testimonial.status === "rejected"
                        ? "error"
                        : "warning"
                  }
                >
                  {testimonial.status === "approved"
                    ? "Approved"
                    : testimonial.status === "rejected"
                      ? "Rejected"
                      : "Pending"}
                </Badge>

                <div className="flex items-center gap-1">
                  {testimonial.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(testimonial.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleReject(testimonial.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setDeleteTarget(testimonial)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    title="Delete"
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
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.customerName ?? ""}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </motion.div>
  );
}
