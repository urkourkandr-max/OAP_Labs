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
      status: 409,
      title: "Conflict",
      detail: "Запис вже існує або порушено обмеження бази даних."
    });
  }

  const status = err.status || 500;
  return res.status(status).json({
    status,
    title: status === 500 ? "Internal Server Error" : "Error",
    detail: err.message || "Внутрішня помилка сервера."
  });
}