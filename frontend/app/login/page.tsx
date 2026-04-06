"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginSchema } from "@/lib/validations";
import { fadeInUp } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Button from "@/components/common/Button";
import SeoHead from "@/components/common/SeoHead";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "react-toastify";
import type { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success(t("auth.loginSuccess"));
      router.push("/account");
    } catch {
      toast.error(t("auth.loginError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <SeoHead
        title={`${t("auth.login")} | Lord`}
        description="Log in to your Lord account"
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
              {t("auth.login")}
            </h1>
            <p className="mt-1 text-sm text-medium-gray">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("auth.email")}
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-lord-navy">
                  {t("auth.password")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-lord-teal hover:underline"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              {t("auth.login")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-medium-gray">
            {t("auth.noAccount")}{" "}
            <Link
              href="/register"
              className="font-medium text-lord-teal hover:underline"
            >
              {t("auth.register")}
            </Link>
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
