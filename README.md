# 🌍 Wanderlust - Travel Accommodation Platform

![Wanderlust Banner](https://via.placeholder.com/1200x300/667eea/ffffff?text=Wanderlust+-+Explore+the+World)

> A full-stack web application for creating, browsing, and reviewing travel accommodation listings. Built with Node.js, Express, MongoDB, and EJS.


---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **Express Session** - Session management
- **Connect Mongo** - MongoDB session store

### Frontend
- **EJS** - Embedded JavaScript templating
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icon library
- **Leaflet.js** - Interactive maps
- **Custom CSS** - Modern design system with gradients and animations

### Cloud Services
- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary (optional)** - Image hosting and optimization
- **OpenStreetMap** - Free geocoding and map tiles

### Security & Utilities
- **Helmet.js** - Security headers
- **Joi** - Schema validation
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **compression** - Response compression
- **CORS** - Cross-origin resource sharing

---

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x450/667eea/ffffff?text=Listings+Grid+View)

### Listing Details with Map
![Listing Details](https://via.placeholder.com/800x450/764ba2/ffffff?text=Listing+Details+%2B+Leaflet+Map)

### Create New Listing
![Create Listing](https://via.placeholder.com/800x450/4f46e5/ffffff?text=Create+Listing+Form)

### User Authentication
![Login Page](https://via.placeholder.com/800x450/06b6d4/ffffff?text=Login+Page)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [MongoDB](https://www.mongodb.com/)
- **Cloudinary account (optional)** - [Cloudinary](https://cloudinary.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wanderlust.git
   cd wanderlust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add:
   ```env
   PORT=3000
   MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
   SESSION_SECRET=your_super_secret_session_key
   NODE_ENV=development
   CORS_ORIGIN=*
   ```

   **Optional (Cloudinary uploads):**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   > **Note:** If Cloudinary env vars are not provided, the app automatically stores uploads locally in `uploads/` and serves them from `/uploads/*`.

4. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000`

   > If port 3000 is already busy during development, the server will automatically try 3001, 3002, ... and print the final URL in the terminal.

---

## 📦 Deployment

### Deploy to Render

1. **Create a new Web Service** on [Render](https://render.com/)

2. **Connect your GitHub repository**

3. **Configure environment variables** in Render dashboard:
   - Add all variables from `.env` file
   - Set `NODE_ENV=production`

4. **Build Command:** `npm install`

5. **Start Command:** `npm start`

6. **Deploy!** 🎉

### Deploy to Railway

1. **Create a new project** on [Railway](https://railway.app/)

2. **Deploy from GitHub**

3. **Add environment variables** in Railway dashboard

4. **Railway will auto-deploy** on every push to main branch

### Deploy to Cyclic

1. **Connect your repository** on [Cyclic](https://www.cyclic.sh/)

2. **Add environment variables**

3. **Deploy automatically**

### Important Deployment Notes

- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0) or add your deployment platform's IPs
- Set `NODE_ENV=production` in production environment
- Update `CORS_ORIGIN` to your deployed domain for security
- **Cloudinary is strongly recommended in production** (local `uploads/` is ephemeral on most hosts and images can disappear after redeploy/restart)
- If you enable uploads in production, set:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

---

## 📁 Project Structure

```
wanderlust/
├── controllers/          # Route controllers (MVC)
│   ├── listingsController.js
│   ├── reviewsController.js
│   └── usersController.js
├── middleware/           # Custom middleware
│   ├── catchAsync.js
│   ├── isAuthor.js
│   ├── isLoggedIn.js
│   ├── isReviewAuthor.js
│   ├── saveRedirectUrl.js
│   ├── validateListing.js
│   └── validateReview.js
├── models/              # Mongoose models
│   ├── Listing.js
│   ├── Review.js
│   └── user.js
├── public/              # Static assets
│   ├── css/
│   │   ├── main.css
│   │   └── starbility.css
│   └── js/
│       └── script.js
├── routes/              # Express routes
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── utils/               # Utility functions
│   ├── cloudinary.js
│   ├── ExpressError.js
│   └── geocoder.js
├── views/               # EJS templates
│   ├── includes/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   ├── navbar.ejs
│   │   └── reviewForm.ejs
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   ├── users/
│   │   ├── login.ejs
│   │   ├── profile.ejs
│   │   └── register.ejs
│   └── error.ejs
├── .env.example         # Environment variables template
├── .gitignore
├── app.js               # Express app configuration
├── package.json
├── README.md
└── schema.js            # Joi validation schemas
```

---

## 🔑 Key Features Explained

### Geocoding with OpenStreetMap
- Automatic conversion of location strings to coordinates
- No API key required (uses free Nominatim service)
- Fallback to default coordinates if geocoding fails

### Leaflet Maps
- Interactive maps with zoom and pan
- Custom markers with popups
- OpenStreetMap tiles (free, no API key)
- Responsive and mobile-friendly

### Image Upload with Cloudinary
- Multiple image uploads per listing
- Automatic optimization and transformation
- Secure cloud storage
- Fast CDN delivery

### Local Upload Fallback (No Cloudinary Needed)
- If Cloudinary credentials are not set, uploads are stored in `uploads/`
- Images are served from `/uploads/<filename>`

### Security Features
- Helmet.js for security headers
- CORS configuration
- Password hashing with bcryptjs
- Session management with MongoDB store
- Input validation with Joi
- CSRF protection ready

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ajmeera Srikanth**

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Cloudinary](https://cloudinary.com/) - Image hosting and optimization
- [Leaflet.js](https://leafletjs.com/) - Open-source JavaScript library for maps
- [OpenStreetMap](https://www.openstreetmap.org/) - Free map data and tiles
- [Bootstrap](https://getbootstrap.com/) - CSS framework
- [Font Awesome](https://fontawesome.com/) - Icon library

---

## 🌟 Live Demo

🔗 **View Live Demo** *(Coming Soon)*

---

## 📧 Support

For support, email **sn171683@gmail.com** or open an issue in the repository.

---

<div align="center">
  Made with ❤️ by <strong>Ajmeera Srikanth</strong>
  <br>
  <sub>Built with Node.js, Express, MongoDB, and EJS</sub>
</div>
