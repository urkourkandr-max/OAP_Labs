import { Request, Response, NextFunction } from "express";
import * as messagesRepository from "../repositories/message.repository";

function pd(res: Response, status: number, title: string, detail: string) {
  return res.status(status).json({ status, title, detail });
}

export async function createMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { dutyId, message } = req.body;
    if (!dutyId || !message) {
      return pd(res, 400, "Bad Request", "Поля dutyId і message є обов'язковими.");
    }
    const created = await messagesRepository.createMessage({ dutyId, message });
    return res.status(201).json({ success: true, data: created });
  } catch (err) { next(err); }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { dutyId, sort, order } = req.query;
    const messages = await messagesRepository.getAllMessages(
      dutyId ? Number(dutyId) : undefined,
      sort as string,
      order as string
    );
    return res.json({ success: true, data: messages });
  } catch (err) { next(err); }
}

export async function getMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const message = await messagesRepository.getMessageById(Number(req.params.id));
    if (!message) return pd(res, 404, "Not Found", "Повідомлення не знайдено.");
    return res.json({ success: true, data: message });
  } catch (err) { next(err); }
}

export async function updateMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { dutyId, message } = req.body;
    if (!dutyId || !message) {
      return pd(res, 400, "Bad Request", "Поля dutyId і message є обов'язковими.");
    }
    const updated = await messagesRepository.updateMessage(
      Number(req.params.id),
      { dutyId, message }
    );
    if (!updated) return pd(res, 404, "Not Found", "Повідомлення не знайдено.");
    return res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

export async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await messagesRepository.deleteMessage(Number(req.params.id));
    if (!deleted) return pd(res, 404, "Not Found", "Повідомлення не знайдено.");
    return res.json({ success: true, message: "Повідомлення видалено." });
  } catch (err) { next(err); }
}

export async function getMessageWithDuty(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await messagesRepository.getMessagesWithDuty(Number(req.params.id));
    if (!result) return pd(res, 404, "Not Found", "Повідомлення не знайдено.");
    return res.json({ success: true, data: result });
  } catch (err) { next(err); }
}