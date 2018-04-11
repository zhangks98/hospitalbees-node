-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: applicationdatabase
-- ------------------------------------------------------
-- Server version	5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking` (
  `Booking_BookingID` int(11) NOT NULL AUTO_INCREMENT,
  `Booking_TID` varchar(45) DEFAULT NULL,
  `Booking_QueueStatus` enum('INACTIVE','ACTIVE','REACTIVATED','FINISHED','MISSED') NOT NULL,
  `Booking_BookingStatus` enum('PENDING','COMPLETED','ABSENT','CANCELLED') NOT NULL,
  `Booking_ETA` int(11) NOT NULL,
  `Booking_QueueNumber` varchar(45) DEFAULT NULL,
  `Booking_ReferencedQueueNumber` varchar(45) DEFAULT NULL,
  `User_UserID` int(11) NOT NULL,
  `Hospital_HospitalID` int(11) NOT NULL,
  PRIMARY KEY (`Booking_BookingID`,`User_UserID`,`Hospital_HospitalID`),
  UNIQUE KEY `idBooking_UNIQUE` (`Booking_BookingID`),
  KEY `fk_Booking_User_idx` (`User_UserID`),
  KEY `fk_Booking_Hospital1_idx` (`Hospital_HospitalID`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (1,'1234567890','FINISHED','ABSENT',0,'0001',NULL,1,1),(7,'112018-03-30 01:00:001234','FINISHED','ABSENT',0,'1234',NULL,1,1),(8,'222018-03-30 23:23:432020','INACTIVE','PENDING',0,'2020',NULL,2,2),(9,'112018-03-31 16:00:002020','FINISHED','ABSENT',0,'2020',NULL,1,1),(11,'00022018-03-3117:00:002021','FINISHED','ABSENT',0,'2021',NULL,1,2),(20,'00012018-03-02T17:00:000006','FINISHED','ABSENT',0,'0006','0002',1,1),(25,'00012018-03-02T17:00:000026','FINISHED','ABSENT',0,'0026','undefined',1,1),(26,'00012018-03-02T17:00:000030','FINISHED','ABSENT',0,'0030','undefined',3,1);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospital`
--

DROP TABLE IF EXISTS `hospital`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hospital` (
  `Hospital_HospitalID` int(11) NOT NULL AUTO_INCREMENT,
  `Hospital_Name` varchar(45) DEFAULT NULL,
  `Hospital_Address` varchar(45) DEFAULT NULL,
  `Hospital_StartingHours` time DEFAULT NULL,
  `Hospital_ClosingHours` time DEFAULT NULL,
  `Hospital_IPAddress` varchar(45) DEFAULT NULL,
  `Hospital_QueueTail` int(11) NOT NULL,
  `Hospital_Latitude` varchar(45) DEFAULT NULL,
  `Hospital_Longitude` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Hospital_HospitalID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospital`
--

LOCK TABLES `hospital` WRITE;
/*!40000 ALTER TABLE `hospital` DISABLE KEYS */;
INSERT INTO `hospital` VALUES (1,'Fullerton Health','36 Nanyang Avenue, #01-01/02, 639801','08:30:00','21:00:00','179.178.1.2',0,'1.345503000','103.682684500'),(2,'Ng Teng Fong General Hospital','1 Jurong East Street 21, Singapore 609606','00:00:00','23:59:59','133.122.3.4',0,'1.334030900','103.745111800'),(3,'Jurong Polyclinic','190 Jurong East Ave 1, Singapore 609788','08:00:00','16:30:00','144.133.6.5',0,'1.349792100','103.730619000');
/*!40000 ALTER TABLE `hospital` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `User_UserID` int(11) NOT NULL AUTO_INCREMENT,
  `User_NRIC` varchar(9) NOT NULL,
  `User_Name` varchar(45) DEFAULT NULL,
  `User_Password` varchar(45) NOT NULL,
  `User_BlockedStatus` tinyint(1) DEFAULT '0',
  `User_PhoneNumber` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`User_UserID`),
  UNIQUE KEY `NRIC_UNIQUE` (`User_NRIC`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'S0000001G','Yusuf Bin Ishak','ilovesingapore',0,'90908080'),(2,'12345','Sir Raffless','bbbb',0,'42576543'),(3,'a','Chong Yong Kim','ckckcabc',0,'77766689');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-11 18:10:03
