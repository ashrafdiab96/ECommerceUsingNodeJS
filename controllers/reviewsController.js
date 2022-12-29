/**
 * @file reviewsController.js
 * @desc reviews controller
 * @version 1.0.0
 * @author AshrafDiab
 */

const factory = require('./handlersFactory');
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
 * @return void
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
 * @return array[objects]
 */
exports.getReviews = factory.getAll(Review, 'Review');

/**
 * @method getReview
 * @desc get specific review by id
 * @route GET /api/v1/reviews/:id
 * @access public
 * @return object
 */
exports.getReview = factory.getOne(Review);

/**
 * @method createReview
 * @desc create new review
 * @route POST /api/v1/reviews
 * @access private
 * @return object
 */
exports.createReview = factory.createOne(Review);

/**
 * @method updateReview
 * @desc update specific review by id
 * @route PUT /api/v1/reviews/:id
 * @access private
 * @return object
 */
exports.updateReview = factory.updateOne(Review);

/**
 * @method deleteReview
 * @desc delete specific review by id
 * @route DELETE /api/v1/reviews/:id
 * @access private
 * @return void
 */
exports.deleteReview = factory.deleteOne(Review);
