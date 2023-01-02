/**
 * @file sanitizeData.js
 * @desc return neccessary data in response
 * @version 1.0.0
 * @author AshrafDiab
 */

/**
 * @method sanitizeSignedupUser
 * @desc return neccessary data on signup response
 * @param {object} user
 * @returns {object} user
 */
exports.sanitizeSignedupUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
});
