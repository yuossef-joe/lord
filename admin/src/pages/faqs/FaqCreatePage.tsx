import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";

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
/*  Schema                                                            */
/* ------------------------------------------------------------------ */

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().min(1, "Category is required"),
  displayOrder: z.number().min(0),
  isActive: z.boolean(),
});

type FaqFormValues = z.infer<typeof faqSchema>;

const CATEGORIES = ["General", "Products", "Services", "Shipping", "Payment"];

const inputStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white";
const selectStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white appearance-none";

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function FaqCreatePage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      displayOrder: 1,
      isActive: true,
    },
  });

  const onSubmit = (_data: FaqFormValues) => {
    // Mock: save FAQ
    navigate("/faqs");
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "FAQs", href: "/faqs" },
            { label: "Create FAQ" },
          ]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">Create FAQ</h1>
      </motion.div>

      {/* Form */}
      <motion.div variants={itemVariants}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              label="Question"
              required
              error={errors.question?.message}
            >
              <input
                {...register("question")}
                className={inputStyles}
                placeholder="Enter the question"
              />
            </FormField>

            <FormField label="Answer" required error={errors.answer?.message}>
              <textarea
                {...register("answer")}
                className={`${inputStyles} h-32 resize-none py-2`}
                placeholder="Enter the answer…"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Category"
                required
                error={errors.category?.message}
              >
                <select {...register("category")} className={selectStyles}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Sort Order"
                error={errors.displayOrder?.message}
              >
                <input
                  type="number"
                  {...register("displayOrder", { valueAsNumber: true })}
                  className={inputStyles}
                  min={0}
                />
              </FormField>
            </div>

            <FormField label="Published">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="h-4 w-4 rounded border-gray-300 text-teal focus:ring-teal"
                />
                <span className="text-sm text-gray-700">Publish this FAQ</span>
              </label>
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/faqs")}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  );
}
