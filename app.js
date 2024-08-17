const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/camgrounds");
const Joi = require("joi");
const { campgroundSchema } = require("./schemas");

mongoose.connect("mongodb://127.0.0.1:27017/Yelpcamp");

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
	console.log("Database connected");
});

const app = express();
const port = 3000;

// configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static("js"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampgroun = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);

	if (error) {
		const msg = error.details.map((e) => e.message).join(", ");
		throw new ExpressError(msg, 400);
	}

	next();
};

// homepage
app.get("/", (req, res) => {
	res.send("homepage!");
});

// Overview Campgrounds
app.get("/campgrounds", async (req, res) => {
	try {
		const campgrounds = await Campground.find();
		res.render("campgrounds/index", { campgrounds });
	} catch (err) {
		next(err);
	}
});

// New campground page
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

// Create campground
app.post("/campgrounds/new", validateCampgroun, async (req, res, next) => {
	try {
		await Campground.create(req.body.campground);
		res.redirect("/campgrounds");
	} catch (err) {
		next(err);
	}
});

// Update campground page
app.get("/campgrounds/:id/edit", async (req, res, next) => {
	try {
		const { id } = req.params;
		const camp = await Campground.findById(id);
		res.render("campgrounds/edit", { camp });
	} catch (err) {
		next(err);
	}
});

// Update campground
app.patch("/campgrounds/:id/edit", validateCampgroun, async (req, res, next) => {
	try {
		const { id } = req.params;
		await Campground.findByIdAndUpdate(id, req.body.campground);
		res.redirect(`/campgrounds/${id}`);
	} catch (err) {
		next(err);
	}
});

// Details page
app.get("/campgrounds/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const camp = await Campground.findById(id);
		res.render("campgrounds/show", { camp });
	} catch (err) {
		next(err);
	}
});

//  Delete campground
app.delete("/campgrounds/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect("/campgrounds");
	} catch (err) {
		next(err);
	}
});

// 404
app.all("*", (req, res, next) => {
	next(new ExpressError("Page not found", 404));
});

// Error Handeling
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.mesage = "Oh No.. Something went wrong";
	res.status(statusCode).render("error", { err });
});

// Server
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
