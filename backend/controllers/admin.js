var con = require('../database');
var encrypt = require('../encrypt');
var yahooFinance = require('yahoo-finance');
const dotenv = require('dotenv');

var exports = module.exports = {};

dotenv.config();

exports.checkAdmin = (req, response, next) => {
    if(req.team) return response.sendStatus(403);
    con.query(`SELECT admin FROM basicuser WHERE userid=${req.userid}`,
        (err, res) => {
            if (err) return response.status(500).json({error: err.message});
            if (res[0].admin==0) return response.sendStatus(403);
            next();
        });
}

exports.createUser = (req, response) => {
    encrypt.encryptPassword(req.body.password, 
    (error, hash) => {
        con.query(`INSERT INTO user (name) VALUES ('${req.body.name}')`,
        (err, res) => {
            if (err) return response.status(500).json({error: err.message});
            con.query(`INSERT INTO basicuser (userid, email, dni, username, password) VALUES (${res.insertId}, '${req.body.email}', ${req.body.dni}, '${req.body.username}', '${hash}')`,
            (err2, res2) => {
                if (err2) return response.status(500).json({error: err2.message});
                return response.sendStatus(200);
            });
        });
    });
}

exports.deleteUser = (req, response) => {
    con.query(`CALL DELETE_USER(${req.params.userid});`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.toggleAdmin = (req, response) => {
    con.query(`UPDATE basicuser SET admin=NOT admin WHERE userid=${req.params.userid};`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.getUsers = (req, response) => {
    con.query(`SELECT u.*, bu.username, bu.email, bu.dni, bu.admin FROM user u INNER JOIN basicuser bu ON u.userid=bu.userid INNER JOIN team ON u.userid=t.userid`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getUser = (req, response) => {
    con.query(`SELECT u.*, bu.username, bu.email, bu.dni, bu.admin FROM user u INNER JOIN basicuser bu ON u.userid=${req.params.userid} AND u.userid=bu.userid INNER JOIN team ON u.userid=t.userid`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getTeams = (req, response) => {
    con.query(`SELECT * FROM user NATURAL JOIN team`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getTeam = (req, response) => {
    con.query(`SELECT * FROM user NATURAL JOIN team WHERE teamid=${req.params.teamid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getUserWins = (req, response) => {
    con.query(`CALL GET_USER_WINS(${req.params.userid})`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getGameWinners = (req, response) => {
    con.query(`SELECT *, ROW_NUMBER() OVER (ORDER BY variation DESC) AS position FROM VARIATIONS WHERE gameid=${req.params.gameid};`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.createGame = (req, response) => {
    con.query(`INSERT INTO game (title, startDate, initialCash) VALUES ('${req.body.title}', sysdate(), ${req.body.initialCash});`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.deleteGame = (req, response) => {
    con.query(`DELETE FROM game WHERE gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.endGame = (req, response) => {
    con.query(`UPDATE game SET finishDate=sysdate() AND finished=NOT finished WHERE gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.getGame = (req, response) => {
    con.query(`SELECT * FROM game WHERE gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getGames = (req, response) => {
    con.query(`SELECT * FROM game`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getGameTransactions = (req, response) => {
    con.query(`SELECT * FROM transaction WHERE gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getGameCurrencyTransactions = (req, response) => {
    con.query(`SELECT * FROM currencytransaction WHERE gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.createShare = (req, response) => {
    yahooFinance.quote({symbol: req.body.code, modules: [ 'price' ]}, 
    (error, quotes) => {
        if (error && (!!req.body.automatized)) return response.status(500).json({error: err.message});
        con.query(`INSERT INTO SHARE (code, name, automatized, currency, quotation, available) VALUES (
            '${req.body.code}', 
            '${req.body.name}', 
            ${req.body.automatized}, 
            '${req.body.currency}', 
            ${!!req.body.automatized ? quotes.price.regularMarketPrice : req.body.quotation}, 1)`,
        (err, res) => {
            if (err) return response.status(500).json({error: err.message});
            if (!!req.body.automatized) return response.sendStatus(200);
            yahooFinance.historical({symbol: req.body.code, from: '2019-01-01'}, 
            (quoteerr, quotes) => {
                if (quoteerr) return response.status(500).json({error: quoteerr.message});
                let query = "INSERT INTO historicalshare (sharecode, date, quotation) VALUES ";
                quotes.forEach(quote => {
                    query+=`('${req.body.code}', '${stringifyDate(quote.date)}', ${quote.close}),`
                });
                query = query.slice(0, -1);
                con.query(query,
                (err2, res2) => {
                    if (err2) return response.status(500).json({error: err2.message});
                    return response.sendStatus(200);
                });
            });
        });
    });
}

exports.createCurrency = (req, response) => {
    if (req.body.code=="USD") createUSD(req, response);
    else {
        yahooFinance.quote({symbol: req.body.code + "ARS=X", modules: [ 'price' ]}, 
        (error, quotes) => {
            if (error && (!!req.body.automatized)) return response.status(500).json({error: err.message});
            con.query(`INSERT INTO currency (code, name, automatized, quotation, available) VALUES (
                '${req.body.code}', 
                '${req.body.name}', 
                ${req.body.automatized},
                ${!!req.body.automatized ? quotes.price.regularMarketPrice : req.body.quotation}, 1)`,
            (err, res) => {
                if (err) return response.status(500).json({error: err.message});
                if (!(!!req.body.automatized)) return response.sendStatus(200);
                yahooFinance.historical({symbol: req.body.code + "ARS=X", from: '2019-01-01'}, 
                (quoteerr, quotes) => {
                    if (quoteerr) return response.status(500).json({error: quoteerr.message});
                    let query = "INSERT INTO historicalcurrency (currencycode, date, quotation) VALUES ";
                    quotes.forEach(quote => {
                        query+=`('${req.body.code}', '${stringifyDate(quote.date)}', ${quote.close}),`
                    });
                    query = query.slice(0, -1);
                    con.query(query,
                    (err2, res2) => {
                        if (err2) return response.status(500).json({error: err2.message});
                        return response.sendStatus(200);
                    });
                });
            });
        });
    }
}

function createUSD(req, response) {
    fetch('https://api.estadisticasbcra.com/usd_of', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.BCRA_BEARER}`,
                'Content-Type': 'application/json'
            }
        }).then(async fetchRes => {
          let quotes = await fetchRes.json();
          quotes = quotes.filter(quote => {
            let year = quote.d.split("-")[0];
            return year >= 2019;
          })
          con.query(`INSERT INTO currency (code, name, automatized, quotation, available) VALUES (
            '${req.body.code}', 
            '${req.body.name}', 
            ${req.body.automatized},
            ${!!req.body.automatized ? quotes[quotes.length - 1].v : req.body.quotation}, 1)`,
            (err, res) => {
                if (err) return response.status(500).json({error: err.message});
                let query = "INSERT INTO historicalcurrency (currencycode, date, quotation) VALUES ";
                quotes.forEach(quote => {
                    query+=`('${req.body.code}', '${quote.d}', ${quote.v}),`
                });
                query = query.slice(0, -1);
                con.query(query,
                (err2, res2) => {
                    if (err2) return response.status(500).json({error: err2.message});
                    return response.sendStatus(200);
                });
            });
        });
}

exports.createCommodity = (req, response) => {
    
}

function stringifyDate(date) {
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}

exports.getShares = (req, response) => {
    con.query(`SELECT * FROM share`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getShare = (req, response) => {
    con.query(`SELECT * FROM share WHERE code='${req.params.sharecode}'`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getGameShares = (req, response) => {
    con.query(`SELECT s.* FROM share s INNER JOIN shareingame sg ON s.code=sg.sharecode AND sg.gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getCurrencies = (req, response) => {
    con.query(`SELECT * FROM currency`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getCurrency = (req, response) => {
    con.query(`SELECT * FROM currency WHERE code='${req.params.currencycode}'`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getGameCurrencies = (req, response) => {
    con.query(`SELECT c.* FROM currency c INNER JOIN currencyingame sg ON c.code=sg.currencycode AND sg.gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}


exports.getCommodities = (req, response) => {
    con.query(`SELECT * FROM commodity`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getCommodity = (req, response) => {
    con.query(`SELECT * FROM commodity WHERE code='${req.params.commoditycode}'`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getGameCommodities = (req, response) => {
    con.query(`SELECT c.* FROM commodity c INNER JOIN commodityingame sg ON c.code=sg.commoditycode AND sg.gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}