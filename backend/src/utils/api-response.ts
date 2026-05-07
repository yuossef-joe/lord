import type { Response } from "express";

export function success<T>(res: Response, data: T, message = "OK", statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, message });
}

export function paginated<T>(
  res: Response,
  data: T,
  pagination: { page: number; limit: number; total: number; totalPages: number },
  message = "OK",
) {
  return res.status(200).json({ success: true, data, message, pagination });
}

export function created<T>(res: Response, data: T, message = "Created") {
  return success(res, data, message, 201);
}
