-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema marketgame
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema marketgame
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `marketgame` DEFAULT CHARACTER SET utf8 ;
USE `marketgame` ;

-- -----------------------------------------------------
-- Table `marketgame`.`game`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`game` (
  `gameid` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `startDate` DATE NOT NULL,
  `finishDate` DATE NULL,
  `finished` TINYINT(1) NOT NULL DEFAULT 0,
  `initialCash` DECIMAL(9,2) NOT NULL,
  PRIMARY KEY (`gameid`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `gameid_UNIQUE` ON `marketgame`.`game` (`gameid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`user` (
  `userid` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `image` VARCHAR(45) NULL,
  `team` TINYINT(1) NOT NULL DEFAULT 0,
  `publicprofile` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`userid`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `userid_UNIQUE` ON `marketgame`.`user` (`userid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`basicUser`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`basicUser` (
  `userid` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `dni` INT NOT NULL,
  `admin` TINYINT(1) NOT NULL DEFAULT 0,
  `password` VARCHAR(60) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`username`),
  CONSTRAINT `bUser_user_idx`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `bUser_user` ON `marketgame`.`basicUser` (`userid` ASC) VISIBLE;

CREATE UNIQUE INDEX `userid_UNIQUE` ON `marketgame`.`basicUser` (`userid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`team`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`team` (
  `teamid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `creatorid` INT NOT NULL,
  PRIMARY KEY (`teamid`),
  CONSTRAINT `team_creator`
    FOREIGN KEY (`creatorid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `team_userid`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `team_creator_idx` ON `marketgame`.`team` (`creatorid` ASC) VISIBLE;

CREATE INDEX `team_userid_idx` ON `marketgame`.`team` (`userid` ASC) VISIBLE;

CREATE UNIQUE INDEX `teamid_UNIQUE` ON `marketgame`.`team` (`teamid` ASC) VISIBLE;

CREATE UNIQUE INDEX `userid_UNIQUE` ON `marketgame`.`team` (`userid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`share`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`share` (
  `code` VARCHAR(10) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `quotation` DECIMAL(9,2) NOT NULL DEFAULT 0,
  `automatized` TINYINT(1) NOT NULL DEFAULT 1,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'ars',
  `image` VARCHAR(45) NULL,
  PRIMARY KEY (`code`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `code_UNIQUE` ON `marketgame`.`share` (`code` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`shareInGame`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`shareInGame` (
  `sharecode` VARCHAR(10) NOT NULL,
  `gameid` INT NOT NULL,
  CONSTRAINT `share_game_sharecode`
    FOREIGN KEY (`sharecode`)
    REFERENCES `marketgame`.`share` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `share_game_gameid`
    FOREIGN KEY (`gameid`)
    REFERENCES `marketgame`.`game` (`gameid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `share_game_sharecode_idx` ON `marketgame`.`shareInGame` (`sharecode` ASC) VISIBLE;

CREATE INDEX `share_game_gameid_idx` ON `marketgame`.`shareInGame` (`gameid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`currency`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`currency` (
  `code` VARCHAR(4) NOT NULL,
  `quotation` DECIMAL(9,2) NOT NULL DEFAULT 0,
  `image` VARCHAR(45) NULL,
  `automatized` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`code`))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `code_UNIQUE` ON `marketgame`.`currency` (`code` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`currencyInGame`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`currencyInGame` (
  `currencycode` VARCHAR(4) NOT NULL,
  `gameid` INT NOT NULL,
  CONSTRAINT `curr_game_currcode`
    FOREIGN KEY (`currencycode`)
    REFERENCES `marketgame`.`currency` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `curr_game_game`
    FOREIGN KEY (`gameid`)
    REFERENCES `marketgame`.`game` (`gameid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `curr_game_currcode_idx` ON `marketgame`.`currencyInGame` (`currencycode` ASC) VISIBLE;

CREATE INDEX `curr_game_game_idx` ON `marketgame`.`currencyInGame` (`gameid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`transaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`transaction` (
  `transid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `gameid` INT NOT NULL,
  `sharecode` VARCHAR(10) NOT NULL,
  `date` DATETIME NOT NULL,
  `quotation` DECIMAL(9,2) NOT NULL DEFAULT 0,
  `action` VARCHAR(4) NOT NULL DEFAULT 'buy',
  `currencycode` VARCHAR(3) NOT NULL DEFAULT 'ARS',
  `amount` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`transid`),
  CONSTRAINT `trans_user`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `trans_share`
    FOREIGN KEY (`sharecode`)
    REFERENCES `marketgame`.`shareInGame` (`sharecode`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `trans_game`
    FOREIGN KEY (`gameid`)
    REFERENCES `marketgame`.`game` (`gameid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `trans_currency`
    FOREIGN KEY (`currencycode`)
    REFERENCES `marketgame`.`currencyInGame` (`currencycode`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `trans_user_idx` ON `marketgame`.`transaction` (`userid` ASC) VISIBLE;

CREATE INDEX `trans_game_idx` ON `marketgame`.`transaction` (`gameid` ASC) VISIBLE;

CREATE INDEX `trans_currency_idx` ON `marketgame`.`transaction` (`currencycode` ASC) VISIBLE;

CREATE INDEX `trans_share_idx` ON `marketgame`.`transaction` (`sharecode` ASC) VISIBLE;

CREATE UNIQUE INDEX `transid_UNIQUE` ON `marketgame`.`transaction` (`transid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`gameParticipants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`gameParticipants` (
  `instanceid` INT NOT NULL AUTO_INCREMENT,
  `gameid` INT NOT NULL,
  `userid` INT NOT NULL,
  `cash` DECIMAL(9,2) NOT NULL,
  PRIMARY KEY (`instanceid`),
  CONSTRAINT `g_part_game`
    FOREIGN KEY (`gameid`)
    REFERENCES `marketgame`.`game` (`gameid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `g_part_user`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `g_part_game_idx` ON `marketgame`.`gameParticipants` (`gameid` ASC) VISIBLE;

CREATE INDEX `g_part_user_idx` ON `marketgame`.`gameParticipants` (`userid` ASC) VISIBLE;

CREATE UNIQUE INDEX `instanceid_UNIQUE` ON `marketgame`.`gameParticipants` (`instanceid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`teamParticipants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`teamParticipants` (
  `teamid` INT NOT NULL,
  `userid` INT NOT NULL,
  CONSTRAINT `t_part_team`
    FOREIGN KEY (`teamid`)
    REFERENCES `marketgame`.`team` (`teamid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `t_part_user`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `t_part_team_idx` ON `marketgame`.`teamParticipants` (`teamid` ASC) INVISIBLE;

CREATE INDEX `t_part_user_idx` ON `marketgame`.`teamParticipants` (`userid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`shareStock`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`shareStock` (
  `instanceid` INT NOT NULL,
  `sharecode` VARCHAR(10) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  CONSTRAINT `share_stock_instance`
    FOREIGN KEY (`instanceid`)
    REFERENCES `marketgame`.`gameParticipants` (`instanceid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `share_stock_sharecode`
    FOREIGN KEY (`sharecode`)
    REFERENCES `marketgame`.`shareInGame` (`sharecode`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `share_stock_instance_idx` ON `marketgame`.`shareStock` (`instanceid` ASC) VISIBLE;

CREATE INDEX `share_stock_sharecode_idx` ON `marketgame`.`shareStock` (`sharecode` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`currencyStock`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`currencyStock` (
  `instanceid` INT NOT NULL,
  `currencycode` VARCHAR(4) NOT NULL,
  `stock` DECIMAL(9,2) NOT NULL,
  CONSTRAINT `curr_stock_instance`
    FOREIGN KEY (`instanceid`)
    REFERENCES `marketgame`.`gameParticipants` (`instanceid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `curr_stock_currency`
    FOREIGN KEY (`currencycode`)
    REFERENCES `marketgame`.`currencyInGame` (`currencycode`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `curr_stock_instance_idx` ON `marketgame`.`currencyStock` (`instanceid` ASC) VISIBLE;

CREATE INDEX `curr_stock_currency_idx` ON `marketgame`.`currencyStock` (`currencycode` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`currencyTransaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`currencyTransaction` (
  `currtransid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `gameid` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `quotation` DECIMAL(9,2) NOT NULL,
  `action` VARCHAR(4) NOT NULL DEFAULT 'buy',
  `currencycode` VARCHAR(4) NOT NULL,
  `amount` DECIMAL(9,2) NOT NULL,
  PRIMARY KEY (`currtransid`),
  CONSTRAINT `curr_trans_userid`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `curr_trans_gameid`
    FOREIGN KEY (`gameid`)
    REFERENCES `marketgame`.`game` (`gameid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `curr_trans_currcode`
    FOREIGN KEY (`currencycode`)
    REFERENCES `marketgame`.`currencyInGame` (`currencycode`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `curr_trans_userid_idx` ON `marketgame`.`currencyTransaction` (`userid` ASC) VISIBLE;

CREATE INDEX `curr_trans_gameid_idx` ON `marketgame`.`currencyTransaction` (`gameid` ASC) VISIBLE;

CREATE INDEX `curr_trans_currcode_idx` ON `marketgame`.`currencyTransaction` (`currencycode` ASC) VISIBLE;

CREATE UNIQUE INDEX `currtransid_UNIQUE` ON `marketgame`.`currencyTransaction` (`currtransid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`teamInvitations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`teamInvitations` (
  `teamid` INT NOT NULL,
  `userid` INT NOT NULL,
  CONSTRAINT `teaminv_team`
    FOREIGN KEY (`teamid`)
    REFERENCES `marketgame`.`team` (`teamid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `teaminv_user`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`basicUser` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `teaminv_team_idx` ON `marketgame`.`teamInvitations` (`teamid` ASC) VISIBLE;

CREATE INDEX `teaminv_user_idx` ON `marketgame`.`teamInvitations` (`userid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`historicalShare`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`historicalShare` (
  `sharecode` VARCHAR(10) NOT NULL,
  `date` DATETIME NOT NULL,
  `quotation` DECIMAL(9,2) NOT NULL,
  CONSTRAINT `hisshare_share`
    FOREIGN KEY (`sharecode`)
    REFERENCES `marketgame`.`share` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `hisshare_share_idx` ON `marketgame`.`historicalShare` (`sharecode` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

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

CREATE VIEW VARIATIONS AS SELECT gp.gameid, gp.userid, gp.cash/g.initialCash*100-100 AS variation FROM gameparticipants gp INNER JOIN game g ON g.gameid=gp.gameid;

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
	IF (SELECT team FROM user WHERE userid=deluserid) = 1 THEN
		DELETE FROM team WHERE userid=deluserid;
        DELETE FROM user WHERE userid=deluserid;
    ELSE
		DELETE FROM basicuser WHERE userid=deluserid;
        DELETE FROM user WHERE userid=deluserid;
    END IF;
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