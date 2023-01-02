/**
 * @file server.js
 * @desc root file
 * @version 1.0.0
 * @author AshrafDiab
 */

/**************************************************************
*                           IMPORTS                           *
**************************************************************/
// built in node js package for handling working with directories and files
const path = require('path');

// node js framework
const express = require('express');
// load environment variables from .env to process.env
const dotenv = require('dotenv');
// http request logger middleware
const morgan = require('morgan');
// enable CORS
const cors = require('cors');
// compress response bodies for all request that traverse through the middleware
const compression = require('compression');
// limit repeated requests to public APIs and/or endpoints such as password reset
const rateLinit = require('express-rate-limit');
// protect against HTTP Parameter Pollution attacks
const hpp = require('hpp');
// sanitizes user-supplied data to prevent MongoDB Operator Injection
const mongoSanitize = require('express-mongo-sanitize');
// sanitizes user-supplied data to prevent HTML tags
const xss = require('xss-clean');

dotenv.config({path: 'config.env'});

// handle errors
const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/errorMiddleware');
// handle databas connection
const dbConnection = require('./config/database');
// file includes all routes
const mountRoutes = require('./routes');
// get webhockCheckout
const { webhockCheckout } = require('./controllers/orderController');

/**************************************************************
*                     DATABASE CONNECTION                     *
**************************************************************/
dbConnection();

/**************************************************************
*                        EXPRESS APP                          *
**************************************************************/
// express app
const app = new express();

// ebable other apps to access our app
app.use(cors());
app.options('*', cors());

// compress all responses
app.use(compression());

// checkout webhock
app.post('/webhock-checkout', express.raw({ type: 'application/json' }), webhockCheckout);

/**************************************************************
*                        MIDDELWARES                          *
**************************************************************/
// convert data to json and limit reuqests
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`node: ${process.env.NODE_ENV}`);
}

/**************************************************************
*                   APPLY DATA SANITIZATION                   *
**************************************************************/
app.use(mongoSanitize());
app.use(xss());

/**************************************************************
*                   LIMIT REPEATED RQUESTS                    *
**************************************************************/
const limiter = rateLinit({
    windowMs: 15 * 60 * 1000,   // 15 MIN
    max: 100,
    message: 'Too many requests, please try again after 15 minutes',
});
app.use('/api', limiter);

/**************************************************************
*               AGAINST HTTP PARAMETER POLLUTION              *
**************************************************************/
app.use(hpp({
    whitelist: [
        'price',
        'sold',
        'quantity',
        'ratingsAverage',
        'ratingsQuantity',
    ]
}));

/**************************************************************
*                           ROUTES                            *
**************************************************************/
mountRoutes(app);

// Handel not exist routes error and send it to error middleware
app.all('*', (req, res, next) => {
    next(new ApiError(`URL not found: ${req.originalUrl}`, 400));
});

// Global error handeling middleware for express
app.use(globalError);

/**************************************************************
*                           SERVER                            *
**************************************************************/
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

// Global error handeling outside express
process.on('unhandledRejection', (error) => {
    console.error(`unhandled rejection error: ${error.name} | ${error.message}`);
    server.close(() => {
        console.log('Shutting down...');
        process.exit(1);
    });
});
