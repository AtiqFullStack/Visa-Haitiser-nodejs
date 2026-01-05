import express from 'express'
import { uploadLogo, uploadMultipleImages, uploadSingleImage } from '../controllers'
import { multipleImages, singleImage } from '../services/fileUpload'


const router = express.Router()

router.use('/upload/logos', singleImage("image"), uploadLogo)

router.use('/upload', singleImage("image"), uploadSingleImage)
router.use('/uploads', multipleImages("images", 10), uploadMultipleImages)


export default router