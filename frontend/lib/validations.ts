import { z } from "zod";

// ─── Login Schema ────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Register Schema ─────────────────────────────────────
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    nationalId: z
      .string()
      .length(14, "National ID must be exactly 14 digits")
      .regex(/^\d{14}$/, "National ID must contain only digits"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(
        /^(\+201|01)[0-2,5]\d{8}$/,
        "Please enter a valid Egyptian phone number",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Contact / Inquiry Schema ────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^(\+201|01)[0-2,5]\d{8}$/,
      "Please enter a valid Egyptian phone number",
    ),
  inquiryType: z.enum([
    "purchase",
    "order_support",
    "installation",
    "maintenance",
    "repair",
    "delivery",
    "general",
  ]),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  honeypot: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Shipping Address Schema ─────────────────────────────
export const addressSchema = z.object({
  label: z.enum(["home", "office", "other"]),
  recipientName: z.string().min(2, "Recipient name is required"),
  phone: z
    .string()
    .regex(
      /^(\+201|01)[0-2,5]\d{8}$/,
      "Please enter a valid Egyptian phone number",
    ),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  governorate: z.string().min(2, "Governorate is required"),
  postalCode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

// ─── Guest Checkout Schema ───────────────────────────────
export const guestCheckoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nationalId: z
    .string()
    .length(14, "National ID must be exactly 14 digits")
    .regex(/^\d{14}$/, "National ID must contain only digits"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^(\+201|01)[0-2,5]\d{8}$/,
      "Please enter a valid Egyptian phone number",
    ),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  governorate: z.string().min(2, "Governorate is required"),
  postalCode: z.string().optional(),
});

export type GuestCheckoutFormData = z.infer<typeof guestCheckoutSchema>;

// ─── Change Password Schema ──────────────────────────────
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ─── Service Request Schema ──────────────────────────────
export const serviceRequestSchema = z.object({
  serviceTypeId: z.string().min(1, "Service type is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^(\+201|01)[0-2,5]\d{8}$/,
      "Please enter a valid Egyptian phone number",
    ),
  message: z.string().optional(),
  installationAddress: z.string().optional(),
  unitBrand: z.string().optional(),
  unitModel: z.string().optional(),
  propertyType: z.enum(["residential", "commercial"]).optional(),
  floorNumber: z.number().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  urgency: z.enum(["standard", "emergency"]).optional(),
});

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

// ─── OTP Schema ──────────────────────────────────────────
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

export type OtpFormData = z.infer<typeof otpSchema>;

// ─── Forgot Password Schema ─────────────────────────────
export const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordEmailData = z.infer<typeof forgotPasswordEmailSchema>;

export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .length(6, "OTP must be 6 digits")
      .regex(/^\d{6}$/, "OTP must contain only digits"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ─── Egyptian Governorates ───────────────────────────────
export const EGYPTIAN_GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Qalyubia",
  "Dakahlia",
  "Sharqia",
  "Gharbia",
  "Monufia",
  "Kafr El Sheikh",
  "Beheira",
  "Damietta",
  "Port Said",
  "Ismailia",
  "Suez",
  "North Sinai",
  "South Sinai",
  "Fayoum",
  "Beni Suef",
  "Minya",
  "Assiut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Red Sea",
  "New Valley",
  "Matruh",
] as const;
