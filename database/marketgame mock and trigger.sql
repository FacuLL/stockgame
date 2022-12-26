INSERT INTO game (title, startDate, initialCash) VALUES ('prueba', sysdate(), 100000);
INSERT INTO game (title, startDate, initialCash) VALUES ('prueba2', sysdate(), 150000);
INSERT INTO game (title, startDate, initialCash) VALUES ('prueba3', sysdate(), 200000);
INSERT INTO game (title, startDate, initialCash) VALUES ('prueba4', sysdate(), 50000);

INSERT INTO user (username, name, password) VALUES ('nperez', 'Nehuen Perez', 'sadjwoes');
INSERT INTO user (username, name, password) VALUES ('aabb', 'AAA BBBB', 'sadjwoes');
INSERT INTO user (username, name, password) VALUES ('ccdd', 'CCCC DDDD', 'sadjwoes');
INSERT INTO user (username, name, password) VALUES ('eeff', 'EEEE FFFF', 'sadjwoes');
INSERT INTO user (username, name, password) VALUES ('gghh', 'GGGG HHHH', 'sadjwoes');

INSERT INTO basicuser (userid, email, dni) VALUES (1, 'nehuen@prueba123.com', 20913821);
INSERT INTO basicuser (userid, email, dni) VALUES (2, 'AAAA@BBBBB.com', 20913821);
INSERT INTO basicuser (userid, email, dni) VALUES (3, 'CCCC@DDDD.com', 20913821);
INSERT INTO basicuser (userid, email, dni) VALUES (4, 'EEEEE@prueba123.com', 20913821);
INSERT INTO basicuser (userid, email, dni) VALUES (5, 'GGGGG@prueba123.com', 20913821);

INSERT INTO gameparticipants (gameid, userid, cash) VALUES (1, 1, (
	SELECT initialCash FROM game WHERE gameid=1
));
INSERT INTO gameparticipants (gameid, userid, cash) VALUES (4, 2, (
	SELECT initialCash FROM game WHERE gameid=4
));
INSERT INTO gameparticipants (gameid, userid, cash) VALUES (4, 3, (
	SELECT initialCash FROM game WHERE gameid=4
));
INSERT INTO gameparticipants (gameid, userid, cash) VALUES (3, 4, (
	SELECT initialCash FROM game WHERE gameid=4
));
INSERT INTO gameparticipants (gameid, userid, cash) VALUES (3, 5, 1000000);

INSERT INTO share (code, name, quotation, currency) VALUES ('YPF', 'YPF ARG', 2000, 'ARS');

INSERT INTO shareingame (gameid, sharecode) VALUES (2, 'YPF');

INSERT INTO currency (code, name, quotation, available) VALUES ('ARS',"Pesos Argentinos", 1, 1);
INSERT INTO currency (code, quotation) VALUES ('USD', 300);

INSERT INTO currencyingame (currencycode, gameid) VALUES ('ARS', 1);
INSERT INTO currencyingame (currencycode, gameid) VALUES ('USD', 1);

INSERT INTO transaction (userid, gameid, sharecode, date, quotation, action, currencycode, amount) VALUES 
	(1, 
    1,
    'YPF', sysdate(), 
    (SELECT quotation FROM share WHERE code='YPF'),
    'buy',
    (SELECT currency FROM share WHERE code='YPF'),
    10
);

UPDATE share SET quotation=3000 WHERE code='YPF';

SELECT * FROM share;

SELECT * FROM gameparticipants;
DELETE FROM gameparticipants WHERE gameid=4;

SELECT stock FROM sharestock WHERE instanceid=1 AND sharecode='YPF';

SELECT * FROM user;
SELECT * FROM (SELECT u.userid, u.name, u.image, u.team, u.publicprofile, u.username, t.creatorid FROM user u LEFT JOIN team t ON u.userid=t.userid) b WHERE userid=6;
SELECT * FROM basicuser;

UPDATE basicuser SET admin=1 WHERE userid=1;

