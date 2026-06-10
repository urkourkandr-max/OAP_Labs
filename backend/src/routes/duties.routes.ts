import { Router } from "express";
import { demoAuth } from "../middlewares/demoAuth";
import { checkDutyOwner } from "../middlewares/checkOwner";

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

router.use(demoAuth);

router.get("/", getDuties);
router.get("/user/:userId/latest", getLatestUserDuties);
router.post("/", createDuty);
router.post("/with-message", createDutyWithMessage);

router.get("/:id/user", checkDutyOwner, getDutyWithUser);
router.get("/:id", checkDutyOwner, getDuty);
router.put("/:id", checkDutyOwner, updateDuty);
router.delete("/:id", checkDutyOwner, deleteDuty);

export default router;