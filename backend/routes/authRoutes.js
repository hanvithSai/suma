const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user && req.user.token) {
      console.log("✅ Authenticated User:", req.user.user);
      console.log("✅ JWT Token:", req.user.token);

      res.json({
        message: "Authentication successful",
        token: req.user.token,
        user: req.user.user,
      });
    } else {
      console.log("❌ Authentication Failed");
      res.status(401).json({ message: "Authentication failed" });
    }
  }
);

module.exports = router;