DROP TRIGGER IF EXISTS UPDATE_CASH;
DELIMITER $$
CREATE TRIGGER UPDATE_CASH
	AFTER INSERT ON transaction
	FOR EACH ROW
	BEGIN
		DECLARE actualinstance INT;
        DECLARE actualcash DECIMAL(9,2);
        DECLARE actualamount INT;
        DECLARE actualstockcurrency DECIMAL(9,2);
        
        SET actualinstance = (SELECT instanceid FROM gameparticipants WHERE gameid=NEW.gameid AND userid=NEW.userid);
        SET actualcash = (SELECT cash FROM gameparticipants WHERE gameid=NEW.gameid AND userid=NEW.userid);
        SET actualamount = (SELECT stock FROM sharestock WHERE instanceid=actualinstance AND sharecode=NEW.sharecode);
        
        IF NOT (SELECT finished FROM game WHERE gameid=NEW.gameid) THEN
			IF actualinstance IS NOT NULL THEN
				IF NEW.sharecode IN (SELECT code FROM share s INNER JOIN shareingame sg ON s.code=sg.sharecode AND sg.gameid=NEW.gameid) THEN
					IF NEW.currencycode = 'ARS' THEN
						IF NEW.action='buy' THEN
							IF actualcash >= (NEW.quotation * NEW.amount) THEN
								UPDATE gameparticipants SET cash=(actualcash - (NEW.quotation * NEW.amount)) WHERE gameid=NEW.gameid AND userid=NEW.userid;
								IF actualamount IS NULL THEN
									INSERT INTO sharestock (instanceid, sharecode, stock) VALUES (actualinstance, NEW.sharecode, NEW.amount);
								ELSE
									UPDATE sharestock SET stock=(actualamount + NEW.amount) WHERE instanceid=actualinstance AND sharecode=NEW.sharecode;
								END IF;
							ELSE
								SIGNAL SQLSTATE '45000'
								SET MESSAGE_TEXT = "Not enough cash to buy";
							END IF;
						ELSEIF NEW.action='sell' THEN
							IF actualamount >= NEW.amount THEN
								UPDATE gameparticipants SET cash=(actualcash + (NEW.quotation * NEW.amount)) WHERE gameid=NEW.gameid AND userid=NEW.userid;
								UPDATE sharestock SET stock=(actualamount - NEW.amount) WHERE instanceid=actualinstance AND sharecode=NEW.sharecode;
							ELSE
								SIGNAL SQLSTATE '45000'
								SET MESSAGE_TEXT = "Not enough stock to sell";
							END IF;
						ELSE
							SIGNAL SQLSTATE '45000'
							SET MESSAGE_TEXT = "Invalid action";
						END IF;
					ELSE
						IF NEW.currencycode IN (SELECT c.code FROM currency c INNER JOIN currencyInGame cg ON c.code=cg.currencycode AND cg.gameid=NEW.gameid) THEN
							SET actualstockcurrency=(SELECT stock FROM currencystock WHERE instanceid=actualinstance AND currencycode=NEW.currencycode);
							IF NEW.action = 'buy' THEN
								IF actualstockcurrency >= (NEW.quotation * NEW.amount) THEN
									UPDATE currencystock SET stock=(actualstockcurrency - (NEW.quotation * NEW.amount)) WHERE instanceid=actualinstance AND currencycode=NEW.currencycode;
									IF actualamount IS NULL THEN
										INSERT INTO sharestock (instanceid, sharecode, stock) VALUES (actualinstance, NEW.sharecode, NEW.amount);
									ELSE
										UPDATE sharestock SET stock=(actualamount + NEW.amount) WHERE instanceid=actualinstance AND sharecode=NEW.sharecode;
									END IF;
								ELSE
									SIGNAL SQLSTATE '45000'
									SET MESSAGE_TEXT = "Not enough cash to buy";
								END IF;
							ELSEIF NEW.action = 'sell' THEN
								IF actualamount IS NOT NULL AND actualamount >= NEW.amount THEN
									UPDATE currencystock SET stock=(actualstockcurrency + (NEW.quotation * NEW.amount)) WHERE instanceid=actualinstance AND currencycode=NEW.currencycode;
									UPDATE sharestock SET stock=(actualamount - NEW.amount) WHERE instanceid=actualinstance AND sharecode=NEW.sharecode;
								ELSE
									SIGNAL SQLSTATE '45000'
									SET MESSAGE_TEXT = "Not enough stock to sell";
								END IF;
							ELSE
								SIGNAL SQLSTATE '45000'
								SET MESSAGE_TEXT = "Invalid action";
							END IF;
						ELSE 
							SIGNAL SQLSTATE '45000'
							SET MESSAGE_TEXT = "Currency is not in this game";
						END IF;
					END IF;
				ELSE
					SIGNAL SQLSTATE '45000'
					SET MESSAGE_TEXT = "Share is not in this game";
				END IF;
			ELSE
				SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = "User not in game";
			END IF;
		ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = "The game has already finished";
		END IF;
	END; 
