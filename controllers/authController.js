const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { jwtConf } = require("../config/config");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");

const generateToken = (userId, secret, expiresIn) =>
  jwt.sign({ userId }, secret, { expiresIn });

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email, password);
    const user = await User.findOne({ email }).lean();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendErrorResponse(res, "Invalid email or password.", 400);
    }
    const accessToken = generateToken(user._id, jwtConf.secret, "15m");
    const refreshToken = generateToken(
      user._id,
      jwtConf.refreshSecret,
      jwtConf.expiresIn
    );

    await User.updateOne({ _id: user._id }, { refreshToken });

    sendSuccessResponse(res, {
      accessToken,
      refreshToken,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        id: user._id,
      },
    });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, "Login failed.", 500);
  }
};

// update password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return sendErrorResponse(res, "Invalid current password.", 401);
    }

    user.password = newPassword;
    await user.save(); // Only `password` is updated

    sendSuccessResponse(res, { message: "Password successfully updated." });
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, "Failed to update password.", 500);
  }
};


//auth me for auth check
exports.authMe = async (req, res) => {
  
};
