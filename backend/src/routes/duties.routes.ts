import { Router, Request, Response, NextFunction } from "express";

import {
  createDuty,
  createDutyWithMessage,
  getDuties,
  getDuty,
  updateDuty,
  deleteDuty,
  getDutyWithUser,
  getLatestUserDuties,
} from "../controllers/duties.controller";

const router = Router();

router.get("/", getDuties);

router.get("/user/:userId/latest", getLatestUserDuties);

router.get("/:id/user", getDutyWithUser);

router.get("/:id", getDuty);

router.post("/", createDuty);

router.post("/with-message", createDutyWithMessage);

router.put("/:id", updateDuty);

router.delete("/:id", deleteDuty);

export default router;
