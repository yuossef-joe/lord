export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errorCode = "API_ERROR",
    public isOperational = true,
  ) {
    super(message);
  }

  static badRequest(message = "Bad request", code = "BAD_REQUEST") {
    return new ApiError(400, message, code);
  }

  static unauthorized(message = "Unauthorized", code = "UNAUTHORIZED") {
    return new ApiError(401, message, code);
  }

  static forbidden(message = "Forbidden", code = "FORBIDDEN") {
    return new ApiError(403, message, code);
  }

  static notFound(message = "Resource not found", code = "NOT_FOUND") {
    return new ApiError(404, message, code);
  }

  static conflict(message = "Conflict", code = "CONFLICT") {
    return new ApiError(409, message, code);
  }

  static internal(message = "Internal server error", code = "INTERNAL") {
    return new ApiError(500, message, code);
  }
}
