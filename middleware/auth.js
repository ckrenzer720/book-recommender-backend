const jwt = require("jsonwebtoken");
const db = require("../knexfile");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    try {
      // Verify user still exists in database
      const dbUser = await db("users").where("user_id", user.user_id).first();
      if (!dbUser) {
        return res.status(403).json({ error: "User no longer exists" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Database error during authentication:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

const checkVerified = async (req, res, next) => {
  try {
    const user = await db("users").where("user_id", req.user.user_id).first();
    if (!user.is_verified) {
      return res.status(403).json({ error: "Email not verified" });
    }
    next();
  } catch (error) {
    console.error("Error checking verification status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  authenticateToken,
  checkVerified,
};
