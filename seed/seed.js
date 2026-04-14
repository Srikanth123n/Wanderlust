require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");
const Listing = require("../models/Listing");
const Review = require("../models/Review");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to database for seeding");

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Review.deleteMany({});
    console.log("Cleared existing data");

    // Create sample users
    const users = [];
    const userData = [
      { username: "john_doe", email: "john@example.com", password: "password123" },
      { username: "jane_smith", email: "jane@example.com", password: "password123" },
      { username: "bob_wilson", email: "bob@example.com", password: "password123" },
    ];

    for (const userInfo of userData) {
      const user = new User({ username: userInfo.username, email: userInfo.email });
      const registeredUser = await User.register(user, userInfo.password);
      users.push(registeredUser);
      console.log(`Created user: ${registeredUser.username}`);
    }

    // Create sample listings with dummy Cloudinary URLs or placeholder text
    const listings = [];
    const listingData = [
      {
        title: "Cozy Beachfront Villa",
        description: "Beautiful villa with stunning ocean views, perfect for a relaxing vacation.",
        location: "Calangute Beach, Goa",
        country: "India",
        price: 5000,
        images: [
          { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", filename: "sample1" },
          { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", filename: "sample2" }
        ],
        geometry: {
          type: "Point",
          coordinates: [73.7553, 15.5388] // Approximate coordinates for Goa
        },
        author: users[0]._id
      },
      {
        title: "Mountain View Apartment",
        description: "Modern apartment with breathtaking mountain views and all modern amenities.",
        location: "Manali, Himachal Pradesh",
        country: "India",
        price: 3500,
        images: [
          { url: "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800", filename: "sample3" }
        ],
        geometry: {
          type: "Point",
          coordinates: [77.1761, 32.2432] // Approximate coordinates for Manali
        },
        author: users[1]._id
      },
      {
        title: "Luxury City Center Loft",
        description: "Stylish loft in the heart of the city, close to all major attractions.",
        location: "Mumbai, Maharashtra",
        country: "India",
        price: 6000,
        images: [
          { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", filename: "sample4" }
        ],
        geometry: {
          type: "Point",
          coordinates: [72.8777, 19.0760] // Approximate coordinates for Mumbai
        },
        author: users[0]._id
      },
      {
        title: "Traditional Heritage House",
        description: "Experience authentic local culture in this beautifully restored heritage property.",
        location: "Jaipur, Rajasthan",
        country: "India",
        price: 4000,
        images: [
          { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", filename: "sample5" }
        ],
        geometry: {
          type: "Point",
          coordinates: [75.7873, 26.9124] // Approximate coordinates for Jaipur
        },
        author: users[2]._id
      },
      {
        title: "Riverside Cottage",
        description: "Peaceful cottage by the river, ideal for nature lovers and families.",
        location: "Rishikesh, Uttarakhand",
        country: "India",
        price: 3000,
        images: [
          { url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800", filename: "sample6" }
        ],
        geometry: {
          type: "Point",
          coordinates: [78.2676, 30.0869] // Approximate coordinates for Rishikesh
        },
        author: users[1]._id
      }
    ];

    for (const listingInfo of listingData) {
      const listing = new Listing(listingInfo);
      await listing.save();
      listings.push(listing);
      console.log(`Created listing: ${listing.title}`);
    }

    // Create sample reviews
    const reviewData = [
      {
        rating: 5,
        body: "Absolutely amazing place! The views were spectacular and the host was very welcoming.",
        author: users[1]._id,
        listing: listings[0]._id
      },
      {
        rating: 4,
        body: "Great location and clean rooms. Would definitely stay here again!",
        author: users[2]._id,
        listing: listings[0]._id
      },
      {
        rating: 5,
        body: "Perfect getaway spot. The mountain views are breathtaking!",
        author: users[0]._id,
        listing: listings[1]._id
      },
      {
        rating: 4,
        body: "Very convenient location, close to everything. Highly recommend!",
        author: users[1]._id,
        listing: listings[2]._id
      },
      {
        rating: 5,
        body: "Authentic experience with great hospitality. Loved every moment!",
        author: users[0]._id,
        listing: listings[3]._id
      }
    ];

    for (const reviewInfo of reviewData) {
      const review = new Review(reviewInfo);
      await review.save();
      
      // Add review to listing's reviews array
      const listing = await Listing.findById(reviewInfo.listing);
      listing.reviews.push(review._id);
      await listing.save();
      
      console.log(`Created review for listing: ${listing.title}`);
    }

    console.log("\n✅ Seeding completed successfully!");
    console.log(`Created ${users.length} users, ${listings.length} listings, and ${reviewData.length} reviews`);
    console.log("\nNote: Sample listings use placeholder images from Unsplash.");
    console.log("In production, upload real images via the create listing form.\n");

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);

  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Instructions:
// 1. Make sure your .env file has MONGO_URL set
// 2. Run: npm run seed or node seed/seed.js
// 3. This will create sample users, listings, and reviews
// 4. You can login with any user (e.g., john_doe / password123)

seedDatabase();




