
const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const { changeStatusOfQrCode, createQR, deleteQrCode, getAllQRs, getSingle, increaseDownloadCount, verifyAuthenticity, getQrWithToken, updateQRsWithoutToken } = require('../../controllers');
const { getPDfWithToken } = require('../../controllers/admin/QrControllers');

const router = express.Router()


router.post('/create', authMiddleware, createQR)
router.get('/get/qrdata', getQrWithToken)
router.patch('/upadatetoken', updateQRsWithoutToken)
router.get('/getAll', authMiddleware, getAllQRs)
router.get('/get/:id', getSingle)
router.post('/increaseDownloadCount/:id', authMiddleware, increaseDownloadCount)
router.put('/updateStatus/:id', authMiddleware, changeStatusOfQrCode)
router.delete('/delete/:id', authMiddleware, deleteQrCode)
router.get('/getPdf/:token',getPDfWithToken)

router.post('/verifyAuthenticity', verifyAuthenticity)

module.exports = router 