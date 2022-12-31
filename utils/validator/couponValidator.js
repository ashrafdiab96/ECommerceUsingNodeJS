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
const Coupon = require('../../models/couponModel');

exports.getCouponValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.createCouponValidator = [
    check('name')
        .notEmpty()
        .withMessage('Coupon name is required'),

    body('name')
        .custom(async (value) => {
            const coupon = await Coupon.findOne({ name: value });
            if (coupon) {
                return Promise.reject(
                    new Error(`Coupon with name: ${value} already exists`, 400)
                );
            }
        }),

    check('expire')
        .notEmpty().withMessage('Coupon expire date is required'),
        // .isDate().withMessage('Invalid coupon expire date'),

    check('discount')
        .notEmpty().withMessage('Coupon discount value is required')
        .isNumeric().withMessage('Coupon discount value must be number'),

    validatorMiddleware,
];

exports.updateCouponValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    check('name')
        .optional(),

    body('name')
        .optional()
        .custom(async (value, { req }) => {
            const coupon = await Coupon.findOne({
                name: value,
                _id: { $ne: req.params.id },
            });
            if (coupon) {
                return Promise.reject(
                    new Error(`Coupon with name: ${value} already exists`, 400)
                );
            }
        }),

    check('expire')
        .optional()
        .isDate().withMessage('Invalid coupon expire date'),

    check('discount')
        .optional()
        .isNumeric().withMessage('Coupon discount value must be number'),

    validatorMiddleware,
];

exports.deleteCouponValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];
