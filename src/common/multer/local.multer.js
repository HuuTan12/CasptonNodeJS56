import fs from "fs";
import path from "path";
import multer from "multer";
import { BadRequestException } from "../helpers/exception.helper.js";

const UPLOAD_DIR = "public/images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new BadRequestException("Chỉ chấp nhận file hình ảnh"));
  }
  cb(null, true);
};

export const uploadLocal = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });

export const toPublicPath = (file) => `/${UPLOAD_DIR}/${file.filename}`;

export const removeLocalFile = (publicPath) => {
  if (!publicPath?.startsWith(`/${UPLOAD_DIR}/`)) return;
  fs.promises.unlink(publicPath.slice(1)).catch(() => {});
};

