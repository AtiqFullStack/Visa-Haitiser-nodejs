import express from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { getDashboardStats } from "../../controllers";

const router = express.Router()

router.get('/stats', authMiddleware, getDashboardStats)

export default router