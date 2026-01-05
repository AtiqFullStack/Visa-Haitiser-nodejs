import multer from 'multer'
import path from "path";
import fs from "fs";


/* ===============================
   Ensure upload directory exists
================================ */
const uploadPath = path.join(process.cwd(), "public/logos");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

/* ===============================
   Storage config
================================ */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${ext}`;
        cb(null, uniqueName);
    },
});


/* ===============================
   File filter (images only)
================================ */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

/* ===============================
   Multer instance
================================ */
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});


/* ===============================
   Helpers
================================ */
export const singleImage = (fieldName = "image") =>
    upload.single(fieldName);

export const multipleImages = (
    fieldName = "images",
    maxCount = 5
) => upload.array(fieldName, maxCount);
