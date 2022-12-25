/**
 * @file brandController.js
 * @desc brand controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Brand = require('../models/brandModel');

/* upload category image */
exports.uploadBrandImage = uploadSingleImage('image');

/**
 * @middleware resizeImage
 * @desc resize uploaded image
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.resizeImge = asyncHandler(async (req, res, next) => {
    const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/brands/${fileName}`);
    
    req.body.image = fileName;
    next();
});

/**
 * @method getBrands
 * @desc get all brans
 * @route GET /api/v1/brands
 * @access public
 * @return array[objects]
 */
exports.getBrands = factory.getAll(Brand, 'Brand');

/**
 * @method getBrand
 * @desc get specific brand by id
 * @route GET /api/v1/brands/:id
 * @access public
 * @return object
 */
exports.getBrand = factory.getOne(Brand);

/**
 * @method createBrand
 * @desc create new brand
 * @route POST /api/v1/brands
 * @access private
 * @return object
 */
exports.createBrand = factory.createOne(Brand);

/**
 * @method updateBrand
 * @desc update specific brand by id
 * @route PUT /api/v1/brands/:id
 * @access private
 * @return object
 */
exports.updateBrand = factory.updateOne(Brand);

/**
 * @method deleteBrand
 * @desc delete specific brand by id
 * @route DELETE /api/v1/brands/:id
 * @access private
 * @return void
 */
exports.deleteBrand = factory.deleteOne(Brand);
