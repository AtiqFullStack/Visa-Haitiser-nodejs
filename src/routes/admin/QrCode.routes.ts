
import express from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { createQR, getAllQRs, increaseDownloadCount } from "../../controllers";

const router = express.Router()


router.post('/create', authMiddleware, createQR)
router.get('/getAll', authMiddleware, getAllQRs)
router.post('/increaseDownloadCount/:id', authMiddleware, increaseDownloadCount)

export default router 