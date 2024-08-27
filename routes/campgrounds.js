// Express
const express = require("express");
const router = express.Router();

// models
const Campground = require("../models/camgrounds");

// Validation
const { campgroundValSchema, validateForm } = require("../validationSchemas");

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
router.get("/new", (req, res) => {
	res.render("campgrounds/new");
});

// Create campground
router.post("/new", validateForm(campgroundValSchema), async (req, res, next) => {
	try {
		const camp = new Campground(req.body.campground);
		camp.save();
		req.flash("flash", ["Succesfully made a campground!", "bg-emerald-600"]);
		res.redirect(`/campgrounds/${camp.id}`);
	} catch (err) {
		next(err);
	}
});

// Update campground page
router.get("/:id/edit", async (req, res, next) => {
	try {
		const { id } = req.params;
		const camp = await Campground.findById(id);
		res.render("campgrounds/edit", { camp });
	} catch (err) {
		req.flash("flash", ["No camp was found with that id!", "bg-amber-500"]);
		res.redirect("/campgrounds");
	}
});

// Update campground
router.patch("/:id/edit", validateForm(campgroundValSchema), async (req, res, next) => {
	try {
		const { id } = req.params;
		await Campground.findByIdAndUpdate(id, req.body.campground);
		req.flash("flash", ["Succesfully updated a campground!", "bg-emerald-600"]);
		res.redirect(`/campgrounds/${id}`);
	} catch (err) {
		next(err);
	}
});

// Campground details page
router.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const camp = await Campground.findById(id).populate("reviews");

		res.render("campgrounds/show", { camp });
	} catch (err) {
		req.flash("flash", ["No camp was found with that id!", "bg-amber-500"]);
		res.redirect("/campgrounds");
	}
});

//  Delete campground
router.delete("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash("flash", ["Succesfully deleted a campground!", "bg-emerald-600"]);
		res.redirect("/campgrounds");
	} catch (err) {
		next(err);
	}
});

module.exports = router;
