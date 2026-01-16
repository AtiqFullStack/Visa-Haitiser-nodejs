const express = require('express');

const { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin, changePassword } = require('../../controllers/admin/Authcontroller');
const authMiddleware = require('../../middlewares/authMiddleware');

const router = express.Router()

router.post('/login', loginAdmin)
router.post('/register', registerAdmin)
router.get('/profile', authMiddleware, getAdminProfile)
router.post('/logout', authMiddleware, logoutAdmin)
router.put('/changePassword', authMiddleware, changePassword)

module.exports = router