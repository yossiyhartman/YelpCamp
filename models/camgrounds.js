const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./reviews");

const campgroundSchema = new Schema({
	title: String,
	price: Number,
	description: String,
	location: String,
	image: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review"
		}
	],
	author: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});

campgroundSchema.post("findOneAndDelete", async function (camp) {
	if (camp) {
		await Review.deleteMany({
			_id: {
				$in: camp.reviews
			}
		});
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);
