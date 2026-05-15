import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.js";

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.cmsUser?.role;
    if (!role || !roles.includes(role)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
}
