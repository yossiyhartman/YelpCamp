// Mongo
const mongoose = require("mongoose");

// Express
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

// passport
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Models
const User = require("./models/users");

// Validation schemas
const Joi = require("joi");

// Routes
const router_authentication = require("./routes/authentication");
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
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7 // miliseconds * seconds * minutes * hours * week
		}
	})
);

// Flash
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.warning = req.flash("warning");

	next();
});

// homepage
app.get("/", (req, res) => {
	res.redirect("/campgrounds");
});

//////////////////
// Routes
//////////////////

app.use("", router_authentication);
app.use("/campgrounds", router_campgrounds);
app.use("", router_reviews);
app.use("", router_errorHandling);

// Server
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
