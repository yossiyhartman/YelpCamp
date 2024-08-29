const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userS = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	}
});

userS.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userS);
