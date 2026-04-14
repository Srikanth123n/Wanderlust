const mongoose = require("mongoose");
const Listing = require("../models/Listing");

async function main() {
  const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
  await mongoose.connect(MONGO_URL);

  const total = await Listing.countDocuments({});
  const missing = await Listing.countDocuments({
    $or: [
      { geometry: { $exists: false } },
      { "geometry.coordinates": { $exists: false } },
      { "geometry.coordinates.1": { $exists: false } },
    ],
  });

  console.log(JSON.stringify({ total, missing }, null, 2));
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

