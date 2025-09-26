const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

// Upload image controller
exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { fileName } = req?.query;

    // Wrap upload_stream in a Promise for async/await
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'gallery',
            public_id: fileName || 'image_1', // use query param or default
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

    const result = await uploadToCloudinary();

    res.json({
      message: 'Upload successful',
      publicUrl: result.secure_url,
      cloudinaryResponse: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};

// Delete image controller
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params; // expect /delete/:publicId

    if (!publicId) {
      return res.status(400).json({ message: 'publicId is required' });
    }

    const result = await cloudinary.uploader.destroy(`gallery/${publicId}`, {
      resource_type: 'image',
    });

    if (result.result === 'not found') {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({
      message: 'Delete successful',
      result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
};
