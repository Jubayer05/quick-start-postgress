import { Router } from "express";
import { authRouter } from "../modules/auth/auth.route.js";
import { adminRouter } from "../modules/admin/admin.routes.js";
import { userRouter } from "../modules/user/user.routes.js";
const router: Router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/users", userRouter);

export default router;
