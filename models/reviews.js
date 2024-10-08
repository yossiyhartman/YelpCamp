const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewsSchema = new Schema({
	review: {
		type: String
	},
	rating: {
		type: Number,
		enum: [1, 2, 3, 4, 5]
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Review", reviewsSchema);
