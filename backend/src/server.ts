import express from "express";

import usersRoutes from "./routes/users.routes";
import dutiesRoutes from "./routes/duties.routes";
import messagesRoutes from "./routes/message.routes";

import { initDatabase } from "./db/init";
import { seedDatabase } from "./db/seed";

import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use(logger);

app.use("/users", usersRoutes);
app.use("/duties", dutiesRoutes);
app.use("/messages", messagesRoutes);

app.use(errorHandler);

const PORT = 3000;

async function startServer() {
  try {
    await initDatabase();

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(
      "Database initialization failed:",
      err
    );
    process.exit(1);
  }
}

startServer();