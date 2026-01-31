import type { NextFunction, Request, Response } from "express";

import { ZodError } from "@hoverexplain/validators";

import type { AppError } from "@/types";

import { config } from "@/config/env-variable";
import { ApiError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

export function errorHandler(error: AppError, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(error);
  }

  const isDevelopment = config.NODE_ENV === "development";
  let statusCode = error.statusCode || 500;
  let message = "Internal Server Error";
  let details: any;

  logger.error({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof ApiError && {
        statusCode: error.statusCode,
        isOperational: error.isOperational,
      }),
    },
    request: {
      method: req.method,
      url: req.url,
      userAgent: req.get("User-Agent"),
      ip: req.ip || req.socket.remoteAddress,
      ...(isDevelopment && { headers: req.headers, body: req.body }),
    },
  }, "Error occurred during request processing");

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    details = error.issues.map(issue => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
  else if (error.name === "SyntaxError") {
    statusCode = 400;
    message = "Invalid JSON Syntax";
  }
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }
  else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired";
  }
  else if (error.name === "TimeoutError") {
    statusCode = 408;
    message = "Request Timeout";
  }
  else if (error.name === "PayloadTooLargeError") {
    statusCode = 413;
    message = "Payload Too Large";
  }
  else if (error instanceof Error) {
    message = isDevelopment ? error.message : "An error occurred";
  }

  const errorResponse = {
    success: false,
    message,
    timestamp: new Date().toLocaleString(),
    requestId: req.headers["x-request-id"] || "unknown",
    ...(details && { details }),
  };

  if (error instanceof ApiError && !error.isOperational) {
    logger.error({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
      },
      context: "Non-operational error occurred",
    }, "System error - requires investigation");
  }

  res.status(statusCode).json(errorResponse);
}
