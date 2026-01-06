import express from "express";

import { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin, changePassword } from "../../controllers/admin/Authcontroller";
import authMiddleware from "../../middlewares/authMiddleware";

const router = express.Router()

router.post('/login', loginAdmin)
router.post('/register', registerAdmin)
router.get('/profile', authMiddleware, getAdminProfile)
router.post('/logout', authMiddleware, logoutAdmin)
router.put('/changePassword', authMiddleware, changePassword)

export default router