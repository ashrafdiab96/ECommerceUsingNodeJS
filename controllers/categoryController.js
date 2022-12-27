/**
 * @file categoryController.js
 * @desc category controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const Category = require('../models/categoryModel');

/**
 * @method uploadCategoryImage
 * @desc upload category image
 * @param {*} fieldName
 */
exports.uploadCategoryImage = uploadSingleImage('image');

/**
 * @middleware resizeImage
 * @desc resize uploaded image
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/categories/${fileName}`);
    
    req.body.image = fileName;
    next();
});

/**
 * @method getCategories
 * @desc get all categories
 * @route GET /api/v1/categories
 * @access public
 * @return array[objects]
 */
exports.getCategories = factory.getAll(Category, 'Category');

/**
 * @method getCategory
 * @desc get specific category by id
 * @route GET /api/v1/categories/:id
 * @access public
 * @return object
 */
exports.getCategory = factory.getOne(Category);

/**
 * @method createCategory
 * @desc create new category
 * @route POST /api/v1/categories
 * @access private
 * @return object
 */
exports.createCategory = factory.createOne(Category);

/**
 * @method updateCategory
 * @desc update specific category by id
 * @route PUT /api/v1/categories/:id
 * @access private
 * @return object
 */
exports.updateCategory = factory.updateOne(Category);

/**
 * @method deleteCategory
 * @desc delete specific category by id
 * @route DELETE /api/v1/categories/:id
 * @access private
 * @return void 
 */
exports.deleteCategory = factory.deleteOne(Category);
