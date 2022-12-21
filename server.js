/**
 * @file server.js
 * @desc root file
 * @version 1.0.0
 * @author AshrafDiab
 */

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({path: 'config.env'});
const ApiError = require('./utils/ApiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');
const subCategoryRoute = require('./routes/subCategoryRoute');
const brands = require('./routes/brandRoute');

/**************************************************************/

// Connect to database
dbConnection();

/**************************************************************/

// Express app
const app = new express();

/**************************************************************/

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`node: ${process.env.NODE_ENV}`);
}

/**************************************************************/

// Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);
app.use('/api/v1/brands', brands);

// Handel not exist routes error and send it to error middleware
app.all('*', (req, res, next) => {
    next(new ApiError(`URL not found: ${req.originalUrl}`, 400));
});

// Global error handeling middleware for express
app.use(globalError);

/**************************************************************/

// Server
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
