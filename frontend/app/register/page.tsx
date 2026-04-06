"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { registerSchema } from "@/lib/validations";
import { fadeInUp } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Button from "@/components/common/Button";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { registerCustomer } from "@/lib/api";
import { getPasswordStrength, getPasswordStrengthLabel } from "@/lib/utils";
import { toast } from "react-toastify";
import type { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password", "");
  const strength = getPasswordStrength(passwordValue);
  const strengthLabel = getPasswordStrengthLabel(strength);
  const strengthColors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-600",
  ];

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await registerCustomer(data);
      toast.success(t("auth.registerSuccess"));
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch {
      toast.error(t("auth.registerError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <SeoHead
        title={`${t("auth.register")} | Lord`}
        description="Create your Lord account"
      />
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full rounded-card border border-[#E8EAED] bg-white p-6 shadow-sm md:p-8"
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-lord-navy">
              {t("auth.register")}
            </h1>
            <p className="mt-1 text-sm text-medium-gray">
              {t("auth.registerSubtitle")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("auth.name")} *
              </label>
              <input
                {...register("name")}
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("auth.email")} *
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("auth.phone")} *
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                placeholder="01xxxxxxxxx"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("auth.nationalId")} *
              </label>
              <input
                {...register("nationalId")}
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                placeholder="14-digit national ID"
                maxLength={14}
              />
              {errors.nationalId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.nationalId.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("auth.password")} *
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-medium-gray hover:text-lord-navy"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
              {/* Strength meter */}
              {passwordValue && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength
                            ? strengthColors[strength]
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-medium-gray">
                    {strengthLabel.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("auth.confirmPassword")} *
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                autoComplete="new-password"
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              {t("auth.register")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-medium-gray">
            {t("auth.hasAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-lord-teal hover:underline"
            >
              {t("auth.login")}
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
