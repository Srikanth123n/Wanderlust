const express = require("express");
const router = express.Router({ mergeParams: true });

const listingsController = require("../controllers/listingsController");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { isAuthor } = require("../middleware/isAuthor");
const { validateListing } = require("../middleware/validateListing");
const catchAsync = require("../middleware/catchAsync");
const ExpressError = require("../utils/ExpressError");

const multer = require("multer");
const { storage, hasCloudinaryCreds } = require("../utils/cloudinary");

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 }, // 5MB each, max 10
  fileFilter: (req, file, cb) => {
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (allowed.has(file.mimetype)) return cb(null, true);
    return cb(new ExpressError(400, "Only JPG, PNG, or WEBP images are allowed."));
  },
});

function uploadImages(req, res, next) {
  // In production, require Cloudinary (local uploads are ephemeral)
  if (process.env.NODE_ENV === "production" && !hasCloudinaryCreds) {
    return next(new ExpressError(500, "Cloudinary is not configured in production."));
  }

  return upload.array("images", 10)(req, res, (err) => {
    if (!err) return next();

    const message = err.message || "Image upload failed.";
    req.flash("error", message);
    const back = req.get("Referrer") || "/listings";
    return res.redirect(back);
  });
}

const reviewRouter = require("./reviews");

// INDEX - ALL LISTINGS
router.get("/", catchAsync(listingsController.index));

// MY LISTINGS
router.get("/my-listings", isLoggedIn, catchAsync(listingsController.myListings));

// NEW LISTING FORM
router.get("/new", isLoggedIn, listingsController.newForm);

// CREATE LISTING
router.post(
  "/",
  isLoggedIn,
  uploadImages,
  validateListing,
  catchAsync(listingsController.createListing)
);

// NESTED REVIEW ROUTES
router.use("/:id/reviews", reviewRouter);

// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(catchAsync(listingsController.show))
  .put(
    isLoggedIn,
    isAuthor,
    uploadImages,
    validateListing,
    catchAsync(listingsController.updateListing)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(listingsController.deleteListing)
  );

// EDIT FORM
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(listingsController.editForm)
);

module.exports = router;

