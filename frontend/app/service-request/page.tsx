"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Wrench, Send, CheckCircle } from "lucide-react";
import { serviceRequestSchema } from "@/lib/validations";
import { fadeInUp } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import SeoHead from "@/components/common/SeoHead";
import { useLanguage } from "@/context/LanguageContext";
import { submitServiceRequest } from "@/lib/api";
import { toast } from "react-toastify";
import type { z } from "zod";

type ServiceFormData = z.infer<typeof serviceRequestSchema>;

const SERVICE_TYPES = [
  { value: "installation", label: "Installation" },
  { value: "maintenance", label: "Maintenance" },
  { value: "repair", label: "Repair" },
  { value: "inspection", label: "Inspection" },
  { value: "spare-parts", label: "Spare Parts" },
];

export default function ServiceRequestPage() {
  const { t, isRTL } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceRequestSchema),
  });

  const onSubmit = async (data: ServiceFormData) => {
    setIsSubmitting(true);
    try {
      await submitServiceRequest(data);
      setIsSubmitted(true);
      reset();
    } catch {
      toast.error(t("general.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <PageTransition>
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4 py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 inline-flex rounded-full bg-green-100 p-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-lord-navy">
              {t("services.requestSubmitted")}
            </h2>
            <p className="mt-2 text-medium-gray">{t("services.requestDesc")}</p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="secondary"
              className="mt-4"
            >
              {t("services.submitAnother")}
            </Button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SeoHead
        title={`${t("services.requestService")} | Lord`}
        description="Request AC installation, maintenance, or repair services from Lord."
      />

      <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.services"), href: "/services" },
            { label: t("services.requestService") },
          ]}
        />

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-6 rounded-card border border-[#E8EAED] bg-white p-6 md:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-lord-teal/10 p-3 text-lord-teal">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-lord-navy">
                {t("services.requestService")}
              </h1>
              <p className="text-sm text-medium-gray">
                {t("services.requestFormDesc")}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-lord-navy">
                  {t("contact.name")} *
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
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("auth.email")}
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("services.serviceType")} *
              </label>
              <select
                {...register("serviceTypeId")}
                className="w-full rounded-button border border-[#E8EAED] bg-white px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
              >
                <option value="">Select service type</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.serviceTypeId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.serviceTypeId.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("services.acBrand")}
              </label>
              <select
                {...register("unitBrand")}
                className="w-full rounded-button border border-[#E8EAED] bg-white px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
              >
                <option value="">Select brand</option>
                <option value="Carrier">Carrier</option>
                <option value="Midea">Midea</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("services.installationAddress")}
              </label>
              <textarea
                {...register("installationAddress")}
                rows={2}
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal resize-none"
                placeholder="Full installation address"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("services.preferredDate")}
              </label>
              <input
                {...register("preferredDate")}
                type="date"
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-lord-navy">
                {t("services.description")}
              </label>
              <textarea
                {...register("message")}
                rows={4}
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal resize-none"
                placeholder={t("services.descriptionPlaceholder")}
              />
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              {t("services.submitRequest")}
            </Button>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
}
