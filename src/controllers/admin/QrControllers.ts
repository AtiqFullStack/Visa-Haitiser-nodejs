import type { Request, Response } from "express";
import QrCode from "../../models/QrCode";

/**
 * CREATE QR
 */
export const createQR = async (req: Request, res: Response) => {
    try {
        const { data, options } = req.body;

        if (!data || !options) {
            return res.status(400).json({
                message: "QR data and options are required",
            });
        }

        const qr = await QrCode.create({
            data,
            options,
            createdBy: req.user?.id, // agar auth laga hai
        });

        res.status(201).json({
            success: true,
            message: "QR saved successfully",
            qr,
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
        });
    }
};

/**
 * GET ALL QRs
 */
export const getAllQRs = async (_req: Request, res: Response) => {
    try {
        const qrs = await QrCode.find({ status: "active" }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: qrs,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * INCREASE DOWNLOAD COUNT
 */
export const increaseDownloadCount = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await QrCode.findByIdAndUpdate(id, {
            $inc: { downloadCount: 1 },
        });

        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
