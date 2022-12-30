/**
 * @file generateToken.js
 * @desc handle generate token
 * @version 1.0.0
 * @author AshrafDiab
 */

// jsomWebToken package for generate and handle tokens
const jwt = require('jsonwebtoken');

/**
 * @method generateToken
 * @desc generate a new token which consists of userId, sekretKey and tokenExpireTime
 * @param {string} payload -> userId 
 * @returns {string} token
 */
const generateToken = (payload) => jwt.sign(
    { userId: payload },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
);

module.exports = generateToken;