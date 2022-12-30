/**
 * @file subCategoryController.js
 * @desc sub category controller
 * @version 1.0.0
 * @author AshrafDiab
 */

// CRUD functions handler
const factory = require('./handlersFactory');
// subcategory model
const SubCategory = require('../models/subCategoryModel');

/**
 * @middleware createFilterObj
 * @desc check if is set categoryId/subcategories on request create filter
 * @route GET /api/v1/categories/:categoryId/subcategories
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {void} void
 */
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};

/**
 * @middleware setCategoryIdToParams
 * @desc middleware check if category is not set in body, get it from params
 * @route POST /api/v1/categories/:categoryId/subcategories
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.setCategoryIdToParams = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

/**
 * @method getSubCategories
 * @desc get all sub categories
 * @route GET /api/v1/subcategories
 * @access public
 * @param {Model} SubCategory
 * @param {string} ModelName
 * @return {array[objects]} subcategories
 */
exports.getSubCategories = factory.getAll(SubCategory, 'SubCategory');

/**
 * @method getSubCategory
 * @desc get specific sub category by id
 * @route GET /api/v1/subcategories/:id
 * @access public
 * @param {Model} SubCategory
 * @return {object} subcategory
 */
exports.getSubCategory = factory.getOne(SubCategory);

/**
 * @method createSubCategory
 * @desc create new sub category
 * @route POST /api/v1/subcategories
 * @access private
 * @param {Model} SubCategory
 * @return {object} subcategory
 */
exports.createSubCategory = factory.createOne(SubCategory);

/**
 * @method updateSubCategory
 * @desc update specific sub category by id
 * @route PUT /api/v1/subcategories/:id
 * @access private
 * @param {Model} SubCategory
 * @return {object} subcategory 
 */
exports.updateSubCategory = factory.updateOne(SubCategory);

/**
 * @method deleteSubCategory
 * @desc delete specific sub category by id
 * @route DELETE /api/v1/subcategories/:id
 * @access private
 * @param {Model} SubCategory
 * @return {void} void 
 */
exports.deleteSubCategory = factory.deleteOne(SubCategory);
