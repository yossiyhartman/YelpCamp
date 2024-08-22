const Joi = require("joi");
const ExpressError = require("./utils/ExpressError");

module.exports.campgroundValSchema = Joi.object({
	campground: Joi.object({
		image: Joi.string().required(),
		title: Joi.string().required(),
		location: Joi.string().required(),
		description: Joi.string().required(),
		price: Joi.number().min(0).required()
	}).required()
});

module.exports.reviewValSchema = Joi.object({
	review: Joi.object({
		rating: Joi.number().required().min(1).max(5),
		review: Joi.string().required()
	}).required()
});

module.exports.validateForm = (schema) => {
	return (req, res, next) => {
		const { error } = schema.validate(req.body);

		if (error) {
			const msg = error.details.map((e) => e.message).join(", ");
			throw new ExpressError(msg, 400);
		}

		next();
	};
};
