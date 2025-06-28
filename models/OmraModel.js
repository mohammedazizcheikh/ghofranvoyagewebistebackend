const mongoose = require("mongoose");
const {
  SERVICE_STATUS, OMRA_PACKAGE_TYPE,
} = require("../utils/constants");

const OmraSchema = new mongoose.Schema(
  {
    packageName: { type: String, required: true },
    packageType: {
      type: String,
      enum: Object.values(OMRA_PACKAGE_TYPE),
      lowercase: true,
    },
    description: { type: String, required: true },
    departureCity: { type: String, required: true },
    destination: { type: String, default: "Mecca" },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    tax : { type: Number, default: 0 },
    packageHighlights: [String],
    hotel: { type: String },
    transport: { type: String },
    accommodationDetails: { type: String },
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
      },
    ],
    includedServices: [String],
    excludedServices: [String],
    mealsIncluded: { type: Boolean, default: false },
    visaIncluded: { type: Boolean, default: false },
    guideAvailable: { type: Boolean, default: true },
    departureOptions: {
      type: String,
      enum: ["go_only", "go_and_back"],
      required: true,
    },
    images: [String],
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(SERVICE_STATUS),
      default: SERVICE_STATUS.ACTIVE,
    },
    bookingConstraints: {
      minBookingDays: { type: Number, default: 3 },
      cancellationPolicy: { type: String, default: "Flexible" },
    },   
  },
  { timestamps: true }
);

const Omra = mongoose.model("Omra", OmraSchema);
module.exports = Omra;
