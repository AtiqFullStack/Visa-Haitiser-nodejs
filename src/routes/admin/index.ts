import express from 'express'
import AdminAuth from './Auth'
import { generateQR } from '../../utils/generateQR'
import Qrcodes from './QrCode.routes'
import templateRoutes from './temaplate.routes.ts'
import dashboardRoutes from './dashboard.routes'

const router = express.Router()

router.use('/auth', AdminAuth)
router.use('/template', templateRoutes)
router.use('/qr', Qrcodes)
router.use('/dashboard', dashboardRoutes)


export default router