import cron from "node-cron";
import { logger } from "../utils/logger.js";

let started = false;

export function startJobs() {
  if (started) return;
  started = true;
  cron.schedule("* * * * *", () => logger.info("Email queue tick"));
  cron.schedule("*/5 * * * *", () => logger.info("Order expiry tick"));
}
