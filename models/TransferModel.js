const mongoose = require("mongoose");
const bookingReferencePlugin = require("../utils/bookingReference"); 

const { BOOKING_STATUS, REGION } = require("../utils/constants");


const TransferSchema = new mongoose.Schema(
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
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    transferType: {
      type: String,
      required: true,
      enum: ["baggage", "family", "group", "other"],
    },
    region: {
      type: String,
      enum: Object.values(REGION),
      default : REGION.OTHER},
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    tripType: {
      type: String,
      required: true,
      enum: ["one-way", "round-trip"],
    },
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    dropoffAddress: {
      type: String,
      required: true,
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    specialRequests: {
      type: String,
      trim: true,
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
TransferSchema.plugin(bookingReferencePlugin, { prefix: "REQ-TR-" });


const Transfer = mongoose.model("Transfer", TransferSchema);
module.exports = Transfer;