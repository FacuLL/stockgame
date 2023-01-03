var con = require('../database');
var encrypt = require('../encrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

var exports = module.exports = {};

dotenv.config();

exports.checkToken = (req, response, next) => {
    if (!req.headers.authorization) return response.status(403).json({error: 'No token'});
    let token = req.headers.authorization.split(' ')[1];
    if (!token) return response.status(403).json({error: 'No token'});
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) return response.status(403).json({error: error.message});
        con.query(`SELECT * FROM basicuser WHERE userid=${user.userid} AND username='${user.username}'`,
        (err, res) => {
            if (err) return response.status(500).json({error: err.message});
            if (res.length <= 0) return response.status(403).json({error: 'Invalid token'});
            if (res.team===1) {
                con.query(`SELECT tp.* FROM teamparticipants tp INNER JOIN team t ON tp.teamid=t.teamid AND t.userid=${user.userid} AND tp.userid=${user.loggeduserid}`,
                (err2, res2) => {
                    if (err2) return response.status(500).json({error: err2.message});
                    if (res2.length <= 0) return response.status(403).json({error: "User isn't in team"});
                });
            }
            req.userid=user.userid;
            req.username=user.username;
            req.team=user.team;
            req.loggeduserid=user.loggeduserid;
            next();
        });
    });
}

exports.verifyToken = (req, response) => {
    return response.status(200).json({message: 'Correct token'});
}

exports.login = (req, response) => {
    con.query(`SELECT * FROM basicuser WHERE username='${req.body.username}'`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        if (res.length <= 0) return response.status(403).json({error: "Username or password invalid"});
        encrypt.comparePassword(req.body.password, res[0].password,
        (error, match) => {
            if (error) return response.status(500).json({error: error.message});
            if(!match) return response.status(403).json({error: "Username or password invalid"});
            if (res[0].team===1) return response.sendStatus(403).json({error: "Can't login into a team"});
            let payload = {
                userid: res[0].userid,
                username: res[0].username,
                team: !!res[0].team
            }
            let token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
            return response.status(200).json({token: token});
        });
    });
}

exports.getPlayingGames = (req, response) => {
    con.query(`SELECT * FROM game g INNER JOIN gameparticipants gp INNER JOIN VARIATIONS v ON g.gameid=gp.gameid AND gp.userid=${req.userid} AND g.finished=0 AND v.instanceid=gp.instanceid;`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getGame = (req, response) => {
    con.query(`SELECT g.*, gp.cash, v.variation, st.stocks, st.transactions FROM game g INNER JOIN gameparticipants gp ON g.gameid=gp.gameid AND gp.userid=${req.userid} AND gp.gameid=${req.params.gameid} INNER JOIN VARIATIONS v ON gp.instanceid=v.instanceid INNER JOIN USERSTATS st ON gp.instanceid=st.instanceid`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res[0]);
    });
}

exports.getFullGame = (req, response) => {
    con.query(`SELECT g.*, gp.cash, v.variation, st.stocks, st.transactions FROM game g INNER JOIN gameparticipants gp ON g.gameid=gp.gameid AND gp.userid=${req.userid} AND gp.gameid=${req.params.gameid} INNER JOIN VARIATIONS v ON gp.instanceid=v.instanceid INNER JOIN USERSTATS st ON gp.instanceid=st.instanceid`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        if (!res[0]) return response.status(404).json({error: 'Game was not found'})
        con.query(`SELECT s.*, ss.lastquote, ss.variation FROM share s INNER JOIN shareingame sg ON s.code=sg.sharecode AND sg.gameid=${res[0].gameid} INNER JOIN gameparticipants gp ON gp.gameid=sg.gameid AND gp.userid=${req.userid} INNER JOIN SHARE_STATS ss ON s.code=ss.code`,
        (err2, res2) => {
            if (err2) return response.status(500).json({error: err2.message});
            res[0].shares = res2;
            con.query(`SELECT c.*, cs.lastquote, cs.variation FROM currency c INNER JOIN currencyingame cg ON c.code=cg.currencycode AND cg.gameid=${res[0].gameid} INNER JOIN gameparticipants gp ON gp.gameid=cg.gameid AND gp.userid=${req.userid} INNER JOIN CURRENCY_STATS cs ON c.code=cs.code`,
            (err3, res3) => {
                if (err3) return response.status(500).json({error: err3.message});
                res[0].currencies = res3;
                con.query(`SELECT c.* FROM commodity c INNER JOIN commodityingame cg ON c.commodityid=cg.commodityid AND cg.gameid=${req.params.gameid} INNER JOIN gameparticipants gp ON gp.gameid=cg.gameid AND gp.userid=${req.userid}`,
                (err4, res4) => {
                    if (err4) return response.status(500).json({error: err4.message});
                    res[0].commodities = res4;
                    return response.status(200).json(res[0]);
                });
            });
        });
    });
}

