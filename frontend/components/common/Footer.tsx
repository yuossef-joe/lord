"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { MapPin, Phone, MessageCircle, Mail, ChevronDown } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons/SocialIcons";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { fetchContactSettings } from "@/lib/api";
import type { ContactSettings } from "@/types/common";

const quickLinks = [
  { key: "nav.home", href: "/" },
  { key: "nav.products", href: "/products" },
  { key: "nav.services", href: "/services" },
  { key: "nav.about", href: "/about" },
  { key: "nav.contact", href: "/contact" },
  { key: "nav.faq", href: "/faq" },
];

const serviceLinks = [
  { label: "Installation", href: "/services" },
  { label: "Maintenance", href: "/services" },
  { label: "Repair", href: "/services" },
  { label: "Delivery", href: "/services" },
  { label: "Spare Parts", href: "/services" },
];

export default function Footer() {
  const { t } = useLanguage();
  const { ref, controls } = useScrollReveal();
  const [contact, setContact] = useState<ContactSettings | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    fetchContactSettings()
      .then((data: unknown) => {
        const res = data as { data: ContactSettings };
        setContact(res.data);
      })
      .catch(() => {});
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <motion.footer
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={controls}
      className="bg-lord-navy text-white"
    >
      <div className="mx-auto max-w-container px-4 py-12 md:px-6 md:py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Column 1: Brand */}
          <motion.div variants={staggerItem}>
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold tracking-tight mb-4"
            >
              L<span className="text-lord-teal">O</span>RD
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Authorized Carrier & Midea Dealer. Air Conditioning solutions
              since 1986.
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-auto text-xs bg-white/10 rounded px-2 py-1 flex items-center">
                Carrier
              </div>
              <div className="h-8 w-auto text-xs bg-white/10 rounded px-2 py-1 flex items-center">
                Midea
              </div>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={staggerItem}>
            <button
              onClick={() => toggleSection("quick")}
              className="flex w-full items-center justify-between md:cursor-default"
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-0 md:mb-4">
                {t("footer.quickLinks")}
              </h4>
              <ChevronDown
                className={`h-4 w-4 md:hidden transition-transform ${
                  openSection === "quick" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              <div
                className={`mt-3 space-y-2 ${
                  openSection === "quick" ? "block" : "hidden"
                } md:block`}
              >
                {quickLinks.map((link) => (
                  <motion.div key={link.href} whileHover={{ x: 4 }}>
                    <Link
                      href={link.href}
                      className="block text-sm text-white/70 hover:text-lord-teal transition-colors py-1"
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </motion.div>

          {/* Column 3: Services */}
          <motion.div variants={staggerItem}>
            <button
              onClick={() => toggleSection("services")}
              className="flex w-full items-center justify-between md:cursor-default"
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-0 md:mb-4">
                {t("footer.services")}
              </h4>
              <ChevronDown
                className={`h-4 w-4 md:hidden transition-transform ${
                  openSection === "services" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`mt-3 space-y-2 ${
                openSection === "services" ? "block" : "hidden"
              } md:block`}
            >
              {serviceLinks.map((link) => (
                <motion.div key={link.label} whileHover={{ x: 4 }}>
                  <Link
                    href={link.href}
                    className="block text-sm text-white/70 hover:text-lord-teal transition-colors py-1"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Column 4: Contact Info */}
          <motion.div variants={staggerItem}>
            <button
              onClick={() => toggleSection("contact")}
              className="flex w-full items-center justify-between md:cursor-default"
            >
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-0 md:mb-4">
                {t("footer.contactInfo")}
              </h4>
              <ChevronDown
                className={`h-4 w-4 md:hidden transition-transform ${
                  openSection === "contact" ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`mt-3 space-y-3 ${
                openSection === "contact" ? "block" : "hidden"
              } md:block`}
            >
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-lord-teal mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/70">
                  {contact?.address || "Cairo, Egypt"}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-lord-teal flex-shrink-0" />
                <a
                  href={`tel:${contact?.phone || ""}`}
                  className="text-sm text-white/70 hover:text-lord-teal transition-colors"
                >
                  {contact?.phone || "Loading..."}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-lord-teal flex-shrink-0" />
                <a
                  href={`https://wa.me/${contact?.whatsapp || ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-lord-teal transition-colors"
                >
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-lord-teal flex-shrink-0" />
                <a
                  href={`mailto:${contact?.email || ""}`}
                  className="text-sm text-white/70 hover:text-lord-teal transition-colors"
                >
                  {contact?.email || "Loading..."}
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-container flex flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row md:px-6">
          <p className="text-xs text-white/50">
            {t("footer.copyright")} · {t("footer.allRights")}
          </p>
          <div className="flex items-center gap-4">
            {contact?.facebookUrl && (
              <motion.a
                href={contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/50 hover:text-lord-teal transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </motion.a>
            )}
            {contact?.instagramUrl && (
              <motion.a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/50 hover:text-lord-teal transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </motion.a>
            )}
            {contact?.whatsapp && (
              <motion.a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/50 hover:text-lord-teal transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
