import { Request, Response, NextFunction } from "express";
import * as messagesRepository from "../repositories/message.repository";

export async function createMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dutyId, message } = req.body;

    if (!dutyId || !message) {
      return res.status(400).json({
        message: "dutyId and message are required",
      });
    }

    const created =
      await messagesRepository.createMessage({
        dutyId,
        message,
      });

    return res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

export async function getMessages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dutyId, sort, order } = req.query;

    const messages =
      await messagesRepository.getAllMessages(
        dutyId ? Number(dutyId) : undefined,
        sort as string,
        order as string
      );

    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function getMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const message =
      await messagesRepository.getMessageById(
        Number(req.params.id)
      );

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
}

export async function updateMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { dutyId, message } = req.body;

    if (!dutyId || !message) {
      return res.status(400).json({
        message: "dutyId and message are required",
      });
    }

    const updated =
      await messagesRepository.updateMessage(
        Number(req.params.id),
        {
          dutyId,
          message,
        }
      );

    if (!updated) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deleted =
      await messagesRepository.deleteMessage(
        Number(req.params.id)
      );

    if (!deleted) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json({
      message: "Message deleted",
    });
  } catch (error) {
    next(error);
  }
}

export async function getMessageWithDuty(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result =
      await messagesRepository.getMessagesWithDuty(
        Number(req.params.id)
      );

    if (!result) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}