const express = require('express');

const authMiddleware = require('../../middlewares/authMiddleware');
const { createTemplate, deleteTemplate, getAllTemplates, getTemplateById, updateTemplate } = require('../../controllers');

const router = express.Router()

router.post('/create', authMiddleware, createTemplate)
router.get('/get', authMiddleware, getAllTemplates)
router.get('/get/:id',  getTemplateById)
router.delete('/delete/:id', authMiddleware, deleteTemplate)
router.put('/update/:id', authMiddleware, updateTemplate)

module.exports = router