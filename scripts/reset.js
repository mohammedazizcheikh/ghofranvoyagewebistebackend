const mongoose = require("mongoose");
const { User } = require("../models"); // Adjust the path if needed
const bcrypt = require("bcryptjs");
const { ROLES } = require("../utils/constants");
const { dbUri } = require("../config/env");
const passport = require("passport");

mongoose
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => {
    console.error("Error connecting to database:", err);
    process.exit(1);
  });

async function resetAdminAccount() {
  const adminEmail = "slimaTours@example.com";
  const adminPassword = "adminPasswordSlimaTours123";

  const adminData = {
    username: "admin",
    email: adminEmail,
    firstName: "Admin",
    lastName: "User",
    phoneNumber: "1234567890",
    role: ROLES.ADMIN,
  };

  try {
    const existingAdmin = await User.findOne({ role: ROLES.ADMIN });

    if (!existingAdmin) {
      // Admin does not exist, create a new one
      const newAdmin = new User({
        ...adminData,
        password: adminPassword,
      });
      await newAdmin.save();
      console.log("Admin account created successfully.");
    } else {
      // Admin exists – check for differences and update if necessary
      let shouldUpdate = false;

      for (const key of Object.keys(adminData)) {
        if (existingAdmin[key] !== adminData[key]) {
          existingAdmin[key] = adminData[key];
          shouldUpdate = true;
        }
      }

      const passwordMatch = await bcrypt.compare(
        adminPassword,
        existingAdmin.password
      );
      if (!passwordMatch) {
        existingAdmin.password = adminPassword;
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        await existingAdmin.save();
        console.log("Admin account reset/updated successfully.");
      } else {
        console.log("Admin account already up-to-date.");
      }
    }
  } catch (error) {
    console.error("Error resetting admin account:", error);
  } finally {
    mongoose.disconnect();
  }
}

resetAdminAccount();
