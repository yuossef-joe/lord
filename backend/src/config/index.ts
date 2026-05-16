import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  API_BASE_URL: z.string().url().default("http://localhost:5000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGINS: z
    .string()
    .default(
      "http://localhost:3000,http://localhost:5173,http://localhost:5174,https://lord-blond.vercel.app",
    ),
  JWT_CUSTOMER_SECRET: z.string().min(16).default("development-customer-secret-change-me"),
  JWT_CUSTOMER_REFRESH_SECRET: z.string().min(16).default("development-customer-refresh-secret-change-me"),
  JWT_CMS_SECRET: z.string().min(16).default("development-cms-secret-change-me"),
  JWT_CMS_REFRESH_SECRET: z.string().min(16).default("development-cms-refresh-secret-change-me"),
  PAYMOB_API_KEY: z.string().optional().default(""),
  PAYMOB_INTEGRATION_ID_CARD: z.string().optional().default(""),
  PAYMOB_INTEGRATION_ID_WALLET: z.string().optional().default(""),
  PAYMOB_INTEGRATION_ID_INSTALLMENT: z.string().optional().default(""),
  PAYMOB_IFRAME_ID: z.string().optional().default(""),
  PAYMOB_HMAC_SECRET: z.string().optional().default(""),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  EMAIL_FROM_NAME: z.string().default("Lord Air Conditioning"),
  EMAIL_FROM_ADDRESS: z.string().email().default("no-reply@example.com"),
  STAFF_NOTIFICATION_EMAIL: z.string().optional().default(""),
});

const parsedEnv = envSchema.parse(process.env);

export const config = {
  nodeEnv: parsedEnv.NODE_ENV,
  isProduction: parsedEnv.NODE_ENV === "production",
  port: parsedEnv.PORT,
  apiBaseUrl: parsedEnv.API_BASE_URL,
  databaseUrl: parsedEnv.DATABASE_URL,
  corsOrigins: parsedEnv.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean),
  jwt: {
    customerSecret: parsedEnv.JWT_CUSTOMER_SECRET,
    customerRefreshSecret: parsedEnv.JWT_CUSTOMER_REFRESH_SECRET,
    cmsSecret: parsedEnv.JWT_CMS_SECRET,
    cmsRefreshSecret: parsedEnv.JWT_CMS_REFRESH_SECRET,
    accessExpiresIn: "1h",
    refreshExpiresIn: "7d",
  },
  paymob: {
    apiKey: parsedEnv.PAYMOB_API_KEY,
    cardIntegrationId: parsedEnv.PAYMOB_INTEGRATION_ID_CARD,
    walletIntegrationId: parsedEnv.PAYMOB_INTEGRATION_ID_WALLET,
    installmentIntegrationId: parsedEnv.PAYMOB_INTEGRATION_ID_INSTALLMENT,
    iframeId: parsedEnv.PAYMOB_IFRAME_ID,
    hmacSecret: parsedEnv.PAYMOB_HMAC_SECRET,
  },
  email: {
    host: parsedEnv.SMTP_HOST,
    port: parsedEnv.SMTP_PORT,
    user: parsedEnv.SMTP_USER,
    pass: parsedEnv.SMTP_PASS,
    fromName: parsedEnv.EMAIL_FROM_NAME,
    fromAddress: parsedEnv.EMAIL_FROM_ADDRESS,
    staffNotificationEmail: parsedEnv.STAFF_NOTIFICATION_EMAIL,
  },
};

export type AppConfig = typeof config;
