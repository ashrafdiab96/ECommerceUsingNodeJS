/**
 * @file brandValidator.js
 * @desc brand validations
 * @version 1.0.0
 * @author AshrafDiab
 */

const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage('Brand name is required')
        .isLength({ min: 3 })
        .withMessage('Too short brand name')
        .isLength({ max: 32 })
        .withMessage('Too long brand name'),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];