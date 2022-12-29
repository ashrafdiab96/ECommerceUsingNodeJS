/**
 * @file reviewValidator.js
 * @desc review validations
 * @version 1.0.0
 * @author AshrafDiab
 */

const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

const Review = require('../../models/reviewsModel');

exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.createReviewValidator = [
    check('title').optional(),
    check('rating')
        .notEmpty().withMessage('Rating is required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Rating value must be between 1 and 5'),
    // check('user').isMongoId().withMessage('Invalid id'),
    check('product')
        .isMongoId().withMessage('Invalid id')
        .custom(async (value, { req }) => {
            const review = await Review.findOne({
                user: req.user._id.toString(),
                product: req.body.product,
            });
            if (review) {
                return Promise.reject(
                    new Error('You have reviewed this product before')
                );
            }
        }),
    validatorMiddleware,
];

exports.updateReviewValidator = [
    check('id')
        .isMongoId().withMessage('Invalid id')
        .custom(async (value, { req }) => {
            const review = await Review.findById(value);
            if (!review) {
                return Promise.reject(
                    new Error(`There is no review with id: ${value}`)
                );
            }
            if (review.user._id.toString() != req.user._id.toString()) {
                return Promise.reject(
                    new Error('You are not allowed to perform this action')
                );
            }
        }),
    validatorMiddleware,
];

exports.deleteReviewValidator = [
    check('id')
        .isMongoId().withMessage('Invalid id')
        .custom(async (value, { req }) => {
            if (req.user.role == 'user') {
                const review = await Review.findById(value);
                if (!review) {
                    return Promise.reject(
                        new Error(`There is no review with id: ${value}`)
                    );
                }
                if (review.user._id.toString() != req.user._id.toString()) {
                    return Promise.reject(
                        new Error('You are not allowed to perform this action')
                    );
                }
            }
        }),
    validatorMiddleware,
];