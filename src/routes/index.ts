import express from 'express'
import adminRoutes from './admin'
import userRoutes from './user'

import imageupload from './imageupload.routes.ts'

const router = express.Router()

router.use('/admin', adminRoutes)
router.use('/user', userRoutes)

router.use('/image', imageupload)

export default router