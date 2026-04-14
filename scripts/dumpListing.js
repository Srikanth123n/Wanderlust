const mongoose = require("mongoose");
const Listing = require("../models/Listing");

async function main() {
  const id = process.argv[2];
  if (!id) {
    console.error("Usage: node scripts/dumpListing.js <listingId>");
    process.exit(1);
  }

  const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
  await mongoose.connect(MONGO_URL);

  const listing = await Listing.findById(id).lean();
  console.log(JSON.stringify(listing, null, 2));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

