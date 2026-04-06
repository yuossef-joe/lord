"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import PriceDisplay from "@/components/common/PriceDisplay";
import Button from "@/components/common/Button";
import QuantitySelector from "@/components/common/QuantitySelector";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { overlayFade, scaleIn } from "@/lib/animations";
import Link from "next/link";
import Image from "next/image";

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  open,
  onClose,
}: QuickViewModalProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);

  React.useEffect(() => {
    if (open) setQuantity(1);
  }, [open]);

  if (!product) return null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(product, quantity);
      onClose();
    } catch {
      // Toast handled in context
    } finally {
      setIsAdding(false);
    }
  };

  const mainImage = product.images?.[0]?.url || "/placeholder.png";
  const isOutOfStock =
    product.stockQuantity !== undefined && product.stockQuantity <= 0;

  return (
    <Dialog.Root open={open} onOpenChange={(val) => !val && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                variants={overlayFade}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-card bg-white p-6 shadow-xl focus:outline-none"
              >
                <Dialog.Close asChild>
                  <button className="absolute right-4 top-4 rounded-full p-1 text-medium-gray hover:bg-off-white hover:text-lord-navy transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>

                <div className="flex flex-col gap-6 sm:flex-row">
                  {/* Image */}
                  <div className="relative aspect-square w-full sm:w-[260px] flex-shrink-0 overflow-hidden rounded-card bg-off-white">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                    {product.brand && (
                      <span
                        className={`absolute top-3 left-3 rounded-full px-2 py-0.5 text-xs font-medium text-white ${
                          product.brand.name === "Carrier"
                            ? "bg-lord-navy"
                            : "bg-lord-teal"
                        }`}
                      >
                        {product.brand.name}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <Dialog.Title className="text-lg font-bold text-lord-navy mb-1">
                      {product.name}
                    </Dialog.Title>

                    {product.category && (
                      <span className="text-xs text-medium-gray mb-3">
                        {product.category.name}
                      </span>
                    )}

                    <PriceDisplay
                      price={product.price}
                      salePrice={product.salePrice}
                      outOfStock={isOutOfStock}
                      size="lg"
                    />

                    {product.shortDescription && (
                      <p className="mt-3 text-sm text-dark-charcoal line-clamp-3">
                        {product.shortDescription}
                      </p>
                    )}

                    {/* Key Specs */}
                    {product.specifications &&
                      product.specifications.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {product.specifications.slice(0, 3).map((spec, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-medium-gray">
                                {spec.key}
                              </span>
                              <span className="font-medium text-lord-navy">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                    <div className="mt-auto pt-4 space-y-3">
                      {!isOutOfStock && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-medium-gray">
                            {t("products.quantity")}:
                          </span>
                          <QuantitySelector
                            value={quantity}
                            onChange={setQuantity}
                            min={1}
                            max={product.stockQuantity || 99}
                          />
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Button
                          onClick={handleAddToCart}
                          disabled={isOutOfStock}
                          isLoading={isAdding}
                          className="flex-1"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {isOutOfStock
                            ? t("products.outOfStock")
                            : t("products.addToCart")}
                        </Button>
                        <Link href={`/products/${product.slug}`}>
                          <Button variant="secondary" onClick={onClose}>
                            {t("products.viewDetails")}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
