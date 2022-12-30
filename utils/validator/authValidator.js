/**
 * @file authValidator.js
 * @desc auth validations
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for creating slug
const slugify = require('slugify');
// package for validation
const { check, body } = require('express-validator');

// validation middleware return any validation error
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
// user model
const User = require('../../models/userModel');

exports.signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Too short user name')
        .isLength({ max: 32 })
        .withMessage('Too long user name'),

    body('name')    
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),

    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                return Promise.reject(
                    new Error(`This email: ${value} is already exists`)
                );
            }
        }),

    check('password')
        .notEmpty().withMessage('Password is requierd')
        .isLength({ min: 6 }).withMessage('Too short password')
        .custom((password, { req }) => {
            if (password != req.body.passConfirm) {
                throw new Error('Password cnfirmation is incorrect');
            }
            return true;
        }),

    check('passConfirm')
        .notEmpty().withMessage('Password confirmation is requierd'),

    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number'),
        
    check('profileImg').optional(),
    check('role')
        .optional()
        .custom((value) => {
            const roles = ['admin', 'manager', 'user'];
            const checker = roles.includes(value);
            if (!checker) {
                return Promise.reject(
                    new Error('Invalid role', 400)
                );
            }
            return true;
        }),
    check('actice').optional(),
    validatorMiddleware,
];

exports.loginValidator = [
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email'),

    check('password')
        .notEmpty().withMessage('Password is requierd')
        .isLength({ min: 6 }).withMessage('Too short password'),    

    validatorMiddleware,    
];
