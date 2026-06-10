import { Request, Response, NextFunction } from "express";
import { getDutyById } from "../repositories/duties.repository";

declare global {
  namespace Express {
    interface Request {
      duty?: any;
    }
  }
}

export async function checkDutyOwner(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      status: 401,
      title: "Unauthorized",
      detail: "User context is required."
    });
  }

  try {
    const duty = await getDutyById(id);

    if (!duty) {
      return res.status(404).json({
        status: 404,
        title: "Not Found",
        detail: `Запис з id=${id} не знайдено.`
      });
    }

    if (duty.userId !== userId) {
      return res.status(403).json({
        status: 403,
        title: "Forbidden",
        detail: "Access denied. You do not own this resource."
      });
    }

    req.duty = duty;
    next();
  } catch (err) {
    next(err);
  }
}