import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Application } from "express";
import { authClient } from "./lib/auth.js";
import router from "./routes/index.js";

const app: Application = express();

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (
      err &&
      typeof err === "object" &&
      "name" in err &&
      (err as { name?: unknown }).name === "SyntaxError"
    ) {
      res.status(400).json({
        error: "Bad Request",
        message: "Invalid JSON body",
      });
      return;
    }
    next(err);
  },
);

const frontendOrigin = (
  process.env.FRONTEND_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (origin === frontendOrigin) {
        callback(null, true);
        return;
      }
      if (
        process.env.NODE_ENV !== "production" &&
        (origin.startsWith("http://localhost:") ||
          origin.startsWith("http://127.0.0.1:"))
      ) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(authClient));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/api/v1/health", (req, res) => {
  console.log("Health check endpoint called - /api/v1/health");
  res.status(200).json({ message: "OK", timestamp: new Date().toISOString() });
});

export default app;
