/**
 * @file ApiError.js
 * @class ApiError
 * @desc resbonsible about opertional errors
 * @version 1.0.0
 * @author AshrafDiab
 */
class ApiError extends Error
{
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
        this.isOpertional = true;
    }
}

module.exports = ApiError;