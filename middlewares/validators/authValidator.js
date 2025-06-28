const { check, validationResult } = require("express-validator");
const { sendErrorResponse } = require("../../utils/response");

const validateRegister = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  check("email").isEmail().withMessage("Valid email is required"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      }));
      return sendErrorResponse(res, "Validation failed", 400, {
        errors: formattedErrors,
      });
    }
    next();
  },
];

const validateLogin = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      }));
      return sendErrorResponse(res, "Validation failed", 400, {
        errors: formattedErrors,
      });
    }
    next();
  },
];

const validateRequestPasswordReset = [
  check("email").isEmail().withMessage("Valid email is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      }));
      return sendErrorResponse(res, "Validation failed", 400, {
        errors: formattedErrors,
      });
    }
    next();
  },
];

const validateResetPassword = [
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      }));
      return sendErrorResponse(res, "Validation failed", 400, {
        errors: formattedErrors,
      });
    }
    next();
  },
];

const validateVerifyEmail = [
  check("token").notEmpty().withMessage("Token is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      }));
      return sendErrorResponse(res, "Validation failed", 400, {
        errors: formattedErrors,
      });
    }
    next();
  },
];

const validateCheckUsername = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      }));
      return sendErrorResponse(res, "Validation failed", 400, {
        errors: formattedErrors,
      });
    }
    next();
  },
];

const validateCheckEmail = [
  check("email").isEmail().withMessage("Valid email is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      }));
      return sendErrorResponse(res, "Validation failed", 400, {
        errors: formattedErrors,
      });
    }
    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
  validateRequestPasswordReset,
  validateResetPassword,
  validateVerifyEmail,
  validateCheckUsername,
  validateCheckEmail,
};
