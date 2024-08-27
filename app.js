// Mongo
const mongoose = require("mongoose");

// Express
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

// Modles
const Campground = require("./models/camgrounds");
const Review = require("./models/reviews");

// Validation schemas
const Joi = require("joi");
const { campgroundValSchema, reviewValSchema, validateForm } = require("./validationSchemas");

// Routes
const router_campgrounds = require("./routes/campgrounds");
const router_reviews = require("./routes/reviews");
const router_errorHandling = require("./routes/errorHandling");

// app options
const app = express();
const port = 3000;

// Mongo Connect
mongoose.connect("mongodb://127.0.0.1:27017/Yelpcamp");

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
	console.log("Database connected");
});

// Express configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Initial Middleware configuration
app.use(express.static("statics"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Session
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7, // miliseconds * seconds * minutes * hours * week
			httpOnly: true
		}
	})
);

// Flash
app.use(flash());
app.use((req, res, next) => {
	res.locals.flash_message = req.flash("flash");
	next();
});

// homepage
app.get("/", (req, res) => {
	res.redirect("/campgrounds");
});

//////////////////
// Routes
//////////////////

app.use("/campgrounds", router_campgrounds);
app.use("", router_reviews);
app.use("", router_errorHandling);

// Server
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
