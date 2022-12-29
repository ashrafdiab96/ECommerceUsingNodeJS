/**
 * @file wishlistValidator.js
 * @desc wishlist validations
 * @version 1.0.0
 * @author AshrafDiab
 */

const { check } = require('express-validator');
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
