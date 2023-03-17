const fs = require('fs');
function deleteImageFile(imageName) {
  console.log(imageName, 'imageName');
  const name = imageName.split('/')[1];
  const DIR = 'uploads/products';
  if (!imageName) {
    return { success: false, message: 'No file received' };
  } else {
    try {
      fs.unlinkSync(DIR + '/' + name);
      return {
        success: true,
        message: "Successfully! Image has been Deleted',",
      };
    } catch (err) {
      // handle the error

      // return { success: false, message: 'File name is invalid' };
      return { success: false, message: err };
    }
  }
}

module.exports = deleteImageFile;
