"use client";

import React from "react";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { floatingPulse } from "@/lib/animations";

interface FloatingWhatsAppProps {
  phoneNumber: string;
}

export default function FloatingWhatsApp({
  phoneNumber,
}: FloatingWhatsAppProps) {
  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", delay: 1, stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-whatsapp text-white shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Chat on WhatsApp"
    >
      <motion.div {...floatingPulse}>
        <MessageCircle className="h-7 w-7" fill="white" />
      </motion.div>
    </motion.a>
  );
}
