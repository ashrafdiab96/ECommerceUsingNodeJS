/**
 * @file brandRoute.js
 * @desc brands routes
 * @version 1.0.0
 * @author AshrafDiab
 */

// nodejs web framework
const express = require('express');

// validation functions
const {
    signupValidator,
    loginValidator
} = require('../utils/validator/authValidator');

// CRUD methods and middlewares
const {
    signup,
    login,
    forgetPassword,
    verifyResetCode,
    resetPassord,
    // uploadUserImage,
    // resizeImge,
} = require('../controllers/authController');

const router = express.Router();

router.post(
    '/signup',
    // signupValidator,
    // uploadUserImage,
    // resizeImge,
    signup
);
router.post('/login', loginValidator, login);
router.post('/forgetPassword', forgetPassword);
router.post('/verifyResetdCode', verifyResetCode);
router.put('/resetPassword', resetPassord);

module.exports = router;