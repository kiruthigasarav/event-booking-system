const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SNNK',
    database: 'event_booking'
});

db.connect((err) => {
    if (err) {
        console.log(' DB connection failed:', err);
    } else {
        console.log('Connected to database');
    }
});

module.exports = db;