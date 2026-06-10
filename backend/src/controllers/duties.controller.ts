import { Request, Response, NextFunction } from "express";
import * as dutiesRepository from "../repositories/duties.repository";

function pd(res: Response, status: number, title: string, detail: string) {
  return res.status(status).json({ status, title, detail });
}

export async function createDuty(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, date, time } = req.body;
    const userId = req.user!.id;

    if (!title || !date || !time) {
      return pd(res, 400, "Bad Request", "Відсутні обов'язкові поля: title, date, time.");
    }

    const duty = await dutiesRepository.createDuty({
      name: title, date, time,
      comment: description || "",
      userId
    });

    return res.status(201).json({ success: true, data: duty });
  } catch (err) { next(err); }
}

export async function getDuties(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    // Повертаємо тільки duties поточного користувача
    const duties = await dutiesRepository.getAllDuties(userId);
    return res.json({ success: true, data: duties });
  } catch (err) { next(err); }
}


export async function getDuty(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ success: true, data: req.duty });
  } catch (err) { next(err); }
}

export async function updateDuty(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, date, time } = req.body;
    const id = Number(req.params.id);

    if (!title || !date || !time) {
      return pd(res, 400, "Bad Request", "Відсутні обов'язкові поля: title, date, time.");
    }

    const duty = await dutiesRepository.updateDuty(id, {
      name: title, date, time,
      comment: description || "",
      userId: req.duty.userId
    });

    return res.json({ success: true, data: duty });
  } catch (err) { next(err); }
}

export async function deleteDuty(req: Request, res: Response, next: NextFunction) {
  try {
    await dutiesRepository.deleteDuty(Number(req.params.id));
    return res.json({ success: true, message: "Видалено успішно." });
  } catch (err) { next(err); }
}

export async function getDutyWithUser(req: Request, res: Response, next: NextFunction) {
  try {
    const duty = await dutiesRepository.getDutyWithUser(Number(req.params.id));
    return res.json({ success: true, data: duty });
  } catch (err) { next(err); }
}

export async function getLatestUserDuties(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const duties = await dutiesRepository.getLatestDutiesByUser(userId);
    return res.json({ success: true, data: duties });
  } catch (err) { next(err); }
}

export async function createDutyWithMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, date, time } = req.body;
    const userId = req.user!.id;

    if (!title || !date || !time) {
      return pd(res, 400, "Bad Request", "Відсутні обов'язкові поля: title, date, time.");
    }

    const result = await dutiesRepository.createDutyWithMessage({
      name: title, date, time,
      comment: description || "",
      userId,
      firstMessage: ""
    });
    return res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}