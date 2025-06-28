const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    star: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: countrySchema,
  },
  { timestamps: true }
);

const facilitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const localizationSchema = new mongoose.Schema(
  {
    longitude: String,
    latitude: String,
  },
  { timestamps: true }
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: categorySchema,
    city: citySchema,
    address: {
      type: String,
      required: true,
    },
    localization: localizationSchema,
    image: String,
    facilities: [facilitySchema],
    theme: [String],
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
