const { ApiResponse, asyncHandler } = require('../utils');
const { LogosSchema } = require('../models');
const { imageDimensionsFromStream } = require('image-dimensions');
const { createReadStream } = require('node:fs');
const path = require('path');

const uploadSingleImage = (req, res) => {
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

const uploadSingleImageUser = (req, res) => {
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

const uploadMultipleImages = (req, res) => {
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

const uploadLogo = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!req.file) {
        throw new Error('No file uploaded');
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
    });

    await data.save();
    return res.status(201).json(
        new ApiResponse(201, data, 'Logo uploaded successfully')
    );
});

const getAllLogos = asyncHandler(async (req, res) => {
    const logos = await LogosSchema.find();
    return res.status(200).json(
        new ApiResponse(200, logos, 'Logos fetched successfully')
    );
});

const deleteLogo = asyncHandler(async (req, res) => {
    const logo = await LogosSchema.findByIdAndDelete(req.params.id);
    return res.status(200).json(
        new ApiResponse(200, logo, 'Logo deleted successfully')
    );
});

module.exports = {
    uploadSingleImage,
    uploadSingleImageUser,
    uploadMultipleImages,
    uploadLogo,
    getAllLogos,
    deleteLogo
};
