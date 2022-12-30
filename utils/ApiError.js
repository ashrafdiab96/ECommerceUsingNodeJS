/**
 * @file ApiError.js
 * @class ApiError
 * @desc resbonsible about opertional errors
 * @version 1.0.0
 * @author AshrafDiab
 */
class ApiError extends Error
{
    /**
     * @constructor
     * @desc 1- inherit message form Error class
     *       2- set statusCode
     *       3- set status
     *       4- set isOpertional
     * @param {*} message 
     * @param {*} statusCode
     * @returns {void} void
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
        this.isOpertional = true;
    }
}

module.exports = ApiError;