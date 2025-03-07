const { upload } = require('../helpers/media_helper');

const uploadImage = (fieldsConfig) => upload.fields(fieldsConfig);

module.exports = { uploadImage };