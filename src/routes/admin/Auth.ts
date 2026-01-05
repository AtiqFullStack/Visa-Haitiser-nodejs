import express from "express";
import { asyncHandler, ApiResponse, ApiError } from "../../utils";
import type { Request, Response } from "express";
import { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin } from "../../controllers/admin/Authcontroller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router()

router.post('/login', loginAdmin)
router.post('/register', registerAdmin)
router.get('/profile', authMiddleware, getAdminProfile)
router.post('/logout', authMiddleware, logoutAdmin)

export default router