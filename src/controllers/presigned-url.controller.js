const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const path = require('path');
const ResponseHandler = require('../utils/responseHandler');

// Helper: upload buffer to Cloudinary
const uploadBufferToCloudinary = (buffer, { folder, publicId }) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder,
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Controller: Upload Image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { filePath = '' } = req.body;
    const fileName =
      path.basename(filePath, path.extname(filePath)) || 'image_1';
    const folderPath =
      path.dirname(filePath) === '.' ? '' : path.dirname(filePath);

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: folderPath,
      publicId: fileName,
    });

    return ResponseHandler.success(
      res,
      'Upload successful',
      {
        publicUrl: result.secure_url,
        cloudinaryResponse: result,
      },
      201
    );
  } catch (err) {
    console.error('❌ Upload failed:', err);
    return ResponseHandler.error(
      res,
      'Upload failed',
      { details: err.message },
      500
    );
  }
};
