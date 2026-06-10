import { Request, Response, NextFunction } from "express";
import * as dutiesRepository from "../repositories/duties.repository";

function problemDetails(res: Response, status: number, title: string, detail: string) {
  return res.status(status).json({ status, title, detail });
}

export async function createDuty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, date, time, userId } = req.body;

    if (!title || !date || !time || !userId) {
      return problemDetails(res, 400, "Bad Request", "Відсутні обов'язкові поля: title, date, time, userId.");
    }

    const duty = await dutiesRepository.createDuty({
      name: title,
      date,
      time,
      comment: description || "",
      userId
    });

    return res.status(201).json({ success: true, data: duty });
  } catch (error) {
    next(error);
  }
}

export async function getDuties(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const duties = await dutiesRepository.getAllDuties();
    return res.json({ success: true, data: duties });
  } catch (error) {
    next(error);
  }
}

export async function getDuty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const duty = await dutiesRepository.getDutyById(Number(id));

    if (!duty) {
      return problemDetails(res, 404, "Not Found", `Запис з id=${id} не знайдено.`);
    }

    return res.json({ success: true, data: duty });
  } catch (error) {
    next(error);
  }
}

export async function updateDuty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { title, description, date, time, userId } = req.body;

    if (!title || !date || !time || !userId) {
      return problemDetails(res, 400, "Bad Request", "Відсутні обов'язкові поля: title, date, time, userId.");
    }

    const existing = await dutiesRepository.getDutyById(Number(id));
    if (!existing) {
      return problemDetails(res, 404, "Not Found", `Запис з id=${id} не знайдено.`);
    }

    const duty = await dutiesRepository.updateDuty(Number(id), {
      name: title,
      date,
      time,
      comment: description || "",
      userId
    });

    return res.json({ success: true, data: duty });
  } catch (error) {
    next(error);
  }
}

export async function deleteDuty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const duty = await dutiesRepository.getDutyById(Number(id));
    if (!duty) {
      return problemDetails(res, 404, "Not Found", `Запис з id=${id} не знайдено.`);
    }

    await dutiesRepository.deleteDuty(Number(id));
    return res.json({ success: true, message: "Видалено успішно." });
  } catch (error) {
    next(error);
  }
}

export async function getDutyWithUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const duty = await dutiesRepository.getDutyWithUser(Number(id));

    if (!duty) {
      return problemDetails(res, 404, "Not Found", `Запис з id=${id} не знайдено.`);
    }

    return res.json({ success: true, data: duty });
  } catch (error) {
    next(error);
  }
}

export async function getLatestUserDuties(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const duties = await dutiesRepository.getLatestDutiesByUser(Number(userId));
    return res.json({ success: true, data: duties });
  } catch (error) {
    next(error);
  }
}

export async function createDutyWithMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, description, date, time, userId } = req.body;
    const result = await dutiesRepository.createDutyWithMessage({
      name: title,
      date,
      time,
      comment: description || "",
      userId,
      firstMessage: ""
    });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}