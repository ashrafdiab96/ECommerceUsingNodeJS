/**
 * @file productValidator.js
 * @desc product validations
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for creating slug
const slugify = require('slugify');
// package for validation
const { check, body }  = require('express-validator');

// validation middleware return any validation error
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
// category model
const Category = require('../../models/categoryModel');
// subcategory model
const SubCategory = require('../../models/subCategoryModel');
// brand model
const Brand = require('../../models/brandModel');

exports.getProductValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.createProductValidator = [
    check('title')
        .notEmpty().withMessage('Product title is required')
        .isLength({ min: 3 }).withMessage('Too short product name')
        .isLength({ max: 100 }).withMessage('Too long product name'),
    
    body('title')  
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),

    check('description')
        .notEmpty().withMessage('Product description is required')
        .isLength({ min: 20 }).withMessage('Too short product description')
        .isLength({ max: 2000 }).withMessage('Too long product description'),

    check('quantity')
        .notEmpty().withMessage('Product quantity is required')
        .isNumeric().withMessage('Quantity must be number'),

    check('sold')
        .optional()
        .isNumeric().withMessage('Sold must be number'),

    check('price')
        .toFloat()
        .notEmpty().withMessage('Product price is required')
        .isNumeric().withMessage('Price must be number')
        .isLength({ max: 32 }).withMessage('Too long product price'),

    check('priceAfterDiscount')
        .optional()
        .isNumeric().withMessage('Price must be number')
        .toFloat()
        .custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error('price after discount must be lower than price');
            }
            return true;
        }),

    check('colors')
        .optional()
        .isArray().withMessage('Product colors should be array of string'),

    check('imageCover')
        .notEmpty().withMessage('Product image cover is required'),

    check('images')
        .optional()
        .isArray().withMessage('Product images should be array of string'),

    check('category')
        .notEmpty().withMessage('Product must belongs to parent category')
        .isMongoId().withMessage('Invalid category id')
        .custom(async (value) => {
            const category = await Category.findById(value);
            if (!category) {
                return Promise.reject(
                    new Error(`Category with id: ${value} is not found`, 404)
                );
            }
        }),

    check('subcategories')
        .optional()
        .isMongoId().withMessage('Invalid subcategory id')
        // check if category is in db or not
        .custom(async (values) => {
            const subcategories = await SubCategory.find({
                _id: { $exists: true, $in: values }
            });
            if (subcategories.length < 1 || subcategories.length != values.length) {
                return Promise.reject(
                    new Error('Subcategories not exist in database')
                );
            }
        })
        // check if subcategory belongs to a parent category or not
        .custom(async (values, { req }) => {
            const subcategories = await SubCategory.find({ category: req.body.category });
            const subcategoriesIdsInDb = [];
            subcategories.forEach((subCategory) => {
                subcategoriesIdsInDb.push(subCategory._id.toString());
            });
            const checker = values.every((value) => subcategoriesIdsInDb.includes(value));
            if (!checker) {
                return Promise.reject(
                    new Error('Subcategories not belong to parent category')
                );
            }
        }),

    check('brand')
        .optional()
        .isMongoId().withMessage('Invalid brand id')
        .custom(async (value) => {
            const brand = await Brand.findById(value);
            if (!brand) {
                return Promise.reject(
                    new Error(`Brand with id: ${value} is not found`, 404)
                );
            }
        }),

    check('ratingsAverage')
        .optional()
        .isNumeric().withMessage('ratings average must be number')
        .isLength({ min: 1 }).withMessage('Rating must be above or equal 1.0')
        .isLength({ max: 5 }).withMessage('Rating must be below or equal 5.0'),

    check('ratingsQuantity')
        .optional()
        .isNumeric().withMessage('ratings quantity must be number'),

    validatorMiddleware,
];

exports.updateProductValidator = [
    check('title')
        .optional()
        .isLength({ min: 3 }).withMessage('Too short product name')
        .isLength({ max: 100 }).withMessage('Too long product name'),
    
    body('title')
        .optional()
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),

    check('description')
        .optional()
        .isLength({ min: 20 }).withMessage('Too short product description')
        .isLength({ max: 2000 }).withMessage('Too long product description'),

    check('quantity')
        .optional()
        .isNumeric().withMessage('Quantity must be number'),

    check('sold')
        .optional()
        .isNumeric().withMessage('Sold must be number'),

    check('price')
        .toFloat()
        .optional()
        .isNumeric().withMessage('Price must be number')
        .isLength({ max: 32 }).withMessage('Too long product price'),

    check('priceAfterDiscount')
        .optional()
        .isNumeric().withMessage('Price must be number')
        .toFloat()
        .custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error('price after discount must be lower than price');
            }
            return true;
        }),

    check('colors')
        .optional()
        .isArray().withMessage('Product colors should be array of string'),

    check('imageCover')
        .optional(),

    check('images')
        .optional()
        .isArray().withMessage('Product images should be array of string'),

    check('category')
        .optional()
        .isMongoId().withMessage('Invalid category id')
        .custom(async (value) => {
            const category = await Category.findById(value);
            if (!category) {
                return Promise.reject(
                    new Error(`Category with id: ${value} is not found`, 404)
                );
            }
        }),

    check('subcategories')
        .optional()
        .isMongoId().withMessage('Invalid subcategory id')
        // check if category is in db or not
        .custom(async (values) => {
            const subcategories = await SubCategory.find({
                _id: { $exists: true, $in: values }
            });
            if (subcategories.length < 1 || subcategories.length != values.length) {
                return Promise.reject(
                    new Error('Subcategories not exist in database')
                );
            }
        })
        // check if subcategory belongs to a parent category or not
        .custom(async (values, { req }) => {
            const subcategories = await SubCategory.find({ category: req.body.category });
            const subcategoriesIdsInDb = [];
            subcategories.forEach((subCategory) => {
                subcategoriesIdsInDb.push(subCategory._id.toString());
            });
            const checker = values.every((value) => subcategoriesIdsInDb.includes(value));
            if (!checker) {
                return Promise.reject(
                    new Error('Subcategories not belong to parent category')
                );
            }
        }),

    check('brand')
        .optional()
        .isMongoId().withMessage('Invalid brand id')
        .custom(async (value) => {
            const brand = await Brand.findById(value);
            if (!brand) {
                return Promise.reject(
                    new Error(`Brand with id: ${value} is not found`, 404)
                );
            }
        }),

    check('ratingsAverage')
        .optional()
        .isNumeric().withMessage('ratings average must be number')
        .isLength({ min: 1 }).withMessage('Rating must be above or equal 1.0')
        .isLength({ max: 5 }).withMessage('Rating must be below or equal 5.0'),

    check('ratingsQuantity')
        .optional()
        .isNumeric().withMessage('ratings quantity must be number'),

    validatorMiddleware,
];

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];