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

const deleteImages = async function (
  imageUrls,
  continueOnErrorName = 'ENOENT'
) {
  if (!Array.isArray(imageUrls)) {
    throw new Error('imageUrls must be an array of strings');
  }

  console.log('🔍 Checking images to delete:', imageUrls);

  try {
    await Promise.all(
      imageUrls.map(async (imageUrl) => {
        if (typeof imageUrl !== 'string') {
          console.error('❌ Skipping invalid image URL:', imageUrl);
          return; // לא מנסה למחוק משהו שאינו מחרוזת
        }

        const filename = path.basename(imageUrl); // שולף רק את שם הקובץ
        const imagePath = path.resolve(
          __dirname,
          '..',
          'public',
          'uploads',
          filename
        );

        console.log(`🗑️ Trying to delete: ${imagePath}`);

        try {
          await fs.unlink(imagePath);
          console.log(`✅ Deleted: ${filename}`);
        } catch (error) {
          if (error.code === continueOnErrorName) {
            console.warn(`⚠️ File not found, skipping: ${filename}`);
          } else {
            throw new Error(
              `🚨 Error deleting image ${filename}: ${error.message}`
            );
          }
        }
      })
    );
  } catch (error) {
    console.error('❌ Failed to delete images:', error);
    throw error;
  }
};

module.exports = { upload, deleteImages };
