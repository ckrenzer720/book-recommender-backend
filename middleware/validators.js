const { body, param, query } = require("express-validator");

// Auth validation
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Book validation
const searchValidation = [
  query("query")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2 })
    .withMessage("Search query must be at least 2 characters long"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
];

const bookIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Book ID is required")
    .isLength({ min: 1 })
    .withMessage("Invalid book ID"),
];

// Collection validation
const collectionValidation = [
  body("book_id").trim().notEmpty().withMessage("Book ID is required"),
  body("status")
    .optional()
    .isIn(["wishlist", "reading", "read"])
    .withMessage("Status must be one of: wishlist, reading, read"),
];

// Review validation
const reviewValidation = [
  body("book_id").trim().notEmpty().withMessage("Book ID is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review_text")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Review text must not exceed 1000 characters"),
];

const reviewIdValidation = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Review ID is required")
    .isInt()
    .withMessage("Review ID must be an integer"),
];

module.exports = {
  registerValidation,
  loginValidation,
  searchValidation,
  bookIdValidation,
  collectionValidation,
  reviewValidation,
  reviewIdValidation,
};
