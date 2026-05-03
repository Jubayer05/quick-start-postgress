import { type Router, Router as ExpressRouter } from "express";
import multer from "multer";
import { authenticate } from "../auth/auth.middleware.js";
import {
  deleteMe,
  getMe,
  getMySessions,
  patchMe,
  postAvatar,
} from "./user.controller.js";

const router: Router = ExpressRouter();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ── Protected Routes ──────────────────────────────────────────────────────────
router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, patchMe);
router.post("/avatar", authenticate, upload.single("avatar"), postAvatar);
router.get("/sessions", authenticate, getMySessions);
router.delete("/me", authenticate, deleteMe);

export { router as userRouter };
