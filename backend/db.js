const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

// test connection
db.getConnection((err, connection) => {
    if (err) {
        console.log("DB connection failed:", err);
    } else {
        console.log("Connected to Railway MySQL");
        connection.release();
    }
});

module.exports = db;