const fs = require('fs');
function deleteImageFile(imageName) {
  const DIR = 'uploads/products';
  if (!imageName) {
    return { success: false, message: 'No file received' };
  } else {
    try {
      fs.unlinkSync(DIR + '/' + imageName);
      return {
        success: true,
        message: "Successfully! Image has been Deleted',",
      };
    } catch (err) {
      // handle the error
      return { success: false, message: 'File name is invalid' };
    }
  }
}

module.exports = deleteImageFile;
