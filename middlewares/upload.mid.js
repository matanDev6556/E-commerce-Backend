const { upload } = require('../helpers/media_helper');

const uploadImage = upload.fields([{ name: 'image', maxCount: 1 }]);

module.exports = { uploadImage };