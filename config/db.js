const mongoose = require("mongoose");
const { database } = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
