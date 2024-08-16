const mongoose = require("mongoose");
const Campground = require("../models/camgrounds");
const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelpers.js");

mongoose.connect("mongodb://127.0.0.1:27017/Yelpcamp");

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
	console.log("Database connected");
});

const sampleArr = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Create a cities dataset
const sampleCities = (num = 50) => {
	const samples = [];

	for (let i = 0; i < num; i++) {
		// Sample without replacement
		const citySample = cities.splice(sampleArr(cities), 1)[0];

		samples.push({
			location: `${citySample.city}, ${citySample.state}`,
			title: `${sampleArr(descriptors)} ${sampleArr(places)}`
		});
	}

	return samples;
};

(async () => {
	// First Delete DB
	await Campground.deleteMany({});

	// Then populate DB
	await Campground.insertMany(sampleCities());
})().then(() => {
	mongoose.connection.close();
});
