/**
 * @file subCategoryController.js
 * @desc sub category controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const factory = require('./handlersFactory');
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
 * @middleware setCategoryIdToParams
 * @desc middleware check if category is not set get it from params
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
 * @method getSubCategories
 * @desc get all sub categories
 * @route GET /api/v1/subcategories
 * @access public
 * @return array[objects]
 */
exports.getSubCategories = factory.getAll(SubCategory, 'SubCategory');

/**
 * @method getSubCategory
 * @desc get specific sub category by id
 * @route GET /api/v1/subcategories/:id
 * @access public
 * @return object
 */
exports.getSubCategory = factory.getOne(SubCategory);

/**
 * @method createSubCategory
 * @desc create new sub category
 * @route POST /api/v1/subcategories
 * @access private
 * @return object
 */
exports.createSubCategory = factory.createOne(SubCategory);

/**
 * @method updateSubCategory
 * @desc update specific sub category by id
 * @route PUT /api/v1/subcategories/:id
 * @access private
 * @param {*} req 
 * @param {*} res
 * @return object 
 */
exports.updateSubCategory = factory.updateOne(SubCategory);

/**
 * @method deleteSubCategory
 * @desc delete specific sub category by id
 * @route DELETE /api/v1/subcategories/:id
 * @access private
 * @return void 
 */
exports.deleteSubCategory = factory.deleteOne(SubCategory);