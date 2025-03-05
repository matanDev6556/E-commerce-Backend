const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const ALLOWED_EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (_, file, cb) {
    const filename = file.originalname
      .replace(' ', '-')
      .replace('.png', '')
      .replace('.jpg', '')
      .replace('.jpeg', '');
    const extension = ALLOWED_EXTENSIONS[file.mimetype];
    if (!extension) {
      return cb(new Error(`Invalid image type: ${file.mimetype}`));
    }
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: (_, file, cb) => {
    const isValid = ALLOWED_EXTENSIONS[file.mimetype];
    if (!isValid) {
      return cb(
        new Error(`Invalid image type: ${file.mimetype} is not allowed`)
      );
    }
    cb(null, true);
  },
});



const  deleteImages = async function (imageUrls, continueOnErrorName = 'ENOENT') {
  try {
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
        const imagePath = path.resolve(
          __dirname,
          '..',
          'public',
          'uploads',
          path.basename(imageUrl)
        );
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          if (error.code === continueOnErrorName) {
            console.warn(`Continuing with the next image: ${error.message}`);
          } else {
            throw new Error(`Error deleting image ${imagePath}: ${error.message}`);
          }
        }
      })
    );
  } catch (error) {
    throw error; 
  }
};

module.exports = { upload,deleteImages };
