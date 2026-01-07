import express from 'express'
import { deleteLogo, getAllLogos, uploadLogo, uploadMultipleImages, uploadSingleImage, uploadSingleImageUser } from '../controllers'
import { multipleImages, singleImage } from '../services/fileUpload'
import authMiddleware from '../middlewares/authMiddleware'


const router = express.Router()

router.use('/upload/logos', singleImage("image"), uploadLogo)
router.use('/get/logos', authMiddleware, getAllLogos)
router.use('/delete/logos/:id', authMiddleware, deleteLogo)


router.use('/uploaduserImage', singleImage("image"), uploadSingleImageUser)

router.use('/upload', singleImage("image"), uploadSingleImage)

router.use('/uploads', multipleImages("images", 10), uploadMultipleImages)


export default router