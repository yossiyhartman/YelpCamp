// Express
const express = require("express");
const router = express.Router();

// models
const Campground = require("../models/camgrounds");

// Validation
const { campgroundValSchema, validateForm } = require("../validationSchemas");

// middleware
const { loggedIn, isAuthor } = require("../middleware");

// Routes
router.get("", async (req, res) => {
	try {
		const campgrounds = await Campground.find();
		res.render("campgrounds/index", { campgrounds });
	} catch (err) {
		next(err);
	}
});

// New campground page
router.get("/new", loggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// Create campground
router.post("/new", loggedIn, validateForm(campgroundValSchema), async (req, res, next) => {
	try {
		const camp = new Campground(req.body.campground);
		camp.author = req.user.id;

		camp.save();
		req.flash("success", "Succesfully made a campground!");
		res.redirect(`/campgrounds/${camp.id}`);
	} catch (err) {
		next(err);
	}
});

// Update campground
router.patch("/:id/edit", loggedIn, isAuthor, validateForm(campgroundValSchema), async (req, res, next) => {
	try {
		const { id } = req.params;
		await Campground.findByIdAndUpdate(id, req.body);
		req.flash("success", "Succesfully updated a campground!");
		res.redirect(`/campgrounds/${id}`);
	} catch (err) {
		next(err);
	}
});

// Update campground page
router.get("/:id/edit", loggedIn, isAuthor, async (req, res, next) => {
	try {
		const { id } = req.params;
		const camp = await Campground.findById(id);

		res.render("campgrounds/edit", { camp });
	} catch (err) {
		req.flash("error", "Cannot find that campground");
		return res.redirect("/campgrounds");
	}
});

//  Delete campground
router.delete("/:id", loggedIn, isAuthor, async (req, res, next) => {
	try {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash("success", "Succesfully deleted a campground!");
		res.redirect("/campgrounds");
	} catch (err) {
		next(err);
	}
});

// Campground details page
router.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const camp = await Campground.findById(id)
			.populate({
				path: "reviews",
				populate: "author"
			})
			.populate("author");
		res.render("campgrounds/show", { camp });
	} catch (err) {
		req.flash("error", "No camp was found with that id!");
		res.redirect("/campgrounds");
	}
});

module.exports = router;
