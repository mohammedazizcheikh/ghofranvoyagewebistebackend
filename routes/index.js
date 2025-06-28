const express = require('express');
const router = express.Router();


//auth 
router.use('/auth', require('./authRoutes'));

//base
router.use('/trips', require('./tripRoutes'));
router.use('/omra', require('./omraRoutes'));
router.use('/vip-omra', require('./vipOmraRoutes'));
router.use('/banner', require('./bannerRoutes'));

//dashboard stat
router.use('/stat', require("./statisticRoutes"))

//booking and requests
router.use('/transfer', require('./transferRoutes'));
router.use('/flight', require('./flightRoutes'))
router.use('/ferry', require('./ferryRoutes'))
router.use("/bk-service", require("./bookingRoutes"));
router.use("/bk-hotels", require("./hotelBookingRouter"));

//base on partner api
router.use('/category', require('./categoryRoutes'))
router.use('/city', require('./cityRouter'))
router.use('/tag', require('./TagRouter'))

//sync
router.use('/partner-sync', require('./partnerAPI/static'))




module.exports = router;
