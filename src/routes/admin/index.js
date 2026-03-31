const express = require('express');
const AdminAuth = require('./Auth');
const Qrcodes = require('./QrCode.routes');
const templateRoutes = require('./temaplate.routes');
const dashboardRoutes = require('./dashboard.routes');
const geetest = require('../../utils/geetest.js');
const axios = require('axios');
const crypto = require('crypto');
const { GEETEST_ID, GEETEST_KEY } = require('../../utils/cofig');

const router = express.Router();

router.use('/auth', AdminAuth);
router.use('/template', templateRoutes);
router.use('/qr', Qrcodes);
router.use('/dashboard', dashboardRoutes);

const geetestRegister = async (req, res) => {
    const CAPTCHA_ID = GEETEST_ID;
    const CAPTCHA_KEY = GEETEST_KEY;

    const timestamp = Math.round(new Date().getTime() / 1000);
    const digest = crypto
        .createHash("sha256")
        .update(CAPTCHA_ID + timestamp + CAPTCHA_KEY)
        .digest("hex");

    try {
        const response = await axios.get(
            "https://gcaptcha4.geetest.com/register",
            {
                params: {
                    captcha_id: CAPTCHA_ID,
                    challenge: digest,
                    client_type: "web",
                    lang: "en",
                },
            }
        );

        return res.json(response.data);
    } catch (err) {
        console.error("GeeTest error:", err.message);
        return res.status(500).json({ error: "geetest_failed" });
    }
};

router.get('/geetest', (req, res) => {
    geetest.register(
        {
            client_type: 'web',
            ip_address: req.headers['x-forwarded-for'] || req.ip,
        },
        (err, data) => {
            if (err) {
                console.error('GeeTest register error:', err);
                return res.json({
                    success: 0,
                    gt: process.env.GEETEST_ID,
                    challenge: 'fallback',
                    new_captcha: true,
                });
            }
            res.json(data);
        }
    );
});

router.post('/validate', (req, res) => {
    const {
        geetest_challenge,
        geetest_validate,
        geetest_seccode,
    } = req.body;

    geetest.validate(
        {
            geetest_challenge,
            geetest_validate,
            geetest_seccode,
        },
        (err, success) => {
            if (err || !success) {
                return res.status(400).json({ success: false });
            }
            res.json({ success: true });
        }
    );
});

module.exports = router;
module.exports.geetestRegister = geetestRegister;
