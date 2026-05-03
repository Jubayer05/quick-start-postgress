import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

type SchemaBundle = Partial<{
  body: ZodTypeAny;
  query: ZodTypeAny;
  params: ZodTypeAny;
}>;

export const validate = (schemas: SchemaBundle) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) (req as unknown as { query: unknown }).query = schemas.query.parse(req.query);
      if (schemas.params)
        (req as unknown as { params: unknown }).params = schemas.params.parse(req.params);
      next();
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as { message?: unknown }).message ?? "Validation failed")
          : "Validation failed";
      res.status(400).json({ error: "Validation error", message });
    }
  };
};

