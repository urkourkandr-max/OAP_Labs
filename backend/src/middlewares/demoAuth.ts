import { Request, Response, NextFunction } from "express";
import { getUserById } from "../repositories/user.repository";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

export async function demoAuth(req: Request, res: Response, next: NextFunction) {
  const userId = req.header("X-Demo-UserId");

  if (!userId) {
    return res.status(401).json({
      status: 401,
      title: "Unauthorized",
      detail: "X-Demo-UserId header is required."
    });
  }

  const parsedId = Number(userId);
  if (isNaN(parsedId) || parsedId <= 0 || !Number.isInteger(parsedId)) {
    return res.status(401).json({
      status: 401,
      title: "Unauthorized",
      detail: "Invalid X-Demo-UserId: must be a positive integer."
    });
  }

  try {
    const user = await getUserById(parsedId);
    if (!user) {
      return res.status(401).json({
        status: 401,
        title: "Unauthorized",
        detail: `User with id=${parsedId} does not exist.`
      });
    }
  } catch (err) {
    return next(err);
  }

  req.user = { id: parsedId };
  next();
}