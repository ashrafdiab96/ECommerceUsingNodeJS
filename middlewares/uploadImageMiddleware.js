/**
 * @file uploadImageMiddleware.js
 * @desc handel images upload
 * @version 1.0.0
 * @author AshrafDiab
 */

const multer = require('multer');
const ApiError = require('../utils/ApiError');

/**
 * @method multerOptions
 * handle multer options
 * @returns 
 */
const multerOptions = () => {
    const multerStorage = multer.memoryStorage();
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new ApiError('Only images are allowed', 400), false);
        }
    }
    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
    return upload;
}

/**
 * @method uploadSingleImage
 * @desc upload single image
 * @param {*} filedName 
 * @returns void
 */
exports.uploadSingleImage = (filedName) => multerOptions().single(filedName);

/**
 * @method uploadMixOfImages
 * @desc upload mix of images
 * @param {*} arrayOfFields 
 * @returns void
 */
exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields);
