const mongoose = require('mongoose');
const {User} = require('../models'); // Adjust the path if needed
const bcrypt = require('bcryptjs');
const { ROLES } = require('../utils/constants'); // Ensure that ROLES is defined in the constants
const { dbUri } = require("../config/env");

// Connect to the MongoDB database
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Error connecting to database:', err));

async function createAdminAccount() {
  const adminData = {
    username: 'admin',  
    email: 'admin@example.com', 
    firstName: 'Admin',  
    lastName: 'User', 
    phoneNumber: '1234567890', 
    password: 'adminPassword123',
    role: ROLES.ADMIN,
  };

  try {
    // Check if the admin already exists
    const existingAdmin = await User.findOne({ role: ROLES.ADMIN });
    if (existingAdmin) {
      console.log('Admin account already exists.');
      return;
    }

    // Create the admin account
    const newAdmin = new User(adminData);
    await newAdmin.save();
    console.log('Admin account created successfully.');
  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdminAccount();
