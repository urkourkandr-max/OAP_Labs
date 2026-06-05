import { Router } from "express";

import {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
  getMessageWithDuty,
} from "../controllers/message.controller";

const router = Router();

router.post("/", createMessage);

router.get("/", getMessages);

router.get("/:id/duty", getMessageWithDuty);

router.get("/:id", getMessage);

router.put("/:id", updateMessage);

router.delete("/:id", deleteMessage);

export default router;