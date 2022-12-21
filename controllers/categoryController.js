/**
 * @file categoryController.js
 * @desc category controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const Category = require('../models/categoryModel');

/**
 * @method getCategories
 * @desc get all categories
 * @route GET /api/v1/categories
 * @access public
 * @param {*} req 
 * @param {*} res
 * @return array[objects] 
 */
exports.getCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const categories = await Category.find({}).skip(skip).limit(limit);
    res.status(200).json({ result: categories.length, page, data: categories });
});

/**
 * @method getCategory
 * @desc get specific category by id
 * @route GET /api/v1/categories/:id
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return object 
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
        return next(new ApiError(`Category with id: ${id} is not found`, 404));
    }
    res.status(200).json({ data: category });
});

/**
 * @method createCategory
 * @desc create new category
 * @route POST /api/v1/categories
 * @access private
 * @param {*} req 
 * @param {*} res
 * @return object 
 */
exports.createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.create({ name, slug: slugify(name) });
    res.status(200).json({ data: category });
});

/**
 * @method updateCategory
 * @desc update specific category by id
 * @route PUT /api/v1/categories/:id
 * @access private
 * @param {*} req 
 * @param {*} res
 * @param {*} next
 * @return object 
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findOneAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true }
    );
    if (!category) {
        return next(new ApiError(`Category with id: ${id} is not found`, 404));
    }
    res.status(200).json({ data: category });
});

/**
 * @method deleteCategory
 * @desc delete specific category by id
 * @route DELETE /api/v1/categories/:id
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return void 
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findOneAndDelete({ _id: id });
    if (!category) {
        return next(new ApiError(`Category with id: ${id} is not found`, 404));
    }
    res.status(204).json();
});
