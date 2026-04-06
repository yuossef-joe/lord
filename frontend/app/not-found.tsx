"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import Button from "@/components/common/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        {/* 404 Number */}
        <div className="relative mx-auto mb-6">
          <span className="text-[120px] font-extrabold leading-none text-lord-navy/10 md:text-[180px]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-16 w-16 text-lord-teal md:h-24 md:w-24" />
          </div>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-lord-navy md:text-3xl">
          Page Not Found
        </h1>
        <p className="mx-auto mb-8 max-w-md text-medium-gray">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.history.back();
            }}
          >
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
