import { Router, Response, Request } from "express";
import ClashRoutes from "./clashRoutes.js";

import AuthRoutes from "./authRoutes.js";
import VerifyRoutes from "./verifyRoutes.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = Router();

router.use('/auth',AuthRoutes) ;
router.use("/api/clash", ClashRoutes);

router.use("/",authMiddleware, VerifyRoutes);

export default router;