import express from "express";

import authMiddleware from "../../middlewares/authMiddleware";
import { createTemplate, deleteTemplate, getAllTemplates, getTemplateById, updateTemplate } from "../../controllers";

const router = express.Router()

router.post('/create', authMiddleware, createTemplate)
router.get('/get', authMiddleware, getAllTemplates)
router.get('/get/:id',  getTemplateById)
router.delete('/delete/:id', authMiddleware, deleteTemplate)
router.put('/update/:id', authMiddleware, updateTemplate)

export default router