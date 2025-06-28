const mongoose = require("mongoose");
const { SERVICE_STATUS } = require("../utils/constants");


const TripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    tripType: {
      type: String,
      enum: ["cultural", "adventure", "beach"],
      required: true,
    },
    description: { type: String, required: true },
    transportType: {
      type: String,
      enum: ["flight", "bus", "train", "cruise"],
      required: true,
    },
    transport: { type: String },
    departureCity: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: Number, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date },
    departureOptions: {
      type: String,
      enum: ["go_only", "go_and_back"],
      required: true,
    },
    tax: { type: Number, default: 0 },

    includedServices: [String],
    excludedServices: [String],
    tripHighlights: [String],
    images: [String],
    price: { type: Number, required: true },
    maxParticipants: { type: Number, required: true },
    travelerType: {
      type: String,
      enum: ["adult", "child", "senior", "any"],
      required: true,
    },
    itinerary: [
      {
        day: { type: String, required: true },
        activities: [
          {
            activityName: { type: String, required: true },
            activityTime: { type: Date },
            description: { type: String },
            cost: { type: Number },
          },
        ],
        meals: { type: String },
        accommodation: { type: String },
      },
    ],
    status: {
      type: String,
      enum: Object.values(SERVICE_STATUS),
      default: SERVICE_STATUS.PENDING,
      
    },
    bookingConstraints :{
      minBookingDays: { type: Number, default: 3 },
      cancellationPolicy :{ type: String, default: "Flexible" }
    },
    accommodationDetails: { type: String },
    guideAvailable: { type: Boolean },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", TripSchema);
module.exports = Trip;
