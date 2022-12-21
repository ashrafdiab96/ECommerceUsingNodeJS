/**
 * @file database.js
 * @desc handel database connection
 * @version 1.0.0
 * @author AshrafDiab
 */

const mongoose = require('mongoose');

/**
 * @method dbConnection
 * connect to database
 * @return void
 */
const dbConnection = () => {
    mongoose.connect(process.env.DB_URL).then((conn) => {
        console.log(`Database connected: ${conn.connection.host}`);
    });
}

module.exports = dbConnection;