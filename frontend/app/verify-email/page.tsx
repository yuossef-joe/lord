"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Mail, CheckCircle } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Button from "@/components/common/Button";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { verifyEmail, resendOtp } from "@/lib/api";
import { toast } from "react-toastify";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setIsVerifying(true);
    try {
      await verifyEmail({ email, otp: code });
      setVerified(true);
      toast.success(t("auth.verifySuccess"));
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      toast.error(t("auth.verifyError"));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendOtp(email);
      toast.success(t("auth.otpResent"));
    } catch {
      toast.error(t("auth.resendError"));
    } finally {
      setIsResending(false);
    }
  };

  if (verified) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-lord-navy">
          {t("auth.emailVerified")}
        </h2>
        <p className="mt-2 text-sm text-medium-gray">{t("auth.redirecting")}</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-lord-teal/10 p-4">
          <Mail className="h-8 w-8 text-lord-teal" />
        </div>
        <h1 className="text-2xl font-bold text-lord-navy">
          {t("auth.verifyEmail")}
        </h1>
        <p className="mt-1 text-sm text-medium-gray">
          {t("auth.otpSent")}{" "}
          <span className="font-medium text-lord-navy">{email}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            maxLength={1}
            className="h-12 w-12 rounded-button border-2 border-[#E8EAED] text-center text-lg font-bold text-lord-navy focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
          />
        ))}
      </div>

      <Button
        onClick={handleVerify}
        isLoading={isVerifying}
        disabled={otp.join("").length !== 6}
        className="mt-6 w-full"
      >
        {t("auth.verify")}
      </Button>

      <p className="mt-4 text-center text-sm text-medium-gray">
        {t("auth.noCode")}{" "}
        <button
          onClick={handleResend}
          disabled={isResending}
          className="font-medium text-lord-teal hover:underline disabled:opacity-50"
        >
          {isResending ? t("general.loading") : t("auth.resendOtp")}
        </button>
      </p>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <PageTransition>
      <SeoHead
        title="Verify Email | Lord"
        description="Verify your email address"
      />
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="w-full rounded-card border border-[#E8EAED] bg-white p-6 shadow-sm md:p-8"
        >
          <Suspense
            fallback={
              <div className="text-center text-medium-gray">Loading...</div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </motion.div>
      </div>
    </PageTransition>
  );
}
