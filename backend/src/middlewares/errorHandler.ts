import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);

  if (err.code === "SQLITE_CONSTRAINT") {
    return res.status(409).json({
      success: false,
      message: "Database constraint violation",
      details: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    details: err.message,
  });
}