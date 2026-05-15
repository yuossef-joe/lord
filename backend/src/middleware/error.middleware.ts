import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { config } from "../config/index.js";
import { ApiError } from "../utils/api-error.js";
import { logger } from "../utils/logger.js";

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errorCode: "VALIDATION_ERROR",
      errors: error.issues,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const statusCode = error.code === "P2025" ? 404 : error.code === "P2002" ? 409 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.code === "P2002" ? "Unique constraint failed" : "Database request failed",
      errorCode: error.code,
    });
  }

  logger.error(error);
  return res.status(500).json({
    success: false,
    message: config.isProduction ? "Internal server error" : error instanceof Error ? error.message : "Unknown error",
    errorCode: "INTERNAL",
  });
}
