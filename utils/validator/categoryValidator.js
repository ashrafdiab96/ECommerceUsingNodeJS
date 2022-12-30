/**
 * @file categoryValidator.js
 * @desc category validations
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for creating slug
const slugify = require('slugify');
// package for validation
const { check, body } = require('express-validator');

// validation middleware return any validation error
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
// category model
const Category = require('../../models/categoryModel');

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id'),
    validatorMiddleware,
];

exports.createCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3 })
        .withMessage('Too short category name')
        .isLength({ max: 32 })
        .withMessage('Too long category name'),
    body('name')    
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        })
        .custom(async (value) => {
            const category = await Category.findOne({ name: value });
            if (category) {
                return Promise.reject(
                    new Error(`Category with name: ${value} already exists`, 400)
                );
            }
        }),
    validatorMiddleware,
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id'),
    check('name')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Too short category name')
        .isLength({ max: 32 })
        .withMessage('Too long category name'),
    body('name')
        .optional()
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        })
        .custom(async (value, { req }) => {
            const category = await Category.findOne({
                name: value,
                _id: { $ne: req.params.id },
            });
            if (category) {
                return Promise.reject(
                    new Error(`Category with name: ${value} already exists`, 400)
                );
            }
        }),
    validatorMiddleware,
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id'),
    validatorMiddleware,
];
