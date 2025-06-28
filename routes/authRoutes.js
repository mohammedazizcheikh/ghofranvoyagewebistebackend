const express = require("express");
const router = express.Router();
const {authValidator} = require("../middlewares/validators")
const {authController} = require("../controllers/");
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/update-password',authMiddleware(), authController.updatePassword);
router.post('/login',authValidator.validateLogin, authController.login);
module.exports = router;
