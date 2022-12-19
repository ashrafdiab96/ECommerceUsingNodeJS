const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config({path: 'config.env'});
const dbConnection = require('./config/database');
const categoryRoute = require('./routes/categoryRoute');

// Connect to database
dbConnection();

// Express app
const app = new express();

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
    console.log(`node: ${process.env.NODE_ENV}`);
}

// Routes
app.use('api/v1/categories', categoryRoute);

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
