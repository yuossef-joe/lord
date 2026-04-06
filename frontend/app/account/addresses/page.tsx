"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Plus, Trash2, Star, X } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import * as Dialog from "@radix-ui/react-dialog";
import { addressSchema, EGYPTIAN_GOVERNORATES } from "@/lib/validations";
import {
  staggerContainer,
  staggerItem,
  overlayFade,
  scaleIn,
} from "@/lib/animations";
import Button from "@/components/common/Button";
import { useLanguage } from "@/context/LanguageContext";
import {
  fetchCustomerAddresses,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "@/lib/api";
import { CustomerAddress } from "@/types/customer";
import { toast } from "react-toastify";
import type { z } from "zod";

type AddressFormData = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const { t, isRTL } = useLanguage();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [animateParent] = useAutoAnimate();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const loadAddresses = async () => {
    try {
      const data = (await fetchCustomerAddresses()) as {
        data: CustomerAddress[];
      };
      setAddresses(data.data || []);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const openNew = () => {
    setEditingAddress(null);
    form.reset({
      label: "home",
      recipientName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      governorate: "",
      phone: "",
      postalCode: "",
      isDefault: false,
    });
    setDialogOpen(true);
  };

  const openEdit = (addr: CustomerAddress) => {
    setEditingAddress(addr);
    form.reset({
      label: addr.label || "home",
      recipientName: addr.recipientName,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      governorate: addr.governorate,
      phone: addr.phone || "",
      postalCode: addr.postalCode || "",
      isDefault: addr.isDefault || false,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: AddressFormData) => {
    setIsSaving(true);
    try {
      if (editingAddress) {
        await updateCustomerAddress(editingAddress._id, data);
        toast.success(t("account.addressUpdated"));
      } else {
        await addCustomerAddress(data);
        toast.success(t("account.addressAdded"));
      }
      setDialogOpen(false);
      loadAddresses();
    } catch {
      toast.error(t("general.error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("account.confirmDelete"))) return;
    try {
      await deleteCustomerAddress(id);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      toast.success(t("account.addressDeleted"));
    } catch {
      toast.error(t("general.error"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-lord-navy">
          {t("account.addresses")}
        </h1>
        <Button onClick={openNew} disabled={addresses.length >= 10} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          {t("account.addAddress")}
        </Button>
      </div>

      {addresses.length >= 10 && (
        <p className="text-sm text-medium-gray">{t("account.maxAddresses")}</p>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 rounded-card skeleton-shimmer" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-card border border-[#E8EAED] bg-white p-12 text-center">
          <MapPin className="mx-auto mb-3 h-10 w-10 text-medium-gray" />
          <p className="text-medium-gray">{t("account.noAddresses")}</p>
        </div>
      ) : (
        <div ref={animateParent} className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <motion.div
              key={addr._id}
              layout
              className={`rounded-card border-2 bg-white p-4 ${
                addr.isDefault ? "border-lord-teal" : "border-[#E8EAED]"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-lord-navy">
                    {addr.label || addr.city}
                  </span>
                  {addr.isDefault && (
                    <span className="flex items-center gap-0.5 rounded-full bg-lord-teal/10 px-2 py-0.5 text-[10px] font-medium text-lord-teal">
                      <Star className="h-3 w-3" fill="currentColor" />
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(addr)}
                    className="rounded p-1 text-medium-gray hover:bg-off-white hover:text-lord-navy transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="rounded p-1 text-medium-gray hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-dark-charcoal">{addr.addressLine1}</p>
              {addr.addressLine2 && (
                <p className="text-sm text-dark-charcoal">
                  {addr.addressLine2}
                </p>
              )}
              <p className="text-sm text-dark-charcoal">
                {addr.city}, {addr.governorate}
              </p>
              {addr.phone && (
                <p className="text-xs text-medium-gray mt-1">{addr.phone}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Address Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <AnimatePresence>
          {dialogOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  variants={overlayFade}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="fixed inset-0 z-50 bg-black/40"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-card bg-white p-6 shadow-xl focus:outline-none max-h-[90vh] overflow-y-auto"
                >
                  <Dialog.Close asChild>
                    <button className="absolute right-4 top-4 rounded-full p-1 text-medium-gray hover:bg-off-white">
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>

                  <Dialog.Title className="mb-4 text-lg font-bold text-lord-navy">
                    {editingAddress
                      ? t("account.editAddress")
                      : t("account.addAddress")}
                  </Dialog.Title>

                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <div>
                      <label className="mb-1 block text-sm font-medium text-lord-navy">
                        Label *
                      </label>
                      <select
                        {...form.register("label")}
                        className="w-full rounded-button border border-[#E8EAED] bg-white px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                      >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-lord-navy">
                        Recipient Name *
                      </label>
                      <input
                        {...form.register("recipientName")}
                        className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                      />
                      {form.formState.errors.recipientName && (
                        <p className="mt-1 text-xs text-red-500">
                          {form.formState.errors.recipientName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-lord-navy">
                        Address Line 1 *
                      </label>
                      <input
                        {...form.register("addressLine1")}
                        className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                      />
                      {form.formState.errors.addressLine1 && (
                        <p className="mt-1 text-xs text-red-500">
                          {form.formState.errors.addressLine1.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-lord-navy">
                        Address Line 2
                      </label>
                      <input
                        {...form.register("addressLine2")}
                        className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-lord-navy">
                          City *
                        </label>
                        <input
                          {...form.register("city")}
                          className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                        />
                        {form.formState.errors.city && (
                          <p className="mt-1 text-xs text-red-500">
                            {form.formState.errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-lord-navy">
                          Governorate *
                        </label>
                        <select
                          {...form.register("governorate")}
                          className="w-full rounded-button border border-[#E8EAED] bg-white px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                        >
                          <option value="">Select</option>
                          {EGYPTIAN_GOVERNORATES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-lord-navy">
                          Phone *
                        </label>
                        <input
                          {...form.register("phone")}
                          type="tel"
                          className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                        />
                        {form.formState.errors.phone && (
                          <p className="mt-1 text-xs text-red-500">
                            {form.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-lord-navy">
                          Postal Code
                        </label>
                        <input
                          {...form.register("postalCode")}
                          className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...form.register("isDefault")}
                        className="accent-lord-teal"
                      />
                      <span className="text-sm text-dark-charcoal">
                        Set as default address
                      </span>
                    </label>
                    <Button
                      type="submit"
                      isLoading={isSaving}
                      className="w-full"
                    >
                      {editingAddress
                        ? t("general.save")
                        : t("account.addAddress")}
                    </Button>
                  </form>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
