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

dotenv.config({path: 'config.env'});

// handle errors
const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/errorMiddleware');
// handle databas connection
const dbConnection = require('./config/database');
// file includes all routes
const mountRoutes = require('./routes');

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

/**************************************************************
*                        MIDDELWARES                          *
**************************************************************/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`node: ${process.env.NODE_ENV}`);
}

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
    console.error(`unhandledRejection error: ${error.name} | ${error.message}`);
    server.close(() => {
        console.log('Shutting down...');
        process.exit(1);
    });
});
