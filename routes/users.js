const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/saveRedirectUrl");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const catchAsync = require("../middleware/catchAsync");

router
  .route("/register")
  .get(usersController.registerForm)
  .post(usersController.registerUser);

router
  .route("/login")
  .get(usersController.loginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usersController.loginUser
  );

router.get("/logout", usersController.logoutUser);

router.get("/profile", isLoggedIn, usersController.profile);

router.post(
  "/listings/:id/favorite/remove",
  isLoggedIn,
  catchAsync(usersController.removeFavorite)
);

module.exports = router;
