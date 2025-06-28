const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  Id: Number,
  Title: String,
});

module.exports = mongoose.model("Tag", TagSchema);
