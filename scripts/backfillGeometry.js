const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const { getCoordinates } = require("../utils/geocoder");

async function main() {
  const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
  await mongoose.connect(MONGO_URL);

  const listings = await Listing.find({}).select("_id location country geometry");
  let updated = 0;
  let skipped = 0;

  for (const listing of listings) {
    const hasCoords =
      listing.geometry &&
      Array.isArray(listing.geometry.coordinates) &&
      listing.geometry.coordinates.length === 2 &&
      typeof listing.geometry.coordinates[0] === "number" &&
      typeof listing.geometry.coordinates[1] === "number";

    if (hasCoords) {
      skipped += 1;
      continue;
    }

    const locationString = `${listing.location}, ${listing.country}`;
    const geometry = await getCoordinates(locationString);
    listing.geometry = geometry;
    await listing.save();
    updated += 1;
    console.log(`Updated ${listing._id}: ${locationString} -> ${geometry.coordinates.join(",")}`);
  }

  console.log(JSON.stringify({ updated, skipped, total: listings.length }, null, 2));
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

