-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2021 at 06:22 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `purchaseportal`
--

-- --------------------------------------------------------

--
-- Table structure for table `mas_product`
--

CREATE TABLE `mas_product` (
  `id` bigint(20) NOT NULL,
  `index_number` varchar(10) DEFAULT NULL,
  `product` varchar(150) DEFAULT NULL,
  `product_description` varchar(255) DEFAULT NULL,
  `product_quantity` int(11) DEFAULT NULL,
  `product_rate` float DEFAULT NULL,
  `product_image_path` varchar(255) DEFAULT NULL,
  `active_flag` tinyint(1) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `mas_product`
--

INSERT INTO `mas_product` (`id`, `index_number`, `product`, `product_description`, `product_quantity`, `product_rate`, `product_image_path`, `active_flag`) VALUES
(1, 'P123', 'TeddyBear', 'TeddyBear', 80, 100, 'product1_pinkteddy4.jpg', 1),
(2, 'P12345', 'Barbie', 'Barbie', 90, 150, 'product2_download (15).jpg', 1),
(3, 'P134567', 'Panda', 'Panda', 60, 200, 'product3_download (17).jpg', 1),
(4, 'P3456', 'Dog', 'Dog', 299, 300, 'product4_blackwatch.jpg', 127),
(5, 'P346', 'Dor1', 'Dog', 299, 300, 'product5_download (16).jpg', 127);

-- --------------------------------------------------------

--
-- Table structure for table `mas_user`
--

CREATE TABLE `mas_user` (
  `id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_password` varchar(200) DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  `active_flag` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mas_user`
--

INSERT INTO `mas_user` (`id`, `user_type`, `user_name`, `user_email`, `user_password`, `updated_on`, `active_flag`) VALUES
(1, 2, 'Saranya', 'caprillsweet6@gmail.com', '$2b$10$6tkw/2GwkfGmInmNfWiACedWP8tiALZVv0kbTShpnmXt4dqCz.8yy', '2021-01-08 09:54:45', 1),
(2, 1, 'Admin', 'Saraswathi2995@gmail.com', '$2b$10$N4mfDNgskietVABeIZZxT.3BBy7TyOSLYpKyvWZmjvTmWovUtHada', '2021-01-08 10:08:56', 1);

-- --------------------------------------------------------

--
-- Table structure for table `mas_user_type`
--

CREATE TABLE `mas_user_type` (
  `id` int(11) NOT NULL,
  `user_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mas_user_type`
--

INSERT INTO `mas_user_type` (`id`, `user_type`) VALUES
(1, 'Admin'),
(2, 'Customer');

-- --------------------------------------------------------

--
-- Table structure for table `trn_cart`
--

CREATE TABLE `trn_cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_on` datetime NOT NULL,
  `cart_status` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trn_cart`
--

INSERT INTO `trn_cart` (`id`, `user_id`, `created_on`, `cart_status`) VALUES
(1, 1, '2021-01-08 10:19:02', 0),
(2, 1, '2021-01-08 10:21:26', 0);

-- --------------------------------------------------------

--
-- Table structure for table `trn_cart_details`
--

CREATE TABLE `trn_cart_details` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_rate` float NOT NULL,
  `amount` float NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `modified_by` int(11) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trn_cart_details`
--

INSERT INTO `trn_cart_details` (`id`, `cart_id`, `product_id`, `quantity`, `unit_rate`, `amount`, `created_by`, `created_on`, `modified_by`, `modified_on`) VALUES
(1, 1, 1, 10, 20, 100, 1, '2021-01-08 10:19:02', NULL, NULL),
(2, 1, 2, 5, 20, 100, 1, '2021-01-08 10:19:02', NULL, NULL),
(3, 1, 3, 20, 20, 100, 1, '2021-01-08 10:19:02', NULL, NULL),
(4, 2, 1, 10, 20, 100, 1, '2021-01-08 10:21:26', NULL, NULL),
(5, 2, 2, 5, 20, 100, 1, '2021-01-08 10:21:26', NULL, NULL),
(6, 2, 3, 20, 20, 100, 1, '2021-01-08 10:21:26', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `trn_order`
--

CREATE TABLE `trn_order` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `total_amount` float NOT NULL,
  `order_date` datetime DEFAULT NULL,
  `payment_status` tinyint(1) DEFAULT NULL,
  `cancel_status` tinyint(1) DEFAULT 0,
  `cancel_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `modified_by` int(11) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trn_order`
--

INSERT INTO `trn_order` (`id`, `user_id`, `cart_id`, `total_amount`, `order_date`, `payment_status`, `cancel_status`, `cancel_date`, `created_by`, `created_on`, `modified_by`, `modified_on`) VALUES
(1, 1, 1, 300, '2021-01-08 10:21:11', 1, 0, NULL, 1, '2021-01-08 10:21:11', NULL, NULL),
(2, 1, 2, 300, '2021-01-08 10:21:47', 1, 1, '2021-01-08 10:22:03', 1, '2021-01-08 10:21:47', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mas_product`
--
ALTER TABLE `mas_product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mas_user`
--
ALTER TABLE `mas_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mas_user_type`
--
ALTER TABLE `mas_user_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trn_cart`
--
ALTER TABLE `trn_cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sh_patient_id` (`user_id`);

--
-- Indexes for table `trn_cart_details`
--
ALTER TABLE `trn_cart_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trn_sh_cart` (`cart_id`),
  ADD KEY `sh_product_id` (`product_id`);

--
-- Indexes for table `trn_order`
--
ALTER TABLE `trn_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sh_patient_id` (`user_id`),
  ADD KEY `sh_cart_id` (`cart_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mas_product`
--
ALTER TABLE `mas_product`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mas_user`
--
ALTER TABLE `mas_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mas_user_type`
--
ALTER TABLE `mas_user_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trn_cart`
--
ALTER TABLE `trn_cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trn_cart_details`
--
ALTER TABLE `trn_cart_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `trn_order`
--
ALTER TABLE `trn_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
