var express = require("express");
var router = express.Router();
const passport = require("passport");
require("dotenv").config();
// ----------------------------
const CLIENT_URL = `${process.env.CLIENT_URL}/user`;
// ----------------------------
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
    });
    // console.log(req.user);
  }
});
// ----------------------------
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});
// ----------------------------
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      //? Handle any errors that may occur during logout
      console.error(err);
      //? Send an error response if needed
      return res.status(500).json({ error: "Failed to logout" });
    }
    //? Redirect to the desired URL after successful logout
    res.redirect(process.env.CLIENT_URL);
  });
});

// ----------------------------
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);
// ----------------------------
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
// ----------------------------
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["profile"],
  })
);
// ----------------------------
router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
// ----------------------------
module.exports = router;
// ----------------------------
