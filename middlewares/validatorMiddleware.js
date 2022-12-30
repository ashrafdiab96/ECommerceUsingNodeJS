/**
 * @file validatorMiddleware.js
 * @desc middleware to check validation errors
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for validation entered data
const { validationResult } = require('express-validator');

/**
 * @method validatorMiddleware
 * @desc check if validationResult errors is not empty return errors
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns response
 */
const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validatorMiddleware;
