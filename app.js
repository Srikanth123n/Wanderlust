require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

const User = require("./models/user");
const listingRouter = require("./routes/listings");
const userRouter = require("./routes/users");
const ExpressError = require("./utils/ExpressError");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const SESSION_SECRET = process.env.SESSION_SECRET || "mysupersecretcode";

// -----------------------------
// DATABASE CONNECTION
// -----------------------------
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB:", MONGO_URL))
  .catch((err) => console.log("Mongo Connection Error:", err));

// -----------------------------
// PRODUCTION MIDDLEWARE
// -----------------------------
// Trust proxy for deployment platforms (Render, Railway, etc.)
app.set("trust proxy", 1);

// Security headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https:"],
      },
    },
  })
);

// Response compression
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// -----------------------------
// VIEW ENGINE + MIDDLEWARE
// -----------------------------
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// SESSION STORE
// -----------------------------
const sessionStore = MongoStore.create({
  mongoUrl: MONGO_URL,
  touchAfter: 24 * 3600,
});

const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// -----------------------------
// PASSPORT SETUP
// -----------------------------
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -----------------------------
// FLASH + USER MIDDLEWARE
// -----------------------------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// -----------------------------
// ROUTES
// -----------------------------
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/", userRouter);

// -----------------------------
// 404 HANDLER
// -----------------------------
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// -----------------------------
// ERROR HANDLER
// -----------------------------
app.use((err, req, res, next) => {
  // Ensure we always have a real Error-like object
  const safeErr =
    err instanceof Error
      ? err
      : new Error(typeof err === "string" ? err : "Something went wrong!");

  // Preserve statusCode if provided (e.g. ExpressError)
  safeErr.statusCode = err?.statusCode || err?.status || safeErr.statusCode;

  const status = safeErr.statusCode || 500;
  const message = safeErr.message || "Something went wrong!";

  // Log errors in development
  if (process.env.NODE_ENV !== "production") {
    console.error(`ERROR: ${req.method} ${req.originalUrl} -> ${status} ${message}`);
    console.error(safeErr.stack || safeErr);
  } else {
    // In production, log only the message
    console.error(`ERROR: ${status} ${message}`);
  }

  res.status(status);
  return res.render("error", { err: safeErr });
});

// -----------------------------
// SERVER LISTEN
// -----------------------------
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🌍 Visit: http://localhost:${port}`);
  });

  server.on("error", (err) => {
    // In dev, auto-recover from PORT already in use (common with nodemon).
    if (err && err.code === "EADDRINUSE" && process.env.NODE_ENV !== "production") {
      const nextPort = Number(port) + 1;
      console.error(`❌ Port ${port} is already in use. Trying ${nextPort}...`);
      return startServer(nextPort);
    }
    throw err;
  });

  return server;
}

const PORT = Number(process.env.PORT) || 3000;
startServer(PORT);

