const Campground = require("./models/camgrounds");

module.exports.loggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "must be logged in");
		return res.redirect("/login");
	}
	next();
};

module.exports.storeReturnTo = (req, res, next) => {
	if (req.session.returnTo) {
		res.locals.returnTo = req.session.returnTo;
	}
	next();
};

module.exports.isAuthor = async (req, res, next) => {
	try {
		const { id } = req.params;
		const camp = await Campground.findById(id);

		if (!camp.author.equals(req.user.id)) {
			req.flash("error", "You don't have permission to edit this campground");
			return res.redirect(`/campgrounds/${id}`);
		}
	} catch (error) {
		next(error);
	}
};
