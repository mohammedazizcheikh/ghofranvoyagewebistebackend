const User = require("./UserModel");
const Trip = require("./TripModel");
const Omra = require("./OmraModel");
const Booking = require("./BookingModel");
const VipOmra = require("./VipOmraModel");
const Transfer = require("./TransferModel");
const Banner = require("./BannerModel");
const Ferry = require("./FerryModel");
const Flight = require("./FlightModel");
const HotelBookingModel = require("./HotelBookingModel");

//partner
const Tag = require("./partnerAPI/Tag")
const City = require("./partnerAPI/City");
const Category = require("./partnerAPI/Category");
module.exports = {
  User,
  Trip,
  Omra,
  Booking,
  VipOmra,
  Transfer,
  City,
  Banner,
  Tag,
  Category,
  Ferry,
  Flight,
  HotelBookingModel
};
