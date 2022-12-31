/**
 * @file brandController.js
 * @desc brand controller
 * @version 1.0.0
 * @author AshrafDiab
 */

// CRUD functions handler
const factory = require('./handlersFactory');
// brand model
const Coupon = require('../models/couponModel');

/**
 * @method getCoupons
 * @desc get all coupons
 * @route GET /api/v1/coupons
 * @access public
 * @param {Model} Coupon
 * @param {string} ModelName
 * @return {array[objects]} coupons
 */
exports.getCoupons = factory.getAll(Coupon, 'Coupon');

/**
 * @method getCoupon
 * @desc get specific coupon by id
 * @route GET /api/v1/coupons/:id
 * @access public
 * @param {Model} Coupon
 * @return {object} coupon
 */
exports.getCoupon = factory.getOne(Coupon);

/**
 * @method createCoupon
 * @desc create new coupon
 * @route POST /api/v1/coupons
 * @access private
 * @param {Model} Coupon
 * @return {object} coupon
 */
exports.createCoupon = factory.createOne(Coupon);

/**
 * @method updateCoupon
 * @desc update specific coupon by id
 * @route PUT /api/v1/coupons/:id
 * @access private
 * @param {Model} Coupon
 * @return {object} coupon
 */
exports.updateCoupon = factory.updateOne(Coupon);

/**
 * @method deleteCoupon
 * @desc delete specific coupon by id
 * @route DELETE /api/v1/coupons/:id
 * @access private
 * @param {Model} Coupon
 * @return {void} void
 */
exports.deleteCoupon = factory.deleteOne(Coupon);
