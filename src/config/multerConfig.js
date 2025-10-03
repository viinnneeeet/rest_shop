const multer = require('multer');

// Memory storage for in-memory handling (Cloudinary, S3, etc.)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
