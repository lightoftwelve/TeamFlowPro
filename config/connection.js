const mysql = require('mysql2');
const env = require('dotenv');

env.config();

const dbConfig = {
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name,
};

const dbConnection = mysql.createConnection(dbConfig);

dbConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the application with an error code
    }
    // console.log('Connected to the database');
});

module.exports = dbConnection;