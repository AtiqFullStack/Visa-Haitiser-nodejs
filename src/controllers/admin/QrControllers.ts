import type { Request, Response } from "express";
import QrCode from "../../models/QrCode";
import { ApiResponse } from "../../utils";

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
        const qrs = await QrCode.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: qrs,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET ALL QRs
 */
export const getSingle = async (_req: Request, res: Response) => {
    try {
        const qrs = await QrCode.findOne({ _id: _req.params.id }).sort({ createdAt: -1 });
        return res.status(200).json(new ApiResponse(200, qrs, 'Data fetched'))
    } catch (error: any) {
        throw new Error(error.message)
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

/**
 * Change Status 
 */
export const changeStatusOfQrCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const qr = await QrCode.findById(id);

    if (!qr) {
      return res.status(404).json({ message: "QR Code not found" });
    }

    const newStatus = qr.status === "active" ? "inactive" : "active";

    await QrCode.findByIdAndUpdate(id, {
      status: newStatus,
    });

    res.json({
      success: true,
      status: newStatus,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteQrCode = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const data=await QrCode.findByIdAndDelete(id);
        return res.status(200).json(
        new ApiResponse(200, data, 'QR Code deleted successfully')
    )
    } catch (error: any) {
           throw new Error(error)
    }
};


