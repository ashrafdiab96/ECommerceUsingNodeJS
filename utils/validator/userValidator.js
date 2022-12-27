/**
 * @file brandValidator.js
 * @desc brand validations
 * @version 1.0.0
 * @author AshrafDiab
 */

const slugify = require('slugify');
const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/userModel');

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.createUserValidator = [
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

    body('passwordChangedAt')
        .optional(),

    check('passConfirm')
        .notEmpty().withMessage('Password confirmation is requierd'),

    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number'),
        
    check('profileImg').optional(),
    check('role').optional(),
    check('active').optional(),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    body('name')
        .optional()    
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
    check('active').optional(),

    validatorMiddleware,
];

exports.changePasswordValidator = [
    check('id').isMongoId().withMessage('Invalid id'),

    body('currentPassword')
        .notEmpty().withMessage('Current password is requierd'),

    body('passConfirm')
        .notEmpty().withMessage('Password confirmation is requierd'),

    body('passwordChangedAt')
        .optional(),

    body('password')
        .notEmpty().withMessage('Password is requierd')
        .isLength({ min: 6 }).withMessage('Too short password')
        .custom(async (value, { req }) => {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error(`User with id: ${req.params.id} is not found`);
            }
            const isCurrentPass = await bcrypt.compare(
                req.body.currentPassword, user.password
            );
            if (!isCurrentPass) {
                throw new Error('Incorrect current password');
            }
            if (value != req.body.passConfirm) {
                throw new Error('Password confirmation is incorrect');
            }
            return true;
        }),
    validatorMiddleware,
];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid id'),
    validatorMiddleware,
];

exports.updateLoggedUserValidator = [
    body('name')
        .optional()    
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),
    
    check('email')
        .optional()
        .isEmail().withMessage('Invalid email')
        .custom((value) => User.findOne({ email: value }).then((user) => {
            if (user) {
                return Promise.reject(new Error('This email is already exists'));
            }
        })),

    check('phone')
        .optional()
        .isMobilePhone(['ar-EG', 'ar-SA']).withMessage('Invalid phone number'),

    validatorMiddleware,
];
