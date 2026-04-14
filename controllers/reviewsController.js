// controllers/reviewsController.js

const Review = require("../models/Review");
const Listing = require("../models/Listing");

// CREATE REVIEW
// Note: catchAsync is applied in the route, not here
module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const review = new Review(req.body.review);
  review.author = req.user._id;
  review.listing = listing._id; // Fix: assign listing reference (required by Review model)

  listing.reviews.push(review);

  await review.save();
  await listing.save();

  req.flash("success", "Review added!");
  res.redirect(`/listings/${listing._id}`);
};

// DELETE REVIEW
// Note: catchAsync is applied in the route, not here
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};

