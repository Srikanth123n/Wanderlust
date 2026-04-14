const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

const hasCloudinaryCreds =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET);

if (hasCloudinaryCreds) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const storage = hasCloudinaryCreds
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "wanderlust_DEV",
        allowed_formats: ["jpeg", "png", "jpg", "webp"],
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "uploads"));
      },
      filename: (req, file, cb) => {
        const safeBase = path
          .basename(file.originalname, path.extname(file.originalname))
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .slice(0, 60);
        cb(null, `${Date.now()}-${safeBase}${path.extname(file.originalname)}`);
      },
    });

module.exports = {
  cloudinary,
  storage,
  hasCloudinaryCreds,
};