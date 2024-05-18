/** Database config for database. */


const { Pool } = require("pg");
const {DB_URI} = require("./config");

let db = new Pool({
    database: DB_URI,
    password: process.env.PASSWORD,
    host: 'localhost',
    user: 'postgres',
    port: 5432
});

module.exports = db;
