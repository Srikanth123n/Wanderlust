const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewsController = require("../controllers/reviewsController");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { validateReview } = require("../middleware/validateReview");
const { isReviewAuthor } = require("../middleware/isReviewAuthor");

const catchAsync = require("../middleware/catchAsync");

// CREATE REVIEW
router.post("/", isLoggedIn, validateReview, catchAsync(reviewsController.createReview));

// DELETE REVIEW
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;
