/**
 * @file subCategoryValidator.js
 * @desc sub category validations
 * @version 1.0.0
 * @author AshrafDiab
 */

const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

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
    body('name')
        .optional()
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];