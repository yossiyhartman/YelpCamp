// Express
const express = require("express");
const router = express.Router();

// Modles
const Campground = require("../models/camgrounds");
const Review = require("../models/reviews");

// Validation schemas
const { reviewValSchema, validateForm } = require("../validationSchemas");

// middleware

const { loggedIn, isAuthor } = require("../middleware");

// Routes
router.post("/campgrounds/:id/reviews", loggedIn, validateForm(reviewValSchema), async (req, res, next) => {
	try {
		const camp = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		review.author = req.user.id;

		camp.reviews.push(review);

		Promise.all([review.save(), camp.save()]);
		req.flash("success", "Successfully posted a review!");
		res.redirect(`/campgrounds/${camp.id}`);
	} catch (err) {
		next(err);
	}
});

router.delete("/campgrounds/:id/reviews/:review_id", loggedIn, async (req, res, next) => {
	try {
		const { id, review_id } = req.params;
		const review = await Review.findById(review_id);

		if (!review.author.equals(req.user.id)) {
			req.flash("error", "This is not your review");
			return res.redirect(`/campgrounds/${id}`);
		}

		await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
		await Review.findByIdAndDelete(review_id);
		res.redirect(`/campgrounds/${id}`);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
