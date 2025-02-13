import { Router } from "express";
import AurthRoutes from "./authRoutes.js";
const router = Router();
router.use('/api/auth', AurthRoutes);
export default router;