$$ DELIMITER ;

DROP TRIGGER IF EXISTS UPDATE_CURRENCY_CASH;
DELIMITER $$
CREATE TRIGGER UPDATE_CURRENCY_CASH
	AFTER INSERT ON currencytransaction
	FOR EACH ROW
	BEGIN
		DECLARE actualinstance INT;
        DECLARE actualcash DECIMAL(9,2);
        DECLARE actualamount INT;
        DECLARE actualstockcurrency DECIMAL(9,2);
        
        SET actualinstance = (SELECT instanceid FROM gameparticipants WHERE gameid=NEW.gameid AND userid=NEW.userid);
        SET actualcash = (SELECT cash FROM gameparticipants WHERE gameid=NEW.gameid AND userid=NEW.userid);
        SET actualamount = (SELECT stock FROM currencystock WHERE instanceid=actualinstance AND currencycode=NEW.currencycode);
        
        IF NOT (SELECT finished FROM game WHERE gameid=NEW.gameid) THEN
			IF actualinstance IS NOT NULL THEN
				IF NEW.currencycode IN (SELECT code FROM currency c INNER JOIN currencyingame cg ON c.code=cg.currencycode AND cg.gameid=NEW.gameid) THEN
					IF NEW.currencycode != 'ARS' THEN
						IF NEW.action='buy' THEN
							IF actualcash >= (NEW.quotation * NEW.amount) THEN
								UPDATE gameparticipants SET cash=(actualcash - (NEW.quotation * NEW.amount)) WHERE gameid=NEW.gameid AND userid=NEW.userid;
								IF actualamount IS NULL THEN
									INSERT INTO currencystock (instanceid, currencycode, stock) VALUES (actualinstance, NEW.currencycode, NEW.amount);
								ELSE
									UPDATE currencystock SET stock=(actualamount + NEW.amount) WHERE instanceid=actualinstance AND currencycode=NEW.currencycode;
								END IF;
							ELSE
								SIGNAL SQLSTATE '45000'
								SET MESSAGE_TEXT = "Not enough cash to buy";
							END IF;
						ELSEIF NEW.action='sell' THEN
							IF actualamount IS NOT NULL AND actualamount >= NEW.amount THEN
								UPDATE gameparticipants SET cash=(actualcash + (NEW.quotation * NEW.amount)) WHERE gameid=NEW.gameid AND userid=NEW.userid;
								UPDATE currencystock SET stock=(actualamount - NEW.amount) WHERE instanceid=actualinstance AND currencycode=NEW.currencycode;
							ELSE
								SIGNAL SQLSTATE '45000'
								SET MESSAGE_TEXT = "Not enough stock to sell";
							END IF;
						ELSE
							SIGNAL SQLSTATE '45000'
							SET MESSAGE_TEXT = "Invalid action";
						END IF;
					ELSE 
						SIGNAL SQLSTATE '45000'
						SET MESSAGE_TEXT = "Cant buy or sell ARS";
					END IF;
				ELSE
					SIGNAL SQLSTATE '45000'
					SET MESSAGE_TEXT = "Currency is not in this game";
				END IF;
			ELSE
				SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = "User not in game";
			END IF;
		ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = "The game has already finished";
		END IF;
	END; 
$$ DELIMITER ;

