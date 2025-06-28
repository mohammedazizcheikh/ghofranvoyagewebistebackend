const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    Id: { type: Number },
    Star: {
      type: Number,
      default : null,
    },
    Title: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model("Category", categorySchema);
