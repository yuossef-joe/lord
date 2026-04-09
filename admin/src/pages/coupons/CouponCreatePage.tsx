import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { Sparkles, Tag, Calendar, Eye } from "lucide-react";
import { generateCouponCode, formatCurrency, formatDate } from "@/lib/utils";
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

const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  description: z.string().optional(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().min(0, "Must be ≥ 0"),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  isActive: z.boolean(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type CouponFormValues = z.infer<typeof couponSchema>;

/* ------------------------------------------------------------------ */
/*  Shared styles                                                     */
/* ------------------------------------------------------------------ */

const inputStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white";
const selectStyles =
  "w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-teal focus:border-teal outline-none transition bg-white appearance-none";

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function CouponCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      type: "percentage",
      value: 0,
      minOrderAmount: undefined,
      maxDiscount: undefined,
      usageLimit: undefined,
      isActive: true,
      startDate: "",
      endDate: "",
    },
  });

  const couponType = watch("type");
  const code = watch("code");
  const value = watch("value");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const isActive = watch("isActive");

  const onSubmit = (_data: CouponFormValues) => {
    setIsSubmitting(true);
    // Mock: save coupon
    setTimeout(() => {
      toast.success("Coupon created successfully!");
      navigate("/coupons");
    }, 500);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Coupons", href: "/coupons" },
            { label: "Create Coupon" },
          ]}
        />
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center mb-6 mt-4"
        >
          <h1 className="text-2xl font-bold text-navy">Create Coupon</h1>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* ========================================== */}
          {/*  Left Column                               */}
          {/* ========================================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coupon Details */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                <Tag size={18} /> Coupon Details
              </h2>
              <div className="space-y-4">
                {/* Code */}
                <FormField
                  label="Coupon Code"
                  error={errors.code?.message}
                  required
                >
                  <div className="flex gap-2">
                    <input
                      {...register("code")}
                      className={`${inputStyles} font-mono uppercase flex-1`}
                      placeholder="e.g. SUMMER20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<Sparkles size={14} />}
                      onClick={() => setValue("code", generateCouponCode())}
                    >
                      Generate
                    </Button>
                  </div>
                </FormField>

                {/* Description */}
                <FormField
                  label="Description"
                  error={errors.description?.message}
                >
                  <textarea
                    {...register("description")}
                    rows={3}
                    className={`${inputStyles} h-auto py-2 resize-none`}
                    placeholder="Optional description"
                  />
                </FormField>

                {/* Type + Value */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Discount Type"
                    error={errors.type?.message}
                    required
                  >
                    <select {...register("type")} className={selectStyles}>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </FormField>

                  <FormField
                    label={
                      couponType === "percentage"
                        ? "Discount (%)"
                        : "Discount (EGP)"
                    }
                    error={errors.value?.message}
                    required
                  >
                    <input
                      type="number"
                      {...register("value", { valueAsNumber: true })}
                      className={inputStyles}
                      placeholder="0"
                      min={0}
                      max={couponType === "percentage" ? 100 : undefined}
                    />
                  </FormField>
                </div>
              </div>
            </Card>

            {/* Restrictions */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">
                Restrictions
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Minimum Order Amount"
                    error={errors.minOrderAmount?.message}
                  >
                    <input
                      type="number"
                      {...register("minOrderAmount", { valueAsNumber: true })}
                      className={inputStyles}
                      placeholder="0"
                      min={0}
                    />
                  </FormField>

                  {couponType === "percentage" && (
                    <FormField
                      label="Maximum Discount"
                      error={errors.maxDiscount?.message}
                    >
                      <input
                        type="number"
                        {...register("maxDiscount", { valueAsNumber: true })}
                        className={inputStyles}
                        placeholder="No limit"
                        min={0}
                      />
                    </FormField>
                  )}
                </div>

                <FormField
                  label="Usage Limit"
                  error={errors.usageLimit?.message}
                >
                  <input
                    type="number"
                    {...register("usageLimit", { valueAsNumber: true })}
                    className={inputStyles}
                    placeholder="Unlimited"
                    min={1}
                  />
                </FormField>
              </div>
            </Card>

            {/* Validity */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                <Calendar size={18} /> Validity Period
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Start Date"
                  error={errors.startDate?.message}
                  required
                >
                  <input
                    type="date"
                    {...register("startDate")}
                    className={inputStyles}
                  />
                </FormField>
                <FormField
                  label="End Date"
                  error={errors.endDate?.message}
                  required
                >
                  <input
                    type="date"
                    {...register("endDate")}
                    className={inputStyles}
                  />
                </FormField>
              </div>
            </Card>
          </div>

          {/* ========================================== */}
          {/*  Right Column                              */}
          {/* ========================================== */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4">Status</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-teal transition" />
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </Card>

            {/* Preview */}
            <Card>
              <h2 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
                <Eye size={18} /> Preview
              </h2>
              <div className="bg-gradient-to-br from-teal to-teal/80 rounded-xl p-5 text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -left-3 -bottom-3 w-16 h-16 bg-white/10 rounded-full" />

                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                    Discount Code
                  </p>
                  <p className="text-2xl font-bold font-mono tracking-wider mb-3">
                    {code || "CODE"}
                  </p>
                  <div className="text-3xl font-extrabold mb-2">
                    {couponType === "percentage"
                      ? `${value || 0}% OFF`
                      : formatCurrency(value || 0) + " OFF"}
                  </div>
                  {startDate && endDate && (
                    <p className="text-xs opacity-80">
                      Valid: {formatDate(startDate || new Date().toISOString())}{" "}
                      – {formatDate(endDate || new Date().toISOString())}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
}