exports.getPosInGames = (req, response) => {
    con.query(`CALL GET_USER_WINS(${req.userid})`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res[0]);
    });
}

exports.getSharesInGame = (req, response) => {
    con.query(`SELECT s.* FROM share s INNER JOIN shareingame sg ON s.code=sg.sharecode AND sg.gameid=${req.params.gameid} INNER JOIN gameparticipants gp ON gp.gameid=sg.gameid AND gp.userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getCurrenciesInGame = (req, response) => {
    con.query(`SELECT c.* FROM currency c INNER JOIN currencyingame cg ON c.code=cg.currencycode AND cg.gameid=${req.params.gameid} INNER JOIN gameparticipants gp ON gp.gameid=cg.gameid AND gp.userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getCommoditiesInGame = (req, response) => {
    con.query(`SELECT c.* FROM commodity c INNER JOIN commodityingame cg ON c.commodityid=cg.commodityid AND cg.gameid=${req.params.gameid} INNER JOIN gameparticipants gp ON gp.gameid=cg.gameid AND gp.userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getFullShare = (req, response) => {
    con.query(`SELECT s.* FROM share s INNER JOIN shareingame sg INNER JOIN gameparticipants gp ON s.code=sg.sharecode AND sg.gameid=${req.params.gameid} AND sg.gameid=gp.gameid AND gp.userid=${req.userid} AND s.code='${req.params.sharecode}'`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        if (!res[0]) return response.status(404).json({error: 'Share was not found'});
        con.query(`SELECT * FROM historicalshare WHERE sharecode='${res[0].code}'`,
        (err2, res2) => {
            if (err2) return response.status(500).json({error: err2.message});
            res[0].historical = res2;
            return response.status(200).json(res[0]);
        });
    });
}

exports.getHistoricalShare = (req, response) => {
    con.query(`SELECT hs.* FROM historicalshare hs INNER JOIN shareingame sg ON hs.sharecode=sg.sharecode AND hs.sharecode=${req.params.sharecode} AND sg.gameid=${req.params.gameid} INNER JOIN gameparticipants gp ON gp.gameid=sg.gameid AND gp.userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getSharesStock = (req, response) => {
    con.query(`SELECT ss.sharecode, ss.stock FROM sharestock ss INNER JOIN gameparticipants gp ON ss.instanceid=gp.instanceid AND gp.userid=${req.userid} AND gp.gameid=${req.params.gameid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getTransactions = (req, response) => {
    con.query(`SELECT * FROM transaction WHERE userid=${req.userid} AND gameid=${req.params.gameid} ORDER BY date DESC`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getCurrencyTransactions = (req, response) => {
    con.query(`SELECT * FROM currencytransaction WHERE userid=${req.userid} AND gameid=${req.params.gameid} ORDER BY date DESC`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.createTransaction = (req, response) => {
    con.query(
    `INSERT INTO transaction (userid, gameid, sharecode, date, quotation, action, currencycode, amount) VALUES 
	(${req.userid},
    ${req.params.gameid},
    '${req.body.sharecode}', sysdate(), 
    (SELECT quotation FROM share WHERE code='${req.body.sharecode}'),
    '${req.body.action}',
    (SELECT currency FROM share WHERE code='${req.body.sharecode}'),
    ${req.body.amount}
    );`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.createCurrencyTransaction = (req, response) => {
    con.query(
    `INSERT INTO currencytransaction (userid, gameid, date, quotation, action, currencycode, amount) VALUES 
	(${req.userid},
    ${req.params.gameid},
    sysdate(), 
    (SELECT quotation FROM currency WHERE code='${req.body.currencycode}'),
    '${req.body.action}',
    '${req.body.currencycode}',
    ${req.body.amount}
    );`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.getProfile = (req, response) => {
    con.query(`SELECT * FROM (SELECT u.userid, u.name, u.image, u.team, u.publicprofile, bu.username, t.creatorid FROM user u LEFT JOIN team t ON u.userid=t.userid LEFT JOIN basicuser bu ON u.userid=bu.userid) b WHERE userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message, code: err.sqlState});
        return response.status(200).json(res[0]);
    });
}

exports.updateProfile = (req, response) => {
    con.query(`UPDATE user SET name='${req.body.name}', publicprofile=${req.body.publicprofile} WHERE userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        if (!req.team) {
            con.query(`UPDATE basicuser SET email='${req.body.email}', dni=${req.body.dni} WHERE userid=${req.userid}`,
            (err2, res2) => {
                if (err2) return response.status(500).json({error: err2.message});
                return response.sendStatus(200);
            });
        }
    });
}

exports.recoverPassword = (req, response) => {

}

exports.getUser = (req, response) => {
    con.query(`SELECT * FROM (SELECT u.userid, u.name, u.image, u.team, u.publicprofile, t.creatorid, bu.username FROM user u LEFT JOIN team t ON u.userid=t.userid LEFT JOIN basicuser bu ON u.userid=bu.userid) b WHERE userid=${req.params.userid} AND publicprofile=1;`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res[0]);
    });
}

exports.switchToTeam = (req, response) => {
    if (req.team) return response.status(500).json({error: "Switch to user first"})
    con.query(`SELECT * FROM user u INNER JOIN team t ON u.userid=t.userid AND u.team=1 AND t.teamid=${req.params.teamid} INNER JOIN teamparticipants tp ON t.teamid=tp.teamid AND tp.userid=${req.userid}`,
    (err, res) => {
        if (res.length <= 0) return response.status(403).json({error: "You don't play in this team"}); 
        if (err) return response.status(500).json({error: err.message});
            let payload = {
                userid: res[0].userid,
                username: res[0].username,
                team: !!res[0].team,
                loggeduserid: req.userid
            }
            let token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
            return response.status(200).json({token: token});
    });
}

exports.switchToUser = (req, response) => {
    if (!req.team) return response.status(500).json({error: "Switch to team first"})
    con.query(`SELECT * FROM user WHERE userid=${req.loggeduserid}`,
    (err, res) => {
        if (res.length <= 0) return response.status(403).json({error: "Previous user wasn't found"}); 
        if (err) return response.status(500).json({error: err.message});
            let payload = {
                userid: res[0].userid,
                username: res[0].username,
                team: !!res[0].team
            }
            let token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
            return response.status(200).json({token: token});
    });
}

exports.getOwnerTeams = (req, response) => {
    con.query(`SELECT u.*, t.creatorid FROM user u INNER JOIN team t ON u.userid=t.userid AND t.creatorid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getTeamParticipants = (req, response) => {
    if (!req.team) return response.status(500).json({error: 'You are not a team'});
    con.query(`SELECT u.* FROM user u INNER JOIN teamparticipants tp ON u.userid=tp.userid AND tp.teamid=${req.userid} INNER JOIN basicuser bu ON u.userid=bu.userid`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.getPlayingTeams = (req, response) => {
    if (req.team) return response.status(500).json({error: 'You are a team'});
    con.query(`SELECT u.*, t.creatorid FROM user u INNER JOIN team t ON u.userid=t.userid INNER JOIN teamparticipants tp ON t.teamid=tp.teamid AND tp.userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.createTeam = (req, response) => {
    if (req.team) return response.status(500).json({error: 'You are a team'});
    con.query(`INSERT INTO user (name, team) VALUES ('${req.body.name}', 1)`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        con.query(`INSERT INTO team (userid, creatorid) VALUES (${res.insertId}, ${req.userid})`,
        (err2, res2) => {
            if (err2) return response.status(500).json({error: err2.message});
            con.query(`INSERT INTO teamparticipants (teamid, userid) VALUES (${res2.insertId}, ${req.userid})`,
            (err3, res3) => {
                if (err3) return response.status(500).json({error: err3.message});
                return response.sendStatus(200);
            });
        });
    });
}

exports.leaveTeam = (req, response) => {
    if (req.team) return response.status(500).json({error: 'You are a team'});
    con.query(`DELETE FROM teamparticipants WHERE teamid=${req.body.teamid} AND userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.getTeamInvitations = (req, response) => {
    if (req.team) return response.status(500).json({error: 'You are a team'});
    con.query(`SELECT * FROM teaminvitations WHERE userid=${req.userid}`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.status(200).json(res);
    });
}

exports.inviteToTeam = (req, response) => {
    if (!req.team) return response.status(500).json({error: 'You are not a team'});
    con.query(`CALL CREATE_TEAM_INVITATION(${req.userid}, '${req.params.username}')`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}

exports.acceptTeamInvitation = (req, response) => {
    if (req.team) return response.status(500).json({error: 'You are a team'});
    con.query(`CALL ACCEPT_TEAM_INVITATION(${req.params.teamid}, ${req.userid})`,
    (err, res) => {
        if (err) return response.status(500).json({error: err.message});
        return response.sendStatus(200);
    });
}