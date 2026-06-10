import express from "express";
import cors from "cors";

import usersRoutes from "./routes/users.routes";
import dutiesRoutes from "./routes/duties.routes";
import messagesRoutes from "./routes/message.routes";

import { initDatabase } from "./db/init";
import { seedDatabase } from "./db/seed";

import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(logger);

app.use("/api/v1/duties", dutiesRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/messages", messagesRoutes);

app.use(errorHandler);

const PORT = 3000;

async function startServer() {
  try {
    await initDatabase();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

startServer();