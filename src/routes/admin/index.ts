import express from 'express'
import AdminAuth from './Auth'
import { generateQR } from '../../utils/generateQR'
import Qrcodes from './QrCode.routes'

const router = express.Router()

router.use('/auth', AdminAuth)
router.use('/qr', Qrcodes)


export default router