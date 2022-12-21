/**
 * @file subCategoryController.js
 * @desc sub category controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const SubCategory = require('../models/subCategoryModel');

/**
 * @middleware createFilterObj
 * @desc check if is set categoryId on request params create filter
 * @route GET /api/v1/categories/:categoryId/subcategories
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return void
 */
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};

/**
 * @method getSubCategories
 * @desc get all sub categories
 * @route GET /api/v1/subcategories
 * @access public
 * @param {*} req 
 * @param {*} res
 * @return array[objects]
 */
exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const subCategories = await SubCategory.find(req.filterObj)
    .skip(skip).limit(limit).populate({
        path: 'category', select: 'name'
    });
    res.status(200).json({
        result: subCategories.length,
        page,
        data: subCategories
    });
});

/**
 * @method getSubCategory
 * @desc get specific sub category by id
 * @route GET /api/v1/subcategories/:id
 * @access public
 * @param {*} req 
 * @param {*} res
 * @return object 
 */
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id).populate({
        path: 'category', select: 'name -_id'
    });
    if (!subCategory) {
        return next(new ApiError(`Sub category with id ${id} is not found`, 404));
    }
    res.status(200).json({ data: subCategory });
});

/**
 * @middleware setCategoryIdToParams
 * @desc middleware check if category is not set add it to params
 * @route POST /api/v1/categories/:categoryId/subcategories
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return void
 */
exports.setCategoryIdToParams = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

/**
 * @method createSubCategory
 * @desc create new sub category
 * @route POST /api/v1/subcategories
 * @access private
 * @param {*} req 
 * @param {*} res
 * @return object 
 */
exports.createSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    const subCategory = await SubCategory.create({ name, category, slug: slugify(name) });
    res.status(200).json({ data: subCategory });
});

/**
 * @method updateSubCategory
 * @desc update specific sub category by id
 * @route PUT /api/v1/subcategories/:id
 * @access private
 * @param {*} req 
 * @param {*} res
 * @return object 
 */
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;
    const subCategory = await SubCategory.findByIdAndUpdate(
        { _id: id },
        { name, slug: slugify(name), category },
        { new: true },
    );
    if (!subCategory) {
        return next(new ApiError(`Sub category with id ${id} is not found`, 404));
    }
    res.status(200).json({ data: subCategory });
});

/**
 * @method deleteSubCategory
 * @desc delete specific sub category by id
 * @route DELETE /api/v1/subcategories/:id
 * @access private
 * @param {*} req 
 * @param {*} res
 * @return void 
 */
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findOneAndDelete({ _id: id });
    if (!subCategory) {
        return next(new ApiError(`Sub category with id ${id} is not found`, 404));
    }
    res.status(204).json();
});