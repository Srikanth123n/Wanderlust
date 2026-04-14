const User = require("../models/user");

// REGISTER (GET)
module.exports.registerForm = (req, res) => {
  res.render("users/register");
};

// REGISTER (POST)
module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ email, username });
    const newUser = await User.register(user, password);

    req.login(newUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      return res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/register");
  }
};

// LOGIN (GET)
module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

// LOGIN (POST)
module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// LOGOUT
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};

// PROFILE PAGE
module.exports.profile = (req, res) => {
  res.render("users/profile", { user: req.user });
};

// REMOVE FAVORITE
module.exports.removeFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.favorites = user.favorites.filter((fav) => fav.toString() !== req.params.id);
  await user.save();

  req.flash("success", "Removed from favorites");
  res.redirect(`/listings/${req.params.id}`);
};
