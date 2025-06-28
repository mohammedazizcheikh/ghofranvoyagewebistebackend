const mongoose = require("mongoose");
const bookingReferencePlugin = require("../utils/bookingReference"); 
const {
  BOOKING_STATUS,
} = require("../utils/constants");


const VipOmraSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    departureCity: {
      type: String,
      required: true,
    },
    travelers: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    hotelPreference: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    bookingReference: { type: String, unique: true },

  },
  {
    timestamps: true,
  }
);

VipOmraSchema.plugin(bookingReferencePlugin, { prefix: "REQ-VIP-" });

const VipOmra = mongoose.model("VipOmra", VipOmraSchema);
module.exports = VipOmra;
