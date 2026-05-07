import multer from "multer";
import { isAllowedImageType } from "../utils/file-upload.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    if (isAllowedImageType(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new Error("Only jpg, png and webp images are allowed"));
  },
});
