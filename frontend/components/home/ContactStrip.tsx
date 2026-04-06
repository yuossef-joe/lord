"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { MapPin, Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import ScrollReveal from "@/components/common/ScrollReveal";
import { fetchContactSettings } from "@/lib/api";
import type { ContactSettings } from "@/types/common";

export default function ContactStrip() {
  const [contact, setContact] = useState<ContactSettings | null>(null);

  useEffect(() => {
    fetchContactSettings()
      .then((data: unknown) => {
        const res = data as { data: ContactSettings };
        setContact(res.data);
      })
      .catch(() => {});
  }, []);

  const items = [
    {
      icon: <MapPin className="h-5 w-5" />,
      label: contact?.address || "Cairo, Egypt",
      href: contact?.googleMapsUrl || "#",
      external: true,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: contact?.phone || "Loading...",
      href: `tel:${contact?.phone || ""}`,
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "WhatsApp",
      href: `https://wa.me/${contact?.whatsapp || ""}`,
      external: true,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: contact?.email || "Loading...",
      href: `mailto:${contact?.email || ""}`,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: contact?.workingHours || "Sat–Thu: 9AM–6PM",
    },
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-container px-4 md:px-6">
        <ScrollReveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          >
            {items.map((item, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                className="flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.1, color: "#0DBACA" }}
                  className="text-lord-teal"
                >
                  {item.icon}
                </motion.div>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-medium-gray hover:text-lord-teal transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-sm text-medium-gray">{item.label}</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
