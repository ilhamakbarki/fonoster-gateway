const response = require('./response');
const multer = require('multer');
const config = require('@config');

exports.ErrorNotFound = 'data not found';
exports.ErrorHandler = (err, req, res, next) => {
    const showError = config.server.env === 'development' ? err : null;

    if (err instanceof multer.MulterError) {
        return res.status(422).json(response(err.message, null, false, '422', showError));
    }

    if (err.type === 'entity.too.large') {
        return res.status(422).json(response(`Maximum file size is ${config.upload.max_upload}MB`, null, false, '422', showError));
    }

    if (err.code === 'UNSUPPORTED_FILE_TYPE') {
        return res.status(422).json(response(`Only ${config.upload.allowed_files.join(', ')} files are supported`, null, false, '422', showError));
    }
    res.status(500).json(response(err.message, null, false, '500001', showError));
};