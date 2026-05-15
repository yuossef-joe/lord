import rateLimit from "express-rate-limit";
import { config } from "../config/index.js";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: config.isProduction ? 5 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
