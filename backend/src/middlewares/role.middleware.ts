import type { NextFunction, Request, Response } from "express";

export const requireRole =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const role = req.user.role;
    if (!role || !allowedRoles.includes(role)) {
      res.status(403).json({
        error: "Forbidden",
        message: `Access restricted to: ${allowedRoles.join(", ")}`,
      });
      return;
    }

    next();
  };

