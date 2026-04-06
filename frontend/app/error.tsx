"use client";

import React from "react";
import { motion } from "motion/react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { fadeInUp } from "@/lib/animations";
import Button from "@/components/common/Button";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <div className="mx-auto mb-4 inline-flex rounded-full bg-red-100 p-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>

        <h2 className="mb-2 text-xl font-bold text-lord-navy">
          Something went wrong
        </h2>
        <p className="mx-auto mb-6 max-w-md text-medium-gray">
          {error.message ||
            "An unexpected error occurred. Please try again or return to the home page."}
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="secondary">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-4 text-xs text-medium-gray">
            Error ID: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