DROP TRIGGER IF EXISTS UPDATE_COMMODITIY_CASH;
DELIMITER $$
CREATE TRIGGER UPDATE_COMMODITIY_CASH
	AFTER INSERT ON commoditytransaction
	FOR EACH ROW
	BEGIN
		DECLARE actualinstance INT;
        DECLARE actualcash DECIMAL(9,2);
        DECLARE actualamount INT;
        DECLARE actualstockcommodity DECIMAL(9,2);
        
        SET actualinstance = (SELECT instanceid FROM gameparticipants WHERE gameid=NEW.gameid AND userid=NEW.userid);
        SET actualcash = (SELECT cash FROM gameparticipants WHERE gameid=NEW.gameid AND userid=NEW.userid);
        SET actualamount = (SELECT stock FROM commoditystock WHERE instanceid=actualinstance AND commodityid=NEW.commodityid);
        
        IF NOT (SELECT finished FROM game WHERE gameid=NEW.gameid) THEN
			IF actualinstance IS NOT NULL THEN
				IF NEW.commodityid IN (SELECT commodityid FROM commodity c INNER JOIN commodityingame cg ON c.commodityid=cg.commodityid AND cg.gameid=NEW.gameid) THEN
					IF NEW.action='buy' THEN
						IF actualcash >= (NEW.quotation * NEW.amount) THEN
							UPDATE gameparticipants SET cash=(actualcash - (NEW.quotation * NEW.amount)) WHERE gameid=NEW.gameid AND userid=NEW.userid;
							IF actualamount IS NULL THEN
								INSERT INTO commoditystock (instanceid, commodityid, stock) VALUES (actualinstance, NEW.commodityid, NEW.amount);
							ELSE
								UPDATE commoditystock SET stock=(actualamount + NEW.amount) WHERE instanceid=actualinstance AND commodityid=NEW.commodityid;
							END IF;
						ELSE
							SIGNAL SQLSTATE '45000'
							SET MESSAGE_TEXT = "Not enough cash to buy";
						END IF;
					ELSEIF NEW.action='sell' THEN
						IF actualamount IS NOT NULL AND actualamount >= NEW.amount THEN
							UPDATE gameparticipants SET cash=(actualcash + (NEW.quotation * NEW.amount)) WHERE gameid=NEW.gameid AND userid=NEW.userid;
							UPDATE commoditystock SET stock=(actualamount - NEW.amount) WHERE instanceid=actualinstance AND commodityid=NEW.commodityid;
						ELSE
							SIGNAL SQLSTATE '45000'
							SET MESSAGE_TEXT = "Not enough stock to sell";
						END IF;
					ELSE
						SIGNAL SQLSTATE '45000'
						SET MESSAGE_TEXT = "Invalid action";
					END IF;
				ELSE
					SIGNAL SQLSTATE '45000'
					SET MESSAGE_TEXT = "Currency is not in this game";
				END IF;
			ELSE
				SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = "User not in game";
			END IF;
		ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = "The game has already finished";
		END IF;
	END; 
$$ DELIMITER ;

DROP VIEW VARIATIONS;
CREATE VIEW VARIATIONS AS SELECT gp.instanceid, gp.cash/g.initialCash*100-100 AS variation FROM gameparticipants gp INNER JOIN game g ON g.gameid=gp.gameid;

DELIMITER $$
CREATE PROCEDURE GET_USER_WINS(IN winuserid INT)
BEGIN
	DECLARE i INT;
	DECLARE num_rows INT;
    DECLARE actual_game INT;
    SET i = 1;
    SET num_rows = (SELECT count(*) FROM gameparticipants WHERE userid=winuserid);
    
    CREATE TEMPORARY TABLE wins SELECT * FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY variation DESC) AS position FROM VARIATIONS) AS B LIMIT 0;
    WHILE i <= num_rows DO
		SET actual_game = (SELECT gameid FROM (SELECT userid, gameid, ROW_NUMBER() OVER (ORDER BY gameid) AS position FROM gameparticipants WHERE userid=winuserid) AS B WHERE position=i);
        INSERT INTO wins SELECT * FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY variation DESC) AS position FROM VARIATIONS WHERE gameid=actual_game) AS B WHERE userid=winuserid;
        SET i = i + 1;
    END WHILE;
    SELECT * FROM wins;
    DROP TEMPORARY TABLE wins;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE DELETE_USER(IN deluserid INT)
BEGIN
	DECLARE delteamid INT;
	IF (SELECT team FROM user WHERE userid=deluserid) = 1 THEN
		SET delteamid = (SELECT teamid WHERE userid=deluserid);
        DELETE FROM teamparticipants WHERE teamid=delteamid;
        DELETE FROM teaminvitations WHERE teamid=delteamid;
		DELETE FROM team WHERE userid=deluserid;
    ELSE
		DELETE FROM teamparticipants WHERE userid=deluserid;
        DELETE FROM teaminvitations WHERE userid=deluserid;
		DELETE FROM basicuser WHERE userid=deluserid;
    END IF;
    DELETE FROM transaction WHERE userid=deluserid;
    DELETE FROM currencytransaction WHERE userid=deluserid;
    DELETE FROM commoditytransaction WHERE userid=deluserid;
    DELETE FROM sharestock WHERE instanceid IN (SELECT instaneid FROM gameparticipants WHERE userid=deluserid);
    DELETE FROM currencystock WHERE instanceid IN (SELECT instaneid FROM gameparticipants WHERE userid=deluserid);
    DELETE FROM commoditystock WHERE instanceid IN (SELECT instaneid FROM gameparticipants WHERE userid=deluserid);
    DELETE FROM gameparticipants WHERE userid=deluserid;
    DELETE FROM user WHERE userid=deluserid;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS CREATE_TEAM_INVITATION;
