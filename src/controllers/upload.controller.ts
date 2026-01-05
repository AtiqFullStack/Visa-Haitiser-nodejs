import type { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../utils";
import { LogosSchema } from "../models";


export const uploadSingleImage = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
        success: true,
        file: {
            filename: req.file.filename,
            path: `/uploads/logos/${req.file.filename}`,
        },
    });
};

export const uploadMultipleImages = (req: Request, res: Response) => {
    if (!req.files || !(req.files instanceof Array)) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files.map((file) => ({
        filename: file.filename,
        path: `/uploads/logos/${file.filename}`,
    }));

    res.json({
        success: true,
        files,
    });
};


export const uploadLogo = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new Error('No file uploaded')
    }

    const data = new LogosSchema({
        url: `/uploads/logos/${req.file.filename}`,
        name: req.file.filename
    })
    await data.save()
    return res.status(404).json(
        new ApiResponse(404, data, 'Logo uploaded successfully')
    )

})