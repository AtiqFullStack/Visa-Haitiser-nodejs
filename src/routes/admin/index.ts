import express from 'express'
import AdminAuth from './Auth'

const router = express.Router()

router.use('/auth', AdminAuth)

export default router