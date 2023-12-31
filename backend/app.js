const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");
const mongodb = require("mongodb");

const app = express();
app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauce");
const db = require("./db");

// Middleware Setup
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(
  session({
    secret: "myTokenCookie", // secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  // Allow cross-origin requests
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);
module.exports = app;
