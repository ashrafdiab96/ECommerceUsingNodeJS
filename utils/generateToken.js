const jwt = require('jsonwebtoken');

/**
 * @method generateToken
 * @desc generate a new token
 * @param {*} payload 
 * @returns token
 */
const generateToken = (payload) => jwt.sign(
    { userId: payload },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
);

module.exports = generateToken;