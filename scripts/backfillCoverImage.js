const mongoose = require("mongoose");

async function main() {
  const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
  await mongoose.connect(MONGO_URL);

  const listingsColl = mongoose.connection.db.collection("listings");
  const result = await listingsColl.updateMany(
    {
      $or: [
        { coverImageFilename: { $exists: false } },
        { coverImageFilename: null },
        { coverImageFilename: "" },
      ],
      "images.0.filename": { $exists: true },
    },
    [{ $set: { coverImageFilename: "$images.0.filename" } }]
  );

  console.log(
    JSON.stringify(
      {
        matched: result.matchedCount,
        modified: result.modifiedCount,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

