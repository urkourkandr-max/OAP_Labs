import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err);

  const isDev = process.env.NODE_ENV !== "production";

  res.status(500).json({
    status: 500,
    title: "Internal Server Error",
    detail: isDev ? String(err.message ?? err) : "An error occurred while processing your request."
  });
}