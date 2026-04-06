"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons/SocialIcons";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import { contactSchema } from "@/lib/validations";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import ScrollReveal from "@/components/common/ScrollReveal";
import SeoHead from "@/components/common/SeoHead";
import Button from "@/components/common/Button";
import { useLanguage } from "@/context/LanguageContext";
import { submitContactForm, fetchContactSettings } from "@/lib/api";
import { ContactSettings } from "@/types/common";
import { toast } from "react-toastify";
import type { z } from "zod";

type ContactFormData = z.infer<typeof contactSchema>;

const CONTACT_DEFAULTS: ContactSettings = {
  phone: "+20 123 456 7890",
  whatsapp: "+20 123 456 7890",
  email: "info@lord-ac.com",
  address: "Cairo, Egypt",
  workingHours: "Sat-Thu: 9AM-9PM",
  googleMapsUrl: "",
  googleMapsEmbedUrl: "",
  facebookUrl: "https://facebook.com/lordac",
  instagramUrl: "https://instagram.com/lordac",
};

export default function ContactPage() {
  const { t, isRTL } = useLanguage();
  const [contact, setContact] = useState<ContactSettings>(CONTACT_DEFAULTS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    fetchContactSettings()
      .then((data) => {
        const d = data as { data: ContactSettings };
        if (d.data) setContact(d.data);
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactForm(data);
      toast.success(t("contact.successMessage"));
      reset();
    } catch {
      toast.error(t("contact.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    {
      icon: MapPin,
      label: t("contact.address"),
      value: contact.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`,
    },
    {
      icon: Phone,
      label: t("contact.phone"),
      value: contact.phone,
      href: `tel:${contact.phone?.replace(/\s/g, "")}`,
    },
    {
      icon: MessageCircle,
      label: t("contact.whatsapp"),
      value: contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp?.replace(/[^0-9]/g, "")}`,
    },
    {
      icon: Mail,
      label: t("contact.email"),
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: Clock,
      label: t("contact.workingHours"),
      value: contact.workingHours,
    },
  ];

  return (
    <PageTransition>
      <SeoHead
        title={`${t("nav.contact")} | Lord`}
        description="Contact Lord for AC sales, installation, maintenance, and support. Call, WhatsApp, or visit our showroom in Cairo, Egypt."
      />

      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("nav.contact") },
          ]}
        />

        <ScrollReveal>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-lord-navy md:text-4xl">
              {t("contact.title")}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-medium-gray">
              {t("contact.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Contact Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 lg:col-span-2"
          >
            {contactItems.map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="flex items-start gap-4 rounded-card border border-[#E8EAED] bg-white p-4"
              >
                <div className="rounded-lg bg-lord-teal/10 p-2 text-lord-teal">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-medium-gray">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-lord-navy hover:text-lord-teal transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-lord-navy">
                      {item.value}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {contact.facebookUrl && (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-lord-navy p-3 text-white transition-transform hover:scale-110"
                >
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {contact.instagramUrl && (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-3 text-white transition-transform hover:scale-110"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
              <a
                href={`https://wa.me/${contact.whatsapp?.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-500 p-3 text-white transition-transform hover:scale-110"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <ScrollReveal direction="right" className="lg:col-span-3">
            <motion.div
              variants={fadeInUp}
              className="rounded-card border border-[#E8EAED] bg-white p-6 md:p-8"
            >
              <h2 className="mb-6 text-xl font-bold text-lord-navy">
                {t("contact.formTitle")}
              </h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {/* Honeypot */}
                <input
                  type="text"
                  {...register("honeypot")}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-lord-navy">
                      {t("contact.name")} *
                    </label>
                    <input
                      {...register("name")}
                      className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                      placeholder={t("contact.namePlaceholder")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-lord-navy">
                      {t("contact.email")} *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                      placeholder={t("contact.emailPlaceholder")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-lord-navy">
                      {t("contact.phone")} *
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
                      {t("contact.inquiryType")} *
                    </label>
                    <select
                      {...register("inquiryType")}
                      className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                    >
                      <option value="general">
                        {t("contact.inquiryTypes.general")}
                      </option>
                      <option value="purchase">
                        {t("contact.inquiryTypes.purchase")}
                      </option>
                      <option value="installation">
                        {t("contact.inquiryTypes.installation")}
                      </option>
                      <option value="maintenance">
                        {t("contact.inquiryTypes.maintenance")}
                      </option>
                      <option value="order_support">
                        {t("contact.inquiryTypes.orderSupport")}
                      </option>
                    </select>
                    {errors.inquiryType && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.inquiryType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-lord-navy">
                    {t("contact.message")} *
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal resize-none"
                    placeholder={t("contact.messagePlaceholder")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {t("contact.send")}
                </Button>
              </form>
            </motion.div>
          </ScrollReveal>
        </div>

        {/* Map */}
        <ScrollReveal>
          <div className="mt-12 overflow-hidden rounded-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.123!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzQwLjAiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lord Location"
              className="w-full"
            />
          </div>
        </ScrollReveal>
      </div>
    </PageTransition>
  );
}
