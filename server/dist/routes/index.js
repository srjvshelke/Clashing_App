import { Router } from "express";
import ClashRoutes from "./clashRoutes.js";
import AuthRoutes from "./authRoutes.js";
import VerifyRoutes from "./verifyRoutes.js";
const router = Router();
router.use('/auth', AuthRoutes);
router.use("/api/clash", ClashRoutes);
router.use("/", VerifyRoutes);
export default router;
