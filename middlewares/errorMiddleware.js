/**
 * @file errorMiddleware.js
 * @desc handel errors which happen inside express
 * @version 1.0.0
 * @author AshrafDiab
 */

/**
 * @method sendErrorForDev
 * Send error object in development mode
 * @param {*} error 
 * @param {*} res 
 * @returns response
 */
const sendErrorForDev = (error, res) => res.status(400).json({ 
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
});

/**
 * @method sendErrorForProd
 * Send error object in production mode
 * @param {*} error 
 * @param {*} res 
 * @returns response
 */
const sendErrorForProd = (error, res) => res.status(400).json({ 
    status: error.status,
    message: error.message,
});

/**
 * @method globalError
 * Handel errors which happen inside express
 * @param {*} error 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const globalError = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorForDev(error, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendErrorForProd(error, res);
    }
};

module.exports = globalError;