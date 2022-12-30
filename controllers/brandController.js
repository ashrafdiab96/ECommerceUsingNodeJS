/**
 * @file brandController.js
 * @desc brand controller
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs image processing package
const sharp = require('sharp');
// express error handler for async functions (catch errors)
const asyncHandler = require('express-async-handler');
// create a strong unique random values
const { v4: uuidv4 } = require('uuid');

// CRUD functions handler
const factory = require('./handlersFactory');
// handle upload images
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
// brand model
const Brand = require('../models/brandModel');

/**
 * @method uploadBrandImage
 * @desc upload brand image
 * @param {*} fieldName
 */
exports.uploadBrandImage = uploadSingleImage('image');

/**
 * @middleware resizeImage
 * @desc resize uploaded image
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void} void
 */
exports.resizeImge = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/brands/${fileName}`);
        
        req.body.image = fileName;
    }
    next();
});

/**
 * @method getBrands
 * @desc get all brands
 * @route GET /api/v1/brands
 * @access public
 * @param {Model} Brand
 * @param {string} ModelName
 * @return {array[objects]} brands
 */
exports.getBrands = factory.getAll(Brand, 'Brand');

/**
 * @method getBrand
 * @desc get specific brand by id
 * @route GET /api/v1/brands/:id
 * @access public
 * @param {Model} Brand
 * @return {object} brand
 */
exports.getBrand = factory.getOne(Brand);

/**
 * @method createBrand
 * @desc create new brand
 * @route POST /api/v1/brands
 * @access private
 * @param {Model} Brand
 * @return {object} brand
 */
exports.createBrand = factory.createOne(Brand);

/**
 * @method updateBrand
 * @desc update specific brand by id
 * @route PUT /api/v1/brands/:id
 * @access private
 * @param {Model} Brand
 * @return {object} brand
 */
exports.updateBrand = factory.updateOne(Brand);

/**
 * @method deleteBrand
 * @desc delete specific brand by id
 * @route DELETE /api/v1/brands/:id
 * @access private
 * @param {Model} Brand
 * @return {void} void
 */
exports.deleteBrand = factory.deleteOne(Brand);
