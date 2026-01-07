import express from 'express'
import AdminAuth from './Auth'
import { generateQR } from '../../utils/generateQR'
import Qrcodes from './QrCode.routes'
import templateRoutes from './temaplate.routes.ts'
import dashboardRoutes from './dashboard.routes'
import type { Request, Response } from 'express'
import geetest from '../../utils/geetest.js'

import axios from "axios";
import crypto from "crypto";
import { GEETEST_ID, GEETEST_KEY } from '../../utils/cofig.ts'


const router = express.Router()

router.use('/auth', AdminAuth)
router.use('/template', templateRoutes)
router.use('/qr', Qrcodes)
router.use('/dashboard', dashboardRoutes)



export const geetestRegister = async (req, res) => {
    const CAPTCHA_ID = GEETEST_ID
    const CAPTCHA_KEY = GEETEST_KEY

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

            // 🔴 THIS PART IS CRITICAL
            if (err) {
                console.error('GeeTest register error:', err);

                // fallback mode (DOC REQUIRED)
                return res.json({
                    success: 0,
                    gt: process.env.GEETEST_ID,
                    challenge: 'fallback',
                    new_captcha: true,
                });
            }

            // ✅ SUCCESS RESPONSE
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
        (err: any, success: any) => {
            if (err || !success) {
                return res.status(400).json({ success: false });
            }
            res.json({ success: true });
        }
    );
});

export default router