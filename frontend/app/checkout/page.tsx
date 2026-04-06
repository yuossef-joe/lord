"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  CreditCard,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  ShoppingBag,
} from "lucide-react";
import { addressSchema, guestCheckoutSchema } from "@/lib/validations";
import { EGYPTIAN_GOVERNORATES } from "@/lib/validations";
import { fadeInUp } from "@/lib/animations";
import PageTransition from "@/components/common/PageTransition";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import SeoHead from "@/components/common/SeoHead";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { toast } from "react-toastify";
import {
  createOrder,
  initiatePayment,
  fetchCustomerAddresses,
} from "@/lib/api";
import { CustomerAddress } from "@/types/customer";
import Image from "next/image";
import type { z } from "zod";

type AddressFormData = z.infer<typeof addressSchema>;
type GuestFormData = z.infer<typeof guestCheckoutSchema>;

const STEPS = [
  { key: "shipping", icon: MapPin, label: "Shipping" },
  { key: "review", icon: ClipboardCheck, label: "Review" },
  { key: "payment", icon: CreditCard, label: "Payment" },
];

export default function CheckoutPage() {
  const { isAuthenticated, customer } = useAuth();
  const { items, subtotal, shipping, discount, total, couponCode, clearCart } =
    useCart();
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingData, setShippingData] = useState<
    AddressFormData | GuestFormData | null
  >(null);

  // Form for authenticated users (address only)
  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  // Form for guest users (full info + address)
  const guestForm = useForm<GuestFormData>({
    resolver: zodResolver(guestCheckoutSchema),
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomerAddresses()
        .then((data) => {
          const d = data as { data: CustomerAddress[] };
          setSavedAddresses(d.data || []);
          if (d.data?.length > 0) {
            const def = d.data.find((a) => a.isDefault);
            setSelectedAddressId(def?._id || d.data[0]._id);
          } else {
            setUseNewAddress(true);
          }
        })
        .catch(() => setUseNewAddress(true));
    }
  }, [isAuthenticated]);

  const handleShippingSubmit = () => {
    if (isAuthenticated && !useNewAddress && selectedAddressId) {
      const addr = savedAddresses.find((a) => a._id === selectedAddressId);
      if (addr) {
        setShippingData(addr as unknown as AddressFormData);
        setCurrentStep(1);
      }
      return;
    }

    if (isAuthenticated) {
      addressForm.handleSubmit((data) => {
        setShippingData(data);
        setCurrentStep(1);
      })();
    } else {
      guestForm.handleSubmit((data) => {
        setShippingData(data);
        setCurrentStep(1);
      })();
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        shippingAddress: shippingData,
        items: items.map((item) => ({
          product: item.product?._id || ("productId" in item ? item.productId : ""),
          quantity: item.quantity,
        })),
        couponCode: couponCode || undefined,
      };

      const orderResult = (await createOrder(orderData)) as {
        data: { _id: string };
      };
      const orderId = orderResult.data._id;

      // Initiate Paymob payment
      const paymentResult = (await initiatePayment(orderId)) as {
        data: { paymentUrl: string };
      };
      if (paymentResult.data?.paymentUrl) {
        clearCart();
        window.location.href = paymentResult.data.paymentUrl;
      }
    } catch {
      toast.error(t("checkout.orderError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <SeoHead title={`${t("checkout.title")} | Lord`} description="Checkout" />
      <div className="mx-auto max-w-container px-4 py-6 md:px-6 md:py-8">
        <Breadcrumb
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("cart.title"), href: "/cart" },
            { label: t("checkout.title") },
          ]}
        />

        {/* Stepper */}
        <div className="mx-auto mt-8 mb-10 flex max-w-lg items-center justify-between">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    i <= currentStep
                      ? "bg-lord-teal text-white"
                      : "bg-off-white text-medium-gray"
                  }`}
                >
                  {i < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`mt-1 text-xs ${
                    i <= currentStep
                      ? "font-medium text-lord-navy"
                      : "text-medium-gray"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors ${
                    i < currentStep ? "bg-lord-teal" : "bg-[#E8EAED]"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 0 && (
                <motion.div
                  key="shipping"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-card border border-[#E8EAED] bg-white p-6"
                >
                  <h2 className="mb-6 text-lg font-bold text-lord-navy">
                    {t("checkout.shippingAddress")}
                  </h2>

                  {isAuthenticated && savedAddresses.length > 0 && (
                    <div className="mb-6 space-y-3">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr._id}
                          className={`flex cursor-pointer items-start gap-3 rounded-card border-2 p-4 transition-colors ${
                            selectedAddressId === addr._id && !useNewAddress
                              ? "border-lord-teal bg-lord-teal/5"
                              : "border-[#E8EAED] hover:border-silver"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={
                              selectedAddressId === addr._id && !useNewAddress
                            }
                            onChange={() => {
                              setSelectedAddressId(addr._id);
                              setUseNewAddress(false);
                            }}
                            className="mt-1 accent-lord-teal"
                          />
                          <div>
                            <p className="text-sm font-medium text-lord-navy">
                              {addr.label || addr.city}
                            </p>
                            <p className="text-xs text-medium-gray">
                              {addr.addressLine1}, {addr.city},{" "}
                              {addr.governorate}
                            </p>
                          </div>
                        </label>
                      ))}
                      <button
                        onClick={() => setUseNewAddress(true)}
                        className={`w-full rounded-card border-2 border-dashed p-4 text-sm text-center transition-colors ${
                          useNewAddress
                            ? "border-lord-teal text-lord-teal"
                            : "border-[#E8EAED] text-medium-gray hover:border-silver"
                        }`}
                      >
                        + {t("checkout.addNewAddress")}
                      </button>
                    </div>
                  )}

                  {(!isAuthenticated || useNewAddress) && (
                    <form className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
                      {!isAuthenticated && (
                        <>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-lord-navy">
                              {t("auth.name")} *
                            </label>
                            <input
                              {...guestForm.register("name")}
                              className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                            />
                            {guestForm.formState.errors.name && (
                              <p className="mt-1 text-xs text-red-500">
                                {guestForm.formState.errors.name.message}
                              </p>
                            )}
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-lord-navy">
                                {t("auth.email")} *
                              </label>
                              <input
                                {...guestForm.register("email")}
                                type="email"
                                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-lord-navy">
                                {t("auth.phone")} *
                              </label>
                              <input
                                {...guestForm.register("phone")}
                                type="tel"
                                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                                placeholder="01xxxxxxxxx"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-lord-navy">
                              {t("auth.nationalId")} *
                            </label>
                            <input
                              {...guestForm.register("nationalId")}
                              className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                              placeholder="14-digit national ID"
                              maxLength={14}
                            />
                          </div>
                        </>
                      )}

                      {/* Address fields */}
                      {(() => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const form = (isAuthenticated ? addressForm : guestForm) as any;
                        return (
                          <>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-lord-navy">
                                {t("checkout.addressLine1")} *
                              </label>
                              <input
                                {...form.register("addressLine1")}
                                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-lord-navy">
                                {t("checkout.addressLine2")}
                              </label>
                              <input
                                {...form.register("addressLine2")}
                                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                              />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 block text-sm font-medium text-lord-navy">
                                  {t("checkout.city")} *
                                </label>
                                <input
                                  {...form.register("city")}
                                  className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-sm font-medium text-lord-navy">
                                  {t("checkout.governorate")} *
                                </label>
                                <select
                                  {...form.register("governorate")}
                                  className="w-full rounded-button border border-[#E8EAED] bg-white px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                                >
                                  <option value="">Select</option>
                                  {EGYPTIAN_GOVERNORATES.map((g: string) => (
                                    <option key={g} value={g}>
                                      {g}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-lord-navy">
                                {t("checkout.phone")} *
                              </label>
                              <input
                                {...form.register("phone")}
                                type="tel"
                                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                              />
                            </div>
                          </>
                        );
                      })()}
                    </form>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleShippingSubmit}>
                      {t("checkout.continue")}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {currentStep === 1 && (
                <motion.div
                  key="review"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-card border border-[#E8EAED] bg-white p-6"
                >
                  <h2 className="mb-6 text-lg font-bold text-lord-navy">
                    {t("checkout.reviewOrder")}
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div
                        key={item.product?._id || ("productId" in item ? item.productId : "")}
                        className="flex items-center gap-4 rounded-lg bg-off-white p-3"
                      >
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                          <Image
                            src={
                              item.product?.images?.[0]?.url ||
                              "/placeholder.png"
                            }
                            alt={item.product?.name || ""}
                            fill
                            className="object-contain p-1"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-lord-navy">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-medium-gray">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-lord-navy">
                          {formatPrice(
                            (item.product?.salePrice ||
                              item.product?.price ||
                              0) * item.quantity,
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address summary */}
                  {shippingData && (
                    <div className="rounded-lg border border-[#E8EAED] p-4 mb-6">
                      <h3 className="mb-2 text-sm font-semibold text-lord-navy">
                        {t("checkout.shippingAddress")}
                      </h3>
                      <p className="text-sm text-dark-charcoal">
                        {"addressLine1" in shippingData && shippingData.addressLine1},{" "}
                        {"city" in shippingData && shippingData.city},{" "}
                        {"governorate" in shippingData &&
                          shippingData.governorate}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentStep(0)}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      {t("checkout.back")}
                    </Button>
                    <Button onClick={() => setCurrentStep(2)}>
                      {t("checkout.proceedToPayment")}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-card border border-[#E8EAED] bg-white p-6"
                >
                  <h2 className="mb-6 text-lg font-bold text-lord-navy">
                    {t("checkout.payment")}
                  </h2>

                  <div className="rounded-lg bg-off-white p-6 text-center">
                    <CreditCard className="mx-auto mb-3 h-10 w-10 text-lord-teal" />
                    <h3 className="text-sm font-semibold text-lord-navy">
                      {t("checkout.paymobInfo")}
                    </h3>
                    <p className="mt-1 text-xs text-medium-gray">
                      {t("checkout.paymobDesc")}
                    </p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      {t("checkout.back")}
                    </Button>
                    <Button onClick={handlePlaceOrder} isLoading={isSubmitting}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      {t("checkout.placeOrder")}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="sticky top-24 rounded-card border border-[#E8EAED] bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-lord-navy">
                {t("cart.orderSummary")}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark-charcoal">
                    {t("cart.subtotal")}
                  </span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-charcoal">
                    {t("cart.shipping")}
                  </span>
                  <span className="font-medium text-green-600">
                    {shipping === 0
                      ? t("cart.freeShipping")
                      : formatPrice(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("cart.discount")}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <hr className="border-[#E8EAED]" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-lord-navy">{t("cart.total")}</span>
                  <span className="text-lord-teal">{formatPrice(total)}</span>
                </div>
              </div>

              {!isAuthenticated && (
                <p className="mt-4 text-xs text-medium-gray">
                  {t("checkout.guestNote")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
