/**
 * @file wishlistValidator.js
 * @desc wishlist validations
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for validation
const { check } = require('express-validator');

// validation middleware return any validation error
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// const Review = require('../../models/reviewsModel');

exports.addProductToWishlistValidator = [
    check('productId').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.removeProductFromWishlistValidator = [
    check('productId').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];
