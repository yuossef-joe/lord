"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ProductImage } from "@/types/product";
import ImagePlaceholder from "@/components/common/ImagePlaceholder";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({
  images,
  productName,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index));
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full">
        <ImagePlaceholder className="h-full w-full rounded-card" />
      </div>
    );
  }

  const activeImage = images[activeIndex];

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="group relative aspect-square overflow-hidden rounded-card bg-off-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full cursor-zoom-in"
            onClick={() => setIsZoomed(true)}
          >
            {failedImages.has(activeIndex) ? (
              <ImagePlaceholder className="h-full w-full" />
            ) : (
              <Image
                src={activeImage.url}
                alt={activeImage.alt || productName}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={() => handleImageError(activeIndex)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-lord-navy" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-lord-navy" />
            </button>
          </>
        )}

        <button
          onClick={() => setIsZoomed(true)}
          className="absolute bottom-3 right-3 rounded-full bg-white/80 p-2 shadow-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
        >
          <ZoomIn className="h-4 w-4 text-lord-navy" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === activeIndex
                  ? "border-lord-teal"
                  : "border-transparent hover:border-silver"
              }`}
            >
              {failedImages.has(index) ? (
                <ImagePlaceholder className="h-full w-full" />
              ) : (
                <Image
                  src={img.url}
                  alt={img.alt || `${productName} ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                  onError={() => handleImageError(index)}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImage.url}
                alt={activeImage.alt || productName}
                width={800}
                height={800}
                className="max-h-[90vh] w-auto object-contain"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute -top-2 -right-2 rounded-full bg-white p-2 shadow-lg hover:bg-off-white"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
