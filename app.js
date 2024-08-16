const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const Campground = require("./models/camgrounds");

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

// Routes
app.get("/", (req, res) => {
	res.send("homepage!");
});

// Overview
app.get("/campgrounds", async (req, res) => {
	const campgrounds = await Campground.find();
	res.render("campgrounds/index", { campgrounds });
});

// Create new campgrounds
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

app.post("/campgrounds/new", async (req, res) => {
	await Campground.create(req.body.campground);
	res.redirect("/campgrounds");
});

// Update campgrounds
app.get("/campgrounds/:id/edit", async (req, res) => {
	const { id } = req.params;
	try {
		const camp = await Campground.findById(id);
		res.render("campgrounds/edit", { camp });
	} catch (err) {
		console.log("nothing with this id");
	}
});

app.patch("/campgrounds/:id/edit", async (req, res) => {
	const { id } = req.params;
	try {
		await Campground.findByIdAndUpdate(id, req.body.campground);
	} catch (err) {
		console.log("nothing with this id");
	}
	res.redirect("/campgrounds");
});

// Show specific campground
app.get("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const camp = await Campground.findById(id);
		res.render("campgrounds/show", { camp });
	} catch (err) {
		console.log("nothing with this id");
	}
});

// Show specific campground
app.delete("/campgrounds/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await Campground.findByIdAndDelete(id);
	} catch (err) {
		console.log("nothing with this id");
	}
	res.redirect("/campgrounds");
});

// Server
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
