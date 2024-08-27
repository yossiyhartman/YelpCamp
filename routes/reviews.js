// Express
const express = require("express");
const router = express.Router();

// Modles
const Campground = require("../models/camgrounds");
const Review = require("../models/reviews");

// Validation schemas
const { reviewValSchema, validateForm } = require("../validationSchemas");

// Routes

router.post("/campgrounds/:id/reviews", validateForm(reviewValSchema), async (req, res, next) => {
	try {
		const camp = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		camp.reviews.push(review);

		Promise.all([review.save(), camp.save()]);

		res.redirect(`/campgrounds/${camp.id}`);
	} catch (err) {
		next(err);
	}
});

router.delete("/campgrounds/:id/reviews/:review_id", async (req, res, next) => {
	try {
		const { id, review_id } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
		await Review.findByIdAndDelete(review_id);
		res.redirect(`/campgrounds/${id}`);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
