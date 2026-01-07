import type { Request, Response } from "express";
import { ApiResponse, asyncHandler } from "../utils";
import { LogosSchema } from "../models";
import { imageDimensionsFromStream } from 'image-dimensions';
import { createReadStream } from 'node:fs';
import * as path from "path";


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
export const uploadSingleImageUser = (req: Request, res: Response) => {
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
    const {name }=req.body
    if (!req.file) {
        throw new Error('No file uploaded')
    }
    const filePath = path.join(
        process.cwd(),
        "public",
        "logos",
        req.file.filename
    );
    const stream = createReadStream(filePath);

    const dimensions = await imageDimensionsFromStream(stream);

    const data = new LogosSchema({
        url: `/uploads/logos/${req.file.filename}`,
        name: name || req.file.filename,
        dimensions: {
            width: dimensions?.height,
            height: dimensions?.width
        },

    })

    await data.save()
    return res.status(201).json(
        new ApiResponse(201, data, 'Logo uploaded successfully')
    )

})


export const getAllLogos = asyncHandler(async (req: Request, res: Response) => {
    const logos = await LogosSchema.find()
    return res.status(200).json(
        new ApiResponse(200, logos, 'Logos fetched successfully')
    )
})

export const deleteLogo = asyncHandler(async (req: Request, res: Response) => {
    const logo = await LogosSchema.findByIdAndDelete(req.params.id)
    return res.status(200).json(
        new ApiResponse(200, logo, 'Logo deleted successfully')
    )
})