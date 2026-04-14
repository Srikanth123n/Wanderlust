const mongoose = require("mongoose");

async function main() {
  const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
  await mongoose.connect(MONGO_URL);

  const listingsColl = mongoose.connection.db.collection("listings");

  const total = await listingsColl.countDocuments({});

  // owner -> author
  const ownerToAuthor = await listingsColl.updateMany(
    { author: { $exists: false }, owner: { $exists: true } },
    [{ $set: { author: "$owner" } }]
  );

  // image -> images
  const imageToImages = await listingsColl.updateMany(
    {
      $and: [
        { $or: [{ images: { $exists: false } }, { images: { $size: 0 } }] },
        { "image.url": { $exists: true } },
      ],
    },
    [
      {
        $set: {
          images: [
            {
              url: "$image.url",
              filename: { $ifNull: ["$image.filename", "legacy-image"] },
            },
          ],
        },
      },
    ]
  );

  console.log(
    JSON.stringify(
      {
        total,
        ownerToAuthorMatched: ownerToAuthor.matchedCount,
        ownerToAuthorModified: ownerToAuthor.modifiedCount,
        imageToImagesMatched: imageToImages.matchedCount,
        imageToImagesModified: imageToImages.modifiedCount,
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

