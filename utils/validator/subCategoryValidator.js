/**
 * @file subCategoryValidator.js
 * @desc sub category validations
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for creating slug
const slugify = require('slugify');
// package for validation
const { check, body } = require('express-validator');

// validation middleware return any validation error
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
// subcategory model
const SubCategory = require('../../models/subCategoryModel');

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('Sub category name is required')
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
            const subcategory = await SubCategory.findOne({ name: value });
            if (subcategory) {
                return Promise.reject(
                    new Error(`Subcategory with name: ${value} already exists`, 400)
                );
            }
        }),
    check('category')
        .notEmpty()
        .withMessage('Sub category must be belongs to parent category')
        .isMongoId()
        .withMessage('Invalid category id'),
    validatorMiddleware,
];

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
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
            const subcategory = await SubCategory.findOne({
                name: value,
                _id: { $ne: req.params.id },
            });
            if (subcategory) {
                return Promise.reject(
                    new Error(`Subcategory with name: ${value} already exists`, 400)
                );
            }
        }),
    validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];