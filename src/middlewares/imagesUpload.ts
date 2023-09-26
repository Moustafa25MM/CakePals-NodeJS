import multer from 'multer';
import cloudinary from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

const cloudi = cloudinary.v2;
cloudi.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const randomNumber = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
const maxSize = 1024 * 1024 * 5;

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploadedImages/users');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + randomNumber.toString() + file.originalname);
  },
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploadedImages/products');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + randomNumber.toString() + file.originalname);
  },
});

function fileFilter(req: any, file: any, cb: any) {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const userPicUpload = multer({
  fileFilter,
  storage: userStorage,
  limits: { fileSize: maxSize },
});
const productUpload = multer({
  fileFilter,
  storage: productStorage,
  limits: { fileSize: maxSize },
});

export { userPicUpload, productUpload, cloudi };
