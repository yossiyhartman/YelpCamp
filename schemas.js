const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
	campground: Joi.object({
		image: Joi.string().required(),
		title: Joi.string().required(),
		location: Joi.string().required(),
		description: Joi.string().required(),
		price: Joi.number().min(0).required()
	}).required()
});
