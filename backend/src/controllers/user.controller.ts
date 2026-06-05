import { Request, Response, NextFunction } from "express";
import * as usersRepository from "../repositories/user.repository";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    const user = await usersRepository.createUser({
      name,
      email,
      password,
    });

    return res.status(201).json(user);
  } catch (error: any) {
    if (
      error.message?.includes("UNIQUE") ||
      error.code === "SQLITE_CONSTRAINT"
    ) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    next(error);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { sort, order, email } = req.query;

    const users = await usersRepository.getAllUsers(
      sort as string,
      order as string,
      email as string
    );

    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await usersRepository.getUserById(
      Number(req.params.id)
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    const user = await usersRepository.updateUser(
      Number(req.params.id),
      {
        name,
        email,
        password,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deleted = await usersRepository.deleteUser(
      Number(req.params.id)
    );

    if (!deleted) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
}