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


-- -----------------------------------------------------
-- Table `marketgame`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`user` (
  `userid` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `image` VARCHAR(45) NULL,
  `team` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`userid`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `marketgame`.`basicUser`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`basicUser` (
  `userid` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `dni` INT NOT NULL,
  `admin` TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT `bUser_user_idx`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `bUser_user` ON `marketgame`.`basicUser` (`userid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`team`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`team` (
  `teamid` INT NOT NULL AUTO_INCREMENT,
  `creatorid` INT NOT NULL,
  `userid` INT NOT NULL,
  PRIMARY KEY (`teamid`),
  CONSTRAINT `team_user`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `team_creator`
    FOREIGN KEY (`creatorid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `team_user_idx` ON `marketgame`.`team` (`userid` ASC) VISIBLE;

CREATE INDEX `team_creator_idx` ON `marketgame`.`team` (`creatorid` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `marketgame`.`share`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`share` (
  `code` VARCHAR(10) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `quotation` DECIMAL(9,2) NOT NULL DEFAULT 0,
  `automatized` TINYINT(1) NOT NULL DEFAULT 1,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'ars',
  PRIMARY KEY (`code`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `marketgame`.`transaction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `marketgame`.`transaction` (
  `transid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `gameid` INT NOT NULL,
  `sharecode` VARCHAR(10) NOT NULL,
  `date` DATE NOT NULL,
  `quotation` DECIMAL(9,2) NOT NULL DEFAULT 0,
  `action` VARCHAR(4) NOT NULL DEFAULT 'buy',
  `currency` VARCHAR(3) NOT NULL DEFAULT 'ars',
  `amount` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`transid`),
  CONSTRAINT `trans_user`
    FOREIGN KEY (`userid`)
    REFERENCES `marketgame`.`user` (`userid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `trans_share`
    FOREIGN KEY (`sharecode`)
    REFERENCES `marketgame`.`share` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `trans_game`
    FOREIGN KEY (`gameid`)
    REFERENCES `marketgame`.`game` (`gameid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `trans_user_idx` ON `marketgame`.`transaction` (`userid` ASC) VISIBLE;

CREATE INDEX `trans_share_idx` ON `marketgame`.`transaction` (`sharecode` ASC) VISIBLE;

CREATE INDEX `trans_game_idx` ON `marketgame`.`transaction` (`gameid` ASC) VISIBLE;


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
    REFERENCES `marketgame`.`share` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE INDEX `share_stock_instance_idx` ON `marketgame`.`shareStock` (`instanceid` ASC) VISIBLE;

CREATE INDEX `share_stock_sharecode_idx` ON `marketgame`.`shareStock` (`sharecode` ASC) VISIBLE;


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


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

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
