/**
 * @file categoryController.js
 * @desc category controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const factory = require('./handlersFactory');
const Category = require('../models/categoryModel');

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
