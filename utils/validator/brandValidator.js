/**
 * @file brandValidator.js
 * @desc brand validations
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for creating slug
const slugify = require('slugify');
// package for validation
const { check, body } = require('express-validator');

// validation middleware return any validation error
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
// brand model
const Brand = require('../../models/brandModel');

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

    body('name')    
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        })
        .custom(async (value) => {
            const brand = await Brand.findOne({ name: value });
            if (brand) {
                return Promise.reject(
                    new Error(`Brand with name: ${value} already exists`, 400)
                );
            }
        }),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    check('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Too short brand name')
        .isLength({ max: 32 })
        .withMessage('Too long brand name'),

    body('name')
        .optional()    
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        })
        .custom(async (value, { req }) => {
            const brand = await Brand.findOne({
                name: value,
                _id: { $ne: req.params.id },
            });
            if (brand) {
                return Promise.reject(
                    new Error(`Brand with name: ${value} already exists`, 400)
                );
            }
        }),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];