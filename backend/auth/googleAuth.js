const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config(); // ✅ Load environment variables

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // ✅ Redirect URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails, photos } = profile;
        const userEmail = emails[0].value;

        // 🔥 Check if the user exists
        let currentUser = await User.findOne({ email: userEmail });

        if (!currentUser) {
          // 🛠️ Create a new user if they don't exist
          currentUser = new User({
            googleId: id,
            name: displayName,
            email: userEmail,
            profilePic: photos[0].value,
            roomsJoined: [],
            roomsCreated: [],
          });

          await currentUser.save();
        }

        // 🚀 Determine user role based on rooms created
        const role = currentUser.roomsCreated.length > 0 ? "host" : "user";

        // ✅ Generate JWT token
        const token = jwt.sign(
          { id: currentUser._id, email: currentUser.email, role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        done(null, { user: currentUser, token });
      } catch (error) {
        console.error("🔥 Error during authentication:", error);
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;   // ✅ Export the configured Passport instance
