const mysql = require("mysql2")

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: false,
    connectionLimit: 10,
    queueLimit: 30,
    typeCast: function (field, next) {
        if (field.type === "DECIMAL" || field.type === "NEWDECIMAL") {
            var value = field.string();
            return (value === null) ? null : Number(value);
        }
        return next();
    }
})

const promisePool = pool.promise()

module.exports = promisePool