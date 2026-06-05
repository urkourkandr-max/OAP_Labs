import { Request, Response, NextFunction } from "express";
import * as dutiesRepository from "../repositories/duties.repository";

export async function createDuty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      name,
      date,
      time,
      comment,
      userId,
    } = req.body;

    if (
      !name ||
      !date ||
      !time ||
      !userId
    ) {
      return res.status(400).json({
        message:
          "name, date, time and userId are required",
      });
    }

    const duty = await dutiesRepository.createDuty({
      name,
      date,
      time,
      comment,
      userId,
    });

    return res.status(201).json(duty);
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
    const { userId, sort, order } = req.query;

    const duties =
      await dutiesRepository.getAllDuties(
        userId ? Number(userId) : undefined,
        sort as string,
        order as string
      );

    res.json(duties);
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
    const duty =
      await dutiesRepository.getDutyById(
        Number(req.params.id)
      );

    if (!duty) {
      return res.status(404).json({
        message: "Duty not found",
      });
    }

    res.json(duty);
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
    const {
      name,
      date,
      time,
      comment,
      userId,
    } = req.body;

    if (
      !name ||
      !date ||
      !time ||
      !userId
    ) {
      return res.status(400).json({
        message:
          "name, date, time and userId are required",
      });
    }

    const duty =
      await dutiesRepository.updateDuty(
        Number(req.params.id),
        {
          name,
          date,
          time,
          comment,
          userId,
        }
      );

    if (!duty) {
      return res.status(404).json({
        message: "Duty not found",
      });
    }

    res.json(duty);
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
    const deleted =
      await dutiesRepository.deleteDuty(
        Number(req.params.id)
      );

    if (!deleted) {
      return res.status(404).json({
        message: "Duty not found",
      });
    }

    res.json({
      message: "Duty deleted",
    });
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
    const duty =
      await dutiesRepository.getDutyWithUser(
        Number(req.params.id)
      );

    if (!duty) {
      return res.status(404).json({
        message: "Duty not found",
      });
    }

    res.json(duty);
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
    const duties =
      await dutiesRepository.getLatestDutiesByUser(
        Number(req.params.userId)
      );

    res.json(duties);
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
    const {
      name,
      date,
      time,
      comment,
      userId,
      firstMessage,
    } = req.body;

    if (
      !name ||
      !date ||
      !time ||
      !userId ||
      !firstMessage
    ) {
      return res.status(400).json({
        message:
          "name, date, time, userId and firstMessage are required",
      });
    }

    const result =
      await dutiesRepository.createDutyWithMessage({
        name,
        date,
        time,
        comment,
        userId,
        firstMessage,
      });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}