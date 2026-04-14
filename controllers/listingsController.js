const Listing = require("../models/Listing");
const Review = require("../models/Review");
const { getCoordinates } = require("../utils/geocoder");
const path = require("path");
const fs = require("fs/promises");
const { cloudinary, hasCloudinaryCreds } = require("../utils/cloudinary");

function toStoredImage(file) {
  // Cloudinary (multer-storage-cloudinary): file.path is a URL
  if (file && typeof file.path === "string" && /^https?:\/\//i.test(file.path)) {
    return { url: file.path, filename: file.filename };
  }
  // Disk storage: file.filename is the saved filename
  if (file && file.filename) {
    return { url: `/uploads/${file.filename}`, filename: file.filename };
  }
  return null;
}

// ==============================
// GET ALL LISTINGS
// ==============================
module.exports.index = async (req, res) => {
  const category = req.query.category;
  const filter = category ? { category } : {};

  const listings = await Listing.find(filter);

  res.render("listings/index", {
    listings,
    category,
  });
};

// ==============================
// NEW FORM
// ==============================
module.exports.newForm = (req, res) => {
  res.render("listings/new");
};

// ==============================
// CREATE LISTING
// ==============================
module.exports.createListing = async (req, res) => {
  const listing = new Listing(req.body.listing);
  listing.author = req.user._id;

  // Save uploaded images
  if (req.files && req.files.length > 0) {
    listing.images = req.files.map(toStoredImage).filter(Boolean);
    if (!listing.coverImageFilename && listing.images.length > 0) {
      listing.coverImageFilename = listing.images[0].filename || null;
    }
  }

  // Geocode location
  try {
    const locationString = `${listing.location}, ${listing.country}`;
    listing.geometry = await getCoordinates(locationString);
  } catch (err) {
    console.log("Geocoder error:", err.message);
  }

  await listing.save();

  req.flash("success", "Listing created successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// ==============================
// SHOW LISTING
// ==============================
module.exports.show = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("author")
    .populate({
      path: "reviews",
      populate: { path: "author" },
    });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// ==============================
// EDIT FORM
// ==============================
module.exports.editForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/edit", { listing });
};

// ==============================
// UPDATE LISTING
// ==============================
module.exports.updateListing = async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body.listing,
    { new: true }
  );

  const toDelete = Array.isArray(req.body?.deleteImages)
    ? req.body.deleteImages
    : typeof req.body?.deleteImages === "string"
      ? [req.body.deleteImages]
      : [];

  if (toDelete.length > 0 && Array.isArray(listing.images) && listing.images.length > 0) {
    const deleteSet = new Set(toDelete);
    const remaining = [];
    const deleted = [];

    for (const img of listing.images) {
      if (img?.filename && deleteSet.has(img.filename)) {
        deleted.push(img);
      } else {
        remaining.push(img);
      }
    }

    listing.images = remaining;

    // If cover image was deleted, pick a new one
    if (
      listing.coverImageFilename &&
      deleted.some((img) => img.filename === listing.coverImageFilename)
    ) {
      listing.coverImageFilename = listing.images[0]?.filename || null;
    }

    // Best-effort cleanup of remote/local files
    await Promise.all(
      deleted.map(async (img) => {
        try {
          if (hasCloudinaryCreds && img.filename && /^https?:\/\//i.test(img.url || "")) {
            await cloudinary.uploader.destroy(img.filename);
            return;
          }

          if (img.filename && (img.url || "").startsWith("/uploads/")) {
            const filePath = path.join(process.cwd(), "uploads", img.filename);
            await fs.unlink(filePath).catch(() => {});
          }
        } catch (_) {
          // ignore cleanup failures
        }
      })
    );
  }

  // Update cover image (if user selected one)
  if (req.body && typeof req.body.coverImageFilename === "string") {
    const requested = req.body.coverImageFilename.trim();
    if (requested.length === 0) {
      listing.coverImageFilename = null;
    } else {
      const exists = listing.images?.some((img) => img.filename === requested);
      if (exists) listing.coverImageFilename = requested;
    }
  }

  // Add new uploaded images
  if (req.files && req.files.length > 0) {
    const newImgs = req.files.map(toStoredImage).filter(Boolean);

    listing.images.push(...newImgs);
    if (!listing.coverImageFilename && listing.images.length > 0) {
      listing.coverImageFilename = listing.images[0].filename || null;
    }
  }

  // Re-geocode if location changed
  try {
    const locationString = `${listing.location}, ${listing.country}`;
    listing.geometry = await getCoordinates(locationString);
  } catch (err) {
    console.log("Geocoder error:", err.message);
  }

  await listing.save();

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// ==============================
// DELETE LISTING
// ==============================
module.exports.deleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};

// ==============================
// MY LISTINGS
// ==============================
module.exports.myListings = async (req, res) => {
  const listings = await Listing.find({
    author: req.user._id,
  }).sort({ createdAt: -1 });

  res.render("listings/myListings", { listings });
};