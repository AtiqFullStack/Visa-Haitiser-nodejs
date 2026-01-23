
const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const { changeStatusOfQrCode, createQR, deleteQrCode, getAllQRs, getSingle, increaseDownloadCount, verifyAuthenticity, getQrWithToken } = require('../../controllers');

const router = express.Router()


router.post('/create', authMiddleware, createQR)
router.get('/get/qrdata', getQrWithToken)
router.get('/getAll', authMiddleware, getAllQRs)
router.get('/get/:id', getSingle)
router.post('/increaseDownloadCount/:id', authMiddleware, increaseDownloadCount)
router.put('/updateStatus/:id', authMiddleware, changeStatusOfQrCode)
router.delete('/delete/:id', authMiddleware, deleteQrCode)

router.post('/verifyAuthenticity', verifyAuthenticity)

module.exports = router 