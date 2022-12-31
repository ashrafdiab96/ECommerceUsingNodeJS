/**
 * @file couponValidator.js
 * @desc coupon validations
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for validation
const { check, body } = require('express-validator');

// validation middleware return any validation error
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
// coupon model
const Cart = require('../../models/cartModel');

exports.getCartValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.createCartValidator = [

    validatorMiddleware,
];

exports.updateCartValidator = [
    
    validatorMiddleware,
];

exports.deleteCartValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];
