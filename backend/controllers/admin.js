var con = require('../database');
var encrypt = require('../encrypt');
var exports = module.exports = {};

exports.checkAdmin = (req, response, next) => {
    con.query(`SELECT admin FROM user WHERE userid=${req.userid}`,
        (err, res) => {
            if (err) return response.status(500).json({error: err.message});
            if (res[0].admin==0) return response.sendStatus(403);
            next();
        });
}

exports.createUser = (req, response) => {
    encrypt.encryptPassword(req.body.password, 
    (error, hash) => {
        con.query(`INSERT INTO user (username, name, password) VALUES ('${req.body.username}', '${req.body.name}', '${hash}')`,
        (err, res) => {
            if (err) return response.status(500).json({error: err.message});
            con.query(`INSERT INTO basicuser (userid, email, dni) VALUES (${res.insertId}, '${req.body.email}', ${req.body.dni})`,
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
    con.query(`UPDATE basicuser SET admin=NOT admin WHERE userid=${req.body.userid};`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.getUsers = (req, response) => {
    con.query(`SELECT userid, username, name, image, team, publicprofile FROM user`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getUser = (req, response) => {
    con.query(`SELECT userid, username, name, image, team, publicprofile FROM user WHERE userid=${req.params.userid}`,
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
        if (err) response.status(500).json({error: err.message});
        response.status(200).json(res);
    });
}

exports.createGame = (req, res) => {
    con.query(`INSERT INTO game (title, startDate, initialCash) VALUES ('${req.body.title}', sysdate(), ${req.body.initialCash});`,
    (err, res) => {
        if (err) response.status(500).json({error: err.message});
        res.sendStatus(200);
    });
}

exports.deleteGame = (req, response) => {
    con.query(`DELETE FROM game WHERE gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) response.status(500).json({error: err.message});
        response.sendStatus(200);
    });
}

exports.endGame = (req, response) => {
    con.query(`UPDATE game SET finishDate=sysdate() AND finished=NOT finished WHERE gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) response.status(500).json({error: err.message});
        response.sendStatus(200);
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
        if (err) response.status(500).json({error: err.message});
        response.status(200).json(res);
    });
}

exports.getGameTransactions = (req, response) => {
    con.query(`SELECT * FROM transaction WHERE gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) response.status(500).json({error: err.message});
        response.status(200).json(res);
    });
}

exports.getGameCurrencyTransactions = (req, response) => {
    con.query(`SELECT * FROM currencytransaction WHERE gameid=${req.body.gameid}`,
    (err, res) => {
        if (err) response.status(500).json({error: err.message});
        response.status(200).json(res);
    });
}

exports.getShares = (req, response) => {
    con.query(`SELECT * FROM share`,
    (err, res) => {
        if (err) response.status(500).json({error: err.message});
        response.status(200).json(res);
    });
}

exports.getShare = (req, response) => {
    con.query(`SELECT * FROM share WHERE code=${req.params.sharecode}`,
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

