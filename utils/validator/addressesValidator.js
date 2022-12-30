/**
 * @file reviewValidator.js
 * @desc review validations
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for validation
const { check } = require('express-validator');

// validation middleware return any validation error
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.addAddressToUserValidator = [
    check('alias')
        .notEmpty().withMessage('Address alias is required'),
    check('details')
        .notEmpty().withMessage('Address details are required'),
    check('phone')
        .notEmpty().withMessage('Phone is required'),
    validatorMiddleware,
];

// exports.updateReviewValidator = [
//     check('alias').optional(),
//     check('details')
//         .notEmpty().withMessage('Address details are required'),
//     check('phone')
//         .notEmpty().withMessage('Phone is required'),
//     validatorMiddleware,
// ];

exports.deleteUserAddressValidator = [
    check('addressId')
        .isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];
