const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  getCollections,
  addToCollection,
  updateCollection,
  removeFromCollection,
} = require("../controllers/collectionController");
const { collectionValidation } = require("../middleware/validators");
const { validate } = require("express-validator");

// All collection routes require authentication
router.use(authenticateToken);

router.get("/", getCollections);
router.post("/", collectionValidation, validate, addToCollection);
router.put("/:id", collectionValidation, validate, updateCollection);
router.delete("/:id", removeFromCollection);

module.exports = router;
