// middleware/isAuthor.js
const Listing = require("../models/Listing");
const Review = require("../models/Review");
const catchAsync = require("./catchAsync");

module.exports.isAuthor = catchAsync(async (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("author");
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  if (!listing.author || String(listing.author._id) !== String(req.user._id)) {
    req.flash("error", "You are not the author of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
});

module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId).populate("author");
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author || String(review.author._id) !== String(req.user._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
});
