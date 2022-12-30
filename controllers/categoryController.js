/**
 * @file categoryController.js
 * @desc category controller
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
// category model
const Category = require('../models/categoryModel');

/**
 * @method uploadCategoryImage
 * @desc upload category image
 * @param {string} fieldName
 */
exports.uploadCategoryImage = uploadSingleImage('image');

/**
 * @middleware resizeImage
 * @desc resize uploaded image
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void} void
 */
exports.resizeImage = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/categories/${fileName}`);
        
        req.body.image = fileName;
    }
    next();
});

/**
 * @method getCategories
 * @desc get all categories
 * @route GET /api/v1/categories
 * @access public
 * @param {Model} Category
 * @param {string} ModelName
 * @return {Array[object]} categories
 */
exports.getCategories = factory.getAll(Category, 'Category');

/**
 * @method getCategory
 * @desc get specific category by id
 * @route GET /api/v1/categories/:id
 * @access public
 * @param {Model} Category
 * @return {object} category
 */
exports.getCategory = factory.getOne(Category);

/**
 * @method createCategory
 * @desc create new category
 * @route POST /api/v1/categories
 * @access private
 * @param {Model} Category
 * @return {object} category
 */
exports.createCategory = factory.createOne(Category);

/**
 * @method updateCategory
 * @desc update specific category by id
 * @route PUT /api/v1/categories/:id
 * @access private
 * @param {Model} Category
 * @return {object} category
 */
exports.updateCategory = factory.updateOne(Category);

/**
 * @method deleteCategory
 * @desc delete specific category by id
 * @route DELETE /api/v1/categories/:id
 * @access private
 * @param {Model} Category
 * @return {void} void 
 */
exports.deleteCategory = factory.deleteOne(Category);
