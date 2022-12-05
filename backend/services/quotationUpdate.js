var con = require('../database');
var yahooFinance = require('yahoo-finance');
const dotenv = require('dotenv');

var exports = module.exports = {};

dotenv.config();

exports.shareUpdate = () => {
    con.query(`SELECT admin FROM basicuser WHERE userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        if (res[0].admin==0) return response.sendStatus(403);
        next();
    });
}