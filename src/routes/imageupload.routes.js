const express = require('express');
const { deleteLogo, getAllLogos, uploadLogo, uploadMultipleImages, uploadSingleImage, uploadSingleImageUser } = require('../controllers');
const { multipleImages, singleImage } = require('../services/fileUpload');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/upload/logos', singleImage("image"), uploadLogo);
router.use('/get/logos', authMiddleware, getAllLogos);
router.use('/delete/logos/:id', authMiddleware, deleteLogo);

router.use('/uploaduserImage', singleImage("image"), uploadSingleImageUser);
router.use('/upload', singleImage("image"), uploadSingleImage);
router.use('/uploads', multipleImages("images", 10), uploadMultipleImages);

module.exports = router;
