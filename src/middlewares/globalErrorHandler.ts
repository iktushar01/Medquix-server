import { Request, Response, NextFunction } from "express";

/**
 * Global Error Handler Middleware
 * Catches all errors thrown in routes/middlewares
 * and sends a standard JSON response.
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // log for debugging

  // Default status
  const statusCode = err.status || err.statusCode || 500;

  // Default message
  const message =
    err.message || "Something went wrong on the server. Please try again.";

  // Optional: Send validation errors if available (Prisma, JOI, etc.)
  const errors = err.errors || undefined;

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
