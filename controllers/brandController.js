/**
 * @file brandController.js
 * @desc brand controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const Brand = require('../models/brandModel');

/**
 * @method getBrands
 * @desc get all brans
 * @route GET /api/v1/brands
 * @access public
 * @param {*} req 
 * @param {*} res
 * @return array[objects] 
 */
exports.getBrands = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const brands = await Brand.find({}).skip(skip).limit(limit);
    res.status(200).json({ result: brands.length, page, data: brands });
});

/**
 * @method getBrand
 * @desc get specific brand by id
 * @route GET /api/v1/brands/:id
 * @access public
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return object 
 */
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
        return next(new ApiError(`Brand with id: ${id} is not found`, 404));
    }
    res.status(200).json({ data: brand });
});

/**
 * @method createBrand
 * @desc create new brand
 * @route POST /api/v1/brands
 * @access private
 * @param {*} req 
 * @param {*} res
 * @return object 
 */
exports.createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const brand = await Brand.create({ name, slug: slugify(name) });
    res.status(200).json({ data: brand });
});

/**
 * @method updateBrand
 * @desc update specific brand by id
 * @route PUT /api/v1/brands/:id
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return object 
 */
exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const brand = await Brand.findOneAndUpdate(
        { _id: id },
        { name, slug: slugify(name) },
        { new: true }
    );
    if (!brand) {
        return next(new ApiError(`Brand with id: ${id} is not found`, 404));
    }
    res.status(200).json({ data: brand });
});

/**
 * @method deleteBrand
 * @desc delete specific brand by id
 * @route DELETE /api/v1/brands/:id
 * @access private
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return void 
 */
exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findOneAndDelete({ _id: id });
    if (!brand) {
        return next(new ApiError(`Brand with id: ${id} is not found`, 404));
    }
    res.status(204).json();
});
