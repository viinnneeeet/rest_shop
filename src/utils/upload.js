const multer = require('multer');
const fs = require('fs');
const fsPromise = require('fs').promises;
const path = require('path');

exports.uploadImage = (key, folderName) => {
  async function checkFile(folderName) {
    try {
      if (!fs.existsSync(path.join(__dirname, '../../uploads/', folderName))) {
        await fsPromise.mkdir(
          path.join(__dirname, '../../uploads/', folderName)
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  checkFile(folderName);

  const storage = multer.diskStorage({
    destination: function (req, files, cb) {
      return cb(null, `./uploads/${folderName}`);
    },

    filename: function (req, files, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const uniqueSuffix = Date.now();
      return cb(null, uniqueSuffix + '-' + files.originalname);
    },
  });

  return folderName === 'products'
    ? (multi_upload = multer({
        storage,
        limits: { fileSize: 10000000 },
        fileFilter: function (req, file, cb) {
          if (
            !file.originalname.match(
              /\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/
            )
          ) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(null, false);
          }
          cb(null, true);
        },
      }).array(key, 2))
    : (multi_upload = multer({
        storage,
        limits: { fileSize: 10000000 },
        fileFilter: function (req, file, cb) {
          if (
            !file.originalname.match(
              /\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/
            )
          ) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(null, false);
          }
          cb(null, true);
        },
      }).single(key));
};
