/**
 * @file reviewsController.js
 * @desc reviews controller
 * @version 1.0.0
 * @author AshrafDiab
 */

// CRUD functions handler
const factory = require('./handlersFactory');
// review model
const Review = require('../models/reviewsModel');

/**
 * @middleware createFilterObj
 * @desc check if is set productId on request params create filter -
 * - to get reviews for specific project
 * @route GET /api/v1/products/:productId/reviews
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @returns {void} void
 */
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
};

/**
 * @middleware setProductIdToParams
 * @desc middleware check if product is not set get it from params
 * @route POST /api/v1/products/:categoryId/reviews
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {void} void
 */
exports.setProductIdToParams = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    next();
};

/**
 * @method getReviews
 * @desc get all reviews
 * @route GET /api/v1/reviews
 * @access public
 * @param {Model} Review
 * @param {string} ModelName
 * @return {array[objects]} reviews
 */
exports.getReviews = factory.getAll(Review, 'Review');

/**
 * @method getReview
 * @desc get specific review by id
 * @route GET /api/v1/reviews/:id
 * @access public
 * @param {Model} Review
 * @return {object} review
 */
exports.getReview = factory.getOne(Review);

/**
 * @method createReview
 * @desc create new review
 * @route POST /api/v1/reviews
 * @access private
 * @param {Model} Review
 * @return {object} review
 */
exports.createReview = factory.createOne(Review);

/**
 * @method updateReview
 * @desc update specific review by id
 * @route PUT /api/v1/reviews/:id
 * @access private
 * @param {Model} Review
 * @return {object} review
 */
exports.updateReview = factory.updateOne(Review);

/**
 * @method deleteReview
 * @desc delete specific review by id
 * @route DELETE /api/v1/reviews/:id
 * @access private
 * @param {Model} Review
 * @return {void} review
 */
exports.deleteReview = factory.deleteOne(Review);
