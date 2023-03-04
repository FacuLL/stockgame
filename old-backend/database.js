const mysql = require('mysql');

const con = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'facu',
    database: 'marketgame',
    multipleStatements: true
});

exports = module.exports = con;