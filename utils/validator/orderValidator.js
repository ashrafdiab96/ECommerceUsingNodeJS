/**
 * @file orderValidator.js
 * @desc order validations
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for validation
const { check } = require('express-validator');

// validation middleware return any validation error
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
// product model
const Product = require('../../models/productModel');

exports.getOrderValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.createOrderValidator = [
    
    check('cartItem.*.product')
        .isMongoId().withMessage('Invalid product id')
        .custom(async (value) => {
            const product = await Product.findById(value);
            if (!product) {
                return Promise.reject(
                    new Error(`Product with id: ${value} is not found`, 404)
                );
            }
        }),
   
    validatorMiddleware,
];

exports.updateOrderValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.deleteOrderValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];
