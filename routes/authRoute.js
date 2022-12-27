/**
 * @file brandRoute.js
 * @desc brands routes
 * @version 1.0.0
 * @author AshrafDiab
 */

const express = require('express');

const { signupValidator, loginValidator } = require('../utils/validator/authValidator');

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

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgetPassword', forgetPassword);
router.post('/verifyResetdCode', verifyResetCode);
router.put('/resetPassword', resetPassord);

module.exports = router;