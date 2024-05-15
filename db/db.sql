DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'yourUsername', // Replace with your MySQL username
    password: 'yourPassword', // Replace with your MySQL password
    database: 'employee_tracker_db' // Ensure this matches the exact name of your database
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to database as ID ' + db.threadId);
});

module.exports = db;

