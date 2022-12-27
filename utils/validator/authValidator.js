/**
 * @file authValidator.js
 * @desc auth validations
 * @version 1.0.0
 * @author AshrafDiab
 */

const slugify = require('slugify');
const { check, body } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Too short brand name')
        .isLength({ max: 32 })
        .withMessage('Too long brand name'),

    body('name')    
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),

    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email')
        .custom((value) => User.findOne({ email: value }).then((user) => {
            if (user) {
                return Promise.reject(new Error('This email is already exists'));
            }
        })),

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
    check('role').optional(),
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
