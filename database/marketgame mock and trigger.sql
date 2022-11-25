INSERT INTO game (title, startDate, initialCash) VALUES ('prueba', sysdate(), 100000);

INSERT INTO user (name, password) VALUES ('Nehuen Perez', 'sadjwoes');

INSERT INTO basicuser (userid, email, dni) VALUES (1, 'nehuen@prueba123.com', 20913821);

INSERT INTO gameparticipants (gameid, userid, cash) VALUES (1, 1, (
	SELECT initialCash FROM game WHERE gameid=1
));

INSERT INTO share (code, name, quotation, currency) VALUES ('YPF', 'YPF ARG', 2000, 'ARS');

INSERT INTO shareingame (gameid, sharecode) VALUES (1, 'YPF');

INSERT INTO transaction (userid, gameid, sharecode, date, quotation, action, currency, amount) VALUES 
	(1, 1, 'YPF', sysdate(), 
    (SELECT quotation FROM share WHERE code='YPF'),
    'sell',
    (SELECT currency FROM share WHERE code='YPF'),
    3
);

SELECT stock FROM sharestock WHERE instanceid=1 AND sharecode='YPF';

DROP TRIGGER IF EXISTS UPDATE_CASH;
DELIMITER $$
CREATE TRIGGER UPDATE_CASH
	AFTER INSERT ON transaction
	FOR EACH ROW
	BEGIN
		DECLARE actualinstance INT;
        DECLARE actualcash DECIMAL(9,2);
        DECLARE actualamount INT;
        SET actualinstance = (SELECT instanceid FROM gameparticipants WHERE gameid=NEW.gameid AND userid=NEW.userid);
        SET actualcash = (SELECT cash FROM gameparticipants WHERE gameid=NEW.gameid AND userid=NEW.userid);
        SET actualamount = (SELECT stock FROM sharestock WHERE instanceid=actualinstance AND sharecode=NEW.sharecode);
        
        IF NEW.sharecode IN (SELECT code FROM share s INNER JOIN shareingame sg ON s.code=sg.sharecode) THEN
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
			END IF;
        END IF;
	END; 
$$ DELIMITER ;
        