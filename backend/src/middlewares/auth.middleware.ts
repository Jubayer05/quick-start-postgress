import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type JwtUserPayload = {
  id: string;
  email?: string;
  role?: string;
};

function readBearerToken(req: Request): string | null {
  const h = req.headers.authorization;
  if (!h) return null;
  const [scheme, token] = h.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim();
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        error: "Server error",
        message: "JWT_SECRET is not configured",
      });
      return;
    }

    const token = readBearerToken(req);
    if (!token) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Missing bearer token",
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtUserPayload | string;
    if (!decoded || typeof decoded === "string" || !decoded.id) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid token payload",
      });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email ?? "",
      role: decoded.role ?? "USER",
    };

    next();
  } catch (error: unknown) {
    console.error("JWT verification error:", error);
    const message =
      error instanceof Error ? error.message : "Invalid or expired token";
    res.status(401).json({ error: "Unauthorized", message });
  }
};

