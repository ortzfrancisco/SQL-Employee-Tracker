const mysql = require('mysql');
//require('dotenv').config();

const db = mysql.createConnection({
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'Elpueblito1',
    database: 'employee_tracker_db'
});

module.exports = db;