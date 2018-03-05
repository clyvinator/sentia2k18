CREATE TABLE IF NOT EXISTS `ACL` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `AccessToken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `scopes` text,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Event` (
  `eventID` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `eventName` varchar(150) CHARACTER SET utf8 DEFAULT NULL,
  `dayNum` int(1) NOT NULL,
  PRIMARY KEY (`eventID`),
  UNIQUE KEY `EventID` (`eventID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Participant` (
  `participantID` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` varchar(10) NOT NULL,
  `usn` varchar(10) NOT NULL,
  `college` varchar(150) NOT NULL,
  PRIMARY KEY (`participantID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Participant_Event` (
  `participantID` int(20) NOT NULL,
  `eventID` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `Role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `RoleMapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(255) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `principalId` (`principalId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `SentiaUser` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) NOT NULL,
  `mobile` varchar(512) NOT NULL,
  `college` varchar(512) NOT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `email` varchar(512) NOT NULL,
  `realm` varchar(512) DEFAULT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `sentia-general` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 DEFAULT NULL,
  `usn` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT 'Should always be unique',
  `mobileno` int(12) DEFAULT NULL,
  `email` varchar(30) NOT NULL,
  `event` varchar(150) CHARACTER SET utf8 DEFAULT NULL,
  `college` varchar(50) CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `USN` (`usn`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;



INSERT INTO `AccessToken` (`id`,`ttl`,`scopes`,`created`,`userId`) VALUES ('gh4wFmxIH67rmZx9K4lCgQdQATH74gRxmlDZbgJM1EYFsWfHInN9r8QtTOtemYiI',1209600,NULL,'2018-03-05 09:53:50.000',1);

INSERT INTO `Event` (`eventID`,`eventName`,`dayNum`) VALUES (1,'test_1',1);
INSERT INTO `Event` (`eventID`,`eventName`,`dayNum`) VALUES (2,'test_2',2);









INSERT INTO `SentiaUser` (`id`,`name`,`mobile`,`college`,`username`,`password`,`email`,`realm`,`emailVerified`,`verificationToken`) VALUES (1,'admin','9008930868','MITE',NULL,'$2a$10$H6z5IR4EqrCprPa9JcjM7e.C9h7SstQ/oPW3RH4IwPW..HJOc0l8i','admin@sentia.com',NULL,NULL,NULL);



INSERT INTO `sentia-general` (`id`,`name`,`usn`,`mobileno`,`email`,`event`,`college`) VALUES (1,'clyde shelton','4mt14cs032',2147483647,'admin@sentia.com','[\"test_1\",\"test\"]','MITE');
INSERT INTO `sentia-general` (`id`,`name`,`usn`,`mobileno`,`email`,`event`,`college`) VALUES (3,'abc','5767ayurfaff',123456789,'xyz@xyz.com',NULL,'MITE');