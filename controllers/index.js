const authController = require("./authController");
const tripController = require("./tripController");
const omraController = require("./omraController");
const bookingController = require("./bookingController");
const vipOmraController = require("./vipOmraController");
const transferController = require("./transferController");
const bannerController = require("./bannerController");
const ferryController = require("./ferryController");
const flightController = require("./flightController");
const hotelBookingController = require("./hotelBookingController");
//stat
const statisticsController = require("./statisticController")

// partner
const categoryController = require('./categoyController')
const cityController = require("./cityController");
const tagController = require("./tagController");


module.exports = {
  authController,
  tripController,
  omraController,
  transferController,
  bookingController,
  vipOmraController,
  cityController,
  bannerController,
  tagController,
  categoryController,
  ferryController,
  flightController,
  hotelBookingController,
  statisticsController
};
