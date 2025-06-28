const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookingReferencePlugin = require("../utils/bookingReference");
const { BOOKING_STATUS, PAYMENT_STATUS  } = require("../utils/constants");

// Schema for individual traveler
const TravelerSchema = new Schema({
  type: {
    type: String,
    enum: ["adult", "child", "infant1-2", "infant<1", "senior"],
    required: true,
  },
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
  dob: {
    type: Date,
    required: true,
  },
  passport: {
    type: String,
    required: function () {
      return (
        this.type === "adult" || this.type === "child" || this.type === "senior"
      );
    },
  },
});

// Schema for contact information
const ContactInfoSchema = new Schema({
  title: {
    type: String,
    enum: ["mr", "mrs", "ms", "dr"],
    default: "mr",
  },
  forename: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  telephone: {
    type: String,
    required: true,
    trim: true,
  },
});

// Main ferry booking schema
const FerryBookingSchema = new Schema(
  {
    crossingType: {
      type: String,
      enum: ["one-way", "round-trip", "open-return"],
      required: true,
    },
    departureDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: function () {
        return this.crossingType === "round-trip";
      },
    },
    departurePort: {
      type: String,
      required: true,
      trim: true,
    },
    arrivalPort: {
      type: String,
      required: true,
      trim: true,
    },
    cabinType: {
      type: String,
      enum: ["inside", "outside", "deluxe", "suite", "none"],
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["none", "car", "suv", "van", "motorcycle", "other"],
      default: "none",
    },
    contactInfo: {
      type: ContactInfoSchema,
      required: true,
    },
    travellers: {
      type: [TravelerSchema],
      validate: {
        validator: function (travellers) {
          // Ensure at least one adult traveler
          return travellers.some((traveller) => traveller.type === "adult");
        },
        message: "At least one adult traveler is required",
      },
    },
    observations: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
    bookingReference: {
      type: String,
      unique: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Generate a unique booking reference before saving
FerryBookingSchema.plugin(bookingReferencePlugin, { prefix: "REQ-FER-" });

const Ferry = mongoose.model("FerryBooking", FerryBookingSchema);
module.exports = Ferry;
