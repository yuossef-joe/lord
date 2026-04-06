"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { KeyRound, ArrowLeft, CheckCircle } from "lucide-react";
import {
  forgotPasswordEmailSchema,
  resetPasswordSchema,
} from "@/lib/validations";
import { fadeInUp } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Button from "@/components/common/Button";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { forgotPassword, resetPassword } from "@/lib/api";
import { toast } from "react-toastify";
import type { z } from "zod";

type EmailFormData = z.infer<typeof forgotPasswordEmailSchema>;
type ResetFormData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const { t, isRTL } = useLanguage();
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setStep("reset");
      toast.success(t("auth.otpSent"));
    } catch {
      toast.error(t("auth.forgotPasswordError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true);
    try {
      await resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      setStep("done");
      toast.success(t("auth.passwordResetSuccess"));
    } catch {
      toast.error(t("auth.resetError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <SeoHead
        title={`${t("auth.forgotPassword")} | Lord`}
        description="Reset your password"
      />
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full rounded-card border border-[#E8EAED] bg-white p-6 shadow-sm md:p-8"
        >
          {step === "email" && (
            <>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 inline-flex rounded-full bg-lord-teal/10 p-4">
                  <KeyRound className="h-8 w-8 text-lord-teal" />
                </div>
                <h1 className="text-2xl font-bold text-lord-navy">
                  {t("auth.forgotPassword")}
                </h1>
                <p className="mt-1 text-sm text-medium-gray">
                  {t("auth.forgotPasswordDesc")}
                </p>
              </div>

              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-4"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-lord-navy">
                    {t("auth.email")}
                  </label>
                  <input
                    {...emailForm.register("email")}
                    type="email"
                    className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                    placeholder="email@example.com"
                  />
                  {emailForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  {t("auth.sendResetCode")}
                </Button>
              </form>

              <Link
                href="/login"
                className="mt-4 flex items-center justify-center gap-1 text-sm text-lord-teal hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("auth.backToLogin")}
              </Link>
            </>
          )}

          {step === "reset" && (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-lord-navy">
                  {t("auth.resetPassword")}
                </h1>
                <p className="mt-1 text-sm text-medium-gray">
                  {t("auth.resetPasswordDesc")} {email}
                </p>
              </div>

              <form
                onSubmit={resetForm.handleSubmit(onResetSubmit)}
                className="space-y-4"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-lord-navy">
                    {t("auth.otpCode")}
                  </label>
                  <input
                    {...resetForm.register("otp")}
                    className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm text-center tracking-widest focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                    placeholder="000000"
                    maxLength={6}
                  />
                  {resetForm.formState.errors.otp && (
                    <p className="mt-1 text-xs text-red-500">
                      {resetForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-lord-navy">
                    {t("auth.newPassword")}
                  </label>
                  <input
                    {...resetForm.register("newPassword")}
                    type="password"
                    className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                  />
                  {resetForm.formState.errors.newPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-lord-navy">
                    {t("auth.confirmPassword")}
                  </label>
                  <input
                    {...resetForm.register("confirmPassword")}
                    type="password"
                    className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                  />
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  {t("auth.resetPassword")}
                </Button>
              </form>
            </>
          )}

          {step === "done" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-lord-navy">
                {t("auth.passwordResetSuccess")}
              </h2>
              <p className="mt-2 text-sm text-medium-gray">
                {t("auth.passwordResetDesc")}
              </p>
              <Link href="/login" className="mt-4 block">
                <Button className="w-full">{t("auth.login")}</Button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
