"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Eye, EyeOff, Save, Lock } from "lucide-react";
import { changePasswordSchema } from "@/lib/validations";
import { fadeInUp } from "@/lib/animations";
import Button from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { updateCustomerProfile, changePassword } from "@/lib/api";
import { toast } from "react-toastify";
import type { z } from "zod";

type PasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ProfilePage() {
  const { customer, setCustomer } = useAuth();
  const { t, isRTL } = useLanguage();

  const [profileData, setProfileData] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const data = (await updateCustomerProfile(profileData)) as {
        data: typeof customer;
      };
      if (data.data) setCustomer(data.data);
      toast.success(t("account.profileUpdated"));
    } catch {
      toast.error(t("general.error"));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    setIsSavingPassword(true);
    try {
      await changePassword(data);
      passwordForm.reset();
      toast.success(t("account.passwordChanged"));
    } catch {
      toast.error(t("account.passwordError"));
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-lord-navy">
        {t("account.profile")}
      </h1>

      {/* Profile Info */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="rounded-card border border-[#E8EAED] bg-white p-6"
      >
        <h2 className="mb-4 text-lg font-semibold text-lord-navy">
          {t("account.personalInfo")}
        </h2>
        <form
          onSubmit={handleProfileSave}
          className="space-y-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-lord-navy">
              {t("auth.name")}
            </label>
            <input
              value={profileData.name}
              onChange={(e) =>
                setProfileData((p) => ({ ...p, name: e.target.value }))
              }
              className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-lord-navy">
              {t("auth.email")}
            </label>
            <input
              value={customer?.email || ""}
              disabled
              className="w-full rounded-button border border-[#E8EAED] bg-off-white px-4 py-2.5 text-sm text-medium-gray cursor-not-allowed"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-lord-navy">
              {t("auth.phone")}
            </label>
            <input
              value={profileData.phone}
              onChange={(e) =>
                setProfileData((p) => ({ ...p, phone: e.target.value }))
              }
              type="tel"
              className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-lord-navy">
              {t("auth.nationalId")}
            </label>
            <input
              value={customer?.nationalId || ""}
              disabled
              className="w-full rounded-button border border-[#E8EAED] bg-off-white px-4 py-2.5 text-sm text-medium-gray cursor-not-allowed"
            />
          </div>

          <Button type="submit" isLoading={isSavingProfile}>
            <Save className="mr-2 h-4 w-4" />
            {t("general.save")}
          </Button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="rounded-card border border-[#E8EAED] bg-white p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-lord-navy">
          <Lock className="h-5 w-5" />
          {t("account.changePassword")}
        </h2>
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
          className="space-y-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-lord-navy">
              {t("account.currentPassword")}
            </label>
            <div className="relative">
              <input
                {...passwordForm.register("currentPassword")}
                type={showPasswords ? "text" : "password"}
                className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-medium-gray"
              >
                {showPasswords ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.currentPassword && (
              <p className="mt-1 text-xs text-red-500">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-lord-navy">
              {t("auth.newPassword")}
            </label>
            <input
              {...passwordForm.register("newPassword")}
              type={showPasswords ? "text" : "password"}
              className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-lord-navy">
              {t("auth.confirmPassword")}
            </label>
            <input
              {...passwordForm.register("confirmNewPassword")}
              type="password"
              className="w-full rounded-button border border-[#E8EAED] px-4 py-2.5 text-sm focus:border-lord-teal focus:outline-none focus:ring-1 focus:ring-lord-teal"
            />
            {passwordForm.formState.errors.confirmNewPassword && (
              <p className="mt-1 text-xs text-red-500">
                {passwordForm.formState.errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isSavingPassword}
            variant="secondary"
          >
            {t("account.changePassword")}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
