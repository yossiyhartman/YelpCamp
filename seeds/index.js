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
const sampleCities = (num = 20) => {
	const samples = [];

	for (let i = 0; i < num; i++) {
		// Sample without replacement
		const citySample = cities.splice(sampleArr(cities), 1)[0];

		samples.push({
			author: "66ce2173f9d30d47163e15f3",
			location: `${citySample.city}, ${citySample.state}`,
			title: `${sampleArr(descriptors)} ${sampleArr(places)}`,
			image: `https://picsum.photos/600/400?random=${Math.random()}`,
			description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum consequuntur id eius asperiores, at, rerum autem iusto ipsam, architecto minima neque veniam quia accusantium expedita. Minus, eligendi? Quam, doloremque commodi. Harum autem cupiditate beatae quia similique ad numquam sequi veniam excepturi, sapiente ea quod, ducimus velit ipsa. Harum consectetur architecto labore, minus ipsa quos laboriosam laborum est esse doloremque! Velit. Natus vero consectetur quas qui, cupiditate sapiente ad, dicta rem a incidunt aliquam minima tempora. Corrupti ducimus quidem accusantium, corporis error vero voluptates molestias? Labore distinctio earum voluptatum eligendi laboriosam? Aut fugiat rem voluptatum omnis fuga, eaque nulla, quisquam culpa quam obcaecati maxime perspiciatis illum eveniet doloribus maiores, officiis sunt quia atque velit totam sed. Temporibus possimus ullam eveniet voluptas. Quas earum error reiciendis nemo eos, ea eum ducimus tempore. Dicta temporibus voluptatem aliquam sint ex, expedita doloremque, nostrum nisi inventore quasi rem beatae exercitationem deserunt nesciunt repellat iste? Nostrum!`,
			price: Math.floor(Math.random() * 20) + 35
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
	mongoose.connection.close().then(() => {
		console.log("Database closed");
	});
});
