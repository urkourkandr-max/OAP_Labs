import { Request, Response, NextFunction } from "express";
import * as usersRepository from "../repositories/user.repository";

function pd(res: Response, status: number, title: string, detail: string) {
  return res.status(status).json({ status, title, detail });
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return pd(res, 400, "Bad Request", "Поля name, email і password є обов'язковими.");
    }

    const user = await usersRepository.createUser({ name, email, password });
    return res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    if (error.message?.includes("UNIQUE") || error.code === "SQLITE_CONSTRAINT") {
      return pd(res, 409, "Conflict", "Користувач з таким email вже існує.");
    }
    next(error);
  }
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { sort, order, email } = req.query;
    const users = await usersRepository.getAllUsers(
      sort as string,
      order as string,
      email as string
    );
    return res.json({ success: true, data: users });
  } catch (err) { next(err); }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersRepository.getUserById(Number(req.params.id));
    if (!user) return pd(res, 404, "Not Found", "Користувача не знайдено.");
    return res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return pd(res, 400, "Bad Request", "Поля name, email і password є обов'язковими.");
    }

    const user = await usersRepository.updateUser(
      Number(req.params.id),
      { name, email, password }
    );
    if (!user) return pd(res, 404, "Not Found", "Користувача не знайдено.");
    return res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await usersRepository.deleteUser(Number(req.params.id));
    if (!deleted) return pd(res, 404, "Not Found", "Користувача не знайдено.");
    return res.json({ success: true, message: "Користувача видалено." });
  } catch (err) { next(err); }
}