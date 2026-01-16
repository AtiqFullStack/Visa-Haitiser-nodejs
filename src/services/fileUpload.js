const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(process.cwd(), "public/logos");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const singleImage = (fieldName = "image") => upload.single(fieldName);

const multipleImages = (fieldName = "images", maxCount = 5) => upload.array(fieldName, maxCount);

module.exports = {
    upload,
    singleImage,
    multipleImages
};
