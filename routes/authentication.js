// Express
const express = require("express");
const router = express.Router();

// passport
const passport = require("passport");

// models
const User = require("../models/users");

// middleware
const { storeReturnTo } = require("../middleware");

// Routes
router.post("/register", async (req, res) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const r_user = await User.register(user, password);
		req.login(r_user, (err) => {
			if (err) return next(err);
			req.flash("success", "Welcome!");
			res.redirect("/campgrounds");
		});
	} catch (error) {
		req.flash("error", error.message);
		res.redirect("/register");
	}
});

router.get("/register", (req, res) => {
	res.render("authentication/register");
});

router.post("/login", storeReturnTo, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, failureMessage: true }), (req, res) => {
	req.flash("success", "Welcome!");

	const returnURL = res.locals.returnTo || "/campgrounds";
	res.redirect(returnURL);
});

router.get("/login", (req, res) => {
	res.render("authentication/login");
});

router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "Bye!");
		res.redirect("/campgrounds");
	});
});

module.exports = router;
