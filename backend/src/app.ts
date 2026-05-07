import cors from "cors";
import express from "express";
import helmet from "helmet";
import { corsOptions } from "./config/cors.js";
import { apiLimiter } from "./middleware/rate-limit.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/request-logger.middleware.js";
import routes from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use(apiLimiter);

  app.use("/api", routes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found", errorCode: "NOT_FOUND" });
  });

  app.use(errorMiddleware);

  return app;
}

export default createApp();
