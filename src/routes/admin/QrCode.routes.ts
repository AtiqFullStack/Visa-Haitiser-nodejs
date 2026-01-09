
import express from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import { changeStatusOfQrCode, createQR, deleteQrCode, getAllQRs, getSingle, increaseDownloadCount } from "../../controllers";

const router = express.Router()


router.post('/create', authMiddleware, createQR)
router.get('/getAll', authMiddleware, getAllQRs)
router.get('/get/:id', getSingle)
router.post('/increaseDownloadCount/:id', authMiddleware, increaseDownloadCount)
router.put('/updateStatus/:id', authMiddleware, changeStatusOfQrCode)
router.delete('/delete/:id', authMiddleware, deleteQrCode)

export default router 