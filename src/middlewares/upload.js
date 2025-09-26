// middlewares/upload.js
const multer = require('multer');

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

module.exports = multer({ storage, fileFilter });
