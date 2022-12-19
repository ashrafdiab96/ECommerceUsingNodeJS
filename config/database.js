const mongoose = require('mongoose');

/**
 * @method dbConnection
 * connect to database
 * @return void
 */
const dbConnection = () => {
    mongoose.connect(process.env.DB_URL).then((conn) => {
        console.log(`Database connected: ${conn.connection.host}`);
    }).catch((error) => {
        console.error(`Faild to connect with database: ${error}`);
        process.exit(1);
    });
}

module.exports = dbConnection;