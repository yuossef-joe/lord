import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/api-error.js";
import { verifyCustomerToken } from "../utils/token.js";

export async function customerAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw ApiError.unauthorized();
    const payload = verifyCustomerToken(token);
    const customerId = String(payload.customerId ?? payload.id ?? "");
    const customer = await prisma.customers.findUnique({ where: { id: customerId } });
    if (!customer || !customer.isActive) throw ApiError.unauthorized();
    req.customer = { id: customer.id, email: customer.email, name: customer.name };
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : ApiError.unauthorized());
  }
}
