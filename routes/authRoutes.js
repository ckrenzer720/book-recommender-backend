const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  register,
  login,
  verifyEmail,
  getCurrentUser,
} = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validators");
const { authLimiter } = require("../middleware/rateLimiter");
const { validate } = require("express-validator");

// Apply rate limiting to auth routes
router.use(authLimiter);

// Public routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.post("/verify", verifyEmail);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

module.exports = router;
