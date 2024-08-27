// Express
const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");

// Routes

// 404
router.all("*", (req, res, next) => {
	next(new ExpressError("Page not found", 404));
});

// Error Handeling
router.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.mesage = "Oh No.. Something went wrong";
	res.status(statusCode).render("error", { err });
});

module.exports = router;
