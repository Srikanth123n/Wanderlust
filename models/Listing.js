const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  coverImageFilename: {
    type: String,
    default: null,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  category: {
    type: String,
    enum: ['Hotels', 'Resorts', 'Villas', 'Beach Houses', 'Mountain Stays', 'Budget Rooms', 'Luxury Stays', 'Trending', 'Popular Places', 'Nearby Locations'],
    default: 'Hotels',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Listing", listingSchema);


