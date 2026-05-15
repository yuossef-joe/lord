import app from "./app.js";
import { config } from "./config/index.js";
import { prisma } from "./config/database.js";
import { startJobs } from "./jobs/index.js";
import { logger } from "./utils/logger.js";

const server = app.listen(config.port, () => {
  logger.info(`Lord backend listening on port ${config.port}`);
  startJobs();
});

async function shutdown(signal: string) {
  logger.info(`${signal} received. Shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
