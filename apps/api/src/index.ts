import type { CorsOptions } from "cors";

import { clerkMiddleware } from "@clerk/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "@/config/env-variable";
import { logger } from "@/lib/logger";
import { errorHandler, isAuthenticated, rateLimiter } from "@/middlewares";
import { authRouter, summaryRouter } from "@/routes";

class HoverDocsApp {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.PORT;

    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      }),
    );

    this.app.use(
      morgan("combined", {
        stream: { write: message => logger.info(message.trim()) },
      }),
    );

    const corsOptions: CorsOptions = {
      // WIP: vscode-webview://* after publishing the extension

    };

    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    this.app.get("/", (req, res) => {
      res.status(200).json({ message: "HoverDocs API is running" });
    });

    this.app.get("/health", (req, res) => {
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toLocaleString(),
        uptime: process.uptime(),
      });
    });

    this.app.use(clerkMiddleware());

    this.app.use("/api/auth", authRouter);
    this.app.use("/api/ai-code", isAuthenticated, rateLimiter, summaryRouter);

    this.app.use((req, res) => {
      res.status(404).json({ message: "API route not found", path: req.originalUrl });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public start(): void {
    this.app.listen(this.port, (error) => {
      if (error) {
        logger.error({ message: error.message }, "Error starting HoverDocs API");
        process.exit(1);
      }

      logger.info(`HoverDocs API is running on port ${this.port}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`Health check avaliable at ${config.SERVER_API_URL}/health`);
    });
  }
}

const server = new HoverDocsApp();
server.start();

process.on("SIGINT", () => process.exit());
process.on("SIGTERM", () => process.exit());