DELIMITER $$
CREATE PROCEDURE CREATE_TEAM_INVITATION(IN invteamuserid INT, IN invusername VARCHAR(45))
BEGIN
	DECLARE invuserid INT;
    DECLARE invteamid INT;
    SET invuserid=(SELECT userid FROM basicuser WHERE username=invusername);
    SET invteamid=(SELECT teamid FROM team WHERE userid=invteamuserid);
    IF (SELECT team FROM user WHERE userid=invuserid)=0 THEN
		IF (SELECT team FROM user WHERE userid=invteamuserid)=1 AND invteamid IS NOT NULL THEN
			IF (SELECT userid FROM teaminvitations WHERE userid=invuserid AND teamid=invteamid) IS NULL THEN
				IF (SELECT userid FROM teamparticipants WHERE userid=invuserid AND teamid=invteamid) IS NULL THEN
					INSERT INTO teaminvitations (teamid, userid) VALUES (invteamid, invuserid);
				ELSE
					SIGNAL SQLSTATE '45000'
					SET MESSAGE_TEXT = "User already in team";
				END IF;
			ELSE
				SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = "User already invited";
			END IF;
		ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = "Invitations can be only created from a team";
		END IF;
	ELSE
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = "Invited user is a team";
	END IF;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS ACCEPT_TEAM_INVITATION;
DELIMITER $$
CREATE PROCEDURE ACCEPT_TEAM_INVITATION(IN invteamid INT, IN invuserid INT)
BEGIN
	IF (SELECT team FROM user WHERE userid=invuserid)=0 THEN
		IF (SELECT userid FROM teaminvitations WHERE userid=invuserid AND teamid=invteamid) THEN
			IF (SELECT userid FROM teamparticipants WHERE userid=invuserid AND teamid=invteamid) IS NULL THEN
				INSERT INTO teamparticipants (teamid, userid) VALUES (invteamid, invuserid);
                DELETE FROM teaminvitations WHERE userid=invuserid AND teamid=invteamid;
			ELSE
				DELETE FROM teaminvitations WHERE userid=invuserid AND teamid=invteamid;
				SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = "User already in team";
			END IF;
		ELSE
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = "User not invited";
		END IF;
	ELSE
		DELETE FROM teaminvitations WHERE userid=invuserid;
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = "User invited is a team";
	END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER ADD_PARTICIPANTS
	AFTER INSERT ON gameparticipants
    FOR EACH ROW
    BEGIN
		IF EXISTS (SELECT * FROM gameparticipants WHERE userid=NEW.userid AND gameid=NEW.gameid) THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = "User already in team";
		END IF;
	END  $$
DELIMITER ;

CALL GET_USER(3);
SELECT *, ROW_NUMBER() OVER (ORDER BY variation DESC) AS position FROM VARIATIONS WHERE gameid=4;

SELECT * FROM user u NATURAL JOIN team t;

SELECT g.* FROM game g INNER JOIN gameparticipants gp ON g.gameid=gp.gameid AND gp.userid=1;

SELECT * FROM VARIATIONS;

SELECT s.* FROM share s INNER JOIN shareingame sg ON s.code=sg.sharecode AND sg.gameid=2 INNER JOIN gameparticipants gp ON gp.gameid=sg.gameid AND gp.userid=1;

INSERT INTO teaminvitations (teamid, userid) VALUES (1, (SELECT userid ));

SELECT u.userid, u.name, u.username, u.image FROM user u INNER JOIN teamparticipants tp ON u.userid=tp.userid AND tp.teamid=3;

SELECT * FROM (SELECT u.userid, u.name, u.image, u.team, u.publicprofile, t.creatorid, bu.username FROM user u LEFT JOIN team t ON u.userid=t.userid LEFT JOIN basicuser bu ON u.userid=bu.userid) b WHERE userid=1 AND publicprofile=1;