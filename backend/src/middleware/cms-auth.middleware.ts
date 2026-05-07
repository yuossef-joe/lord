import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database.js";
import { ApiError } from "../utils/api-error.js";
import { verifyCmsToken } from "../utils/token.js";

export async function cmsAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw ApiError.unauthorized();
    const blacklisted = await prisma.tokenBlacklist.findUnique({ where: { token } });
    if (blacklisted) throw ApiError.unauthorized("Token has been revoked");
    const payload = verifyCmsToken(token);
    const userId = String(payload.cmsUserId ?? payload.id ?? "");
    const user = await prisma.cmsUsers.findUnique({ where: { id: userId } });
    if (!user || !user.isActive) throw ApiError.unauthorized();
    req.cmsUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : ApiError.unauthorized());
  }
}
