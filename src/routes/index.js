const express = require('express');
const adminRoutes = require('./admin');
const userRoutes = require('./user');
const templateRoutes = require('./template.routes');
const imageupload = require('./imageupload.routes');

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/template', templateRoutes);
router.use('/image', imageupload);

module.exports = router;
