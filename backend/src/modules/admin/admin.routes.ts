import { type Router, Router as ExpressRouter } from "express";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import {
  deleteUserById,
  getAdminStats,
  getUsers,
  patchUserRole,
  postUserBan,
  postUserUnban,
} from "./admin.controller.js";

const router: Router = ExpressRouter();

router.get("/users", authenticate, authorize("ADMIN"), getUsers);
router.patch("/users/:id/role", authenticate, authorize("ADMIN"), patchUserRole);
router.post("/users/:id/ban", authenticate, authorize("ADMIN"), postUserBan);
router.post("/users/:id/unban", authenticate, authorize("ADMIN"), postUserUnban);
router.delete("/users/:id", authenticate, authorize("ADMIN"), deleteUserById);
router.get("/stats", authenticate, authorize("ADMIN"), getAdminStats);

export { router as adminRouter };

