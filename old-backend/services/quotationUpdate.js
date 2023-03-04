var con = require('../database');
var yahooFinance = require('yahoo-finance');
const dotenv = require('dotenv');

var exports = module.exports = {};

dotenv.config();

var interval;

exports.startUpdates = () => {
    interval = setInterval(() => {
        shareUpdate();
        currencyUpdate();
        commodityUpdate();
    }, 3600000);
    console.log("Quotation update started");
}

exports.stopUpdates = () => {
    if (interval) clearInterval(interval);
}

function shareUpdate() {
    con.query(`SELECT code, quotation FROM share WHERE automatized=1`,
    (err, res) => {
        if (err) return console.log(err.message);
        res.forEach(share => {
            yahooFinance.quote({symbol: share.code, modules: [ 'price' ]}, 
            (error, quotes) => {
                if (error) return console.log(error.message);
                let query = "";
                query+=`INSERT INTO historicalshare (sharecode, date, quotation) VALUES ('${share.code}', sysdate(), ${share.quotation});`;
                query+=`UPDATE share SET quotation=${quotes.price.regularMarketPrice} WHERE code='${share.code}'`;
                con.query(query,
                (err2, res2) => {
                    if (err2) return console.log(err2.message);
                    console.log("Share update completed");
                });
            });
        });
    });
}

function currencyUpdate() {
    con.query(`SELECT code, quotation FROM currency WHERE automatized=1`,
    (err, res) => {
        if (err) return console.log(err.message);
        res.forEach(async currency => {
            if (currency.code=='USD') await USDUpdate(currency.quotation);
            else if (currency.code=='ARS') {}
            else {
                yahooFinance.quote({symbol: currency.code + "ARS=X", modules: [ 'price' ]}, 
                (error, quotes) => {
                    if (error) return console.log(error.message);
                    let query = "";
                    query+=`INSERT INTO historicalcurrency (currencycode, date, quotation) VALUES ('${currency.code}', sysdate(), ${currency.quotation});`;
                    query+=`UPDATE currency SET quotation=${quotes.price.regularMarketPrice} WHERE code='${currency.code}'`;
                    con.query(query,
                    (err2, res2) => {
                        if (err2) return console.log(err2.message);
                        console.log("Currency update completed");
                    });
                });
            }
        });
    });
}

async function USDUpdate(quotation) {
    try {
        await fetch('https://api.estadisticasbcra.com/usd_of', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.BCRA_BEARER}`,
                'Content-Type': 'application/json'
            }
        }).then(async fetchRes => {
            let quotes = await fetchRes.json();
            let lastQuote = quotes[quotes.length - 1];
            let query = "";
            query+=`INSERT INTO historicalcurrency (currencycode, date, quotation) VALUES ('USD', sysdate(), ${quotation});`;
            query+=`UPDATE currency SET quotation=${lastQuote.v} WHERE code='USD'`;
            con.query(query,
            (err2, res2) => {
                if (err2) return console.log(err2.message);
            });
        });
    }
    catch (e) {
        console.log(e.message);
    }
}

function commodityUpdate() {

}