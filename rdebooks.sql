-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2017 at 04:19 AM
-- Server version: 10.1.19-MariaDB
-- PHP Version: 5.5.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rdebooks`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `Title` varchar(255) NOT NULL,
  `Author` text NOT NULL,
  `Path` varchar(75) NOT NULL,
  `AvgRating` decimal(2,1) NOT NULL,
  `RatingSum` int(4) NOT NULL,
  `Ratings` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`Title`, `Author`, `Path`, `AvgRating`, `RatingSum`, `Ratings`) VALUES
('Alice''s Adventures in Wonderland', 'Lewis Carroll', './Books/11-0.txt', '0.0', 0, 0),
('Dracula', 'Bram Stoker', './Books/pg345.txt', '0.0', 0, 0),
('Frankenstein', 'Mary Wollstonecraft (Godwin) Shelley', './Books/pg84.txt', '0.0', 0, 0),
('Grimms'' Fairy Tales', 'The Brothers Grimm', './Books/2591-0.txt', '0.0', 0, 0),
('The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', './Books/pg1661.txt', '0.0', 0, 0),
('The Iliad of Homer', 'Homer', './Books/pg6130.txt', '0.0', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `userbookinfo`
--

CREATE TABLE `userbookinfo` (
  `username` varchar(25) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `CurrentPage` int(5) NOT NULL DEFAULT '1',
  `Rated` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(25) NOT NULL,
  `password` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`Title`),
  ADD UNIQUE KEY `Path` (`Path`),
  ADD UNIQUE KEY `Title` (`Title`);

--
-- Indexes for table `userbookinfo`
--
ALTER TABLE `userbookinfo`
  ADD PRIMARY KEY (`username`,`Title`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
