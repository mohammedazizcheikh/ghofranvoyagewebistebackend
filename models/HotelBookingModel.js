const mongoose = require("mongoose");
const bookingReferencePlugin = require("../utils/bookingReference");
const { BOOKING_STATUS } = require("../utils/constants");
const cancellationPolicySchema = new mongoose.Schema(
  {
    Fees: { type: String, required: true },
    Type: { type: String, required: true },
    Nature: { type: String, required: true },
    FromDate: { type: String },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    Id: { type: Number, required: true },
    Name: { type: String, required: true },
    Photo: { type: String, default: null },
    Description: { type: String },
    Icones: { type: [String], default: [] },
    Quantity: { type: Number, required: true },
    Price: { type: String, required: true },
    BasePrice: { type: String },
    StopReservation: { type: Boolean, default: false },
    OnRequest: { type: Boolean, default: false },
    CancellationPolicy: [cancellationPolicySchema],
  },
  { _id: false }
);

const guestInfoSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, default: "child" },
    phone: { type: String, default: "child"   },
    specialRequests: { type: String },
  },
  { _id: false }
);

const hotelBookingSchema = new mongoose.Schema(
  {
    hotel: { type: String, required: true },
    hotelId: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    rooms: {
      type: Map,
      of: roomSchema,
      required: true,
    },

    boardingType: { type: String, required: true },

    bookingInfo: {
      mainGuest: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String },
        city: { type: String },
        country: { type: String },
        postalCode: { type: String },
      },
      roomGuests: {
        type: Map,
        of: [guestInfoSchema],
        required: true,
      },
      specialRequests: { type: String },
      acceptTerms: { type: Boolean, required: true },
    },
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    bookingReference: { type: String, unique: true },
  },
  { timestamps: true }
);

hotelBookingSchema.plugin(bookingReferencePlugin, { prefix: "BK-H-" });
//persave calculate price
hotelBookingSchema.pre("save", function (next) {
  let total = 0;

  if (this.rooms && this.rooms.size > 0) {
    this.rooms.forEach((room) => {
      const price = parseFloat(room.Price);
      if (!isNaN(price)) {
        total += price;
      }
    });
  }

  this.totalAmount = total;
  next();
});

const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);

module.exports = HotelBooking;
