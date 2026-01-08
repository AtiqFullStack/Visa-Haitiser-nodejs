import express from 'express'
import adminRoutes from './admin'
import userRoutes from './user'
import templateRoutes from './template.routes'
import imageupload from './imageupload.routes.ts'

const router = express.Router()

router.use('/admin', adminRoutes)
router.use('/user', userRoutes)
router.use('/template', templateRoutes)
router.use('/image', imageupload)

export default router